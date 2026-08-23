package com.InventoryManagementSystem.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    @Value("${whatsapp.api.url}")
    private String whatsappApiUrl;

    @Value("${whatsapp.api.token}")
    private String whatsappApiToken;

    @Value("${whatsapp.phone.number.id}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendMessage(String phoneNumber, String message) {
        try {
            String url = whatsappApiUrl + "/" + phoneNumberId + "/messages";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(whatsappApiToken);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("messaging_product", "whatsapp");
            requestBody.put("to", formatPhoneNumber(phoneNumber));
            requestBody.put("type", "text");

            Map<String, String> text = new HashMap<>();
            text.put("body", message);
            requestBody.put("text", text);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            System.err.println("Error sending WhatsApp message: " + e.getMessage());
            return false;
        }
    }

    private String formatPhoneNumber(String phoneNumber) {
        // Remove any non-digit characters and add country code if needed
        String cleanNumber = phoneNumber.replaceAll("[^\\d]", "");
        if (!cleanNumber.startsWith("977")) { // Nepal country code
            cleanNumber = "977" + cleanNumber;
        }
        return cleanNumber;
    }
}
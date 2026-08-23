(function () {
    // Core request function for all HTTP methods
    async function _request(endpoint, method = "GET", data = {}, contentType = "application/json", params = {}) {
        try {
            // Replace placeholders in endpoint (e.g., /api/resource/{id}) with param values
            let urlStr = endpoint;
            Object.entries(params).forEach(([key, value]) => {
                urlStr = urlStr.replace(`{${key}}`, encodeURIComponent(value));
            });

            // Construct absolute URL based on current origin
            const url = new URL(urlStr, window.location.origin);
            const options = { method, headers: {} };

            if (method === "GET") {
                // Add query parameters for GET requests
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) url.searchParams.append(key, value);
                });
            } else {
                // For non-GET requests, set body and content-type headers
                if (contentType === "multipart/form-data") {
                    // For file uploads, handle FormData properly
                    options.body = data instanceof FormData ? data : new FormData();
                    // Note: 'Content-Type' is set automatically by browser for FormData
                } else {
                    // For JSON payloads
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(data);
                }
            }

            // Debug log for outgoing requests
            console.log(`ApiService: ${method} ${url.toString()}`);

            // Perform the HTTP request using fetch API
            const response = await fetch(url.toString(), options);

            // Handle non-OK responses (not 2xx)
            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    // Try parsing error message as JSON
                    const errorData = await response.json();
                    errorMsg = errorData.message || JSON.stringify(errorData);
                } catch {
                    // Fall back to raw text if JSON parsing fails
                    errorMsg = await response.text();
                }
                console.error(`ApiService error: ${method} ${url.toString()} - ${errorMsg}`);
                throw new Error(errorMsg);
            }

            // Parse response body based on Content-Type
            const contentTypeHeader = response.headers.get("Content-Type") || "";
            if (contentTypeHeader.includes("application/json")) {
                return await response.json();
            } else if (contentTypeHeader.includes("image/")) {
                return await response.blob(); // For image/binary responses
            } else {
                return await response.text(); // For plain text, HTML, etc.
            }
        } catch (error) {
            // Log and propagate errors
            console.error(`ApiService request failed: ${method} ${endpoint}`, error);
            throw error;
        }
    }

    // Public API with convenience shortcuts for HTTP verbs
    window.ApiService = {
        // GET request: endpoint, optional query params, url params for placeholders
        get: (endpoint, queryParams = {}, urlParams = {}) => _request(endpoint, "GET", queryParams, "application/json", urlParams),
        // POST request: endpoint, data, content type, url params for placeholders
        post: (endpoint, data = {}, contentType = "application/json", urlParams = {}) =>
            _request(endpoint, "POST", data, contentType, urlParams),
        // PUT request: endpoint, data, content type, url params for placeholders
        put: (endpoint, data = {}, contentType = "application/json", urlParams = {}) =>
            _request(endpoint, "PUT", data, contentType, urlParams),
        // DELETE request: endpoint, data, content type, url params for placeholders
        delete: (endpoint, data = {}, contentType = "application/json", urlParams = {}) =>
            _request(endpoint, "DELETE", data, contentType, urlParams)
    };
})();
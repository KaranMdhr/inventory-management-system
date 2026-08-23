package com.InventoryManagementSystem.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.InventoryManagementSystem.Dto.CalenderDto;
import com.InventoryManagementSystem.Model.Calender;
import com.InventoryManagementSystem.Repository.CalenderRepository;

@Service
public class CalenderService {

    @Autowired
    private CalenderRepository calenderRepository;

    private static final String[] WEEK_DAYS = {
        "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
    };

    public void saveCalendar(Map<String, Object> payload) {
        String adDateStr = (String) payload.get("adDate");
        String bsDate = (String) payload.get("bsDate");
        String startDay = (String) payload.get("startDay");
        List<?> monthsRaw = (List<?>) payload.get("months");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> months = monthsRaw != null
            ? monthsRaw.stream()
                .filter(item -> item instanceof Map)
                .map(item -> (Map<String, Object>) item)
                .toList()
            : List.of();

        LocalDate adDate = LocalDate.parse(adDateStr);

        int dayOfWeekIndex = 0;
        for (int i = 0; i < WEEK_DAYS.length; i++) {
            if (WEEK_DAYS[i].equalsIgnoreCase(startDay)) {
                dayOfWeekIndex = i;
                break;
            }
        }

        int adDayOffset = 0;
        int bsMonth = 1;

        for (Map<String, Object> monthObj : months) {
            String monthName = (String) monthObj.get("month");
            int days = Integer.parseInt(monthObj.get("days").toString());
            List<?> holidaysRaw = (List<?>) monthObj.get("holidays");
            List<Integer> holidays = holidaysRaw != null
                ? holidaysRaw.stream()
                    .filter(item -> item instanceof Integer)
                    .map(item -> (Integer) item)
                    .toList()
                : null;

            for (int day = 1; day <= days; day++) {
                String thisBsDate = bsDate + "-" + String.format("%02d", bsMonth) + "-" + String.format("%02d", day);
                LocalDate thisAdDate = adDate.plusDays(adDayOffset);

                // Try to find existing row (even if display=false)
                Calender cal = calenderRepository.findByBsDate(thisBsDate).orElse(null);
                if (cal == null) {
                    cal = new Calender();
                    cal.setCreatedDate(LocalDateTime.now());
                }
                cal.setUpdatedDate(LocalDateTime.now());
                cal.setDisplay(true);
                cal.setAdDate(thisAdDate);
                cal.setBsDate(thisBsDate);
                cal.setDay(WEEK_DAYS[dayOfWeekIndex]);
                cal.setHoliday(holidays != null && holidays.contains(day));
                cal.setMonth(monthName);

                try {
                    cal.setYear(Integer.parseInt(thisBsDate.substring(0, 4)));
                } catch (Exception e) {
                    cal.setYear(null);
                }

                calenderRepository.save(cal);

                dayOfWeekIndex = (dayOfWeekIndex + 1) % 7;
                adDayOffset++;
            }
            bsMonth++;
        }
    }

    public List<CalenderDto> getAllCalendars() {
        List<Calender> calendars = calenderRepository.findAll();
        return calendars.stream().map(this::toDto).toList();
    }

    public List<CalenderDto> getCalendarByBsYear(String bsYear) {
        List<Calender> list = calenderRepository.findByBsDateStartingWithAndDisplayTrue(bsYear + "-");
        return list.stream().map(this::toDto).toList();
    }

    public List<CalenderDto> getMonthCalendar(int year, String month) {
        return calenderRepository.findByBsDateStartingWithAndMonthAndDisplayTrue(year + "-", month.toUpperCase())
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public void deleteCalendarYear(String bsYear) {
        List<Calender> list = calenderRepository.findByBsDateStartingWithAndDisplayTrue(bsYear + "-");
        for (Calender cal : list) {
            cal.setDisplay(false);
        }
        calenderRepository.saveAll(list);
    }

    private CalenderDto toDto(Calender cal) {
        CalenderDto dto = new CalenderDto();
        dto.setCId(cal.getCId());
        dto.setCreatedDate(cal.getCreatedDate());
        dto.setUpdatedDate(cal.getUpdatedDate());
        dto.setDisplay(cal.getDisplay());
        dto.setAdDate(cal.getAdDate());
        dto.setBsDate(cal.getBsDate());
        dto.setDay(cal.getDay());
        dto.setHoliday(cal.getHoliday());
        dto.setMonth(cal.getMonth());
        dto.setNepaliFiscalYearId(cal.getNepaliFiscalYear() != null ? cal.getNepaliFiscalYear().getNfyId() : null);
        dto.setEnglishFiscalYearId(cal.getEnglishFiscalYear() != null ? cal.getEnglishFiscalYear().getEfyId() : null);

        if (cal.getNepaliFiscalYear() != null) {
            dto.setNepaliFiscalYearFrom(cal.getNepaliFiscalYear().getFiscalYearFrom());
            dto.setNepaliFiscalYearTill(cal.getNepaliFiscalYear().getFiscalYearTill());
        }
        if (cal.getEnglishFiscalYear() != null) {
            dto.setEnglishFiscalYearFrom(cal.getEnglishFiscalYear().getFiscalYearFrom());
            dto.setEnglishFiscalYearTill(cal.getEnglishFiscalYear().getFiscalYearTill());
            dto.setAdEndDate(cal.getEnglishFiscalYear().getFiscalAdEnd());
        }
        return dto;
    }
}
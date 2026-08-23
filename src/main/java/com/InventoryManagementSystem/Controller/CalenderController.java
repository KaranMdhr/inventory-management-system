package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Service.CalenderService;
import com.InventoryManagementSystem.Dto.CalenderDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalenderController {

    @Autowired
    private CalenderService calenderService;

    @PostMapping("/save")
    public void saveCalendar(@RequestBody Map<String, Object> payload) {
        calenderService.saveCalendar(payload);
    }

    @GetMapping("/all")
    public List<CalenderDto> getAllCalendars() {
        return calenderService.getAllCalendars();
    }

    @GetMapping("/year/{bsYear}")
    public List<CalenderDto> getCalendarByBsYear(@PathVariable String bsYear) {
        return calenderService.getCalendarByBsYear(bsYear);
    }

    @GetMapping("/month/{year}/{month}")
    public List<CalenderDto> getMonthCalendar(@PathVariable int year, @PathVariable String month) {
        return calenderService.getMonthCalendar(year, month);
    }

    @PutMapping("/delete/year/{bsYear}")
    public void deleteCalendarYear(@PathVariable String bsYear) {
        calenderService.deleteCalendarYear(bsYear);
    }
}
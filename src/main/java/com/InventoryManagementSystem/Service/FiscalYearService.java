package com.InventoryManagementSystem.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.InventoryManagementSystem.Model.Calender;
import com.InventoryManagementSystem.Model.EnglishFiscalYear;
import com.InventoryManagementSystem.Model.NepaliFiscalYear;
import com.InventoryManagementSystem.Repository.CalenderRepository;
import com.InventoryManagementSystem.Repository.EnglishFiscalYearRepository;
import com.InventoryManagementSystem.Repository.NepaliFiscalYearRepository;

@Service
public class FiscalYearService {

    @Autowired
    private NepaliFiscalYearRepository nepaliFiscalYearRepository;

    @Autowired
    private EnglishFiscalYearRepository englishFiscalYearRepository;

    @Autowired
    private CalenderRepository calenderRepository;

    public void saveFiscalYear(Map<String, String> payload) {
        String fiscalBsStart = payload.get("fiscalBsStart");
        String fiscalBsEnd = payload.get("fiscalBsEnd");
        String fiscalAdStartStr = payload.get("fiscalAdStart");
        String fiscalAdEndStr = payload.get("fiscalAdEnd");

        LocalDate fiscalAdStart = LocalDate.parse(fiscalAdStartStr);
        LocalDate fiscalAdEnd = LocalDate.parse(fiscalAdEndStr);

        String bsYearFrom = fiscalBsStart.substring(0, 4);
        String bsYearTill = fiscalBsEnd.substring(0, 4);
        String adYearFrom = String.valueOf(fiscalAdStart.getYear());
        String adYearTill = String.valueOf(fiscalAdEnd.getYear());

        NepaliFiscalYear nfy = new NepaliFiscalYear();
        nfy.setCreateDate(LocalDateTime.now());
        nfy.setUpdatedDate(LocalDateTime.now());
        nfy.setDisplay(true);
        nfy.setFiscalBsStart(fiscalBsStart);
        nfy.setFiscalBsEnd(fiscalBsEnd);
        nfy.setFiscalAdStart(fiscalAdStart);
        nfy.setFiscalAdEnd(fiscalAdEnd);
        nfy.setFiscalYearFrom(bsYearFrom);
        nfy.setFiscalYearTill(bsYearTill);

        NepaliFiscalYear savedNfy = nepaliFiscalYearRepository.save(nfy);

        Optional<Calender> calStart = calenderRepository.findByAdDateAndDisplayTrue(fiscalAdStart);
        Optional<Calender> calEnd = calenderRepository.findByAdDateAndDisplayTrue(fiscalAdEnd);

        String englishFiscalBsStart = calStart.map(Calender::getBsDate).orElse(null);
        String englishFiscalBsEnd = calEnd.map(Calender::getBsDate).orElse(null);

        EnglishFiscalYear efy = new EnglishFiscalYear();
        efy.setCreateDate(LocalDateTime.now());
        efy.setUpdatedDate(LocalDateTime.now());
        efy.setDisplay(true);
        efy.setFiscalAdStart(fiscalAdStart);
        efy.setFiscalAdEnd(fiscalAdEnd);
        efy.setFiscalBsStart(englishFiscalBsStart);
        efy.setFiscalBsEnd(englishFiscalBsEnd);
        efy.setFiscalYearFrom(adYearFrom);
        efy.setFiscalYearTill(adYearTill);

        EnglishFiscalYear savedEfy = englishFiscalYearRepository.save(efy);

        List<Calender> nepaliCalRows = calenderRepository.findByBsDateBetweenAndDisplayTrue(fiscalBsStart, fiscalBsEnd);
        for (Calender cal : nepaliCalRows) {
            cal.setNepaliFiscalYear(savedNfy);
        }
        calenderRepository.saveAll(nepaliCalRows);

        List<Calender> englishCalRows = calenderRepository.findByAdDateBetweenAndDisplayTrue(fiscalAdStart,
                fiscalAdEnd);
        for (Calender cal : englishCalRows) {
            cal.setEnglishFiscalYear(savedEfy);
        }
        calenderRepository.saveAll(englishCalRows);
    }
}
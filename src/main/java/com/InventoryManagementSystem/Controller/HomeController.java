package com.InventoryManagementSystem.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/categoryform")
    public String categoryForm() {
        return "parameterization/category/categoryform";
    }

    @GetMapping("/categoryedit")
    public String categoryEdit() {
        return "parameterization/category/categoryedit";
    }

    @GetMapping("/categorydetails")
    public String categorydetails() {
        return "parameterization/category/categorydetails";
    }

    @GetMapping("/categorytype")
    public String categorytype() {
        return "parameterization/category/categorytype";
    }

    @GetMapping("/company")
    public String companyForm() {
        return "parameterization/company/company";
    }

    @GetMapping("/companydetails")
    public String companyDetails() {
        return "parameterization/company/companydetails";
    }

    @GetMapping("/companyview")
    public String companyView() {
        return "parameterization/company/companyview";
    }

    @GetMapping("/branchsetup")
    public String branchSetup() {
        return "parameterization/branch/branchsetup";
    }

    @GetMapping("/branchdetails")
    public String branchDetails() {
        return "parameterization/branch/branchdetails";
    }

    @GetMapping("/branchedit")
    public String branchEdit() {
        return "parameterization/branch/branchedit";
    }

    @GetMapping("/branchview")
    public String branchView() {
        return "parameterization/branch/branchview";
    }

    @GetMapping("/departmentsetup")
    public String departmentSetup() {
        return "parameterization/department/departmentsetup";
    }

    @GetMapping("/departmentedit")
    public String departmentEdit() {
        return "parameterization/department/departmentedit";
    }

    @GetMapping("/departmentdetails")
    public String departmentDetails() {
        return "parameterization/department/departmentdetails";
    }

    @GetMapping("/userregistration")
    public String userRegistration() {
        return "utility/userregistration";
    }

    @GetMapping("/roleform")
    public String roleForm() {
        return "roleform";
    }

    @GetMapping("/backup")
    public String backup() {
        return "backuprestore";
    }

    @GetMapping("/requisitionslip")
    public String requisitionSlip() {
        return "operations/requisitionslip";
    }

    @GetMapping("/requisitionslipview")
    public String requisitionSlipView() {
        return "requisitionslipview";
    }

    @GetMapping("/purchaseorder")
    public String purchaseOrder() {
        return "operations/purchaseorder";
    }

    @GetMapping("/purchaseorderview")
    public String purchaseOrderView() {
        return "purchaseorderview";
    }

    @GetMapping("/goodreceivingnote")
    public String goodReceivingNote() {
        return "operations/goodreceivingnote";
    }

    @GetMapping("/damagedetails")
    public String damagedetails() {
        return "damagedetails";
    }

    @GetMapping("/setupCalendar")
    public String setupCalendarform() {
        return "parameterization/setupCalendar";
    }

    @GetMapping("/itemissueform")
    public String itemIssueForm() {
        return "operations/itemissueform";
    }

    @GetMapping("/calculator")
    public String calculator() {
        return "utility/calculator";
    }

    @GetMapping("/calender")
    public String calender() {
        return "utility/calender";
    }

    @GetMapping("/companystaff")
    public String companystaffform() {
        return "utility/companystaff";
    }

    @GetMapping("/companystaffview")
    public String companystaffView() {
        return "companystaffview";
    }

    @GetMapping("/companystaffdetails")
    public String companystaffDetails() {
        return "utility/companystaffdetails";
    }

    @GetMapping("/organizationsetup")
    public String organizationsetupform() {
        return "parameterization/organizationsetup";
    }

    @GetMapping("/itemdetails")
    public String itemForm() {
        return "parameterization/item/itemdetails";
    }

    @GetMapping("/additemform")
    public String addItemForm() {
        return "parameterization/item/additemform";
    }

    @GetMapping("/itemview")
    public String itemView() {
        return "parameterization/item/itemview";
    }

    @GetMapping("/reports/stockledgerreport")
    public String stockLedgerreport() {
        return "Reports/stockledgerreport";
    }

    @GetMapping("layout/table")
    public String table() {
        return "layout/table";
    }

    @GetMapping("/reports/stock_detail")
    public String stock_detail() {
        return "reports/stock_detail";
    }

    @GetMapping("/reports/maintainancereport")
    public String maintainancereport() {
        return "reports/maintainancereport";
    }

    @GetMapping("/reports/maintainancereportview")
    public String maintainancereportview() {
        return "reports/maintainancereportview";
    }

    @GetMapping("/requisitionreport")
    public String requisitionReport() {
        return "reports/requisitionreport";
    }

    @GetMapping("/itemissuereportview")
    public String itemissuereportview() {
        return "reports/itemissuereportview";
    }

    @GetMapping("/purchaseorderreport")
    public String purchaseorderReport() {
        return "reports/purchaseorderreport";
    }

    @GetMapping("/goodreceivingnotereports")
    public String goodReceivingNoteReport() {
        return "reports/goodreceivingnotereports";
    }

    @GetMapping("/damagereport")
    public String damageReport() {
        return "reports/damagereport";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/goodreceivingnoteview")
    public String goodreceivingnoteview() {
        return "reports/goodreceivingnoteview";
    }

    @GetMapping("/userregistrationview")
    public String userregistrationview() {
        return "reports/userregistrationview";
    }

    @GetMapping("/goodissuereport")
    public String goodIssueReport() {
        return "reports/goodissuereport";
    }

    @GetMapping("/details")
    public String detailsform() {
        return "details";
    }

    @GetMapping("/reports/filter")
    public String filterPage() {
        return "Reports/filter";
    }

    @GetMapping("/monthsetup")
    public String monthsetup() {
        return "parameterization/monthsetup";
    }

    @GetMapping("/fiscalyear")
    public String fiscalyearsetup() {
        return "parameterization/fiscalyear";
    }

    @GetMapping("/maintainanceform")
    public String maintainanceform() {
        return "operations/maintainanceform";
    }

    @GetMapping("/setupcalendar")
    public String setupCalendar() {
        return "parameterization/setupCalendar";
    }

    @GetMapping("/accesscontrol")
    public String accessControl() {
        return "utility/accesscontrol";
    }

    @GetMapping("/codegenerator")
    public String codegenerator() {
        return "utility/codegenerator";
    }

    @GetMapping("/recentreports")
    public String itemOpening() {
        return "Reports/recentReports";
    }

    @GetMapping("/reminder")
    public String reminder() {
        return "utility/reminder";
    }

    @GetMapping("/notes")
    public String notes() {
        return "utility/notes";
    }

    @GetMapping("/dictionary")
    public String dictionary() {
        return "utility/dictionary";
    }

    @GetMapping("/unitconverter")
    public String unitConverter() {
        return "utility/unitconverter";
    }

    @GetMapping("/supportform")
    public String supportForm() {
        return "supportform";
    }

    @GetMapping("/inventorymethod")
    public String inventoryMethod() {
        return "utility/inventorymethod";
    }
}
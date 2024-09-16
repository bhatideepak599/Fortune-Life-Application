package com.techlabs.app.controller;

import com.techlabs.app.dto.AdminDto;
import com.techlabs.app.dto.ReportsDto;
import com.techlabs.app.dto.UserDto;
import com.techlabs.app.service.AdminService;
import com.techlabs.app.service.ReportsService;
import com.techlabs.app.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fortuneLife/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    @Autowired
    private AdminService adminService;

    @Autowired
    private ReportsService reportsService;

    @Operation(summary = "Add A New Admin ")
    @PostMapping
    public ResponseEntity<AdminDto> addAdmin(@Valid @RequestBody UserDto userDto,
                                             @RequestParam(name = "role") String name) {
        logger.info("Adding A New Admin");
        String role = "ROLE_" + name.toUpperCase();
        AdminDto adminDto = adminService.addAdmin(userDto, role);

        return new ResponseEntity<>(adminDto, HttpStatus.OK);
    }

    @Operation(summary = "Get All Admins based on Search Criteria")
    @GetMapping
    public ResponseEntity<PageResponse<AdminDto>> getAllAdmins(@RequestParam(required = false) Long id,
                                                               @RequestParam(required = false) String userName, @RequestParam(required = false) String name,
                                                               @RequestParam(required = false) String mobileNumber, @RequestParam(required = false) String email,
                                                               @RequestParam(required = false) Boolean active, @RequestParam(name = "page", defaultValue = "0") int page,
                                                               @RequestParam(name = "size", defaultValue = "10") int size) {
        logger.info("Fetching All The Admins");
        PageResponse<AdminDto> admins = adminService.getAllAdmins(id, userName, name, mobileNumber, email, active, page,
                size);

        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    @Operation(summary = "Fetch Admin By Id")
    @GetMapping("/{id}")
    public ResponseEntity<AdminDto> getAdminById(@PathVariable("id") Long id) {
        logger.info("Fetching An Admin");
        AdminDto admin = adminService.getAdminById(id);
        return new ResponseEntity<>(admin, HttpStatus.OK);
    }

    @Operation(summary = "Fetch Logged Admin By Token")
    @GetMapping("/logged")
    public ResponseEntity<AdminDto> getAdminByToken(HttpServletRequest request) {
        logger.info("Fetching An Admin");
        AdminDto admin = adminService.getAdminByToken(request);
        return new ResponseEntity<>(admin, HttpStatus.OK);
    }

    @Operation(summary = "Update An  Admin")
    @PutMapping
    public ResponseEntity<AdminDto> updateAdmin(@Valid @RequestBody UserDto userDto) {
        logger.info("Updating An Admin");
        AdminDto admin = adminService.updateAdmin(userDto);
        return new ResponseEntity<>(admin, HttpStatus.OK);
    }

    @Operation(summary = "Activate An  Admin")
    @PutMapping("/activate/{id}")
    public ResponseEntity<String> activateAdmin(@PathVariable("id") Long id) {
        logger.info("Activating An Admin");
        String activatedMessage = adminService.activateAdmin(id);
        return new ResponseEntity<>(activatedMessage, HttpStatus.OK);
    }

    @Operation(summary = "Delete Admin By Id")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdminById(@PathVariable("id") Long id) {
        logger.info("Deleting An Admin with Admin Id");
        String message = adminService.deleteAdminById(id);

        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @Secured("ADMIN")
    @Operation(summary = "Count Report")
    @GetMapping("/count")
    public ResponseEntity<ReportsDto> getAllCount(){
        logger.info("Getting counts of customers, policies, agents, employees");
        ReportsDto reportsDto = reportsService.getAllReportCount();

        return new ResponseEntity<>(reportsDto, HttpStatus.OK);
    }
}

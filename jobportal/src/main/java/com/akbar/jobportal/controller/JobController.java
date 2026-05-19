package com.akbar.jobportal.controller;

import com.akbar.jobportal.dto.JobRequest;
import com.akbar.jobportal.dto.JobResponse;
import com.akbar.jobportal.service.JobService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse createJob(@Valid @RequestBody JobRequest request, Principal principal) {
        return jobService.createJob(request, principal.getName());
    }

    @GetMapping
    public List<JobResponse> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/{id}")
    public JobResponse getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PutMapping("/update/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Principal principal
    ) {
        return jobService.updateJob(id, request, principal.getName());
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable Long id, Principal principal) {
        jobService.deleteJob(id, principal.getName());
    }

    @GetMapping("/search")
    public List<JobResponse> searchJobs(@RequestParam String title) {
        return jobService.searchByTitle(title);
    }

    @GetMapping("/filter")
    public List<JobResponse> filterJobs(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary,
            @RequestParam(required = false) String location
    ) {
        return jobService.filterJobs(category, minSalary, maxSalary, location);
    }

    @GetMapping("/mine")
    public List<JobResponse> getMyJobs(Principal principal) {
        return jobService.getJobsByOwner(principal.getName());
    }
}

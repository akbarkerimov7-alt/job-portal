package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.JobRequest;
import com.akbar.jobportal.dto.JobResponse;
import java.math.BigDecimal;
import java.util.List;

public interface JobService {

    JobResponse createJob(JobRequest request, String ownerEmail);

    List<JobResponse> getAllJobs();

    JobResponse getJobById(Long id);

    JobResponse updateJob(Long id, JobRequest request, String ownerEmail);

    void deleteJob(Long id, String ownerEmail);

    List<JobResponse> searchByTitle(String title);

    List<JobResponse> filterJobs(String category, BigDecimal minSalary, BigDecimal maxSalary, String location);

    List<JobResponse> getJobsByOwner(String ownerEmail);
}

package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.JobRequest;
import com.akbar.jobportal.dto.JobResponse;
import com.akbar.jobportal.model.Job;
import com.akbar.jobportal.model.User;
import com.akbar.jobportal.repository.JobRepository;
import com.akbar.jobportal.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobServiceImpl(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public JobResponse createJob(JobRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Job job = new Job();
        applyRequest(job, request);
        job.setUser(owner);

        return toResponse(jobRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        return toResponse(findJob(id));
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long id, JobRequest request, String ownerEmail) {
        Job job = findJob(id);
        assertOwner(job, ownerEmail);
        applyRequest(job, request);
        return toResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long id, String ownerEmail) {
        Job job = findJob(id);
        assertOwner(job, ownerEmail);
        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> searchByTitle(String title) {
        String value = title == null ? "" : title;
        return jobRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(value).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> filterJobs(String category, BigDecimal minSalary, BigDecimal maxSalary, String location) {
        return jobRepository.filterJobs(blankToNull(category), blankToNull(location), minSalary, maxSalary).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByOwner(String ownerEmail) {
        return jobRepository.findByUserEmailOrderByCreatedAtDesc(ownerEmail).stream()
                .map(this::toResponse)
                .toList();
    }

    private Job findJob(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    private void assertOwner(Job job, String ownerEmail) {
        if (!job.getUser().getEmail().equals(ownerEmail)) {
            throw new AccessDeniedException("You can edit or delete only your own jobs");
        }
    }

    private void applyRequest(Job job, JobRequest request) {
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCategory(request.getCategory());
        job.setSalary(request.getSalary());
        job.setPaymentType(request.getPaymentType());
        job.setLocation(request.getLocation());
        job.setImageUrl(request.getImageUrl());
        job.setGenderRequirement(request.getGenderRequirement());
    }

    private JobResponse toResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setCategory(job.getCategory());
        response.setSalary(job.getSalary());
        response.setPaymentType(job.getPaymentType());
        response.setLocation(job.getLocation());
        response.setImageUrl(job.getImageUrl());
        response.setGenderRequirement(job.getGenderRequirement());
        response.setCreatedAt(job.getCreatedAt());
        response.setUserId(job.getUser().getId());
        response.setOwnerName(job.getUser().getName());
        response.setOwnerEmail(job.getUser().getEmail());
        response.setOwnerPhone(job.getUser().getPhone());
        return response;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}

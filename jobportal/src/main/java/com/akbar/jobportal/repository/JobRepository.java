package com.akbar.jobportal.repository;

import com.akbar.jobportal.model.Job;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);

    List<Job> findByUserEmailOrderByCreatedAtDesc(String email);

    List<Job> findAllByOrderByCreatedAtDesc();

    @Query("""
            select j from Job j
            where (:category is null or lower(j.category) = lower(:category))
              and (:location is null or lower(j.location) like lower(concat('%', :location, '%')))
              and (:minSalary is null or j.salary >= :minSalary)
              and (:maxSalary is null or j.salary <= :maxSalary)
            order by j.createdAt desc
            """)
    List<Job> filterJobs(
            @Param("category") String category,
            @Param("location") String location,
            @Param("minSalary") BigDecimal minSalary,
            @Param("maxSalary") BigDecimal maxSalary
    );
}

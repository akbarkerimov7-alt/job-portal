package com.job.jobportal.repository;

import com.job.jobportal.model.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long> {

    // Дополнительный метод: поиск вакансий по названию (игнорируя регистр)
    List<Vacancy> findByTitleContainingIgnoreCase(String title);
}
package com.job.jobportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.job.jobportal.model.Vacancy;
import com.job.jobportal.service.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/vacancies") // Базовый URL для всех запросов
public class VacancyController {

    @Autowired
    private VacancyService vacancyService;

    // GET запрос: http://localhost:8080/api/vacancies
    @GetMapping
    public List<Vacancy> getAll() {
        return vacancyService.getAllVacancies();
    }

    // POST запрос: для создания вакансии
    @PostMapping
    public Vacancy create(@RequestBody Vacancy vacancy) {
        // Теперь ошибка исчезнет, так как сервис возвращает объект
        return vacancyService.saveVacancy(vacancy);
    }
    // 1. Открыть форму редактирования
    @GetMapping("/vacancies/edit/{id}")
    public String edit(@PathVariable("id") Long id, Model model) {
        Vacancy vacancy = vacancyService.getVacancyById(id); // Тебе нужно будет создать этот метод в сервисе
        model.addAttribute("vacancy", vacancy);
        return "edit-vacancy"; // Создадим этот HTML файл
    }

    // 2. Сохранить измененную вакансию
    @PostMapping("/vacancies/edit")
    public String updateVacancy(@ModelAttribute("vacancy") Vacancy vacancy) {
        vacancyService.saveVacancy(vacancy); // Тот же метод, что для сохранения, Spring сам поймет, что это Update по наличию ID
        return "redirect:/vacancies";
    }

}


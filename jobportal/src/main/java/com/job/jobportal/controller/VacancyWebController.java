package com.job.jobportal.controller;

import com.job.jobportal.model.Vacancy;
import com.job.jobportal.repository.VacancyRepository;
import com.job.jobportal.service.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class VacancyWebController {

    @Autowired
    private VacancyService vacancyService; // Внедряем сервис, а не репозиторий

    // Главная страница со списком
    @GetMapping("/vacancies")
    public String showVacanciesPage(Model model) {
        // Теперь данные берем из Сервиса
        model.addAttribute("allVacancies", vacancyService.getAllVacancies());
        return "vacancies-list";
    }

    // Показать форму добавления
    @GetMapping("/vacancies/add")
    public String showAddForm(Model model) {
        model.addAttribute("vacancy", new Vacancy());
        return "add-vacancy";
    }

    // Сохранить вакансию через сервис
    @PostMapping("/vacancies/save")
    public String save(@ModelAttribute("vacancy") Vacancy vacancy) {
        vacancyService.saveVacancy(vacancy); // Метод в сервисе для сохранения
        return "redirect:/vacancies";
    }

    // Метод для удаления
    @GetMapping("/vacancies/delete/{id}")
    public String delete(@PathVariable Long id) {
        vacancyService.deleteVacancy(id); // Метод в сервисе для удаления
        return "redirect:/vacancies";
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
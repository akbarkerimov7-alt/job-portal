package com.job.jobportal.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vacancies")
@Data // Генерирует геттеры, сеттеры и toString через Lombok
public class Vacancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;          // Название
    private String description;    // Описание
    private String category;       // IT, Дизайн, Доставка
    private Double salary;         // Зарплата
    private String paymentType;    // Ежедневно / Ежемесячно
    private String location;       // Место работы
    private String photoUrl;       // Ссылка на фото
    private String requiredGender; // Пол (если требуется)

    // В будущем добавим связь с пользователем:
    // @ManyToOne
    // private User author;
}
package com.example.restservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "questionId", nullable = false)
    private FeedbackQuestion question;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "responseId", nullable = false)
    private FeedbackResponse response;
}

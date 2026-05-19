package com.akbar.jobportal.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageRequest {

    @NotBlank
    private String content;

    private Long receiverId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
}

package com.akbar.jobportal.controller;

import com.akbar.jobportal.dto.ChatMessageRequest;
import com.akbar.jobportal.dto.ChatMessageResponse;
import com.akbar.jobportal.dto.ConversationResponse;
import com.akbar.jobportal.service.ChatService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/conversations")
    public List<ConversationResponse> getConversations(Principal principal) {
        return chatService.getConversations(principal.getName());
    }

    @GetMapping("/jobs/{jobId}")
    public List<ChatMessageResponse> getMessages(
            @PathVariable Long jobId,
            @RequestParam(required = false) Long participantId,
            Principal principal
    ) {
        return chatService.getMessages(jobId, participantId, principal.getName());
    }

    @PostMapping("/jobs/{jobId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public ChatMessageResponse sendMessage(
            @PathVariable Long jobId,
            @Valid @RequestBody ChatMessageRequest request,
            Principal principal
    ) {
        return chatService.sendMessage(jobId, request, principal.getName());
    }
}

package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.ChatMessageRequest;
import com.akbar.jobportal.dto.ChatMessageResponse;
import com.akbar.jobportal.dto.ConversationResponse;
import com.akbar.jobportal.model.ChatMessage;
import com.akbar.jobportal.model.Job;
import com.akbar.jobportal.model.User;
import com.akbar.jobportal.repository.ChatMessageRepository;
import com.akbar.jobportal.repository.JobRepository;
import com.akbar.jobportal.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ChatServiceImpl(
            ChatMessageRepository chatMessageRepository,
            JobRepository jobRepository,
            UserRepository userRepository
    ) {
        this.chatMessageRepository = chatMessageRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ChatMessageResponse sendMessage(Long jobId, ChatMessageRequest request, String senderEmail) {
        Job job = findJob(jobId);
        User sender = findUser(senderEmail);
        User receiver = resolveReceiver(job, sender, request.getReceiverId());

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot send a message to yourself");
        }

        ChatMessage message = new ChatMessage();
        message.setJob(job);
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent().trim());

        return toResponse(chatMessageRepository.save(message));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Long jobId, Long participantId, String currentEmail) {
        Job job = findJob(jobId);
        User currentUser = findUser(currentEmail);
        Long actualParticipantId = participantId;

        if (actualParticipantId == null) {
            actualParticipantId = job.getUser().getId();
        }

        if (currentUser.getId().equals(job.getUser().getId()) && participantId == null) {
            throw new IllegalArgumentException("Employer must choose a participant");
        }

        return chatMessageRepository.findConversation(jobId, currentEmail, actualParticipantId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversations(String currentEmail) {
        User currentUser = findUser(currentEmail);
        Map<String, ConversationResponse> conversations = new LinkedHashMap<>();

        for (ChatMessage message : chatMessageRepository.findUserMessages(currentEmail)) {
            User participant = message.getSender().getId().equals(currentUser.getId())
                    ? message.getReceiver()
                    : message.getSender();
            String key = message.getJob().getId() + ":" + participant.getId();

            conversations.computeIfAbsent(key, ignored -> {
                ConversationResponse response = new ConversationResponse();
                response.setJobId(message.getJob().getId());
                response.setJobTitle(message.getJob().getTitle());
                response.setParticipantId(participant.getId());
                response.setParticipantName(participant.getName());
                response.setLastMessage(message.getContent());
                response.setLastMessageAt(message.getCreatedAt());
                return response;
            });
        }

        return conversations.values().stream().toList();
    }

    private User resolveReceiver(Job job, User sender, Long receiverId) {
        if (receiverId != null) {
            return userRepository.findById(receiverId)
                    .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
        }

        if (sender.getId().equals(job.getUser().getId())) {
            throw new IllegalArgumentException("Employer must choose a receiver");
        }

        return job.getUser();
    }

    private Job findJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setJobId(message.getJob().getId());
        response.setJobTitle(message.getJob().getTitle());
        response.setSenderId(message.getSender().getId());
        response.setSenderName(message.getSender().getName());
        response.setReceiverId(message.getReceiver().getId());
        response.setReceiverName(message.getReceiver().getName());
        response.setContent(message.getContent());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}

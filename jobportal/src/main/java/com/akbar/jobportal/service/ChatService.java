package com.akbar.jobportal.service;

import com.akbar.jobportal.dto.ChatMessageRequest;
import com.akbar.jobportal.dto.ChatMessageResponse;
import com.akbar.jobportal.dto.ConversationResponse;
import java.util.List;

public interface ChatService {

    ChatMessageResponse sendMessage(Long jobId, ChatMessageRequest request, String senderEmail);

    List<ChatMessageResponse> getMessages(Long jobId, Long participantId, String currentEmail);

    List<ConversationResponse> getConversations(String currentEmail);
}

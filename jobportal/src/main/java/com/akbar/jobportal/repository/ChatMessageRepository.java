package com.akbar.jobportal.repository;

import com.akbar.jobportal.model.ChatMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("""
            select m from ChatMessage m
            where m.job.id = :jobId
              and ((m.sender.email = :currentEmail and m.receiver.id = :participantId)
                or (m.receiver.email = :currentEmail and m.sender.id = :participantId))
            order by m.createdAt asc
            """)
    List<ChatMessage> findConversation(
            @Param("jobId") Long jobId,
            @Param("currentEmail") String currentEmail,
            @Param("participantId") Long participantId
    );

    @Query("""
            select m from ChatMessage m
            where m.sender.email = :email or m.receiver.email = :email
            order by m.createdAt desc
            """)
    List<ChatMessage> findUserMessages(@Param("email") String email);
}

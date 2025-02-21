package com.chat.chatapp.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.chat.chatapp.entity.Message;
import com.chat.chatapp.payload.MessageRequest;

@Service
public class ChatService {

	public Message sendMessage(MessageRequest request) {
		
		Message message = new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setTimestamp(LocalDateTime.now());
		return message;
	}

	}	
	

package com.chat.chatapp.entity;

import java.time.LocalDateTime;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Message {

	private String sender;
	private String content;
	private LocalDateTime timestamp;
	
	public Message(String sender, String content, LocalDateTime timestamp) {
		super();
		this.sender = sender;
		this.content = content;
		this.timestamp = LocalDateTime.now();
	}
	
	
}

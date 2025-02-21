package com.chat.chatapp.repository;

import org.springframework.data.jpa.repository.JpaRepository; 
import org.springframework.stereotype.Repository;

import com.chat.chatapp.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer>{

	Room findByRoomId(String roomId);
}

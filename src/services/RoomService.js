import { httpClient } from "../config/AxiosHelper";

export const roomService = async (roomDetail) => {
  const response = await httpClient.post(`/api/v1/rooms`, roomDetail);
  return response.data;
};

export const joinRoom = async (roomId) => {
  const response = await httpClient.get(`/api/v1/room/${roomId}`);
  return response.data;
};

export const getMessages = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};

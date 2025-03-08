// src/modules/auth/authAPI.ts
import api from "../../services/api";

export const loginAPI = async (credentials: {
  email: string;
  password: string;
}) => {
  // TODO: Replace with actual endpoint URL
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Thêm các API khác: register, refreshToken, ...

import api from './axiosAgent';

export class BaseService {
  public static async get<T>(endpoint: string, params?: object): Promise<T> {
    const response = await api.get<T>(endpoint, { params });
    return response.data;
  }

  public static async post<T>(endpoint: string, data?: object): Promise<T> {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  }

  public static async put<T>(endpoint: string, data?: object): Promise<T> {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  }

  public static async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete<T>(endpoint);
    return response.data;
  }
} 

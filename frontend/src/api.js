import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark it as a retry request

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        const response = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const newAccessToken = response.data.access;
        
        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        api.defaults.headers.common['Authorization'] = null;
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
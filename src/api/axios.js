import axios from "axios";

const api = axios.create({
  baseURL: "http://diaryapplication-backend-production-7a12.up.railway.app",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
const token = localStorage.getItem("accessToken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

  api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // ✅ FIRST handle 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://diaryapplication-backend-production-7a12.up.railway.app/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken ?? res.data;
       localStorage.setItem("accessToken", newToken); // CHANGED
 
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch {
        localStorage.removeItem("accessToken"); 
        window.location.href = "/";
      }
    }

    // ✅ THEN normalize error
    if (error.response?.data) {
      return Promise.reject({
        status: error.response.status,
        code: error.response.data.code,
        message: error.response.data.message
      });
    }

    return Promise.reject({
      status: 500,
      code: "UNKNOWN_ERROR",
      message: "Something went wrong"
    });
  }
);


export default api;



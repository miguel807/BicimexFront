import axios, { type AxiosInstance } from "axios";
import { rutes } from "../../config/rutes";
import "react-toastify/dist/ReactToastify.css";
import { useToast } from "../libs/toastProvider";

class ApiService {
  private axiosInstance: AxiosInstance;
  private refreshTokenRequest: Promise<string> | null = null;
  showToast = useToast();

  constructor(baseURL = `${rutes.baseUrl}`) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.getRefreshToken();

            this.setAuthToken(newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return Promise.reject({
              //@ts-ignore
              ...refreshError,
              isAuthError: true,
            });
          }
        }

        if (error?.status !== 401) {
          this.showToast("error", "Ups, ha ocurrido un error");
        }

        return Promise.reject(error);
      }
    );
  }

  private async getRefreshToken(): Promise<string> {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    this.refreshTokenRequest = this.axiosInstance
      .post("/auth/refresh", { refreshToken })
      .then((response) => {
        const newAccessToken =
          response.data.access_token || response.data.accessToken;
        if (!newAccessToken) {
          throw new Error("Invalid token response");
        }

        localStorage.setItem("access_token", newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        this.refreshTokenRequest = null;
      });

    return this.refreshTokenRequest;
  }
  async get(endpoint: string, params = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error("GET ERROR", error);
      throw error;
    }
  }
  
  async post(endpoint: string, data: Object, isFileUpload = false) {
    const headers = isFileUpload
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers,
      });
     

      return response.data;
    } catch (error) {
      console.error("Error en post:", error);
      throw error;
    }
  }

  async patch(endpoint: string, data: Object) {
    try {
      const response = await this.axiosInstance.patch(endpoint, data);
    
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await this.axiosInstance.delete(endpoint);
     
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  setAuthToken(token: string) {
    localStorage.setItem("access_token", token);
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }
}

export default ApiService;

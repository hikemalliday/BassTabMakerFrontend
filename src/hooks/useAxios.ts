import axios, { AxiosInstance } from "axios";
import { BACKEND_API } from "../requests";
import { useLocalStorageContext } from "../Context/LocalStorageContext";
import { useNavigate } from "react-router-dom";
import { useSongContext } from "../Context/SongContext";

export const useAxios = (enabled: boolean): AxiosInstance => {
  const mavigate = useNavigate();
  const { access, refresh, setAccess, clearLocalStorageContext } =
    useLocalStorageContext();
  const { clearSongContext } = useSongContext();
  const axiosInstance = axios.create({
    baseURL: BACKEND_API,
    withCredentials: true,
  });
  if (!enabled) {
    return axiosInstance;
  }

  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${access}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const resp = await axios.post(BACKEND_API + "token/refresh/", {
            refresh: refresh,
          });
          if (resp.status === 200) {
            setAccess(resp.data.access);
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${resp.data.access}`;
            return axiosInstance(originalRequest);
          }
        } catch (err) {
          console.error(err);
          clearLocalStorageContext();
          clearSongContext();
          mavigate("/login");
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

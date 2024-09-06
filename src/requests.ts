import { AxiosError, AxiosResponse } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ILoginParams,
  INotePost,
  ISignUpParams,
  ISongMetadata,
  ISongState,
} from "./types";
import { useAxios } from "./hooks/useAxios";
import { reduceSong } from "./utils";
import { useSnackbarContext } from "./Context/SnackBarContext";

export const BACKEND_API = "http://127.0.0.1:8000/api/";

export interface IUseCreateSongParams {
  song_name?: string;
  artist?: string;
  time_signature?: number;
  instrument?: string;
}

export interface ISongMetadataParams {
  id: number;
  metadata: ISongMetadata;
}

export const useSongQuery = (songNameInt: number) => {
  const axiosInstance = useAxios(true);
  return useQuery({
    queryFn: async () => {
      if (songNameInt === 0) return "";
      try {
        const resp = await axiosInstance.get("song/" + songNameInt + "/");
        if (resp) {
          return resp.data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    queryKey: ["songName", songNameInt],
  });
};

export const useSongNames = (songData: ISongState) => {
  const axiosInstance = useAxios(true);
  return useQuery({
    queryFn: async () => {
      try {
        const resp = await axiosInstance.get("song/" + "song_names/");
        if (resp) {
          return resp.data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    queryKey: ["songNames", songData],
  });
};

export const useCreateSong = () => {
  const { addToast } = useSnackbarContext();
  const axiosInstance = useAxios(true);
  return useMutation({
    mutationFn: async (params: IUseCreateSongParams) => {
      try {
        const resp = await axiosInstance.post("song/", params);
        if (resp) {
          return resp;
        }
      } catch (err) {
        const error = err as AxiosError;
        addToast(`${JSON.stringify(error?.response?.data)}`, "error");
        console.error(err);
      }
    },
  });
};

export const useSaveSong = () => {
  const { addToast } = useSnackbarContext();
  const axiosInstance = useAxios(true);
  return useMutation({
    mutationFn: async (song: INotePost[]) => {
      try {
        const resp = await axiosInstance.post("song/save_song/", song);
        if (resp) {
          return resp.data;
        }
      } catch (err) {
        const error = err as AxiosError;
        addToast(`${JSON.stringify(error?.response?.data)}`, "error");
        console.error(err);
      }
    },
  });
};

export const useSaveSongMetadata = () => {
  const { addToast } = useSnackbarContext();
  const axiosInstance = useAxios(true);
  return useMutation({
    mutationFn: async (params: ISongMetadataParams) => {
      const id = params.id;
      const metadata = params.metadata;
      try {
        const resp = await axiosInstance.patch(`song/${id}/`, metadata);
        if (resp) {
          return resp;
        }
      } catch (err) {
        const error = err as AxiosError;
        addToast(`${JSON.stringify(error?.response?.data)}`, "error");
        console.error(err);
      }
    },
  });
};

export const useLogin = () => {
  const { addToast } = useSnackbarContext();
  const axiosInstance = useAxios(false);
  return useMutation<AxiosResponse, AxiosError, ILoginParams>({
    mutationFn: async (params: ILoginParams) => {
      try {
        const resp = await axiosInstance.post("token/", params);
        return resp;
      } catch (err) {
        const error = err as AxiosError;
        addToast(`${JSON.stringify(error?.response?.data)}`, "error");
        console.error(err);
        throw err;
      }
    },
  });
};

export const useSignUp = () => {
  const { addToast } = useSnackbarContext();
  const axiosInstance = useAxios(false);
  return useMutation<AxiosResponse, AxiosError, ISignUpParams>({
    mutationFn: async (params: ISignUpParams) => {
      try {
        const resp = await axiosInstance.post("signup/", params);
        addToast(`Account created.`, "success");
        return resp;
      } catch (err) {
        const error = err as AxiosError;
        addToast(`${JSON.stringify(error?.response?.data)}`, "error");
        console.error(err);
        throw err;
      }
    },
  });
};

// Fetch song and manually delete then reset state (cache)
export const useRefreshSong = () => {
  const axiosInstance = useAxios(true);
  const refreshSong = async (
    songNameInt: number,
    songState: ISongState,
    setter: (state: ISongState) => void
  ): Promise<void> => {
    try {
      const resp = await axiosInstance.get(
        BACKEND_API + "song/" + songNameInt + "/"
      );
      if (resp.status === 200) {
        const song = resp.data;
        const stateCopy = { ...songState };
        delete stateCopy[songNameInt];
        stateCopy[songNameInt] = reduceSong(song);
        setter(stateCopy);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { refreshSong };
};

export const useDeleteSong = () => {
  const { addToast } = useSnackbarContext();
  const axiosInstance = useAxios(true);
  return useMutation({
    mutationFn: async (songNameInt: number) => {
      try {
        const resp = await axiosInstance.delete(
          BACKEND_API + "song/" + songNameInt + "/"
        );
        if (resp.status === 204) {
          return resp.data;
        }
      } catch (err) {
        const error = err as AxiosError;
        addToast(`${JSON.stringify(error?.response?.data)}`, "error");
        console.error(err);
        throw err;
      }
    },
  });
};

export const useUserNameQuery = (userId: number) => {
  const axiosInstance = useAxios(true);
  return useQuery({
    queryFn: async () => {
      try {
        const resp = await axiosInstance.get(
          BACKEND_API + `username/${userId}/`
        );
        if (resp.status === 200) {
          return resp.data;
        }
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    queryKey: [userId],
  });
};

import API from "./api";
import { AxiosResponse } from "axios";

  export const fetchJobs = async (page = 1, limit = 10) => {
    const response = await API.get(`/job/?page=${page}&limit=${limit}`);
    if (!response.data) throw new Error(`Error: ${response.status}`);
    return response.data;
  };
  
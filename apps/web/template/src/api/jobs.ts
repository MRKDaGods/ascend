import API from "./api";
import { AxiosResponse } from "axios";

// export const fetchJobs = async (page = 1, limit = 10) => {
//     const response = await fetch(`https://api.ascendx.tech/job/search?page=${page}&limit=${limit}`);
//     if (!response.ok) throw new Error(`Error: ${response.status}`);
//     return response.json();
//   };

  export const fetchJobs = async (page = 1, limit = 10)=> {
    const response = await API.get(`/job/search?page=${page}&limit=${limit}`, {
      params: { page, limit },
    });
    return response.data;
  };
  
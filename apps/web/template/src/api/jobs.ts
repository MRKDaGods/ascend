import API from "./api";
import { AxiosResponse } from "axios";

// Hana's jobs api function

// export const fetchJobs = async (page = 1, limit = 10) => { 
//     const response = await fetch(`https://api.ascendx.tech/job/search?page=${page}&limit=${limit}`);
//     if (!response.ok) throw new Error(`Error: ${response.status}`);
//     return response.json();
//   };

// syntax rewritten to use API (same thing as old function to fetch jobs from api)
  // export const fetchJobs = async (page = 1, limit = 10)=> {
  //   const response = await API.get(`/job/search?page=${page}&limit=${limit}`, {
  //     params: { page, limit },
  //   });
  //   return response.data;
  // };
  
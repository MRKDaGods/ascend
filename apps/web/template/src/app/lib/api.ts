export const fetchJobs = async (page = 1, limit = 10) => {
    const response = await fetch(`https://api.ascendx.tech/job/?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  };
  
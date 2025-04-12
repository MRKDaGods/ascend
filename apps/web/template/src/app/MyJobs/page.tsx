'use client';

import { useEffect } from 'react';
import { useSavedJobs } from './store/useSavedJobs';
import JobCard from './components/JobCard';
import MyJobsTabs from './components/MyJobTabs';


const MyJobsPage = () => {
  const { savedJobs, fetchSavedJobs } = useSavedJobs();

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  return (
    <>
     <MyJobsTabs 
       value={0} 
       onChange={(newValue) => console.log('Tab changed to:', newValue)} 
     />
      {savedJobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        savedJobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            logo={job.logo}
            reviewTime={job.reviewTime}
          />
        ))
      )}
    </>
  );
};

export default MyJobsPage;

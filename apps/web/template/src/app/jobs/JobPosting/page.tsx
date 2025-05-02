// JobPosting/page.tsx
import JobForm from '../../components/JobForm';
import MergeJobsNavbar from '@/app/components/MergeJobsNavbar';

export default function JobPostingPage() {
  return(
    <>
    <MergeJobsNavbar />
    <JobForm />
    </>
  );
}

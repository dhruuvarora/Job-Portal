// import useFetch from '@/hooks/use-fetch'
// import React, { useEffect } from 'react'
// import { getJobs } from '@/api/apiJobs'

// const JobListing = () => {


//   const {fn:fnJobs , data:dataJobs, loading:loadingJobs} = useFetch(getJobs, {})

//   console.log(dataJobs)

//   useEffect(()=>{
//     fnJobs()
//   } , []);
//   return (
//     <div>
//       JobListing
//     </div>
//   )
// }

// export default JobListing



import useFetch from '@/hooks/use-fetch';
import React, { useEffect, useState } from 'react';
import { getJobs } from '@/api/apiJobs';
import { BarLoader } from 'react-spinners';
import { useSession } from '@clerk/clerk-react';
import JobCard from '@/components/job-card';

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location , setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useSession();

  const { 
    fn: fnJobs, 
    data: jobs, 
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery
  });

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (jobs) {
      console.log("Jobs Data: ", jobs);
    }
  }, [jobs]);

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />;
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      {/* Add filter here */}
      {loadingJobs && <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />}

      {!loadingJobs && (
        <div>
          {jobs?.length ? (
            jobs.map((job) => {
              return <JobCard
              
              key={job.id} job = {job}/>
            })
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;

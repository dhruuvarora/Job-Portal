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
import React, { useEffect } from 'react';
import { getJobs } from '@/api/apiJobs';

const JobListing = () => {
  const { fn: fnJobs, data: dataJobs, loading: loadingJobs, isLoaded } = useFetch(getJobs, {});

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (dataJobs) {
      console.log("Jobs Data: ", dataJobs);
    }
  }, [dataJobs]);

  return null;
};

export default JobListing;

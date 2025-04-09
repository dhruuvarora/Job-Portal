// import { getJobs } from '@/api/apiJobs'
// import { useSession } from '@clerk/clerk-react'
// import React, { useEffect } from 'react'

// const JobListing = () => {

//   const {session} = useSession()

//   const fetchJobs = async() =>{
//     const supabaseAccessToken = await session.getToken({
//       template:"supabase",
//     });
//     const data = await getJobs(supabaseAccessToken);
//     console.log(data); 
//   }

//   useEffect(() =>{
//     fetchJobs()
//   }, []);
//   return (
//     <div>
//       JobListing
//     </div>
//   )
// }

// export default JobListing



import { getJobs } from '@/api/apiJobs'
import { useSession } from '@clerk/clerk-react'
import React, { useEffect } from 'react'

const JobListing = () => {
  const { session } = useSession()

  const fetchJobs = async () => {
    const supabaseAccessToken = await session.getToken({
      template: "supabase",
    });

    console.log("Supabase Token:", supabaseAccessToken);

    const data = await getJobs(supabaseAccessToken);
    console.log("Jobs data:", data);
  }

  useEffect(() => {
    if (!session) return;
    fetchJobs();
  }, [session]);

  return (
    <div>
      JobListing
    </div>
  )
}

export default JobListing

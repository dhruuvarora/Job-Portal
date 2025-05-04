import { getSingleJob, updateHiringStatus } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { BriefcaseIcon, DoorClosedIcon, DoorOpenIcon, MapPinIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplyJobDrawer from '@/components/apply-job';

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, {
    job_id: id,
  });

  const handleStatusChange = (value) =>{
    const isOpen = value === "open"
    fnHiringStatus(isOpen).then(() => fnJob());
  }

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between ">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
        <BriefcaseIcon /> {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
        {job?.isOpen ? (
      <>
      <DoorOpenIcon /> Open
      </>
  ) : (
  <>
    <DoorClosedIcon /> Closed
    </>
  )}

        </div>
      </div>

      {/* Hiring Status */}
      {job?.recruiter_id === user?.id && <Select onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950":"bg-red-950"}`}>
            <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? "(Open)" : "(Closed)")}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value = "open">
              Open
            </SelectItem>
            <SelectItem value = "closed">
              Closed
            </SelectItem>
          </SelectContent>
        </Select>}

      <h2 className='text-2xl sm:text-3xl font-bold'>About the Job</h2>

      <p className='sm:text-lg'>
        {job?.description}
      </p>

      <h2 className='text-2xl sm:text-3xl font-bold'>What we are Looking for </h2>

      <MDEditor.Markdown
      source = {job?.requirements}
      className='bg-transparent sm:text-lg'
      />

      {/* render applications */}
      {job?.recruiter_id !== user?.id && 
      (<ApplyJobDrawer 
      job = {job} user = {user} fetchJob = {fnJob}
      applied = {job?.applications?.find((ap) => ap.candidate_id === user.id)}
      />
    )}

    {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl sm:text-3xl font-bold'>
          Applications
        </h2>

        {job?.applications.map((application)=>{
          return <ApplicationCard key = {application.id} application = {application}/>
        })}
      </div>
    )} 
    </div>
  )
}

export default JobPage


// import { getSingleJob, updateHiringStatus } from '@/api/apiJobs';
// import useFetch from '@/hooks/use-fetch';
// import { useUser } from '@clerk/clerk-react';
// import { BriefcaseIcon, DoorClosedIcon, DoorOpenIcon, MapPinIcon } from 'lucide-react';
// import React, { useEffect } from 'react'
// import { useParams } from 'react-router-dom';
// import { BarLoader } from 'react-spinners';
// import MDEditor from '@uiw/react-md-editor';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// const JobPage = () => {
//   const { id } = useParams();
//   const { isLoaded, user } = useUser();

//   const {
//     loading: loadingJob,
//     data: job,
//     fn: fnJob,
//   } = useFetch(getSingleJob, {
//     job_id: id,
//   });

//   const {
//     loading: loadingHiringStatus,
//     fn: fnHiringStatus,
//   } = useFetch(updateHiringStatus, {
//     job_id: id,
//   });

//   const handleStatusChange = (value) => {
//     const isOpen = value === "open";
//     fnHiringStatus(isOpen).then(() => fnJob());
//   }

//   useEffect(() => {
//     if (isLoaded) fnJob();
//   }, [isLoaded]);
  
//   // Add debugging useEffect to see job structure when it loads
//   useEffect(() => {
//     if (job) {
//       console.log('Job data structure:', job);
//       console.log('Applications data:', job?.applications);
//       console.log('Company data:', job?.company);
//     }
//   }, [job]);

//   if (!isLoaded || loadingJob) {
//     return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
//   }

//   return (
//     <div className="flex flex-col gap-8 mt-5">
//       <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
//         <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
//           {job?.title}
//         </h1>
//         {/* Only try to show the logo if company exists */}
//         {job?.company ? (
//           <img src={job.companies.logo_url} className="h-12" alt={job?.title} />
//         ) : (
//           <div className="h-12 bg-gray-200 rounded flex items-center justify-center px-3 text-gray-500">
//             Company ID: {job?.company_id}
//           </div>
//         )}
//       </div>

//       <div className="flex justify-between ">
//         <div className="flex gap-2">
//           <MapPinIcon /> {job?.location}
//         </div>
//         <div className="flex gap-2">
//           <BriefcaseIcon /> {job?.applications ? job.applications.length : 0} Applicants
//         </div>
//         <div className="flex gap-2">
//           {job?.isOpen ? (
//             <>
//               <DoorOpenIcon /> Open
//             </>
//           ) : (
//             <>
//               <DoorClosedIcon /> Closed
//             </>
//           )}
//         </div>
//       </div>

//       {/* Hiring Status */}
//       {!loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7'/>}
//       {job?.recruiter_id === user?.id && (
//         <Select onValueChange={handleStatusChange}>
//           <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
//             <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? "(Open)" : "(Closed)")} />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="open">
//               Open
//             </SelectItem>
//             <SelectItem value="closed">
//               Closed
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       )}

//       {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

//       <h2 className='text-2xl sm:text-3xl font-bold'>About the Job</h2>

//       <p className='sm:text-lg'>
//         {job?.description}
//       </p>

//       <h2 className='text-2xl sm:text-3xl font-bold'>What we are Looking for </h2>

//       <MDEditor.Markdown
//         source={job?.requirements}
//         className='bg-transparent sm:text-lg'
//       />

//       {/* render applications */}
//       {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
//         <div className="flex flex-col gap-2">
//           <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
//           {job.applications.map((application) => (
//             <div key={application.id} className="border p-3 rounded">
//               {application.candidate_id}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default JobPage
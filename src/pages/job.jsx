// import { useEffect } from "react";
// import { BarLoader } from "react-spinners";
// import MDEditor from "@uiw/react-md-editor";
// import { useParams } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ApplyJobDrawer } from "@/components/apply-job";
// import ApplicationCard from "@/components/application-card";

// import useFetch from "@/hooks/use-fetch";
// import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

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

//   useEffect(() => {
//     if (isLoaded) fnJob();
//   }, [isLoaded, fnJob]);

//   const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
//     updateHiringStatus,
//     {
//       job_id: id,
//     }
//   );

//   const handleStatusChange = (value) => {
//     const isOpen = value === "open";
//     fnHiringStatus(isOpen).then(() => fnJob());
//   };

//   if (!isLoaded || loadingJob) {
//     return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
//   }

//   return (
//     <div className="flex flex-col gap-8 mt-5">
//       <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
//         <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
//           {job?.title}
//         </h1>
//         <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
//       </div>

//       <div className="flex justify-between ">
//         <div className="flex gap-2">
//           <MapPinIcon /> {job?.location}
//         </div>
//         <div className="flex gap-2">
//           <Briefcase /> {job?.applications?.length} Applicants
//         </div>
//         <div className="flex gap-2">
//           {job?.isOpen ? (
//             <>
//               <DoorOpen /> Open
//             </>
//           ) : (
//             <>
//               <DoorClosed /> Closed
//             </>
//           )}
//         </div>
//       </div>

//       {job?.recruiter_id === user?.id && (
//         <Select onValueChange={handleStatusChange}>
//           <SelectTrigger
//             className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
//           >
//             <SelectValue
//               placeholder={
//                 "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
//               }
//             />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="open">Open</SelectItem>
//             <SelectItem value="closed">Closed</SelectItem>
//           </SelectContent>
//         </Select>
//       )}

//       <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
//       <p className="sm:text-lg">{job?.description}</p>

//       <h2 className="text-2xl sm:text-3xl font-bold">
//         What we are looking for
//       </h2>
//       <MDEditor.Markdown
//         source={job?.requirements}
//         className="bg-transparent sm:text-lg" // add global ul styles - tutorial
//       />
//       {job?.recruiter_id !== user?.id && (
//         <ApplyJobDrawer
//           job={job}
//           user={user}
//           fetchJob={fnJob}
//           applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
//         />
//       )}
//       {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
//       {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
//         <div className="flex flex-col gap-2">
//           <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
//           {job?.applications.map((application) => {
//             return (
//               <ApplicationCard key={application.id} application={application} />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobPage;



// Jobs.jsx - Fixed component to properly display job listings
import { useEffect, useState } from "react";
import { getJobs } from "@/api/apiJobs"; // Adjust import path as needed
import JobCard from "@/components/job-card";
import { BarLoader } from "react-spinners";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs();
      
      // Log the response to debug
      console.log("Jobs API response:", response);
      
      if (response && Array.isArray(response)) {
        // Filter out invalid job entries
        const validJobs = response.filter(job => 
          job && 
          job.id && 
          job.title && 
          job.description && 
          typeof job.description === 'string'
        );
        
        console.log("Valid jobs count:", validJobs.length);
        setJobs(validJobs);
      } else {
        console.error("Invalid jobs data format:", response);
        setError("Failed to load jobs: Invalid data format");
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobAction = () => {
    // Refresh jobs after an action (save/delete)
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <BarLoader width={"50%"} color="#36d7b7" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
        <button 
          onClick={fetchJobs} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No Jobs Found</h2>
        <p>There are currently no job listings available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onJobAction={handleJobAction}
          />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
// import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
// import { Button } from "./ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Link } from "react-router-dom";
// import useFetch from "@/hooks/use-fetch";
// import { deleteJob, saveJob } from "@/api/apiJobs";
// import { useUser } from "@clerk/clerk-react";
// import { useEffect, useState } from "react";
// import { BarLoader } from "react-spinners";

// const JobCard = ({
//   job,
//   savedInit = false,
//   onJobAction = () => {},
//   isMyJob = false,
// }) => {
//   const [saved, setSaved] = useState(savedInit);

//   const { user } = useUser();

//   const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
//     job_id: job.id,
//   });

//   const {
//     loading: loadingSavedJob,
//     data: savedJob,
//     fn: fnSavedJob,
//   } = useFetch(saveJob);

//   const handleSaveJob = async () => {
//     await fnSavedJob({
//       user_id: user.id,
//       job_id: job.id,
//     });
//     onJobAction();
//   };

//   const handleDeleteJob = async () => {
//     await fnDeleteJob();
//     onJobAction();
//   };

//   useEffect(() => {
//     if (savedJob !== undefined) setSaved(savedJob?.length > 0);
//   }, [savedJob]);

//   return (
//     <Card className="flex flex-col">
//       {loadingDeleteJob && (
//         <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
//       )}
//       <CardHeader className="flex">
//         <CardTitle className="flex justify-between font-bold">
//           {job.title}
//           {isMyJob && (
//             <Trash2Icon
//               fill="red"
//               size={18}
//               className="text-red-300 cursor-pointer"
//               onClick={handleDeleteJob}
//             />
//           )}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-4 flex-1">
//         <div className="flex justify-between">
//           {job.company && <img src={job.company.logo_url} className="h-6" />}
//           <div className="flex gap-2 items-center">
//             <MapPinIcon size={15} /> {job.location}
//           </div>
//         </div>
//         <hr />
//         {job.description.substring(0, job.description.indexOf("."))}.
//       </CardContent>
//       <CardFooter className="flex gap-2">
//         <Link to={`/job/${job.id}`} className="flex-1">
//           <Button variant="secondary" className="w-full">
//             More Details
//           </Button>
//         </Link>
//         {!isMyJob && (
//           <Button
//             variant="outline"
//             className="w-15"
//             onClick={handleSaveJob}
//             disabled={loadingSavedJob}
//           >
//             {saved ? (
//               <Heart size={20} fill="red" stroke="red" />
//             ) : (
//               <Heart size={20} />
//             )}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default JobCard;

// import { useUser } from '@clerk/clerk-react'
// import React, { useEffect, useState } from 'react'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
// import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import { Button } from './ui/button'
// import useFetch from '@/hooks/use-fetch'
// import { saveJob } from '@/api/apiJobs'

// const JobCard = ({
//   job,
//   isMyJob = false,
//   savedInit = false,
//   onJobSaved = () => {},
// }) => {
//   const [saved, setSaved] = useState(savedInit);
//   const {
//     fn: fnSavedJob,
//     data: savedJob,
//     loading: loadingSavedJob,
//   } = useFetch(saveJob, {
//     alreadySaved: saved,
//   });

//   const { user } = useUser();

//   const handleSaveJob = async () => {
//     // Toggle saved state immediately for better UX
//     const newSavedState = !saved;
//     setSaved(newSavedState);
    
//     // Call the API with the updated state
//     await fnSavedJob({
//       user_id: user.id,
//       job_id: job.id,
//     });
    
//     // Trigger the callback to update parent components
//     onJobSaved();
//   };

//   // Update saved state whenever savedJob changes
//   useEffect(() => {
//     if (savedJob !== undefined) {
//       // For saving: if data returned has length > 0, it's saved
//       // For unsaving: an empty array means successfully unsaved
//       if (saved && savedJob?.length === 0) {
//         setSaved(false);
//       } else if (!saved && savedJob?.length > 0) {
//         setSaved(true);
//       }
//     }
//   }, [savedJob, saved]);

//   return (
//     <Card className='flex flex-col'>
//       <CardHeader>
//         <CardTitle className="flex justify-between font-bold">
//           {job.title}
//           {isMyJob && <Trash2Icon fill="red" size={18} className="text-red-300 cursor-pointer" />}
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="flex flex-col gap-4 flex-1">
//         <div className="flex justify-between">
//           {job.company && <img src={job.company.logo_url} className="h-6" alt={job.company.name} />}

//           <div className="flex gap-2 items-center">
//             <MapPinIcon size={15} />
//             {job.location}
//           </div>
//         </div>
//         <hr />
//         {job.description.substring(0, job.description.indexOf(".") + 1)}
//       </CardContent>

//       <CardFooter className="flex gap-2">
//         <Link to={`/jobs/${job.id}`} className="flex-1">
//           <Button className="w-full" variant="secondary">
//             More Details
//           </Button>
//         </Link>

//         {!isMyJob && (
//           <Button
//             variant="outline"
//             className="w-15"
//             onClick={handleSaveJob}
//             disabled={loadingSavedJob}
//           >
//             {saved ? (
//               <Heart size={20} stroke="red" fill="red" />
//             ) : (
//               <Heart size={20} />
//             )}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default JobCard;


// import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
// import { Button } from "./ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { Link } from "react-router-dom";
// import useFetch from "@/hooks/use-fetch";
// import { deleteJob, saveJob } from "@/api/apiJobs";
// import { useUser } from "@clerk/clerk-react";
// import { useEffect, useState } from "react";
// import { BarLoader } from "react-spinners";

// const JobCard = ({
//   job,
//   savedInit = false,
//   onJobAction = () => {},
//   isMyJob = false,
// }) => {
//   const [saved, setSaved] = useState(savedInit);

//   const { user } = useUser();

//   const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
//     job_id: job.id,
//   });

//   const {
//     loading: loadingSavedJob,
//     data: savedJob,
//     fn: fnSavedJob,
//   } = useFetch(saveJob);

//   const handleSaveJob = async () => {
//     await fnSavedJob({
//       user_id: user.id,
//       job_id: job.id,
//     });
//     onJobAction();
//   };

//   const handleDeleteJob = async () => {
//     await fnDeleteJob();
//     onJobAction();
//   };

//   useEffect(() => {
//     if (savedJob !== undefined) setSaved(savedJob?.length > 0);
//   }, [savedJob]);

//   // Helper function to get a preview of the description safely
//   const getDescriptionPreview = (description) => {
//     if (!description) return "";
    
//     const periodIndex = description.indexOf(".");
//     if (periodIndex === -1) {
//       // No period found, return first 100 characters or the entire string
//       return description.length > 100 ? `${description.substring(0, 100)}...` : description;
//     }
    
//     // Return up to the first period
//     return `${description.substring(0, periodIndex + 1)}`;
//   };

//   return (
//     <Card className="flex flex-col">
//       {loadingDeleteJob && (
//         <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
//       )}
//       <CardHeader className="flex">
//         <CardTitle className="flex justify-between font-bold">
//           {job.title}
//           {isMyJob && (
//             <Trash2Icon
//               fill="red"
//               size={18}
//               className="text-red-300 cursor-pointer"
//               onClick={handleDeleteJob}
//             />
//           )}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-4 flex-1">
//         <div className="flex justify-between">
//           {job.company && <img src={job.company.logo_url} className="h-6" />}
//           <div className="flex gap-2 items-center">
//             <MapPinIcon size={15} /> {job.location}
//           </div>
//         </div>
//         <hr />
//         {getDescriptionPreview(job.description)}
//       </CardContent>
//       <CardFooter className="flex gap-2">
//         <Link to={`/job/${job.id}`} className="flex-1">
//           <Button variant="secondary" className="w-full">
//             More Details
//           </Button>
//         </Link>
//         {!isMyJob && (
//           <Button
//             variant="outline"
//             className="w-15"
//             onClick={handleSaveJob}
//             disabled={loadingSavedJob}
//           >
//             {saved ? (
//               <Heart size={20} fill="red" stroke="red" />
//             ) : (
//               <Heart size={20} />
//             )}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default JobCard;



import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    setLoading(true);
    try {
      await fnSavedJob({
        user_id: user.id,
        job_id: job.id,
      });
      onJobAction();
    } catch (err) {
      console.error("Error saving job:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await fnDeleteJob();
      onJobAction();
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  useEffect(() => {
    if (savedJob !== undefined) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);

  // Helper function to get a preview of the description safely
  const getDescriptionPreview = (description) => {
    if (!description || typeof description !== 'string') return "No description available.";
    
    const periodIndex = description.indexOf(".");
    if (periodIndex === -1) {
      // No period found, return first 100 characters or the entire string
      return description.length > 100 ? `${description.substring(0, 100)}...` : description;
    }
    
    // Return up to the first period
    return `${description.substring(0, periodIndex + 1)}`;
  };

  // Calculate if we have company data
  const hasCompanyLogo = job.company && job.company.logo_url;

  return (
    <Card className="flex flex-col h-full">
      {(loadingDeleteJob || loading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          <span className="truncate">{job.title || "Untitled Position"}</span>
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {hasCompanyLogo ? (
            <img 
              src={job.company.logo_url} 
              className="h-6" 
              alt={job.company.name || "Company logo"} 
            />
          ) : (
            <span className="text-gray-500 text-sm">No company logo</span>
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location || "Remote"}
          </div>
        </div>
        <hr />
        <div className="text-sm">
          {getDescriptionPreview(job.description)}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && user && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob || loading}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
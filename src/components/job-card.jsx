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
//   } = useFetch(saveJob,{
//     alreadySaved:saved,
//   });

//   const { user } = useUser();

//   const handleSaveJob = async () => {
//     await fnSavedJob({
//       user_id: user.id,
//       job_id: job.id,
//     });
//     onJobSaved();
//   };

//   useEffect(() => {
//     if (savedJob !== undefined) setSaved(savedJob?.length > 0);
//   }, [savedJob]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex justify-between font-bold">
//           {job.title}
//           {isMyJob && <Trash2Icon fill="red" size={18} className="text-red-300 cursor-pointer" />}
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="flex flex-col gap-4 flex-1">
//         <div className="flex justify-between">
//           {job.company && <img src={job.company.logo_url} className="h-6" />}

//           <div className="flex gap-2 items-center">
//             <MapPinIcon size={15} />
//             {job.location}
//           </div>
//         </div>
//         <hr />
//         {job.description.substring(0, job.description.indexOf("."))}
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



import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import useFetch from '@/hooks/use-fetch'
import { saveJob } from '@/api/apiJobs'

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJob,
  } = useFetch(saveJob, {
    alreadySaved: saved,
  });

  const { user } = useUser();

  const handleSaveJob = async () => {
    // Toggle saved state immediately for better UX
    const newSavedState = !saved;
    setSaved(newSavedState);
    
    // Call the API with the updated state
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    
    // Trigger the callback to update parent components
    onJobSaved();
  };

  // Update saved state whenever savedJob changes
  useEffect(() => {
    if (savedJob !== undefined) {
      // For saving: if data returned has length > 0, it's saved
      // For unsaving: an empty array means successfully unsaved
      if (saved && savedJob?.length === 0) {
        setSaved(false);
      } else if (!saved && savedJob?.length > 0) {
        setSaved(true);
      }
    }
  }, [savedJob, saved]);

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && <Trash2Icon fill="red" size={18} className="text-red-300 cursor-pointer" />}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job.company.logo_url} className="h-6" alt={job.company.name} />}

          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} />
            {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf(".") + 1)}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button className="w-full" variant="secondary">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} stroke="red" fill="red" />
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

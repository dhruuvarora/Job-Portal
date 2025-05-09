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
  savedJobId = null, // This prop is specifically for the SavedJobs page
}) => {
  const [saved, setSaved] = useState(savedInit);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  // Update saved state when savedInit prop changes
  useEffect(() => {
    setSaved(savedInit);
  }, [savedInit]);

  const handleSaveJob = async () => {
    // Prevent multiple clicks while processing
    if (isProcessing || loadingSavedJob) return;
    
    setIsProcessing(true);
    
    try {
      console.log("Current saved state:", saved);
      console.log("SavedJobId if available:", savedJobId);
      
      if (savedJobId) {
        // We're on the Saved Jobs page, use direct deletion by savedJobId
        console.log("Using savedJobId for deletion:", savedJobId);
        
        // Call API with the savedJobId
        await fnSavedJob(
          {
            directDeleteId: savedJobId, // A new parameter specifically for direct deletion
          },
          {
            user_id: user.id,
            job_id: job.id,
          }
        );
      } else {
        // We're on the main page, use normal toggle
        console.log("Using normal toggle with alreadySaved:", saved);
        
        await fnSavedJob(
          {
            alreadySaved: saved,
            job_id: job.id,
          },
          {
            user_id: user.id,
            job_id: job.id,
          }
        );
      }
      
      // Toggle saved state locally
      setSaved(!saved);
      
      // Call callback to refresh parent
      onJobAction();
    } catch (error) {
      console.error("Error toggling job save status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  return (
    <Card className="flex flex-col">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
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
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description && typeof job.description === 'string' 
          ? job.description.substring(0, job.description.indexOf(".") > 0 ? job.description.indexOf(".") : 50) + "."
          : "No description available."}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob || isProcessing}
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
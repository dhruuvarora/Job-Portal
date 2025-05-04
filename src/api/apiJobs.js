// import supabaseClient from "@/utils/supabase";

// // Fetch Jobs
// export async function getJobs(token, { location, company_id, searchQuery }) {
//   const supabase = await supabaseClient(token);
//   let query = supabase
//     .from("jobs")
//     .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

//   if (location) {
//     query = query.eq("location", location);
//   }

//   if (company_id) {
//     query = query.eq("company_id", company_id);
//   }

//   if (searchQuery) {
//     query = query.ilike("title", `%${searchQuery}%`);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching Jobs:", error);
//     return null;
//   }

//   return data;
// }

// // Read Saved Jobs
// export async function getSavedJobs(token) {
//   const supabase = await supabaseClient(token);
//   const { data, error } = await supabase
//     .from("saved_jobs")
//     .select("*, job: jobs(*, company: companies(name,logo_url))");

//   if (error) {
//     console.error("Error fetching Saved Jobs:", error);
//     return null;
//   }

//   return data;
// }

// // Read single job
// export async function getSingleJob(token, { job_id }) {
//   const supabase = await supabaseClient(token);
//   let query = supabase
//     .from("jobs")
//     .select(
//       "*, company: companies(name,logo_url), applications: applications(*)"
//     )
//     .eq("id", job_id)
//     .single();

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching Job:", error);
//     return null;
//   }

//   return data;
// }

// // - Add / Remove Saved Job
// export async function saveJob(token, { alreadySaved }, saveData) {
//   const supabase = await supabaseClient(token);

//   if (alreadySaved) {
//     // If the job is already saved, remove it
//     const { data, error: deleteError } = await supabase
//       .from("saved_jobs")
//       .delete()
//       .eq("job_id", saveData.job_id);

//     if (deleteError) {
//       console.error("Error removing saved job:", deleteError);
//       return data;
//     }

//     return data;
//   } else {
//     // If the job is not saved, add it to saved jobs
//     const { data, error: insertError } = await supabase
//       .from("saved_jobs")
//       .insert([saveData])
//       .select();

//     if (insertError) {
//       console.error("Error saving job:", insertError);
//       return data;
//     }

//     return data;
//   }
// }

// export async function updateHiringStatus(token, { job_id }, isOpen) {
//   const supabase = await supabaseClient(token);
//   const { data, error } = await supabase
//     .from("jobs")
//     .update({ isOpen })
//     .eq("id", job_id)
//     .select();

//   if (error) {
//     console.error("Error Updating Hiring Status:", error);
//     return null;
//   }

//   return data;
// }

// // get my created jobs
// export async function getMyJobs(token, { recruiter_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .select("*, company: companies(name,logo_url)")
//     .eq("recruiter_id", recruiter_id);

//   if (error) {
//     console.error("Error fetching Jobs:", error);
//     return null;
//   }

//   return data;
// }

// // Delete job
// export async function deleteJob(token, { job_id }) {
//   const supabase = await supabaseClient(token);

//   const { data, error: deleteError } = await supabase
//     .from("jobs")
//     .delete()
//     .eq("id", job_id)
//     .select();

//   if (deleteError) {
//     console.error("Error deleting job:", deleteError);
//     return data;
//   }

//   return data;
// }

// // - post job
// export async function addNewJob(token, _, jobData) {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("jobs")
//     .insert([jobData])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Error Creating Job");
//   }

//   return data;
// }


import supabaseClient from "@/utils/supabase";

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery } = {}) {
  try {
    const supabase = await supabaseClient(token);
    let query = supabase
      .from("jobs")
      .select("*, saved: saved_jobs(id), company: companies(name, logo_url)")
      .eq("isOpen", true);  // Only show open jobs by default

    if (location) {
      query = query.eq("location", location);
    }

    if (company_id) {
      query = query.eq("company_id", company_id);
    }

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    // Order by most recent
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching Jobs:", error);
      return [];
    }

    // Ensure we don't have null description fields
    return data.map(job => ({
      ...job,
      description: job.description || "",  // Provide empty string if description is null
      location: job.location || "Remote",  // Provide default location if null
    }));
  } catch (err) {
    console.error("Exception in getJobs:", err);
    return [];
  }
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  try {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("saved_jobs")
      .select("*, job: jobs(*, company: companies(name, logo_url))");

    if (error) {
      console.error("Error fetching Saved Jobs:", error);
      return [];
    }

    // Transform to match expected format and handle null values
    return data.map(item => ({
      ...item.job,
      saved: true,
      description: item.job?.description || "",
      location: item.job?.location || "Remote",
    })).filter(job => job.id); // Filter out any null job entries
  } catch (err) {
    console.error("Exception in getSavedJobs:", err);
    return [];
  }
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  try {
    const supabase = await supabaseClient(token);
    let query = supabase
      .from("jobs")
      .select("*, company: companies(name, logo_url), applications: applications(*)")
      .eq("id", job_id)
      .single();

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching Job:", error);
      return null;
    }

    // Handle null values
    return {
      ...data,
      description: data.description || "",
      location: data.location || "Remote",
    };
  } catch (err) {
    console.error("Exception in getSingleJob:", err);
    return null;
  }
}

// Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  try {
    const supabase = await supabaseClient(token);

    // If alreadySaved wasn't provided, check if it exists
    if (alreadySaved === undefined) {
      const { data: existingSaved } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("job_id", saveData.job_id)
        .eq("user_id", saveData.user_id);
      
      alreadySaved = existingSaved && existingSaved.length > 0;
    }

    if (alreadySaved) {
      // If the job is already saved, remove it
      const { error: deleteError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("job_id", saveData.job_id)
        .eq("user_id", saveData.user_id)
        .select();

      if (deleteError) {
        console.error("Error removing saved job:", deleteError);
        return [];
      }

      return [];  // Return empty array to indicate job is no longer saved
    } else {
      // If the job is not saved, add it to saved jobs
      const { data, error: insertError } = await supabase
        .from("saved_jobs")
        .insert([saveData])
        .select();

      if (insertError) {
        console.error("Error saving job:", insertError);
        return [];
      }

      return data || [];
    }
  } catch (err) {
    console.error("Exception in saveJob:", err);
    return [];
  }
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  try {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("jobs")
      .update({ isOpen })
      .eq("id", job_id)
      .select();

    if (error) {
      console.error("Error Updating Hiring Status:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception in updateHiringStatus:", err);
    return null;
  }
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  try {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
      .from("jobs")
      .select("*, company: companies(name, logo_url)")
      .eq("recruiter_id", recruiter_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching Jobs:", error);
      return [];
    }

    // Handle null values
    return data.map(job => ({
      ...job,
      description: job.description || "",
      location: job.location || "Remote",
    }));
  } catch (err) {
    console.error("Exception in getMyJobs:", err);
    return [];
  }
}

// Delete job
export async function deleteJob(token, { job_id }) {
  try {
    const supabase = await supabaseClient(token);

    const { data, error: deleteError } = await supabase
      .from("jobs")
      .delete()
      .eq("id", job_id)
      .select();

    if (deleteError) {
      console.error("Error deleting job:", deleteError);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception in deleteJob:", err);
    return null;
  }
}

// Post job
export async function addNewJob(token, _, jobData) {
  try {
    const supabase = await supabaseClient(token);
    
    // Ensure company_id is a number
    const formattedJobData = {
      ...jobData,
      company_id: typeof jobData.company_id === 'string' 
        ? parseInt(jobData.company_id, 10) 
        : jobData.company_id
    };

    const { data, error } = await supabase
      .from("jobs")
      .insert([formattedJobData])
      .select();

    if (error) {
      console.error("Error creating job:", error);
      throw new Error("Error Creating Job");
    }

    return data;
  } catch (err) {
    console.error("Exception in addNewJob:", err);
    throw err;
  }
}
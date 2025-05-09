import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

export async function saveJob(token, params, saveData) {
  const supabase = await supabaseClient(token);
  
  // Direct deletion by saved job ID (for Saved Jobs page)
  if (params.directDeleteId) {
    console.log("Directly deleting saved job with ID:", params.directDeleteId);
    
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("id", params.directDeleteId)
      .select();

    if (deleteError) {
      console.error("Error directly deleting saved job:", deleteError);
      return null;
    }

    console.log("Successfully deleted saved job:", data);
    return data;
  }
  
  // Normal toggle logic (for other pages)
  if (params.alreadySaved) {
    console.log("Unsaving job with ID:", params.job_id);
    
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", params.job_id)
      .eq("user_id", saveData.user_id)
      .select();

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return null;
    }

    console.log("Successfully unsaved job:", data);
    return data;
  } else {
    console.log("Saving job with ID:", params.job_id);
    
    // Check if job is already saved to prevent duplicates
    const { data: existingSaves, error: checkError } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", saveData.user_id)
      .eq("job_id", params.job_id);

    if (checkError) {
      console.error("Error checking existing saves:", checkError);
      return null;
    }
    
    // If already saved, don't save again
    if (existingSaves && existingSaves.length > 0) {
      console.log("Job already saved, returning existing record:", existingSaves);
      return existingSaves;
    }

    // Save the job
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return null;
    }

    console.log("Successfully saved job:", data);
    return data;
  }
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
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
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// - post job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
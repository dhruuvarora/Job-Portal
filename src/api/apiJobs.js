import supabaseClient from "@/utils/supabase";


export async function getJobs(token , {location, company_id , searchQuery}) {
    const supabase = await supabaseClient(token);


    let query = supabase.from("jobs").select("*,company:companies(name,logo_url),saved:saved_jobs(id)");

    if(location){
        query = query.eq("location",location);
    }

    if(company_id){
        query = query.eq("company_id" , company_id);
    }

    if(searchQuery){
        query = query.ilike("title", `%${searchQuery}%`);
    }

    const {data, error} = await query

    if(error){
        console.error(error);
        return null
    }

    return data;
}


// export async function saveJob(token ,{alreadySaved}, saveData){
//     const supabase = await supabaseClient(token);

//     if(alreadySaved){
//         const {data, error:deleteError} = await supabase
//         .from("saved_jobs")
//         .delete()
//         .eq("job_id",saveData.job_id);

//         if(deleteError){
//             console.error("Error deleting saved job:" , deleteError);
//             return null;
//         }
//         return data;
//     }else{
//         const {data , error: insertError} = await supabase
//         .from("saved_jobs")
//         .insert([saveData])
//         .select()


//     if(insertError){
//         console.error("Error fetching jobs:",insertError);
//         return null;
//     }

//     return data;
//     }
// }


export async function saveJob(token, { alreadySaved }, saveData) {
    const supabase = await supabaseClient(token);
  
    if (alreadySaved) {
      // When already saved, delete the saved job entry
      const { data, error: deleteError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("job_id", saveData.job_id)
        .eq("user_id", saveData.user_id); 
        
      if (deleteError) {
        console.error("Error deleting saved job:", deleteError);
        return null;
      }
      
      // Return an empty array to indicate successful deletion
      return [];
    } else {
      // When not saved, insert a new saved job entry
      const { data, error: insertError } = await supabase
        .from("saved_jobs")
        .insert([saveData])
        .select();
  
      if (insertError) {
        console.error("Error saving job:", insertError);
        return null;
      }
  
      return data;
    }
}

export async function getSingleJob(token,{job_id}) {
    const supabase = await supabaseClient(token);

      const { data, error } = await supabase
        .from("jobs")
        .select("*","companies(name,logo,url),applications: applications(*)")
        .eq("id",job_id)
        .single();
  
      if (error) {
        console.error("Error Fetching Job:", error);
        return null;
    }
    return data
}

export async function updateHiringStatus(token,{job_id}, isOpen) {
  const supabase = await supabaseClient(token);

    const { data, error } = await supabase
      .from("jobs")
      .update({isOpen})
      .eq("id",job_id)
      .select();

    if (error) {
      console.error("Error Updating Job:", error);
      return null;
  }
  return data
}
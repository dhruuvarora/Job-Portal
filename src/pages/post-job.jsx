import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { State } from 'country-state-city';
import useFetch from '@/hooks/use-fetch';
import { getCompanies } from '@/api/apiCompanies';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import { Navigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';

const schema = z.object({
  title:z.string().min(1,{message:"Title is required"}),
  description:z.string().min(1,{message:"Description is required"}),
  location:z.string().min(1,{message:"Location is required"}),
  company_id:z.string().min(1,{message:"Company is required"}),
  requirements:z.string().min(1,{message:"Requirements is required"}),
});

const PostJob = () => {

  const {isLoaded , user} = useUser();


  const {register, control , handleSubmit, formState:{errors}} = useForm({
    defaultValues:{
      location:"",
      company_id:"",
      requirements:"",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn:fnCompanies,
    data : companies, 
    loading:loadingCompanies
  } = useFetch(getCompanies);

  useEffect(()=>{
    if(isLoaded) fnCompanies();
  },[isLoaded]);

  if(!isLoaded || loadingCompanies){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
  }

  // if(user?.unsafeMetadata?.role !== "recruiter"){
  //   return <Navigate to={"/jobs"} />
  // }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job
      </h1>
      <form className='flex flex-col gap-4 p-4 pb-0'>
        <input placeholder='Job Title' {...register("title")} />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

      <Textarea placeholder='Job Description' {...register("description")} />
      {errors.description && <p className='text-red-500'>{errors.description.message}</p>}

      <div className='flex items-center gap-4'>
        <Controller
        name = "location"
        control={control}
        render={({ field }) => (
          <Select 
      value={field.value} 
      onValueChange={field.onChange}
      >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        )}
        />

<Controller
  name='company_id'
  control={control}
  render={({ field }) => (
    <Select
      value={field.value}
      onValueChange={field.onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filter by Company" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {companies?.map(({ name, id }) => (
            <SelectItem key={id} value={String(id)}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )}
/>
        {/* Add Company Drawer */}
        </div>
        {errors.location && (<p className='text-red-500'>{errors.location.message}</p>)}
        {errors.company_id && (<p className='text-red-500'>{errors.company_id.message}</p>)}

        <Controller
  name='requirements'
  control={control}
  render={({ field }) => <MDEditor value={field.value} onChange = {field.onChange}/> }
  />
  {errors.requirements && (<p className='text-red-500'>{errors.requirements.message}</p>)}
      <Button type='submit' className='mt-2' variant={"blue"} size={"lg"}>Submit</Button>
      
      </form>
    </div>
  )
}

export default PostJob

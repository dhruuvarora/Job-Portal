import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { number, z } from 'zod'
import { useForm, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller } from 'react-hook-form';
import useFetch from '@/hooks/use-fetch'
import { applyToJob } from '@/api/apiJobs'

const schema = z.object({
    experience : z.number()
    .min(0,{message : "Experience must be atleast 0 years"})
    .int(),

    skills : z.string()
    .min(1,{message : "Skills are required"}),
    
    education : z.enum(["Intermediate" , "Graduate" , "Post-Graduate"],{
        "message" : "Education is required"
    }),
    resume : z.any().refine((file) =>file[0] && (file[0].type === "application/pdf" || file[0].type === "application/msword"), {
        message : "File must be a pdf or doc file"
    }),
})

const ApplyJobDrawer = ({user , job , applied = false , fetchJob}) => {
    console.log(job);

        const {register,
            handleSubmit,
            control, 
            formState:{errors},
            reset,

        } =   useForm({
        resolver: zodResolver(schema)
    });

const{
    loading : loadingApply,
    error : errorApply,
    fn:fnApply
} = useFetch(applyToJob)


const onSubmit = async (data) => {
    fnApply({
        ...data,
        
    })
}
  return (
    <div>
    <Drawer open= {applied?false:undefined}>
            <DrawerTrigger asChild>
          <Button
            size="lg"
            variant={job?.isOpen && !applied ? "blue" : applied ? "applied" : "destructive"}
            className="w-full">
        {job?.isOpen ? (applied ? "Applied" : "Apply") : "Closed"}
          </Button>
        </DrawerTrigger>

        <DrawerContent>
        <DrawerHeader>
        <DrawerTitle>Apply for {job?.title} at {job?.company_id} </DrawerTitle>
        <DrawerDescription>Please Fill the Form Below</DrawerDescription>
        </DrawerHeader>

        <form onSubmit = {handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
            <Input
            type="number"
            placeholder="Years of Experience"
            className="flex-1"
            {...register("experience",{
                valueAsNumber:true,
            })}
            />

            {errors.experience && (
                <p className='text-red-500 text-sm'>
                    {errors.experience.message}
                </p>
            )}

            <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills",{
                valueAsNumber:true,
            })}
            />

            {errors.skills && (
                <p className='text-red-500 text-sm'>
                    {errors.skills.message}
                </p>
            )}

            
            <Controller
            name = 'education'
            control = {control}
            render = {({field}) => (
                <RadioGroup
                onValueChange={field.onChange}
                {...field}
                className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Graduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Post Graduate</Label>
                    </div>
                </RadioGroup>
            )}
            />

            {errors.education && (
                <p className='text-red-500 text-sm'>
                    {errors.education.message}
                </p>
            )}

            <Input
            type="file"
            accept=".pdf , .doc , .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume",{
                valueAsNumber:true,
            })}
            />

        </form>
        <DrawerFooter>
            <Button type = "submit" variant="blue" size = "lg">Apply</Button>
            <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
        </DrawerContent>
    </Drawer>

    </div>
  )
}

export default ApplyJobDrawer

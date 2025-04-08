import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/clerk-react'
import { BriefcaseBusinessIcon, Heart, PenBox } from 'lucide-react'

const Header = () => {

   const [showSignIn,setShowSignIn] = useState(false);

   const [search , setSearch] = useSearchParams();
   useEffect(()=>{
    if(search.get('sign-in')){
      setShowSignIn(true)
    }
   },[search])

   const handleOverlayClick=(e)=>{
    if(e.target === e.currentTarget){
      setShowSignIn(false);
      setSearch({});
    }
   }

  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link to="/">
          <img src='/logo.png' alt="Logo" className='h-20' />
        </Link>

        <div className='flex gap-8'>
        <SignedOut>
        <Button variant="outline" onClick={()=>{
          setShowSignIn(true)
        }}>Login</Button>
      </SignedOut>
      <SignedIn>
       {/*add a condition -- for recruiter only  */}
        <Button variant="destructive" className="rounded-full">
          <PenBox className='mr-2' size={20}/>
          Post a Job
        </Button>
        <Link to='/post-job'></Link>
        <UserButton appearance={{
          elements:{
            avatarBox:"w-10 h-10", 
          },
        }}
        >
          <UserButton.MenuItems>
            <UserButton.Link label='My Jobs'
            labelIcon = {<BriefcaseBusinessIcon size={15}/>}
            href='/my-jobs'
            />

            <UserButton.Link label='Saved Jobs'
            labelIcon = {<Heart size={15}/>}
            href='/saved-job'
            />
          </UserButton.MenuItems>

        </UserButton>
      </SignedIn>
      </div>
      </nav>
      {showSignIn && <div className='fixed inset-0 flex items-center justify-center bg-black/50 '
      onClick={handleOverlayClick}>

        <SignIn
        signUpForceRedirectUrl='/onboarding'
        fallbackRedirectUrl='/onboarding'
        />
      </div>}
    </>
  )
}

export default Header

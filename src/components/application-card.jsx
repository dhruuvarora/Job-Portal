import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'
import { Download } from 'lucide-react'

const ApplicationCard = ({application , isCandidate = false}) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle display  = 'flex justify-between font-bold'>
                {isCandidate ? `${application?.job?.title} at ${application?.job?.company?.name}` : application?.name}
                <Download size={"18"}
                className='bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer'/>
            </CardTitle>
        </CardHeader>
    </Card>
  )
}

export default ApplicationCard

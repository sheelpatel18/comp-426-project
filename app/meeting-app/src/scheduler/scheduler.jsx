import React, { useState } from 'react'
import ScheduleSelector from 'react-schedule-selector'
//This is where the implementation of the scheduler takes place. 


export default function Scheduler(props) {
    // 
    const [schedule, setSchedule] = useState([])
    // This handles the state changes when certains times are selected.
    const handleChange = newSchedule => {
        setSchedule({ schedule: newSchedule })
      }

    return (
       //Title of the Meeting Scheduler with the numbers of days, the time for each day and how many blocks exist for each time. This is what is returned and the scheduler is instantiated.
       <div>
            <h1>Meeting Scheduler</h1>
            <ScheduleSelector
                selection={schedule}
                numDays={5}
                minTime={8}
                maxTime={22}
                hourlyChunks={2}
                onChange={handleChange}
            />
        </div>
    )
} 
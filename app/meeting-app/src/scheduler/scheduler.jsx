import React, { useState } from 'react'
import ScheduleSelector from 'react-schedule-selector'



export default function Scheduler(props) {
    const [schedule, setSchedule] = useState([])

    const handleChange = newSchedule => {
        setSchedule({ schedule: newSchedule })
    }

    return (
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
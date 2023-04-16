import React, { useState } from 'react';
import ScheduleSelector from 'react-schedule-selector';

export default function Scheduler(props) {
  const [schedule, setSchedule] = useState([]);

  const handleChange = (newSchedule) => {
    setSchedule(newSchedule);
  };

  const handleSubmit = () => {
    console.log(schedule);
    
  };

  const handleReset = () => {
    setSchedule([]);
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '5px', 
      padding: '1rem' 
    }}>
      <h1 style={{ 
        marginBottom: '1rem', 
        fontSize: '2rem', 
        fontWeight: 'bold' 
      }}>Meeting Scheduler</h1>
      <ScheduleSelector
        selection={schedule}
        numDays={7}
        minTime={10}
        maxTime={22}
        hourlyChunks={1}
        onChange={handleChange}
        style={{ 
          border: '1px solid #ccc', 
          borderRadius: '5px', 
          padding: '1rem' 
        }}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '1rem' 
      }}>
        <button style={{ 
          border: 'none', 
          borderRadius: '6px', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }} onClick={handleReset}>Reset</button>
        <button style={{ 
          border: 'none', 
          borderRadius: '5px', 
          backgroundColor: '#28a745', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

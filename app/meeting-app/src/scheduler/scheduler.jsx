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

  const handleCreate = () => {
    console.log("Create button clicked!");
    // Add code to handle creating the meeting here
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
        fontWeight: 'bold',
        color: '#007bff',
        textTransform: 'uppercase',
        letterSpacing: '0.2rem' 
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
          backgroundColor: '#dc3545', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} onClick={handleReset} 
        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}>Reset</button>
        <button style={{ 
          border: 'none', 
          borderRadius: '5px', 
          backgroundColor: '#28a745', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} onClick={handleSubmit} 
        onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}>Submit</button>
        <button style={{ 
          border: 'none', 
          borderRadius: '5px', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '0.5rem 1rem', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out'
        }} onClick={handleCreate} 
        onMouseEnter={(e) => e.target.style.backgroundColor = '#0069d9'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>Create</button>
      </div>
    </div>
  );
}

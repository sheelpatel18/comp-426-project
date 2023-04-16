import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
function App() {

  return (
    <div className="App">
      <LoginCard />
      {/* <Scheduler /> */}
    </div>
  );
}

export default App;

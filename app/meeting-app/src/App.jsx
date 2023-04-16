import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { useSelector } from 'react-redux';
import { User } from './Tools/user';
function App() {
  const [loginComplete, setLoginComplete] = useState(false)
  const userRaw = useSelector(state => state.user)

  useEffect(() => {
    const user = new User(userRaw)
    const {
      id,
      phone,
      name
    } = user
    if (id && phone && name) {
      setLoginComplete(true)
    }
  }, [userRaw])

  return (
    <div className="App">
      {
        loginComplete ? <Scheduler /> : <LoginCard />
      }
    </div>
  );
}

export default App;

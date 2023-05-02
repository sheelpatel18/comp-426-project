import React, { useEffect, useState } from 'react';
import './App.css';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { useSelector } from 'react-redux';
import { User } from './Tools/user';
import { API } from './Tools/api';
import Bar from "./HeaderBar/Bar"

function Main() {
  const [loginComplete, setLoginComplete] = useState(false)
  const userRaw = useSelector(state => state.user)

  // const args = minimist(process.argv.slice(2))

  // const port = args?.port || 5001

  useEffect(() => {
    const user = new User(userRaw)
    const {
      id,
      phone,
      name
    } = user
    if (id && phone && name) setLoginComplete(true)
    API.setURL('http://localhost', '5001', '/api')

    // axios.get('http://localhost:3000/api/oing')

  }, [userRaw])

  return (
    <div className="App">
      {
        loginComplete ? 
        (
        <>
          <Bar />
          <Scheduler/>       
        </>
        ): <LoginCard />
      }
    </div>
  );
}

export default Main;

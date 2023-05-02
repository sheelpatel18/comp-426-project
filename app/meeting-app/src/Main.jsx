import React, { useEffect, useState } from 'react';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { useSelector } from 'react-redux';
import { User } from './Tools/user';
import { API } from './Tools/api';
import Bar from "./HeaderBar/Bar"

function Main() {
  const [loginComplete, setLoginComplete] = useState(false)
  const userRaw = useSelector(state => state.user)

  const port = process.env.REACT_APP_SERVER_PORT || 5000

  useEffect(() => {
    const user = new User(userRaw)
    const {
      id,
      phone,
      name
    } = user
    if (id && phone && name) setLoginComplete(true)
    API.setURL('http://localhost', port, '/api')

    // axios.get('http://localhost:3000/api/oing')

  }, [userRaw, port])

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

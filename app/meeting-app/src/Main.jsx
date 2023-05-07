import React, { useEffect, useState } from 'react';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { useSelector } from 'react-redux';
import { User } from './Tools/user';
import { API } from './Tools/api';
import Bar from "./HeaderBar/Bar"

function Main() {
  const [loginComplete, setLoginComplete] = useState(false) // used to determine whether to show login card or not
  const userRaw = useSelector(state => state.user) // gets user data from redux store

  const port = process.env.REACT_APP_SERVER_PORT || 5000 // gets port from .env file, defaults to 5000

  useEffect(() => {
    const user = new User(userRaw) // create new user object from redux store data
    const {
      id,
      phone,
      name
    } = user // destructure user object
    if (id && phone && name) setLoginComplete(true) // if user has id, phone, and name, this means user profile is complete and sets loginComplete to true
    API.setURL('http://localhost', port, '/api') // initializes api

  }, [userRaw, port]) // rerun this effect when userRaw or port changes, port should never change tho. 

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

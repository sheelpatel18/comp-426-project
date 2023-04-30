import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { Provider, useSelector } from 'react-redux';
import { User } from './Tools/user';
import { API } from './Tools/api';
import store from './redux/store';

function Main() {
  const [loginComplete, setLoginComplete] = useState(false)
  const userRaw = null//useSelector(state => state.user)

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
    API.setURL('http://localhost', '5000')
  }, [userRaw])

  return (
    <div className="App">
      {
        loginComplete ? <Scheduler /> : <LoginCard />
      }
    </div>
  );
}

export default Main;

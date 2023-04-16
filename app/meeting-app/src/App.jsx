import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { Provider, useSelector } from 'react-redux';
import { User } from './Tools/user';
import { API } from './Tools/api';
import store from './redux/store';
import Main from "./Main"

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;

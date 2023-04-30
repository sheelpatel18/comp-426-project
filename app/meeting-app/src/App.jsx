import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Scheduler from './scheduler/scheduler';
import LoginCard from './Login/LoginCard';
import { User } from './Tools/user';
import { API } from './Tools/api';
import store from './redux/store';
import Main from "./Main"
import { Provider } from 'react-redux';

function App() {
  return (
      <Main />
  );
}

export default App;

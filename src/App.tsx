import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.scss';
import TilesContainer from './Components/TilesContainer/TilesContainer';
import TasksHome from './Pages/Tasks/TasksHome';

function App() {
  return (
    <div className='landingOuter'>
      <div className='Jumbotron'>
        <h1>Welcome!</h1>
      </div>
      <TilesContainer />
    </div>
  );
}

export default App;

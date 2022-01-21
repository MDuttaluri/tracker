import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.scss';
import { getTasksCount } from './Components/Task/Task';
import TilesContainer from './Components/TilesContainer/TilesContainer';
import TasksHome from './Pages/Tasks/TasksHome';

getTasksCount()


function App() {
  return (
    <div className='landingOuter'>
      <div className='Jumbotron'>
        <h1>TraQ.it</h1>
      </div>
      <TilesContainer />
    </div>
  );
}

export default App;

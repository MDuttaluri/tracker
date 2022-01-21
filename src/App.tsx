import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.scss';
import { getTasksCount } from './Components/Task/Task';
import TilesContainer from './Components/TilesContainer/TilesContainer';
import CreateTask from './Pages/Tasks/CreateTask';
import EditTask from './Pages/Tasks/EditTask';
import TasksHome from './Pages/Tasks/TasksHome';



function loadTaskData(setTaskData?: any) {
  getTasksCount();
  let taskData = {} as any;
  const localData = localStorage.getItem('tasks')
  if (localData)
    taskData = JSON.parse(localData);

  if (setTaskData) {
    setTaskData(taskData);
  }
  return taskData;
}

export const TaskDataContext = createContext(loadTaskData());


function App() {
  //TASK DATA CONTEXT DATA
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    //Load or fetch task data and set it to the local state.
    loadTaskData(setTaskData)
  }, [])


  return (
    <TaskDataContext.Provider value={[taskData, setTaskData]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/tasks" element={<TasksHome />} />
          <Route path="/createTask" element={<CreateTask />} />
          <Route path="/editTask/:taskId" element={<EditTask />} />
        </Routes>
      </BrowserRouter>
    </TaskDataContext.Provider>

  );
}



function HomeScreen() {
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

import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.scss';
import Calculator from './Components/Calculator/Calculator';
import { AlertInterface, getTasksCount } from './Components/Task/Task';
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
export const AlertContext = createContext([] as any);


function App() {
  //TASK DATA CONTEXT DATA
  const [taskData, setTaskData] = useState({});
  const [alertData, setAlertData] = useState<AlertInterface>({ message: "", primaryAction: "", secondaryAction: "" });
  useEffect(() => {
    //Load task data and set it to the local state.
    loadTaskData(setTaskData)
  }, [])

  useEffect(() => {
    if (alertData.message != "")
      setTimeout(() => {
        setAlertData({
          message: "",
          primaryAction: "",
          secondaryAction: ""
        })
      }, 5000)
  }, [alertData])


  useEffect(() => {
    console.warn(taskData)
  }, [taskData])


  return (
    <TaskDataContext.Provider value={[taskData, setTaskData]}>
      <AlertContext.Provider value={[alertData, setAlertData]}>
        <div hidden={alertData.message.length == 0}>
          {alertData.message}
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/tasks" element={<TasksHome />} />
            <Route path="/createTask" element={<CreateTask />} />
            <Route path="/editTask/:taskId" element={<EditTask />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </BrowserRouter>

      </AlertContext.Provider>
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

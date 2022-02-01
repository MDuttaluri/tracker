import { getAuth, User } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Calculator from './Components/Calculator/Calculator';
import { AlertInterface, getTasksCount } from './Components/Task/Task';
import TilesContainer from './Components/TilesContainer/TilesContainer';
import { initaliseFirebase } from './firebase';
import Login from './Pages/Authentication/Login';
import Signup from './Pages/Authentication/Signup';
import CreateTask from './Pages/Tasks/CreateTask';
import EditTask from './Pages/Tasks/EditTask';
import TasksHome from './Pages/Tasks/TasksHome';
import { AlertTheme, LoadInitialAuthData, UserDataContextInterface, UserDataInterface } from './Utilities';

initaliseFirebase();


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
export const UserContext = createContext({} as UserDataContextInterface);

function App() {
  //TASK DATA CONTEXT DATA
  const [taskData, setTaskData] = useState({});
  const [alertData, setAlertData] = useState<AlertInterface>({ message: "", theme: AlertTheme.NORMAL });
  const [userData, setUserData] = useState<UserDataInterface>({ name: "Guest" } as UserDataInterface);




  useEffect(() => {
    //Load task data and set it to the local state.
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      console.log(`on auth change ----`);

      if (user && user.email) {
        setUserData({ ...userData, name: user.email })
      }
    })
    loadTaskData(setTaskData)
  }, [])

  useEffect(() => {
    if (alertData.message != "")
      setTimeout(() => {
        setAlertData({
          message: "",
          theme: AlertTheme.NORMAL
        })
      }, 5000)
  }, [alertData])


  useEffect(() => {
    console.warn(taskData)
  }, [taskData])


  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <TaskDataContext.Provider value={[taskData, setTaskData]}>
        <AlertContext.Provider value={[alertData, setAlertData]}>
          <div className='alertBanner' style={{ display: alertData.message.length == 0 ? "none" : "flex" }} >
            {alertData.message}
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/tasks" element={<TasksHome />} />
              <Route path="/createTask" element={<CreateTask />} />
              <Route path="/editTask/:taskId" element={<EditTask />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>

        </AlertContext.Provider>
      </TaskDataContext.Provider>
    </UserContext.Provider>
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

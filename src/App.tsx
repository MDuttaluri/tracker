import { Auth, getAuth, signOut, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.scss';
import Calculator from './Components/Calculator/Calculator';
import CreatePriorityItem from './Components/PriorityItems/CreatePriorityItem';
import EditPriorityItem from './Components/PriorityItems/EditPriorityItem';
import PrioritiesHome from './Components/PriorityItems/PrioritiesHome';
import { loadPriorityItemsDataFromLocalStorage } from './Components/PriorityItems/PriorityItemUtils';
import { AlertInterface, getTasksCount } from './Components/Task/Task';
import TilesContainer from './Components/TilesContainer/TilesContainer';
import useThemeData from './Components/hooks/useThemeData';
import { initaliseFirebase } from './firebase';
import Login from './Pages/Authentication/Login';
import Signup from './Pages/Authentication/Signup';
import CreateTask from './Pages/Tasks/CreateTask';
import EditTask from './Pages/Tasks/EditTask';
import TasksHome from './Pages/Tasks/TasksHome';
import { AppThemeType, DARK_THEME, getThemeStyles, LIGHT_THEME, loadThemeChoiceFromLocalStorage, ThemeContextType } from './ThemeUtils';
import { AlertTheme, LoadInitialAuthData, PrioritiesContextInterface, UserDataContextInterface, UserDataInterface } from './Utilities';
import SettingsPage from './Pages/SettingsPage';

initaliseFirebase();

function lol(status: any) {
  alert(status)
}


try {

  Notification.requestPermission((status) => {
    if (status == 'granted') {
      navigator.serviceWorker.getRegistration()
        .then((reg) => {
          reg?.showNotification("Notifications will show up like this from now on.", { data: "This is the data part.", badge: "badge", requireInteraction: true })
        })
    }
  })


} catch (e) {
  try {
    Notification.requestPermission(lol)
  } catch (e) {

  }
}


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

function loadPriorityItemsData(setPriorityItems: any) {
  const localData = loadPriorityItemsDataFromLocalStorage() as any;
  setPriorityItems({ ...localData });
}

function loadThemeData(setThemeData: any) {
  setThemeData(loadThemeChoiceFromLocalStorage());
}



export const TaskDataContext = createContext(loadTaskData());
export const AlertContext = createContext([] as any);
export const UserContext = createContext({} as UserDataContextInterface);
export const PrioritiesContext = createContext({} as PrioritiesContextInterface);
export const AppThemeContext = createContext({} as ThemeContextType);

function App() {
  //TASK DATA CONTEXT DATA
  const [taskData, setTaskData] = useState({});
  const [alertData, setAlertData] = useState<AlertInterface>({ message: "", theme: AlertTheme.NORMAL });
  const [userData, setUserData] = useState<UserDataInterface>({ name: "Guest" } as UserDataInterface);
  const [prioritiesData, setPrioritiesData] = useState<any>({});
  const [appThemeData, setAppThemeData] = useState(AppThemeType.LIGHT);



  useEffect(() => {
    //Load task data and set it to the local state.
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      console.log(`on auth change ----`);

      if (user && user.email) {
        setUserData({ ...userData, name: user.email })
      }
    })
    loadThemeData(setAppThemeData);
    loadTaskData(setTaskData);
    loadPriorityItemsData(setPrioritiesData);

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



  return (
    <AppThemeContext.Provider value={{ themeMode: appThemeData, setThemeMode: setAppThemeData }}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <PrioritiesContext.Provider value={{ prioritiesData, setPrioritiesData }}>
          <TaskDataContext.Provider value={[taskData, setTaskData]}>
            <AlertContext.Provider value={[alertData, setAlertData]}>

              <div className='bodyDiv' style={appThemeData === AppThemeType.DARK ? DARK_THEME : LIGHT_THEME}>
                <div className='alertBanner' style={{ ...getThemeStyles(appThemeData), display: alertData.message.length == 0 ? "none" : "flex", marginTop: appThemeData === AppThemeType.DARK ? "0" : "10px" }} >
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
                    <Route path="/priorities" element={<PrioritiesHome />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/createPriorityItem" element={<CreatePriorityItem />} />
                    <Route path="/editPriorityItem/:priorityItemId" element={<EditPriorityItem />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </AlertContext.Provider>
          </TaskDataContext.Provider>
        </PrioritiesContext.Provider>
      </UserContext.Provider>
    </AppThemeContext.Provider>
  );
}



function HomeScreen() {

  const { userData, setUserData } = useContext(UserContext);

  let auth: Auth;

  useEffect(() => {
    auth = getAuth();
  }, [])


  return (
    <div className='landingOuter'>
      <div className='Jumbotron'>
        {userData.name == "Guest" && <NavLink className={'userItem'} to='/login'>Login / Signup</NavLink>}
        {userData.name != "Guest" && <p className={'userItem'} onClick={() => {
          if (auth.currentUser?.email) {
            alert("asd")
            signOut(auth).then((lol) => {
              setUserData({ ...userData, message: "Guest" })
            }, (reason) => {
              console.log(`logout failed : ${reason}`);

            })
          }
        }}>Sign out</p>}
        <h1>TraQ.it</h1>
      </div>
      <TilesContainer />
    </div>
  );
}

export default App;

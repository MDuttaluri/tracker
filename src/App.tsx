import { Auth, getAuth, signOut, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.scss';
import Calculator from './Components/Calculator/Calculator';
import CreatePriorityItem from './Components/PriorityItems/CreatePriorityItem';
import EditPriorityItem from './Components/PriorityItems/EditPriorityItem';
import PrioritiesHome from './Components/PriorityItems/PrioritiesHome';
import { deletePriorityItemFromServer, downloadPrioritiesLastModified, loadPriorityItemsDataFromLocalStorage, syncPriorityDataFromServer } from './Components/PriorityItems/PriorityItemUtils';
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
import { AlertTheme, PrioritiesContextInterface, UserDataContextInterface, UserDataInterface } from './Utilities';
import SettingsPage from './Pages/SettingsPage';
import useAuth from './Components/hooks/useAuth';
import { Firestore, getFirestore } from 'firebase/firestore';
import usePriorityIndexedDB from './Components/hooks/usePriorityIndexedDB';
import { IDBPDatabase } from 'idb';

initaliseFirebase();




// try {

//   Notification.requestPermission((status) => {
//     if (status == 'granted') {
//       navigator.serviceWorker.getRegistration()
//         .then((reg) => {
//           reg?.showNotification("Notifications will show up like this from now on.", { data: "This is the data part.", requireInteraction: false, badge: "%PUBLIC_URL%/favicon.ico", icon: "%PUBLIC_URL%/favicon.ico" })
//         })
//     }
//   })


// } catch (e) {
//   try {
//     Notification.requestPermission()
//   } catch (e) {

//   }
// }


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
  const localData = loadPriorityItemsDataFromLocalStorage(null) as any;
  console.log('==================  LOCALDATA  ==================');
  console.log(localData);
  console.log('====================================');
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
  const auth = useAuth();
  const db = getFirestore();
  const idb: IDBPDatabase<unknown> = usePriorityIndexedDB() as any;


  useEffect(() => {
    //Load task data and set it to the local state.
    loadThemeData(setAppThemeData);
    loadTaskData(setTaskData);
    syncPriorityDataFromServer(idb, db, userData.id);
    loadPriorityItemsData(setPrioritiesData);

  }, [])

  useEffect(() => {
    if (auth.currentUser?.uid) {
      console.log(`log : ${userData.id}`);
      syncPriorityDataFromServer(idb, db, userData.id);
      loadPriorityItemsData(setPrioritiesData);

    }

  }, [userData])



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
  const auth = useAuth();


  return (
    <div className='landingOuter'>
      <div className='Jumbotron'>
        {userData.name == "Guest" && <NavLink className={'userItem'} to='/login'>Login / Signup</NavLink>}
        {userData.name != "Guest" && <p className={'userItem'} onClick={() => {
          if (auth.currentUser?.email) {
            signOut(auth)
              .then(() => {
                setUserData({ ...userData, name: "Guest" })
              }, () => { })
          }
        }}>Sign out</p>}
        <h1>TraQ.it</h1>
      </div>
      <TilesContainer />
    </div>
  );
}

export default App;

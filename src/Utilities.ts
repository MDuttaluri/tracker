import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./App";

export interface UserDataInterface {
    name: string,
    dirtyPin: false,
    id: string
}

export interface UserDataContextInterface {
    userData: UserDataInterface,
    setUserData: any
}

export enum AlertTheme {
    'SUCESS', 'FAIL', 'NORMAL'
}

export function LoadInitialAuthData() {

    /* useEffect(()=>{
 
     },[])
 
     const { userData, setUserData } = useContext(UserContext);
     const [fetchedUser, setFetchUser] = useState();
 
     //localStorage.getItem('user')
     const auth = getAuth();
     auth.onAuthStateChanged((user) => {
         if (user) {
             setUserData({ ...userData, name: user.email })
         } else {
 
         }
     })
 
     console.log(auth.currentUser);
 
     if (auth.currentUser && auth.currentUser.email) {
         return {
             id: auth.currentUser.uid,
             dirtyPin: false,
             name: auth.currentUser.email,
         } as UserDataInterface
     }*/
}




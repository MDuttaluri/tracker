import { Auth, getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./App";
import { addDoc, collection, doc, Firestore, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import useFirestore from "./Components/hooks/useFirestore";
import { loadPriorityItemsDataFromLocalStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, savePriorityItemsToLocalStorage } from "./Components/PriorityItems/PriorityItemUtils";

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



export interface PrioritiesContextInterface {
    prioritiesData: any,
    setPrioritiesData: any
}

export function isValidTime(timeString: string) {
    try {
        const parts = timeString.split(":")
        if (parts.length < 2 || parts.length > 3) {
            return false;
        }
        let intPart = parseInt(parts[0]);
        if (intPart > 24 || intPart < 0) {
            return false
        }
        intPart = parseInt(parts[1])
        if (intPart > 60 || intPart < 0)
            return false;
        if (parts.length === 3) {
            intPart = parseInt(parts[2])
            if (intPart > 60 || intPart < 0)
                return false
        }
        return true
    } catch (e) {
        return false
    }
}







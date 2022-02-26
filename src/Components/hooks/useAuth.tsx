import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { PrioritiesContext, UserContext } from '../../App';
import { loadPriorityItemsDataFromLocalStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, savePriorityItemsToLocalStorage } from '../PriorityItems/PriorityItemUtils';
import useFirestore from './useFirestore';

const FIRESTORE_PRIORITYDATA_COLLECTION_PATH = "priorityData"

function useAuth() {
    const [auth, setAuth] = useState(getAuth());
    const { userData, setUserData } = useContext(UserContext);
    const { prioritiesData, setPrioritiesData } = useContext(PrioritiesContext);



    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user && user.email && setUserData) {

                setUserData({ ...userData, name: user.email, id: user.uid });
            }
            setAuth(auth);
        })
    }, [])

    return auth;
}





export default useAuth
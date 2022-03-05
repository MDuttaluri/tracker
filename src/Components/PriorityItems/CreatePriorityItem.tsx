import React, { useContext, useEffect, useRef, useState } from 'react';
import CompactNav from '../CompactNav/CompactNav'
import Selector from '../../Components/Selector/Selector';

import { useNavigate } from "react-router-dom"
import { TaskPriority } from '../Task/Task';
import { AlertContext, PrioritiesContext, UserContext } from '../../App';
import { finalisePriorityItemsInStorage, loadPriorityItemsDataFromLocalStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, savePriorityItemsToLocalStorage, syncPriorityDataFromServer } from './PriorityItemUtils';
import useThemeData from '../hooks/useThemeData';
import { ThemeDataType } from '../../ThemeUtils';
import useFirestore from '../hooks/useFirestore';
import usePriorityIndexedDB from '../hooks/usePriorityIndexedDB';
import { IDBPDatabase } from 'idb';

function CreatePriorityItem() {
    let navigate = useNavigate();
    const { prioritiesData, setPrioritiesData } = useContext(PrioritiesContext);
    const [alertData, setAlertData] = useContext(AlertContext);
    const idb: IDBPDatabase<unknown> = usePriorityIndexedDB() as any;

    const nameRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const [priorityValue, setPriorityValue] = useState(0);
    const themeData = useThemeData()[0];
    const db = useFirestore();
    const { userData, setUserData } = useContext(UserContext)

    const [name, setName] = useState("");


    useEffect(() => {
        console.log('====================================');
        console.log(`ok`);
        console.log(idb);

        console.log('====================================');
    }, [idb])

    function isFormFilled() {
        if (!nameRef?.current?.value || nameRef?.current?.value.length <= 0) {
            return false;
        }
        return true;
    }

    function getJsonItem() {
        return {
            "itemName": nameRef?.current?.value,
            "deadline": endDateRef?.current?.value,
            "description": descriptionRef?.current?.value,
            "notes": notesRef?.current?.value,
            "priority": priorityValue || TaskPriority.NORMAL,
            "itemId": Date.now() + (nameRef?.current?.value || ""),
            "status": 1,
            "createdOn": Date.now(),
            "lastModifiedOn": Date.now()
        }
    }

    async function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isFormFilled()) {
            const itemJson = getJsonItem();
            let newPrioritiesData = { ...prioritiesData };
            newPrioritiesData[itemJson.itemId] = itemJson;
            setPrioritiesData({ ...newPrioritiesData });
            // await savePriorityItemsToLocalStorage(idb, { ...newPrioritiesData });
            setAlertData({ ...alertData, "message": "Priority item created!" });
            syncPriorityDataFromServer(idb, db, userData.id);
            await finalisePriorityItemsInStorage(idb, { ...newPrioritiesData });
            // await loadPriorityItemsDataFromLocalStorage(idb);
            //  await preparePriSortPriorityItems(idb);
            //  await prepareDeadlineSortPriorityItems(idb);
            navigate("/priorities");
        } else {
            setAlertData({ ...alertData, "message": "The form is not yet completed to create an item." });
        }
    }

    return (
        <div>
            <CompactNav backTo='/priorities' content='Add a Priority Item' />


            <div className='outerDiv grid--center'>
                <p style={{ textAlign: 'center' }}>Here you can log a priority item.</p>
                <form className='form'>
                    <div className='formRow'>
                        <label>Item Name</label>
                        <label>:</label>
                        <input ref={nameRef} onChange={(e) => { setName(e.target.value) }} value={name} type='text' style={themeData as ThemeDataType} />
                    </div>
                    <div className='formRow'>
                        <label>Deadline</label>
                        <label>:</label>
                        <input ref={endDateRef} type='date' style={themeData as ThemeDataType} />
                    </div>
                    <div className='formRow'>
                        <label>Description</label>
                        <label>:</label>
                        <input ref={descriptionRef} type='text' style={themeData as ThemeDataType} />
                    </div>
                    <div className='formRow'>
                        <label>Category</label>
                        <label>:</label>
                        <input type='text' style={themeData as ThemeDataType} />

                    </div>
                    <div className='formRow'>
                        <label>Priority</label>
                        <label>:</label>
                        <Selector setterFn={setPriorityValue} />
                    </div>
                    <div className='formGrid'>
                        <label>Additional Notes</label>
                        <textarea ref={notesRef} className='formTextArea' style={themeData as ThemeDataType} />
                    </div>

                    <button type='submit' onClick={handleClick} className='primaryButton'>Create</button>
                </form>
            </div>

        </div>
    )
}

export default CreatePriorityItem
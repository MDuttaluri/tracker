import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertContext, PrioritiesContext, TaskDataContext, UserContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import Selector from '../../Components/Selector/Selector';
import { addTaskToStorage, deleteTaskFromStorage, Task } from '../../Components/Task/Task';
import { mapPriority } from '../../Pages/Tasks/CreateTask';
import { ThemeDataType } from '../../ThemeUtils';
import useThemeData from '../hooks/useThemeData';
import useFirestore from '../hooks/useFirestore';
import NotificationSetup from '../NotificationSetup/NotificationSetup';
import { addPriorityItemToDeletedList, deletePriorityItemFromLocalStorage, deletePriorityItemFromServer, finalisePriorityItemsInStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, savePriorityItemsToLocalStorage, syncPriorityDataFromServer, uploadPriorityToBeDeletedItemsToServer } from './PriorityItemUtils';
import usePriorityIndexedDB from '../hooks/usePriorityIndexedDB';
import { IDBPDatabase } from 'idb';

function EditPriorityItem() {
    const priorityItemId = useParams()['priorityItemId'] as string;
    const nameRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const [priorityValue, setPriorityValue] = useState(0);
    const { prioritiesData, setPrioritiesData } = useContext(PrioritiesContext);
    const [alertData, setAlertData] = useContext(AlertContext);
    const [isLoading, setIsLoading] = useState(true);
    const [selector, setSelector] = useState(<></>);
    const [notificationSetupComponent, setNotificationSetupComponent] = useState(<></>);
    const [itemStatus, setItemStatus] = useState(-1);
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const themeData = useThemeData()[0];
    const navigate = useNavigate();
    const db = useFirestore();
    const idb: IDBPDatabase<unknown> = usePriorityIndexedDB() as any;
    const { userData, setUserData } = useContext(UserContext);



    async function saveTask(e: any, newItemStatus?: number) {
        e.preventDefault();
        let currentItem = prioritiesData[priorityItemId];
        currentItem["itemName"] = nameRef.current?.value;
        currentItem["itemId"] = priorityItemId;
        currentItem["deadline"] = endDateRef.current?.value;
        currentItem["description"] = descriptionRef.current?.value;
        currentItem["notes"] = notesRef.current?.value;
        currentItem["priority"] = mapPriority(priorityValue);
        currentItem["lastModifiedOn"] = Date.now();
        if (newItemStatus)
            currentItem['status'] = newItemStatus;
        else
            currentItem['status'] = itemStatus !== -1 ? itemStatus : (currentItem['status'] || 0);

        let newItemsData = {
            ...prioritiesData,
        }
        newItemsData[priorityItemId] = currentItem;
        setPrioritiesData(newItemsData);
        await finalisePriorityItemsInStorage(idb, newItemsData);
        syncPriorityDataFromServer(idb, db, userData.id);
        setAlertData({ ...alertData, message: `Item edited successfully!` });
        navigate("/priorities");
    }

    async function deleteTask(e: any) {
        e.preventDefault();
        let newItemsData = prioritiesData;
        delete newItemsData[priorityItemId];
        await deletePriorityItemFromLocalStorage(idb, priorityItemId);
        await prepareDeadlineSortPriorityItems(idb, newItemsData);
        await preparePriSortPriorityItems(idb, newItemsData);
        // await finalisePriorityItemsInStorage(idb, newItemsData);
        setAlertData({ ...alertData, message: "Item deleted successfully!" });
        addPriorityItemToDeletedList(idb, priorityItemId);
        setPrioritiesData(newItemsData);
        deletePriorityItemFromServer(db, userData.id, priorityItemId);
        syncPriorityDataFromServer(idb, db, userData.id);
        //uploadPriorityToBeDeletedItemsToServer(db, userData.id);
        navigate("/priorities");
    }

    function toggleItemCompletion(e: any) {
        e.preventDefault();
        const oldStatus = itemStatus !== -1 ? itemStatus : (prioritiesData['status'] || 0);
        const newStatus = oldStatus === 0 ? 1 : 0
        setItemStatus(newStatus);
        saveTask(e, newStatus);
    }

    useEffect(() => {
        if (priorityItemId && prioritiesData[priorityItemId]) {
            let currentItem = prioritiesData[priorityItemId];
            nameRef.current?.setAttribute("value", currentItem.itemName);
            endDateRef.current?.setAttribute("value", currentItem.deadline);
            descriptionRef.current?.setAttribute("value", currentItem.description);
            notesRef.current?.setAttribute("value", currentItem.notes);
            setItemStatus(prioritiesData[priorityItemId]['status']);
            // notesRef.current?.setAttribute("", currentItem.notes);
            setSelector(<Selector setterFn={setPriorityValue} initLevel={currentItem.priority} />)
            // setNotificationSetupComponent(<NotificationSetup itemId={priorityItemId} />)
        }
    }, [prioritiesData, priorityItemId])

    return (
        <div>
            <CompactNav backTo={'/priorities#' + priorityItemId} content='Edit Priority Item' />
            <div className='outerDiv grid--center'>

                <p style={{ textAlign: 'center' }}>View or Edit your item here.</p>
                <form className='form'>
                    <div className='formRow'>
                        <label>Item Name</label>
                        <label>:</label>
                        <input ref={nameRef} type='text' style={themeData as ThemeDataType} />
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
                        <label>Priority</label>
                        <label>:</label>
                        {selector}
                    </div>
                    {/*
                    <div className='formRow'>
                        <label>Notifications</label>
                        <label>:</label>
                        {notificationSetupComponent}
                    </div>
                    */}
                    <div className='formGrid'>
                        <label>Additional Notes</label>
                        <textarea ref={notesRef} className='formTextArea' style={themeData as ThemeDataType} />
                    </div>
                    <button type='submit' onClick={saveTask} className='primaryButton'>Save</button>
                    <div style={{ display: "grid", justifyItems: "center", justifySelf: "center" }}>
                        {
                            itemStatus === 1 ?
                                <p onClick={toggleItemCompletion} style={{ textAlign: 'center', color: "rgb(35, 112, 255)", cursor: "pointer", width: "fit-content", justifySelf: "center" }}>Mark as completed</p>
                                :
                                <p onClick={toggleItemCompletion} style={{ textAlign: 'center', color: "rgb(35, 112, 255)", cursor: "pointer", width: "fit-content", justifySelf: "center" }}>Mark as "In progress"</p>
                        }
                        <p onClick={deleteTask} style={{ textAlign: 'center', color: "red", cursor: "pointer", width: "fit-content", justifySelf: "center" }}>Delete Task</p>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default EditPriorityItem;

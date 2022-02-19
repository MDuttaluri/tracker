import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertContext, PrioritiesContext, TaskDataContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import Selector from '../../Components/Selector/Selector';
import { addTaskToStorage, deleteTaskFromStorage, Task } from '../../Components/Task/Task';
import { mapPriority } from '../../Pages/Tasks/CreateTask';
import { ThemeDataType } from '../../ThemeUtils';
import useThemeData from '../hooks/useThemeData';
import { finalisePriorityItemsInStorage, prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, savePriorityItemsToLocalStorage } from './PriorityItemUtils';

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
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const themeData = useThemeData()[0];
    const navigate = useNavigate();

    function saveTask(e: any) {
        e.preventDefault();
        let currentItem = prioritiesData[priorityItemId];
        currentItem["itemName"] = nameRef.current?.value;
        currentItem["itemId"] = priorityItemId;
        currentItem["deadline"] = endDateRef.current?.value;
        currentItem["description"] = descriptionRef.current?.value;
        currentItem["notes"] = notesRef.current?.value;
        currentItem["priority"] = mapPriority(priorityValue);

        let newItemsData = {
            ...prioritiesData,
        }
        newItemsData[priorityItemId] = currentItem;
        setPrioritiesData(newItemsData);
        finalisePriorityItemsInStorage(newItemsData);
        setAlertData({ ...alertData, message: "Item edited successfully!" });
        navigate("/priorities");
    }

    function deleteTask() {
        let newItemsData = prioritiesData;
        delete newItemsData[priorityItemId];
        finalisePriorityItemsInStorage(newItemsData);
        setAlertData({ ...alertData, message: "Item deleted successfully!" });
        navigate("/priorities");

    }

    useEffect(() => {
        if (priorityItemId && prioritiesData[priorityItemId]) {
            let currentItem = prioritiesData[priorityItemId];
            nameRef.current?.setAttribute("value", currentItem.itemName);
            endDateRef.current?.setAttribute("value", currentItem.deadline);
            descriptionRef.current?.setAttribute("value", currentItem.description);
            notesRef.current?.setAttribute("value", currentItem.notes);
            // notesRef.current?.setAttribute("", currentItem.notes);
            setSelector(<Selector setterFn={setPriorityValue} initLevel={currentItem.priority} />)
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
                    <div className='formGrid'>
                        <label>Additional Notes</label>
                        <textarea ref={notesRef} className='formTextArea' style={themeData as ThemeDataType} />
                    </div>
                    <button type='submit' onClick={saveTask} className='primaryButton'>Save</button>
                    <p onClick={deleteTask} style={{ textAlign: 'center', color: "red", cursor: "pointer", width: "fit-content", justifySelf: "center" }}>Delete Task</p>
                </form>
            </div>

        </div>
    );
}

export default EditPriorityItem;

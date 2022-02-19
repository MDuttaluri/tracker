import React, { useContext, useRef, useState } from 'react';
import CompactNav from '../CompactNav/CompactNav'
import Selector from '../../Components/Selector/Selector';

import { useNavigate } from "react-router-dom"
import { TaskPriority } from '../Task/Task';
import { AlertContext, PrioritiesContext } from '../../App';
import { prepareDeadlineSortPriorityItems, preparePriSortPriorityItems, savePriorityItemsToLocalStorage } from './PriorityItemUtils';

function CreatePriorityItem() {
    let navigate = useNavigate();
    const { prioritiesData, setPrioritiesData } = useContext(PrioritiesContext);
    const [alertData, setAlertData] = useContext(AlertContext);

    const nameRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const [priorityValue, setPriorityValue] = useState(0);

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
            "itemId": Date.now() + (nameRef?.current?.value || "")
        }
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isFormFilled()) {
            const itemJson = getJsonItem();
            let newPrioritiesData = { ...prioritiesData };
            newPrioritiesData[itemJson.itemId] = itemJson;
            setPrioritiesData({ ...newPrioritiesData });
            savePriorityItemsToLocalStorage({ ...newPrioritiesData });
            setAlertData({ ...alertData, "message": "Priority item created!" });
            prepareDeadlineSortPriorityItems();
            preparePriSortPriorityItems();
        } else {
            alert("The form is not yet completed to create an item.")
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
                        <input ref={nameRef} type='text' />
                    </div>
                    <div className='formRow'>
                        <label>Deadline</label>
                        <label>:</label>
                        <input ref={endDateRef} type='date' />
                    </div>
                    <div className='formRow'>
                        <label>Description</label>
                        <label>:</label>
                        <input ref={descriptionRef} type='text' />
                    </div>
                    <div className='formRow'>
                        <label>Category</label>
                        <label>:</label>
                        <input type='text' />

                    </div>
                    <div className='formRow'>
                        <label>Priority</label>
                        <label>:</label>
                        <Selector setterFn={setPriorityValue} />
                    </div>
                    <div className='formGrid'>
                        <label>Additional Notes</label>
                        <textarea ref={notesRef} className='formTextArea' />
                    </div>

                    <button type='submit' onClick={handleClick} className='primaryButton'>Create</button>
                </form>
            </div>

        </div>
    )
}

export default CreatePriorityItem
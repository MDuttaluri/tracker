import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TaskDataContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import Selector from '../../Components/Selector/Selector';
import { addTaskToStorage, Task } from '../../Components/Task/Task';
import { mapPriority } from './CreateTask';

function EditTask() {
    const taskId = useParams()['taskId'] as string;
    const nameRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const [priorityValue, setPriorityValue] = useState(0);
    const [taskData, setTaskData] = useContext(TaskDataContext);
    const [isLoading, setIsLoading] = useState(true);
    const [selector, setSelector] = useState(<></>);
    let task = new Task();

    function saveTask(e: any) {
        e.preventDefault();
        console.log(task);
        task.taskId = taskId;
        task.name = nameRef.current?.value || "";
        task.description = descriptionRef.current?.value || "";
        task.priority = mapPriority(priorityValue);
        task.range = {
            _startFrom: startDateRef.current?.value || "",
            _endAt: endDateRef.current?.value || "",
            _isRecurring: task.range._isRecurring || false
        }
        addTaskToStorage(task);
    }

    useEffect(() => {
        if (taskId) {
            //  console.log(taskId);
            //console.log(taskData[taskId]);
            if (taskData[taskId]) {

                task.cloneFromJSON(taskData[taskId])
                //   task.logTask();
                nameRef.current?.setAttribute('value', task.name)
                startDateRef.current?.setAttribute('value', task.range?._startFrom || "");
                endDateRef.current?.setAttribute('value', task.range?._endAt || "");
                descriptionRef.current?.setAttribute('value', task.description)
                setPriorityValue(task.priority);
                setSelector(<Selector setterFn={setPriorityValue} initLevel={5 - task.priority} />)
                setIsLoading(false)
            }
        }
    }, [taskData])

    return (
        <div>
            <CompactNav backTo={'/tasks#' + taskId} content='Edit Task' />
            <div className='outerDiv grid--center'>
                <p style={{ textAlign: 'center' }}>View or Edit your task here.</p>
                <form className='form'>
                    <div className='formRow'>
                        <label>Task Name</label>
                        <label>:</label>
                        <input ref={nameRef} type='text' />
                    </div>
                    <div className='formRow'>
                        <label>Start Date</label>
                        <label>:</label>
                        <input ref={startDateRef} type='date' />
                    </div>
                    <div className='formRow'>
                        <label>End Date</label>
                        <label>:</label>
                        <input ref={endDateRef} type='date' />
                    </div>
                    <div className='formRow'>
                        <label>Description</label>
                        <label>:</label>
                        <input ref={descriptionRef} type='text' />
                    </div>
                    <div className='formRow'>
                        <label>Priority</label>
                        <label>:</label>
                        {selector}
                    </div>
                    <button type='submit' onClick={saveTask} className='primaryButton'>Save</button>
                </form>
            </div>
        </div>
    );
}

export default EditTask;

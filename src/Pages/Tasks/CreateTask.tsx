import React, { useContext, useRef, useState } from 'react';
import { TaskDataContext } from '../../App';
import CompactNav from '../../Components/CompactNav/CompactNav';
import Selector from '../../Components/Selector/Selector';
import { addTaskToStorage, Task, TaskPriority } from '../../Components/Task/Task';
import './TasksStyles.scss';

import { useNavigate } from "react-router-dom"
import useSpecificThemeData from '../../Components/hooks/useSpecificThemeData';
import { ThemeDataType } from '../../ThemeUtils';
import useThemeData from '../../Components/hooks/useThemeData';

export function mapPriority(level: number) {
    if (level === 1) {
        return TaskPriority['VERY LOW'];
    } else if (level === 2) {
        return TaskPriority.LOW;
    } else if (level === 3) {
        return TaskPriority.NORMAL;
    } else if (level === 4) {
        return TaskPriority.HIGH;
    } else {
        return TaskPriority['VERY HIGH'];
    }
}

function CreateTask() {
    let navigate = useNavigate();

    const [taskData, setTaskData] = useContext(TaskDataContext);
    const nameRef = useRef<HTMLInputElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const [priorityValue, setPriorityValue] = useState(0);
    const themeData = useThemeData()[0];

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        const newTask = new Task(nameRef.current?.value ?? "Task Name empty", descriptionRef.current?.value, mapPriority(priorityValue), false, { _startFrom: startDateRef.current?.value || "", _endAt: endDateRef.current?.value || "", _isRecurring: false })
        //newTask.logTask();
        addTaskToStorage(newTask.getTaskJSON())
        let modifiedState = { ...taskData };
        modifiedState[newTask.taskId] = newTask.getTaskJSON();
        setTaskData(modifiedState);
        navigate('/tasks');
    }

    return <div>
        <CompactNav backTo='/tasks' content='Create Task' />
        <div className='outerDiv grid--center'>
            <p style={{ textAlign: 'center' }}>Here you can log a new task.</p>
            <form className='form'>
                <div className='formRow'>
                    <label>Task Name</label>
                    <label>:</label>
                    <input ref={nameRef} type='text' style={themeData as ThemeDataType} />
                </div>
                <div className='formRow'>
                    <label>Start Date</label>
                    <label>:</label>
                    <input ref={startDateRef} type='date' style={themeData as ThemeDataType} />
                </div>
                <div className='formRow'>
                    <label>End Date</label>
                    <label>:</label>
                    <input ref={endDateRef} type='date' style={themeData as ThemeDataType} />
                </div>
                <div className='formRow'>
                    <label>Description</label>
                    <label>:</label>
                    <input ref={descriptionRef} type='text' style={{ ...themeData, }} />
                </div>
                <div className='formRow'>
                    <label>Priority</label>
                    <label>:</label>
                    <Selector setterFn={setPriorityValue} />
                </div>
                <button type='submit' onClick={handleClick} className='primaryButton'>Create</button>
            </form>
        </div>
    </div>;
}

export default CreateTask;

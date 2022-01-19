import React, { useEffect, useState } from 'react';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { Task } from '../../Components/Task/Task';
import { ReactComponent as NewTaskIcon } from '../../assets/createTask.svg';
import './TasksStyles.scss';
import { NavLink } from 'react-router-dom';

export function loadTasks(setTasks: any) {
    // as of now local storage

    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks == null) {
        setTasks([])
    } else {
        setTasks(storedTasks)
    }
}


function TasksHome() {
    const [tasks, setTasks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [mainComponent, setMainComponent] = useState(<p>Loading</p>);

    useEffect(() => {
        loadTasks(setTasks)
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (loaded) {
            if (tasks.length === 0) {
                setMainComponent(<CreateNewDialog />)
            } else {
                setMainComponent(<TasksList tasks={tasks} />)
            }
        }
    }, [loaded])

    return <div>
        <CompactNav backTo='/' content='Tasks' />
        {mainComponent}
    </div>;
}

function CreateNewDialog() {
    return <div className='createNewTaskDialog'>
        <NewTaskIcon className='svg' />
        <p>It's all clear here! <br />Log a task now!</p>
        <NavLink to="/createTask"><button className='primaryButton'>Create Task</button></NavLink>
    </div>
}

interface TasksListPropsInterface {
    tasks: Task[]
}

export function TasksList(props: TasksListPropsInterface) {
    return (
        <div>TASK LIST</div>

    )
}

export default TasksHome;

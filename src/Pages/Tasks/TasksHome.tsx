import React, { useEffect, useState } from 'react';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { getTasksCount, Task, TaskPriority } from '../../Components/Task/Task';
import { ReactComponent as NewTaskIcon } from '../../assets/createTask.svg';
import './TasksStyles.scss';
import { NavLink } from 'react-router-dom';
import { ReactComponent as AddTaskIcon } from '../../assets/addTask.svg';
import { ReactComponent as AlertIcon } from '../../assets/alert.svg';
import { ReactComponent as EditIcon } from '../../assets/edit.svg';
import { TasksList } from '../../Components/TasksList/TaskList';


export function loadTasks(setTasks: any) {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks == null) {
        setTasks({})
    } else {
        setTasks(JSON.parse(storedTasks))
    }
}


function TasksHome() {
    const [tasksCount, setTasksCount] = useState(getTasksCount());
    const [tasks, setTasks] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [mainComponent, setMainComponent] = useState(<p>Loading</p>);


    useEffect(() => {
        loadTasks(setTasks);
        setLoaded(true);
    }, [])

    useEffect(() => {
        if (loaded) {
            if (tasksCount === 0) {
                setMainComponent(<CreateNewDialog />)
            } else {
                setMainComponent(<TasksList tasks={tasks} />)
            }
        }
    }, [loaded])

    return <div>
        <CompactNav backTo='/' content='Tasks' extraLink={tasksCount > 0 ? { label: <AddTaskIcon />, link: '/createTask' } : null} />
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


interface TaskComponentPropsInterface {
    task: Task;
}

export function TaskComponent(props: TaskComponentPropsInterface) {
    const [task, setTask] = useState<Task>(props.task);
    const [alertBadge, setAlertBadge] = useState(<></>);
    useEffect(() => {
        if (task.priority === TaskPriority.HIGH) {
            setAlertBadge(<AlertIcon className={'alert alert--high'} />)
        } else if (task.priority === TaskPriority['VERY HIGH']) {
            setAlertBadge(<AlertIcon className='alert alert--veryhigh' />)
        } else if (task.priority === TaskPriority.NORMAL) {
            setAlertBadge(<AlertIcon className='alert alert--normal' />)
        } else if (task.priority === TaskPriority.LOW) {
            setAlertBadge(<AlertIcon className='alert alert--low' />)
        } else if (task.priority === TaskPriority['VERY LOW']) {
            setAlertBadge(<AlertIcon className='alert alert--veryhigh' />)
        }
    }, [])
    return (
        <NavLink id={task.taskId} to={'/editTask/' + task.taskId}><div className='taskComponent'>
            <div className='taskLeftDiv'>
                <p>{task.name}</p>
                <p>{alertBadge}</p>
            </div>
            <div className='taskRightDiv'>
                <p>{task.description}</p>

                <p>{task.priority}</p>
            </div>
        </div>
        </NavLink>
    )
}

export default TasksHome;
import React, { useEffect, useState } from 'react';
import CompactNav from '../../Components/CompactNav/CompactNav';
import { getTasksCount, Task, TaskPriority } from '../../Components/Task/Task';
import { ReactComponent as NewTaskIcon } from '../../assets/createTask.svg';
import './TasksStyles.scss';
import { NavLink } from 'react-router-dom';
import { ReactComponent as AddTaskIcon } from '../../assets/addTask.svg';
import { ReactComponent as AlertIcon } from '../../assets/alert.svg';


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

interface TasksListPropsInterface {
    tasks: any;
}

export function TasksList(props: TasksListPropsInterface) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        let tempTasks = [] as Task[]
        console.log(props.tasks);

        Object.keys(props.tasks).map((taskId) => {
            console.log(`key : ${taskId}`);

            if (taskId != 'tasksCount') {
                const newTaskObj = new Task()
                newTaskObj.cloneFromJSON(props.tasks[taskId])
                tempTasks.push(newTaskObj)
            }
        })
        setTasks([...tempTasks]);
    }, [])

    return (
        <div className='outerDiv grid--center taskList'>
            {tasks.length > 0 && tasks.map((val, idx) => {
                console.log(`Task comp created`);
                return <TaskComponent key={'taskComp' + idx} task={val} />
            })}
        </div>

    )
}

interface TaskComponentPropsInterface {
    task: Task;
}

export function TaskComponent(props: TaskComponentPropsInterface) {
    const [task, setTask] = useState<Task>(props.task);
    const [alertBadge, setAlertBadge] = useState(<></>);
    useEffect(() => {
        if (task.priority === TaskPriority.HIGH) {
            setAlertBadge(<AlertIcon className='alert--high' />)
        } else if (task.priority === TaskPriority['VERY HIGH']) {
            setAlertBadge(<AlertIcon className='alert--veryhigh' />)
        }
    }, [])
    return (
        <div className='taskComponent'>
            <div className='taskLeftDiv'>
                <p>{task.name}</p>
                <p>{alertBadge}</p>
            </div>
            <div className='taskRightDiv'>
                <p>{task.description}</p>
                <p>{task.range._startFrom}</p>
                <p>{task.range._endAt}</p>
                <p>{task.priority}</p>
            </div>
        </div>
    )
}

export default TasksHome;
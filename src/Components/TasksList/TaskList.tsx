import { useEffect, useState } from "react";
import { TaskComponent } from "../../Pages/Tasks/TasksHome";
import { Task } from "../Task/Task";

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

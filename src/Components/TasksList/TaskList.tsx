import { useContext, useEffect, useState } from "react";
import { TaskDataContext } from "../../App";
import { TaskComponent } from "../../Pages/Tasks/TasksHome";
import { Task } from "../Task/Task";

interface TasksListPropsInterface {
    tasks: any;
}

export function TasksList(props: TasksListPropsInterface) {
    const [taskData, setTaskData] = useContext(TaskDataContext);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (taskData) {
            console.log(taskData);

            let tempTasks = [] as Task[]
            Object.keys(taskData).map((taskId) => {
                console.log(`key : ${taskId}`);

                if (taskId != 'tasksCount') {
                    const newTaskObj = new Task()
                    newTaskObj.cloneFromJSON(taskData[taskId])
                    tempTasks.push(newTaskObj)
                }

            })
            setTasks([...tempTasks]);
        }
    }, [taskData])


    return (
        <div className='outerDiv grid--center taskList'>
            {tasks.length > 0 && tasks.map((val, idx) => {
                console.log(`Task comp created`);
                console.log(val);

                return <TaskComponent key={'taskComp' + idx} task={val} />
            })}
        </div>

    )
}

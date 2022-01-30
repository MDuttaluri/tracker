import moment from "moment";

export class Task {
    private _taskId: string;
    private _name: string;
    private _description: string;
    private _priority: TaskPriority;
    private _isCompleted: boolean;
    private _range: TaskRange;

    constructor(name?: string, description?: string, priority?: TaskPriority, isCompleted?: boolean, range?: TaskRange) {
        this._taskId = Date.now() + (name || "")
        this._name = name || "No name given"
        this._description = description || "No description available"
        this._priority = priority || TaskPriority["VERY LOW"]
        this._isCompleted = isCompleted ?? false
        this._range = range || { _startFrom: "", _endAt: "", _isRecurring: false }
    }

    public cloneFromJSON(obj: any) {
        console.log(obj);

        if (obj) {
            this._taskId = obj.taskId
            this._name = obj.name
            this._description = obj.description
            this._priority = obj.priority
            this._isCompleted = obj.isCompleted
            this._range = {
                _startFrom: obj.range?.startFrom || "",
                _endAt: obj.range?.endAt || "",
                _isRecurring: obj.range?.isRecurring || ""
            }
        } else {
            console.log(`skip aindhi andoi!`);

        }
        console.log(`Cloning finished...`);
        this.logTask();

    }

    public get taskId() {
        return this._taskId;
    }
    public get name() {
        return this._name
    }
    public get description() {
        return this._description
    }
    public get priority() {
        return this._priority
    }
    public get range() {
        return this._range
    }

    public set taskId(taskId: string) {
        this._taskId = taskId;
    }
    public set name(name: string) {
        this._name = name
    }
    public set description(description: string) {
        this._description = description
    }
    public set priority(priority: TaskPriority) {
        this._priority = priority
    }
    public set range(range: TaskRange) {
        this._range = range
    }

    public logTask() {
        //console.log(`TASK_ID : ${this._taskId} \n TASK NAME : ${this._name} \n TASK DESC : ${this._description} \n TASK PRIORITY : ${this._priority}\n TASK STRT : ${this._range._startFrom}`);
        console.log(this);

    }

    public getTaskJSON: any = () => {
        return {
            //asdkjasgbdfaj,hsdfb hjlzcsbvj
            taskId: this._taskId,
            name: this._name,
            description: this._description,
            priority: this._priority,
            isCompleted: this._isCompleted,
            range: {
                startFrom: this._range._startFrom,
                endAt: this._range._endAt,
                isRecurring: this._range._isRecurring,
            }
        }
    }


}

export interface TaskRange {
    _startFrom: string;
    _endAt: string;
    _isRecurring: boolean;
}


export enum TaskPriority {
    'VERY HIGH', 'HIGH', 'NORMAL', 'LOW', 'VERY LOW'
}

export function getTasksCount() {
    const tasksCount = localStorage.getItem('tasksCount')
    if (tasksCount == null) {
        localStorage.setItem('tasksCount', "0")
        return 0
    } else {
        return Number(tasksCount)
    }
}

export function setTasksCount(newCount: number) {
    localStorage.setItem('tasksCount', newCount + "")
}


export function addTaskToStorage(task: any, edit?: boolean) {
    const storedTasks = localStorage.getItem('tasks');
    let updatedTasks = <any>{}
    if (storedTasks != null) {
        const storedTasksJSON = JSON.parse(storedTasks)
        updatedTasks = { ...storedTasksJSON, tasksCount: storedTasksJSON?.tasksCount + (edit ? 0 : 1) }
        updatedTasks[task.taskId] = task;
    } else {
        updatedTasks[task.taskId] = task;
        updatedTasks['tasksCount'] = 1;
    }
    setTasksCount(updatedTasks.tasksCount);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
}

export enum TimeType {
    'DAYS' = 'days', 'MONTHS' = 'monts', 'YEARS' = 'years'
}

export function getTime(startAt: any, endAt: any, type: TimeType) {

    return moment(endAt).diff(startAt, type as any)

}


export function deleteTaskFromStorage(taskId: string) {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks != null) {
        let tasksJSON = JSON.parse(storedTasks);
        delete tasksJSON[taskId];
        tasksJSON['tasksCount'] = tasksJSON['tasksCount'] - 1;
        localStorage.setItem('tasks', JSON.stringify(tasksJSON))
    }
    const localCount = localStorage.getItem("tasksCount");
    if (localCount != null)
        localStorage.setItem("tasksCount", (parseInt(localCount) - 1) + "")
    else
        localStorage.setItem("tasksCount", "0")
}


export interface AlertInterface {
    message: string,
    primaryAction: string,
    secondaryAction: string,
    callbackSetter?: any
}

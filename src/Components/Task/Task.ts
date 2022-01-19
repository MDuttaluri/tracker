export class Task {
    private _taskId: string;
    private _name: string;
    private _description: string;
    private _priority: TaskPriority;
    private _isCompleted: boolean;

    constructor(name: string, description: string, priority: TaskPriority, isCompleted?: boolean) {
        this._taskId = Date.now() + name
        this._name = name
        this._description = description
        this._priority = priority
        this._isCompleted = isCompleted ?? false
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

    public logTask() {
        console.log(`TASK_ID : ${this._name} \n TASK NAME : ${this._name} \n TASK DESC : ${this._description} \n TASK PRIORITY : ${this._priority}`);
    }

    public getTaskJSON() {
        return {
            id: this._taskId,
            name: this._name,
            description: this._description,
            priority: this._priority,
            isCompleted: this._isCompleted
        }
    }

}

interface TaskRange {
    _startFrom: string;
    _endAt: string;
    _isRecurring: boolean;
}


enum TaskPriority {
    'VERY HIGH', 'HIGH', 'NORMAL', 'LOW', 'VERY LOW'
}
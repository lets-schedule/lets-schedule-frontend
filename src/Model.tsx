export class Event {
    id!: number;
    taskId!: number;
    startTime!: Date;
    endTime!: Date;
}

export class RepeatSettings {
    repeat!: boolean;
    until!: Date;
    days!: boolean[];
}

export class Task {
    id!: number;
    title!: string;
    category!: number;
    createdTime!: Date;
    priority!: number;
}

export class Constraint {
    taskId!: number;
    dueTime!: Date;
    duration!: number;
}

export class User {
    id!: number;
    email!: string;
    name!: string;
}

export class UserCache {
    user!: User;
    events: Record<number, Event> = {}; // key is id
    tasks: Record<number, Task> = {}; // key is id
    constraints: Record<number, Constraint> = {}; // key is taskId
}

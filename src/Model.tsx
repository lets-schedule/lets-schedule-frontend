export class Event {
    id!: number;
    task_id!: number;
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
    priority!: number;
}

export class Constraint {
    task_id!: number;
    dueTime!: Date;
    duration!: number;
}

export class User {
    id!: number;
    email!: string;
    name!: string;
}

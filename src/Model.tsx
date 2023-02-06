export class Event {
    id!: Number;
    task_id!: Number;
    start_time!: Date;
    end_time!: Date;
}

export class Task {
    id!: Number;
    title!: string;
    category!: Number;
    created_time!: Date;
    priority!: Number;
}

export class Constraint {
    id!: Number;
    due_time!: Date;
    duration!: Number;
}

export class User {
    id!: Number;
    email!: string;
    name!: string;
}

export class UserCache {
    user!: User;
    events: Record<number, Event> = {};
    tasks: Record<number, Task> = {};
    constraints: Record<number, Constraint> = {};
}

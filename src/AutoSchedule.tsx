import { Constraint, Event } from "./Model";

const switchTime = 10 * 60 * 1000;

export function removeTaskEvents(task_id: number, events: Record<number, Event>,
            onRemove: (eventId: number) => void) {
    Object.keys(events).forEach((key: any) => {
        if (events[key].task_id == task_id)
            onRemove(Number(key));
    });
}

export async function scheduleTaskEvents(task_id: number, constraint: Constraint,
        events: Record<number, Event>, curTime: Date, onCreate: (event: Event) => Promise<void>) {
    let remainingDuration = constraint.duration;
    while (remainingDuration > 0) {
        let start = nextFreeTime(curTime, events);
        let end = nextBusyTime(start, events);
        if (end === null || end.getTime() - start.getTime() > remainingDuration) {
            end = new Date(start.getTime() + remainingDuration);
        }
        // add event...
        await onCreate({
            id: -1,
            task_id: task_id,
            startTime: start,
            endTime: end,
        });
        curTime = end;
        remainingDuration -= end.getTime() - start.getTime();
    }
}

function nextFreeTime(time: Date, events: Record<number, Event>) {
    let overlappedEvent = true;
    while (overlappedEvent) {
        overlappedEvent = false;
        Object.values(events).forEach((event: Event, index: number) => {
            if (overlapping(time, event)) {
                time = new Date(event.endTime.getTime() + switchTime);
                overlappedEvent = true;
            }
        })
    }
    return time;
}

function nextBusyTime(time: Date, events: Record<number, Event>) {
    let nextTime: (Date | null) = null;
    for (let id in events) {
        const startTime = events[id].startTime.getTime() - switchTime;
        if (startTime > time.getTime() && (nextTime === null || startTime < nextTime.getTime())) {
            nextTime = new Date(startTime);
        }
    }
    return nextTime;
}

function overlapping(time: Date, event: Event) {
    return time.getTime() >= event.startTime.getTime() - switchTime
        && time.getTime() < event.endTime.getTime() + switchTime
}
import { Constraint, Event, Task } from "./Model";
import { randomId } from "./Util";

export function removeTaskEvents(taskId: number, events: Record<number, Event>)
        : Record<number, Event> {
    return Object.keys(events).filter((key: number) => (events[key].taskId != taskId))
        .reduce((obj: any, key: number) => {
            return {
                ...obj,
                [key]: events[key]
            };
        }, {});
}

export function scheduleTaskEvents(taskId: number, constraint: Constraint,
        events: Record<number, Event>, curTime: Date) {
    let remainingDuration = constraint.duration;
    while (remainingDuration > 0) {
        let start = nextFreeTime(curTime, events);
        let end = nextBusyTime(start, events);
        if (end === null || end.getTime() - start.getTime() > remainingDuration) {
            end = new Date(start.getTime() + remainingDuration);
        }
        // add event...
        const newEvent: Event = {
            id: randomId(),
            taskId: taskId,
            startTime: start,
            endTime: end,
        }
        events = {...events, [newEvent.id]: newEvent};
        curTime = end;
        remainingDuration -= end.getTime() - start.getTime();
    }
    return events;
}

function isBusy(time: Date, events: Record<number, Event>) {
    for (let id in events) {
        if (overlapping(time, events[id]))
            return true;
    }
    return false;
}

function nextFreeTime(time: Date, events: Record<number, Event>) {
    let overlappedEvent = true;
    while (overlappedEvent) {
        overlappedEvent = false;
        Object.values(events).forEach((event: Event, index: number) => {
            if (overlapping(time, event)) {
                time = event.endTime;
                overlappedEvent = true;
            }
        })
    }
    return time;
}

function nextBusyTime(time: Date, events: Record<number, Event>) {
    let nextTime: (Date | null) = null;
    for (let id in events) {
        const startTime = events[id].startTime;
        if (startTime.getTime() > time.getTime()
                && (nextTime === null || startTime.getTime() < nextTime.getTime())) {
            nextTime = startTime;
        }
    }
    return nextTime;
}

function overlapping(time: Date, event: Event) {
    return time.getTime() >= event.startTime.getTime()
        && time.getTime() < event.endTime.getTime()
}
import { Constraint, Event, Task } from "./Model";
import { randomId } from "./Util";

const switchTime = 10 * 60 * 1000;

export function removeTaskEvents(task_id: number, events: Record<number, Event>)
        : Record<number, Event> {
    return Object.keys(events).filter((key: number) => (events[key].task_id != task_id))
        .reduce((obj: any, key: number) => {
            return {
                ...obj,
                [key]: events[key]
            };
        }, {});
}

export function scheduleTaskEvents(task_id: number, constraint: Constraint,
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
            task_id: task_id,
            startTime: start,
            endTime: end,
        }
        events = {...events, [newEvent.id]: newEvent};
        curTime = end;
        remainingDuration -= end.getTime() - start.getTime();
    }
    return events;
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
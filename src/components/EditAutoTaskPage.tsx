import React, { useMemo } from 'react';
import {Button, View} from 'react-native-ui-lib';
import {Task, Constraint} from '../Model';
import { commStyles } from './Util';
import EditTask from './EditTask';
import EditConstraint from './EditConstraint';

export default React.memo(function({ route, navigation, ...props }: any) {
    const {taskId} = route.params;
    const {tasks, onTaskChange, constraints, onConstraintChange, ...others}: {
        tasks: Record<number, Task>, onTaskChange: (v: any) => void,
        constraints: Record<number, Constraint>, onConstraintChange: (v: any) => void,
        others: any} = props;

    const task = useMemo(() => tasks[taskId], [tasks, taskId]);
    const constraint = useMemo(() => constraints[taskId], [constraints, taskId]);
    return (
        <View {...others}>
            <EditTask value={task} onChange={onTaskChange} />
            <EditConstraint value={constraint} onChange={onConstraintChange} />
            <View style={commStyles.expand} />
            <Button label='Done' />
        </View>
    )
});

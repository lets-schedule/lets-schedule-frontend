import React, { useMemo } from 'react';
import {FloatingButton, View} from 'react-native-ui-lib';
import {Task, Constraint} from '../Model';
import { commStyles } from '../Util';
import EditTask from './EditTask';
import EditConstraint from './EditConstraint';

export default React.memo(function({ route, navigation, ...props }: any) {
    const {task_id} = route.params;
    const {tasks, onTaskChange, constraints, onConstraintChange, onComplete, ...others}: {
        tasks: Record<number, Task>, onTaskChange: (v: any) => void,
        constraints: Record<number, Constraint>, onConstraintChange: (v: any) => void,
        onComplete: (task_id: number) => Promise<void>,
        others: any} = props;

    const task = useMemo(() => tasks[task_id], [tasks, task_id]);
    const constraint = useMemo(() => constraints[task_id], [constraints, task_id]);
    const button = useMemo(() => {
        return {
            label: 'Done',
            onPress: () => {onComplete(task_id).then(() => navigation.goBack())},
        }}, [navigation, onComplete]);

    return (
        <View {...others} style={commStyles.formPage}>
            <EditTask value={task} onChange={onTaskChange} />
            <View style={commStyles.padded} />
            <EditConstraint value={constraint} onChange={onConstraintChange} />
            <View style={commStyles.expand} />
            <FloatingButton visible={true} button={button} />
        </View>
    )
});

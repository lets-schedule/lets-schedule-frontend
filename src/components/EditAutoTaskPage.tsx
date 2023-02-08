import React from 'react';
import {Button, Text, Typography, View} from 'react-native-ui-lib';
import {Task, Constraint} from '../Model';
import { commStyles } from './Util';
import EditTask from './EditTask';
import EditConstraint from './EditConstraint';

export default function EditAutoTaskPage(props: any) {
    const {task, onTaskChange, constraint, onConstraintChange, ...others}: {
        task: Task, onTaskChange: (v: any) => void,
        constraint: Constraint, onConstraintChange: (v: any) => void,
        others: any} = props;

    return (
        <View {...others}>
            <Text style={Typography.text40L}>Edit Task</Text>
            <EditTask value={task} onChange={onTaskChange} />
            <EditConstraint value={constraint} onChange={onConstraintChange} />
            <View style={commStyles.expand} />
            <Button label='Done' />
        </View>
    )
}

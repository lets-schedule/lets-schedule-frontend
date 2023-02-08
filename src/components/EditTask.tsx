import React, {useCallback} from 'react';
import { SegmentedControl, Text, TextField, View } from 'react-native-ui-lib';
import { Task } from '../Model';
import CategoryPicker from './CategoryPicker';
import { commStyles } from './Util';

export default React.memo(function(props: any) {
    const {value, onChange, ...others}:
        {value: Task, onChange: (v: any) => void} = props;
    const handleTitleChange = useCallback((text: string) => onChange({title: text}),
        [onChange]);
    const handleCategoryChange = useCallback((c: number) => onChange({category: c}),
        [onChange]);
    const handlePriorityChange = useCallback((p: number) => onChange({priority: p}),
        [onChange]);
    return (
        <View {...others}>
            <TextField title='Title' value={value.title}  onChangeText={handleTitleChange} />
            <CategoryPicker value={value.category} onChange={handleCategoryChange} />
            <PriorityPicker value={value.priority} onChange={handlePriorityChange} />
        </View>
    );
});

const prioritySegments = [{label: '1'}, {label: '2'}, {label: '3'}, {label: '4'}, {label: '5'}];

const PriorityPicker = React.memo(function(props: any) {
    const {value, onChange, ...others} = props;
    return (
        <View {...others} style={commStyles.hBox}>
            <Text>Priority:</Text>
            <View style={commStyles.expand}>
                <SegmentedControl segments={prioritySegments} initialIndex={value}
                    onChangeIndex={onChange} />
            </View>
        </View>
    );
});
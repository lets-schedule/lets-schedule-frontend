import React, {useCallback} from 'react';
import { SegmentedControl, Text, TextField, View } from 'react-native-ui-lib';
import { Task } from '../Model';
import CategoryPicker from './CategoryPicker';
import { commStyles } from '../Util';

export default React.memo(function(props: any) {
    const {value, onChange, ...others}:
        {value: Task, onPriorityChange: (v: Integer) => void, onCategoryChange: (v: any) => void, onTitleChange: (t: String) => void, onChange: (v: any) => void} = props;
    // const handleTitleChange = useCallback((text: string) => onChange({id: value.id, title: text}),
        // [onChange, value.id]);
    // const handleCategoryChange = useCallback((c: number) => onChange({id: value.id, category: c}),
        // [onChange, value.id]);
    // const handlePriorityChange = useCallback((p: number) => onChange({id: value.id, priority: p}),
        // [onChange, value.id]);

    const handleCategoryChange = (hex: String) => {
        if (hex === "#FC3D2F") {
            props.onCategoryChange(1);
        } else if (hex === "#FFC50D") {
            props.onCategoryChange(2);

        } else if (hex === "#00A87E") {
            props.onCategoryChange(3);

        } else if (hex === "#9F42BD") {
            props.onCategoryChange(4);

        } else if (hex === "#6E7881") {
            props.onCategoryChange(5);
        }

    }


    return (
        <View {...others}>
            <TextField title='Title' onChangeText={props.onTitleChange} />
            <CategoryPicker onChange={handleCategoryChange}  />
            <PriorityPicker onChange={props.onPriorityChange}  />
        </View>
    );
});

const prioritySegments = [{label: '1'}, {label: '2'}, {label: '3'}, {label: '4'}, {label: '5'}];

const PriorityPicker = React.memo(function(props: any) {
    const {value, onChange, ...others} = props;
    return (
        <View {...others} style={commStyles.hBox}>
            <Text style={commStyles.padded}>Priority:</Text>
            <View style={commStyles.expand}>
                <SegmentedControl segments={prioritySegments} 
                    onChangeIndex={props.onChange} />
            </View>
        </View>
    );
});

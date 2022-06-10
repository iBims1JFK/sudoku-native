import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View, StyleSheet, Pressable } from 'react-native';

export default function Number(props) {

    const { onPress, numberId } = props;
    const dispatch = useDispatch()
    let notes = useSelector(state => state.notes)

    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            backgroundColor: 'white',
            height: 38,
            width: 38,
            margin: 1,
            borderRadius: 5,

        },
        text: {
            fontSize: 35,
            color: 'black',
        },
    });

    function pressing() {
        dispatch({ type: 'number/numberEmitet', payload: numberId })
        if (!notes) {
            dispatch({ type: 'focus/reloadFocus' })
        }
    }

    return (

        <Pressable style={({ pressed }) => [
            styles.button,
            {
                backgroundColor: pressed ? '#40916c' : 'white',
            }
        ]} onPress={() => pressing()} hitSlop={{ bottom: 50, top: 5, right: 5, left: 5}}>
            <Text style={styles.text}>{numberId}</Text>
        </Pressable>
    );



}
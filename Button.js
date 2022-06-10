import React from 'react';
import { useSelector, useDispatch, batch } from 'react-redux'
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Number(props) {

    const { onPress, title, icon, toggleable = false, type } = props;
    const dispatch = useDispatch()
    let number = useSelector(state => state.number)
    let toggled = useSelector(state => state.notes)
    let undeletable = false
    if (type === 'löschen') {
        undeletable = useSelector(state => state.undeletable)
    }
    
    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            backgroundColor: 'white',
            height: 50,
            width: 60,
            margin: 1,
            borderColor: 'black',
            // borderWidth: toggleable ? (toggled ? 1 : 0) : 0,
            borderRadius: 5,
        },
        text: {
            fontSize: 15,
            color: toggleable ? (toggled ? '#40916c' : 'black') : undeletable ? 'grey' : 'black',
        },
    });

    function toggle() {
        if (toggleable) {
            dispatch({ type: 'notes/notesToggled'})
        }
    }

    function pressing() {
        switch (type) {
            case 'bleistift': {
                toggle()
                break
            }
            case 'löschen': {
                if (!undeletable) {
                    batch(() => {
                        dispatch({ type: 'cell/eraseCell' })
                        dispatch({ type: 'focus/reloadFocus' })
                    })
                }
                break
            }
            case 'hinweis': {
                batch(() => {
                    dispatch({ type: 'cell/revealSolution' })
                    dispatch({ type: 'focus/reloadFocus' })
                })
                break
            }
            default: {
                console.log('Fehler')
            }
        }
    }

    return (
        <Pressable style={({ pressed }) => [
            styles.button,
            {
                backgroundColor: pressed ? '#40916c' : 'white',
            }
        ]} onPress={() => pressing()} disabled={undeletable}>
            <View style={{alignItems: 'center'}}>
                <MaterialCommunityIcons name={icon} size={24} color={toggleable ? (toggled ? '#40916c' : 'black') : undeletable ? 'grey' : 'black'} />
                <Text style={styles.text}>{title}</Text>
            </View>
        </Pressable>
    );
    
    
    
}
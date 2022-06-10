import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Text, View, StyleSheet, Pressable } from 'react-native';

export default React.memo(function Cell(props) {
    const { onPress, cellId, style } = props;
    const currentTime = new Date();
    const dispatch = useDispatch()
    const seat = cellId % 9
    const column = (cellId - seat) / 9
    let value = useSelector(state => state.cells[cellId].value)
    let notes = []
    for (let i = 0; i < 9; i++){
        notes[i] = useSelector(state => state.cells[cellId].notes[i])
    }
    let solution = useSelector(state => state.cells[cellId].solution)
    let focused = useSelector(state => state.cells[cellId].focused)
    let highlight = useSelector(state => state.cells[cellId].highlight)
    let mutable = useSelector(state => state.cells[cellId].mutable)
    let wrongSolution = false

    if (value !== 0 && value != solution) {
        dispatch({ type: 'wrongSolution' })
        wrongSolution = true
    }

    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused ? '#03045e' : highlight ? '#0077b6' : 'white',
            height: 38,
            width: 38,

        },
        text: {
            fontSize: 35,
            color: wrongSolution ? 'red' : highlight ? 'white' : mutable ? '#40916c' : '#081c15',
        },
        notes: {
            fontSize: 12,
            marginHorizontal: 3,
            marginVertical: 0,
        },
        notesHighlight: {
            color: 'green',
        },
        notesRow: {
            flex: 1,
            flexDirection: 'row',
        }
    });

    function pressed() {
        dispatch({ type: 'focus/focusChanged', payload: { id: cellId, column, seat, value } })
    }
    let grid = [React.createElement(View, { key: -1 })]
    for (let i = 0; i < 3; i++) {
        let row = []
        for (let j = 0; j < 3; j++){
            let noteId = i * 3 + j
            row.push(<Text style={[styles.notes, { color: (highlight == (noteId + 1)) ? 'white' : focused ? 'white' : 'black'},notes[noteId] ? { opacity: 1 } : { opacity: 0 }]} key={noteId}>{noteId + 1}</Text>)
        }
        grid.push(
            React.createElement(View, { style: [styles.notesRow], key: i }, row)
        )
    }


    return (
        <Pressable style={[styles.button, style]} onPressIn={() => pressed()}>
            {(value == 0) ?
                grid
                :
                <Text style={styles.text}>{value}</Text>
            }
        </Pressable>
    );
})

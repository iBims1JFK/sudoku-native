import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Cell from './Cell.js'
import { useDispatch } from 'react-redux'
import puzzle from './puzzles/diff.json'

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    cell: {
        margin: 0.5,
    },
    gridHorizontal: {
        marginRight: 2,
    },
    gridVertical: {
        marginBottom: 2,
    },
});

export default function SudokuGrid() {
    let dispatch = useDispatch()
    dispatch({ type: 'cell/loadCell', payload: puzzle[0] })
    
    let grid = [React.createElement(View, { key: -1 })]
    for (let i = 0; i < 9; i++) {
        let smallGrid = []
        for (let j = 0; j < 3; j++) {
            let row = []
            for (let k = 0; k < 3; k++) {
                let id = i * 9 + j * 3 + k
                let cellStyle = [styles.cell]
                if ((id - 2) % 9 == 0 || (id - 5) % 9 == 0) cellStyle.push(styles.gridHorizontal)
                if (17 < id && id < 27 || 44 < id && id < 54) cellStyle.push(styles.gridVertical)
                row.push(<Cell key={id} cellId={id} style={cellStyle} />)
            }
            smallGrid.push(
                React.createElement(View, { style: [styles.row, styles.emptyStyle], key:j }, row)
            )
        }
        grid.push(
            React.createElement(View, { style: { flexDirection: 'row' }, key: i }, smallGrid)
        )
    }


    return (
        <View style={{ padding: 2, backgroundColor: 'black' }}>
            {grid}
        </View>
    );
}
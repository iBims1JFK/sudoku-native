import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import Cell from './Cell.js'
import { useDispatch } from 'react-redux'
import {retrieveProgress} from './progress'
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
    let firstTime = useRef(true)
    useEffect(() => {
        if(firstTime.current){
            const fetchProgress = async () => {
                console.log("hello")
                let progress = await retrieveProgress()
                // dispatch({ type: 'game/retrieveProgress', payload: progress })
            }
            fetchProgress()
            firstTime.current = false
        }

    }, [])

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
                React.createElement(View, { style: [styles.row, styles.emptyStyle], key: j }, row)
            )
        }
        grid.push(
            React.createElement(View, { style: { flexDirection: 'row' }, key: i }, smallGrid)
        )
    }

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        if(!firstTime.current){
            const subscription = AppState.addEventListener("change", nextAppState => {
                // if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                //     console.log("App has come to the foreground!");
                // }
                if (nextAppState === "background") {
                    // console.log("App is going into background!");
                    dispatch({ type: 'game/saveProgress' })
                }
                // console.log(nextAppState)
                appState.current = nextAppState;
                setAppStateVisible(appState.current);
                console.log("AppState", appState.current);
            });
    
            return () => {
                subscription.remove();
            };
        }
    }, []);


    return (
        <View style={{ padding: 2, backgroundColor: 'black' }}>
            {grid}
        </View>
    );
}
import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Number from './Number.js'
import Button from './Button.js'
import { useDispatch, useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    
});
export default function NumberGrid() {
    let dispatch = useDispatch()
    let solved = useSelector(state => state.unsolved) === 0
    let difficulty = useSelector(state => state.difficulty)
    let difficultyMap = ['very easy', 'easy', 'medium', 'hard', 'extrem']
    let grid = [React.createElement(View, { key: -1 })]
    for (let i = 0; i < 9; i++) {
        grid.push(<Number key={i} numberId={i + 1} />)
    }
    return (
        <View>
            {solved ?
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Pressable onPress={() => dispatch({type: 'difficulty/decrement'})}>
                            <Ionicons name="chevron-back-sharp" size={25} color="black"/>
                        </Pressable>
                        <Text style={{ fontSize: 25, marginHorizontal: 10, width: 150, textAlign: 'center' }}>{difficultyMap[difficulty]}</Text>
                        <Pressable onPress={() => dispatch({ type: 'difficulty/increment' })}>
                            <Ionicons name="chevron-forward-sharp" size={25} color="black" />
                        </Pressable>
                    </View>
                    <Pressable onPress={() => dispatch({ type: 'cell/loadCell'})}>
                        <Text style={{ fontSize: 30 }}>New Game</Text>
                    </Pressable>
                </View>
                    :
                <View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Button title="Hinweis" icon="lightbulb-outline" type="hinweis" />
                        <Button title="löschen" icon="eraser" type="löschen" />
                        <Button title="Bleistift" icon="pencil" toggleable={true} type="bleistift" />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {grid}
                    </View>
                </View>}
            
        </View>
    );
}
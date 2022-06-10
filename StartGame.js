import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Number from './Number.js'
import Button from './Button.js'

const styles = StyleSheet.create({
    
});
export default function NumberGrid() {

    let grid = [React.createElement(View, { key: -1 })]
    for (let i = 0; i < 9; i++) {
        grid.push(<Number key={i} numberId={i + 1} />)
    }
    return (
        <View>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Button title="Hinweis" icon="lightbulb-outline" type="hinweis" />
                <Button title="löschen" icon="eraser" type="löschen"/>
                <Button title="Bleistift" icon="pencil" toggleable={true} type="bleistift" />
            </View>
            <View style={{ flexDirection: 'row' }}>
                {grid}
            </View>
        </View>
    );
}
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux'

export default function GameBar() {
    let dispatch = useDispatch()
    let mistakes = useSelector(state => state.mistakes)
    let difficulty = useSelector(state => state.difficulty)
    let difficultyMap = useSelector(state => state.difficultyMap)
    let time = useSelector(state => state.time)
    let continueTime = useSelector(state => state.continueTime)
    const [displayTime, setDisplayTime] = useState({
        minutes: "00",
        seconds: "00"
    })


    useEffect(() => {
        const interval = setInterval(() => {
            if (continueTime) {
                dispatch({ type: 'time/save', payload: time + 1 })
            }
            let seconds = Math.floor(time % 60)
            let minutes = Math.floor(time / 60)

            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            setDisplayTime({
                minutes,
                seconds
            })
        }, 1000)

        return () => clearInterval(interval);
    }, [time])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', justifyContent: "space-between", marginHorizontal: 30, marginTop: 20 }}>
                <Ionicons name={!continueTime? "play" : "pause" } size={24} color="black" />
                <Ionicons name="reload" size={24} color="black" />
                <Ionicons name="settings-outline" size={24} color="black" />
            </View>
            <View style={{ flex: 4, justifyContent: 'flex-end', marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{difficultyMap[difficulty]}</Text>
                    <Text>{`${displayTime.minutes} : ${displayTime.seconds}`}</Text>
                    <Text>{mistakes} Mistakes</Text>
                </View>
            </View>
        </View>
    );
}
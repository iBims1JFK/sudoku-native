import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux'

export default function GameBar() {
    let dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false);
    const [resetModalVisible, setResetModalVisible] = useState(false);
    let abort = useSelector(state => state.abort)
    let solved = useSelector(state => state.unsolved) === 0
    let mistakes = useSelector(state => state.mistakes)
    let difficulty = useSelector(state => state.difficulty)
    let difficultyMap = useSelector(state => state.difficultyMap)
    let time = useSelector(state => state.time)
    let continueTime = useSelector(state => state.continueTime)
    const [displayTime, setDisplayTime] = useState({
        minutes: "00",
        seconds: "00"
    })
    const { height } = useWindowDimensions()

    useEffect(() => {
        const interval = setInterval(() => {
            if (continueTime) {
                dispatch({ type: 'time/save', payload: time + 1 })
            }
            let seconds = Math.floor(time % 60)
            let minutes = Math.floor(time / 60)

            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            if (continueTime) {
                setDisplayTime({
                    minutes,
                    seconds
                })
            }
        }, 1000)
        return () => clearInterval(interval);
    }, [time, continueTime])

    const togglePause = () => {
        if (solved || abort) {
            return
        }
        if (continueTime) {
            dispatch({ type: 'time/end' })
            setModalVisible(true)
        } else {
            dispatch({ type: 'time/start' })
            setModalVisible(false)
        }
    }

    const toggleAbort = () => {
        if (solved || abort) {
            return
        }
        setResetModalVisible(!resetModalVisible)
    }

    const abortGame = () => {
        dispatch({ type: 'game/abort' })
        setResetModalVisible(!resetModalVisible)
    }
    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: height / 2 - 100,
                    height: height * 0.2,
                    margin: 10
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: 300,
                        height: 200,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: 'black'
                    }}>
                        <Text
                            style={{ fontSize: 25, fontWeight: 'bold', paddingBottom: 5 }}
                        >Pause</Text>
                        <Pressable
                            onPress={togglePause}
                        >
                            <Text>Continue</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={resetModalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setResetModalVisible(!resetModalVisible);
                }}
            >
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: height / 2 - 100,
                    height: height * 0.2,
                    margin: 10
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: 300,
                        height: 200,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderColor: 'black'
                    }}>
                        <Text
                            style={{ fontSize: 25, fontWeight: 'bold', paddingBottom: 10 }}
                        >Are you sure?</Text>
                        <Pressable
                            onPress={abortGame}
                        >

                            <Text style={{ paddingBottom: 10 }}>Reset Game</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setResetModalVisible(!resetModalVisible)}
                        >
                            <Text>Back</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', justifyContent: "space-between", marginHorizontal: 30, marginTop: 20 }}>
                <Ionicons name={!continueTime ? "play" : "pause"} size={24} color="black" onPress={togglePause} />
                <Ionicons name="reload" size={24} color="black" onPress={toggleAbort} />
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
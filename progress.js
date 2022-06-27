import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeProgress = async (value) => {
    console.log("storing progress")
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@progress', jsonValue)
    } catch (e) {
        console.log("saving failed")
        // saving error
    }

}

export const retrieveProgress = async () => {
    console.log("retrieving progress")
    try {
        const jsonValue = await AsyncStorage.getItem('@progress')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log("retrieving failed")
        // error reading value
    }
}
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux'

export default function GameBar() {
    let mistakes = useSelector(state => state.mistakes)

    return (
            <View style={{ flex: 1}}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 30, marginTop: 20}}>
                    <Ionicons name="reload" size={24} color="black" />
                    <Ionicons name="settings-outline" size={24} color="black" /> 
                </View>
                <View style={{ flex: 4, justifyContent: 'flex-end', marginHorizontal: 15}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>einfach</Text>
                        <Text>00:00</Text>
                    <Text>{mistakes} Fehler</Text>
                    </View>
                </View>
            </View>
    );
}
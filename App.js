import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import NumberGrid from './NumberGrid.js';
import SudokuGrid from './SudokuGrid.js'
import GameBar from './GameBar.js'
import store from './redux/store.js'
import { Provider } from 'react-redux'



export default function App() {

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <GameBar />
        <View style={{ flex: 3, justifyContent: 'flex-start', alignSelf: 'center', }}>
          <SudokuGrid />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <NumberGrid />
        </View>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: '10em',
    color: 'white'
  }
});

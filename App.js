// CineVerse — Root Application Component
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {Colors} from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background}
        translucent={false}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

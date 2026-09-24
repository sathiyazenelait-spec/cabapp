import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#38bdf8',
    secondary: '#10b981',
    background: '#070b13',
    surface: '#111827',
  },
};

const linking = {
  prefixes: ['safepassage-driver://', 'http://driver.safepassage.com'],
  config: {
    screens: {
      DriverSection: 'checklist',
      RouteMapSection: 'map',
      ProfileSection: 'profile',
      CabOwnerSection: 'owner',
    }
  }
};

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer linking={linking}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme, configureFonts } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { Platform } from 'react-native';
import { store } from './src/store/store';
import { AppNavigator } from './src/navigation/AppNavigator';

const customFonts = {
  displayLarge: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  displayMedium: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  displaySmall: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  headlineLarge: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  headlineMedium: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  headlineSmall: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  titleLarge: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }), fontWeight: 'bold' as const },
  titleMedium: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }), fontWeight: 'bold' as const },
  titleSmall: { fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) },
  bodyLarge: { fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) },
  bodyMedium: { fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) },
  bodySmall: { fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) },
  labelLarge: { fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }), fontWeight: 'bold' as const },
  labelMedium: { fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) },
  labelSmall: { fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) },
};

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#38bdf8',
    secondary: '#10b981',
    background: '#070b13',
    surface: '#111827',
  },
  fonts: configureFonts({ config: customFonts }),
};

const linking: LinkingOptions<any> = {
  prefixes: ['safepassage-parent://', 'http://parent.safepassage.com'],
  config: {
    screens: {
      ParentSection: {
        screens: {
          ParentHome: 'home',
          SelectPlan: 'plan/:driverId/:childId',
          LiveTrack: 'track',
          Passport: 'passport',
        }
      }
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

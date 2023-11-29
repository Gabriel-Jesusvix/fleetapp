import 'react-native-get-random-values'
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import './src/libs/dayjs';
import { ThemeProvider } from 'styled-components';
import { SignIn } from './src/screens/SignIn';
import theme from './src/theme'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Loading } from './src/components/Loading';
import { StatusBar } from 'react-native';
import { AppProvider, UserProvider } from "@realm/react";
import { REALM_APP_ID } from '@env'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/routes';
import { RealmProvider, syncConfig } from './src/libs/realm';
import { TopMessage } from './src/components/TopMessage';
import { WifiSlash } from 'phosphor-react-native';

export default function App() {

  const [fontsloaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  const netInfo = useNetInfo();

  if (!fontsloaded) {
    return (
      <Loading />
    )
  }

  return (
    <AppProvider
      id={REALM_APP_ID}
    >
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
        {
            !netInfo.isConnected &&
            <TopMessage 
              title='Você está off-line'
              icon={WifiSlash}
            />
          }
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <UserProvider
            fallback={SignIn}
          >
            <RealmProvider  sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>

      </ThemeProvider>
    </AppProvider>
  );
}



import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';

import SplashScreen from './src/pages/Splash';
import RegisterScreen from './src/pages/Register';
import LoginScreen from './src/pages/Login';
import DashboardScreen from './src/pages/Dashboard';
import KonsultasiScreen from './src/pages/Konsultasi';
import KuesionerScreen from './src/pages/Kuesioner';
import ProcessingScreen from './src/pages/Processing';
import HasilScreen from './src/pages/Hasil';
import PlaceholderScreen from './src/pages/Placeholder';
import RiwayatScreen from './src/pages/Riwayat';
import ChatScreen from './src/pages/Chat';
import Profile from './src/pages/Profile';
import Notifikasi from './src/pages/Notifikasi';
import EditProfil from './src/pages/EditProfil';
import PengaturanAkun from './src/pages/PengaturanAkun';
import UbahPassword from './src/pages/UbahPassword';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Beranda" component={DashboardScreen} />
          <Stack.Screen name="Konsultasi" component={KonsultasiScreen} />
          <Stack.Screen name="Kuesioner" component={KuesionerScreen} />
          <Stack.Screen name="Processing" component={ProcessingScreen} />
          <Stack.Screen name="Hasil" component={HasilScreen} />
          <Stack.Screen name="Riwayat" component={RiwayatScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profil" component={Profile} />
          <Stack.Screen name="Notifikasi" component={Notifikasi} />
          <Stack.Screen name="EditProfil" component={EditProfil} />
          <Stack.Screen name="PengaturanAkun" component={PengaturanAkun} />
          <Stack.Screen name="UbahPassword" component={UbahPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

registerRootComponent(App);
export default App;

import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Komponen StatusBar kustom yang menangani safe area padding atas
 * dan warna status bar (dark/light).
 *
 * Penggunaan:
 *   <StatusBar />          → status bar dark (default)
 *   <StatusBar dark />     → status bar dark
 *   <StatusBar light />    → status bar light (teks putih)
 */
export default function StatusBar({ dark, light }) {
  const insets = useSafeAreaInsets();
  const style = light ? 'light' : 'dark';

  return (
    <View style={{ paddingTop: insets.top }}>
      <ExpoStatusBar style={style} />
    </View>
  );
}

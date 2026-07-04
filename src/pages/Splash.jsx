import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export default function Splash() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top green section */}
      <View style={styles.topSection}>
        <SafeAreaView style={styles.topContent}>
          <Text style={styles.title}>ScholarSense</Text>
          <Text style={styles.subtitle}>Konsultasi Perilaku Akademik Online</Text>

          <View style={styles.dots}>
            <View style={styles.dotSmall} />
            <View style={styles.dotSmall} />
            <View style={styles.dotWide} />
          </View>
        </SafeAreaView>
      </View>

      {/* Bottom white section */}
      <View style={styles.bottomSection}>
        {/* Decorative SVG */}
        <View style={styles.decorSvg}>
          <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
            <Path
              d="M0 120C20 90 10 60 30 40C50 20 80 30 90 10"
              stroke="#1F7A40"
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.15}
            />
            <Circle cx={18} cy={100} r={10} fill="#2F8F52" opacity={0.5} />
            <Circle cx={40} cy={112} r={6} fill="#1F7A40" opacity={0.4} />
          </Svg>
        </View>

        <Text style={styles.heading}>
          Mulai Perjalanan{'\n'}Akademik yang lebih baik{'\n'}bersama{' '}
          <Text style={styles.headingGreen}>ScholarSense</Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Mulai Sekarang</Text>
          <View style={styles.buttonIcon}>
            <ArrowRight size={14} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#155c33',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#cfe9d6',
    fontSize: 14,
    marginTop: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotWide: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  decorSvg: {
    position: 'absolute',
    bottom: -8,
    left: -8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 26,
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
  },
  headingGreen: {
    color: '#176236',
  },
  button: {
    backgroundColor: '#1f7a40',
    borderRadius: 9999,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    zIndex: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

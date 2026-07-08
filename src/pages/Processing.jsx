import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle2, LayoutGrid, BarChart2, Database } from 'lucide-react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import BottomNav from '../components/BottomNav';

const STEPS = [
  { icon: CheckCircle2, label: 'Mengumpulkan data kriteria...' },
  { icon: LayoutGrid, label: 'Mencocokkan fakta dengan aturan pakar...' },
  { icon: BarChart2, label: 'Menghitung persentase peluang profil...' },
];

export default function Processing() {
  const navigation = useNavigation();
  const route = useRoute();
  const [step, setStep] = useState(0);
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!route.params?.apiResult) {
      navigation.navigate('Konsultasi');
      return;
    }

    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => setStep(3), 2300);
    const t4 = setTimeout(() => {
      // Data already comes from API, pass apiResult + answers forward
      navigation.navigate('Hasil', {
        apiResult: route.params.apiResult,
        answers: route.params.answers,
      });
    }, 3000);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ScholarSense</Text>
          <TouchableOpacity style={styles.menuBtn}>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Spinner */}
        <View style={styles.spinnerWrap}>
          {/* Outer glow */}
          <View style={styles.spinnerGlow} />

          {/* Spinning arc */}
          <Animated.View style={[styles.spinnerSvgWrap, { transform: [{ rotate: spin }] }]}>
            <Svg width={192} height={192} viewBox="0 0 192 192">
              <SvgCircle
                cx="96" cy="96" r="82"
                fill="none"
                stroke="#0d9488"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="160 360"
              />
              <SvgCircle cx="96" cy="14" r="5" fill="#0d9488" />
            </Svg>
          </Animated.View>

          {/* Inner circle */}
          <View style={styles.spinnerInner}>
            <Database size={52} color="#0f766e" strokeWidth={1.5} />
          </View>

          {/* Bottom dot */}
          <View style={styles.spinnerDot} />
        </View>

        <Text style={styles.title}>Menganalisis Data...</Text>

        {/* Steps card */}
        <View style={styles.stepsCard}>
          {STEPS.map(({ icon: Icon, label }, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <View key={i} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepIcon,
                    done && styles.stepIconDone,
                    active && styles.stepIconActive,
                    !done && !active && styles.stepIconPending,
                  ]}
                >
                  <Icon
                    size={15}
                    strokeWidth={2}
                    color={done ? '#0d9488' : active ? '#5eead4' : '#9ca3af'}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    done && styles.stepLabelDone,
                    active && styles.stepLabelActive,
                    !done && !active && styles.stepLabelPending,
                  ]}
                >
                  {label}
                </Text>
              </View>
            );
          })}

          {/* Loading bar */}
          <View style={styles.loadingBarWrap}>
            <View style={[styles.loadingBar, { width: `${(step / STEPS.length) * 100}%` }]} />
          </View>
        </View>

        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>INFERENCE ENGINE ACTIVE</Text>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  safeArea: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: '800',
    color: '#111827',
    fontSize: 18,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  menuDots: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
    lineHeight: 20,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  spinnerWrap: {
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  spinnerGlow: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#cffafe',
    opacity: 0.6,
  },
  spinnerSvgWrap: {
    position: 'absolute',
    width: 192,
    height: 192,
  },
  spinnerInner: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f3d22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    zIndex: 10,
  },
  spinnerDot: {
    position: 'absolute',
    bottom: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#14b8a6',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  stepsCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconDone: {
    backgroundColor: '#ccfbf1',
  },
  stepIconActive: {
    backgroundColor: '#f0fdfa',
  },
  stepIconPending: {
    backgroundColor: '#f3f4f6',
  },
  stepLabel: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  stepLabelDone: {
    color: '#6b7280',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#374151',
    fontWeight: '600',
  },
  stepLabelPending: {
    color: '#9ca3af',
  },
  loadingBarWrap: {
    paddingTop: 4,
  },
  loadingBar: {
    height: 4,
    backgroundColor: '#2dd4bf',
    borderRadius: 9999,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 32,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#14b8a6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#0f766e',
    textTransform: 'uppercase',
  },
});
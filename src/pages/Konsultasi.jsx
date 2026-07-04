import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, HelpCircle, Clock, Play } from 'lucide-react-native';
import BottomNav from '../components/BottomNav';
import StudentIllustration from '../assets/StudentIllustration';

export default function Konsultasi() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Beranda')}>
          <ArrowLeft size={20} color="#155c33" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konsultasi</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.illustrationWrap}>
          <StudentIllustration size={210} />
        </View>

        <Text style={styles.appName}>ScholarSense</Text>
        <Text style={styles.tagline}>Pahami Potensimu</Text>
        <Text style={styles.desc}>
          Langkah awal untuk pertumbuhan akademik yang bermakna dimulai dari kejujuran pada diri sendiri
        </Text>

        {/* Info cards row */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <HelpCircle size={18} color="#176236" />
            </View>
            <Text style={styles.infoText}>15 Pertanyaan</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Clock size={18} color="#176236" />
            </View>
            <Text style={styles.infoText}>3 Menit</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Kuesioner')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>Mulai Evaluasi</Text>
          <Play size={14} color="#fff" fill="#fff" />
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Jawablah setiap pertanyaan sejujur mungkin. Hasil evaluasi akan diproses menggunakan mesin
          inferensi Forward Chaining.
        </Text>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#155c33',
    fontSize: 16,
  },
  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  illustrationWrap: {
    marginTop: 24,
  },
  appName: {
    fontWeight: '800',
    color: '#111827',
    fontSize: 20,
    marginTop: 8,
  },
  tagline: {
    color: '#176236',
    fontWeight: '600',
    marginTop: 24,
    fontSize: 16,
  },
  desc: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 28,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eaf5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  ctaBtn: {
    backgroundColor: '#1f7a40',
    borderRadius: 9999,
    paddingVertical: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },
  ctaBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerNote: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 16,
    lineHeight: 18,
    textAlign: 'center',
  },
});

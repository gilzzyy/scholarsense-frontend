import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, CheckCircle2, Bot } from 'lucide-react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import BottomNav from '../components/BottomNav';

function skorLabel(skor) {
  if (skor >= 85) return 'SANGAT BAIK';
  if (skor >= 70) return 'BAIK';
  if (skor >= 55) return 'CUKUP';
  return 'PERLU PERHATIAN';
}

function skorWarna(skor) {
  if (skor >= 70) return '#176236';
  if (skor >= 55) return '#f59e0b';
  return '#ef4444';
}

export default function Hasil() {
  const navigation = useNavigation();
  const route = useRoute();

  // Mendukung dua sumber data:
  // 1. apiResult dari halaman Processing (konsultasi baru)
  // 2. apiResult dari halaman Riwayat (history detail)
  const apiResult = route.params?.apiResult;

  if (!apiResult?.final_profile) {
    navigation.navigate('Konsultasi');
    return null;
  }

  const { final_profile, scores, consultation_id } = apiResult;

  // Hitung skor perilaku dari jawaban aktual (% jawaban "Ya")
  // Ini lebih representatif daripada persentase_utama dari API
  // yang merupakan confidence kecocokan profil
  const answers = route.params?.answers;
  const jawaban_raw = apiResult?.jawaban_raw;

  let skor;
  if (answers && answers.length > 0) {
    // Dari konsultasi baru (Kuesioner → Processing → Hasil)
    const yaCount = answers.filter((a) => a.answer === true).length;
    skor = Math.round((yaCount / answers.length) * 100);
  } else if (jawaban_raw) {
    // Dari riwayat (history detail) — jawaban_raw: { "1": true, "2": false, ... }
    const vals = Object.values(jawaban_raw);
    const yaCount = vals.filter(Boolean).length;
    skor = vals.length > 0 ? Math.round((yaCount / vals.length) * 100) : 0;
  } else {
    // Fallback jika tidak ada data jawaban
    skor = Math.round(final_profile.persentase_utama);
  }

  const warna = skorWarna(skor);

  // Parse rekomendasi_tindakan menjadi array tips
  const rekomendasiText = final_profile.rekomendasi_tindakan || '';
  const tips = rekomendasiText
    .split(/[.!]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10)
    .slice(0, 4); // Max 4 tips

  // Profil lain yang terdeteksi (is_match === true, selain profil utama)
  const otherProfiles = (scores || [])
    .filter((s) => s.is_match && s.kode_profil !== final_profile.kode_profil)
    .sort((a, b) => a.peringkat - b.peringkat);

  // SVG ring
  const R = 72;
  const keliling = 2 * Math.PI * R;
  const dashOffset = keliling * (1 - skor / 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Konsultasi')}>
          <ArrowLeft size={20} color="#155c33" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasil Analisis</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Score ring */}
        <View style={styles.ringWrap}>
          <Svg width={176} height={176} viewBox="0 0 176 176">
            <SvgCircle cx="88" cy="88" r={R} fill="none" stroke="#e5e7eb" strokeWidth="14" />
            <SvgCircle
              cx="88" cy="88" r={R}
              fill="none"
              stroke={warna}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${keliling}`}
              strokeDashoffset={`${dashOffset}`}
              rotation="-90"
              origin="88, 88"
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.ringScore, { color: warna }]}>{skor}%</Text>
            <Text style={styles.ringLabel}>{skorLabel(skor)}</Text>
          </View>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <Text style={styles.profileName}>
            {final_profile.kode_profil} – {final_profile.nama_profil}
          </Text>
          <Text style={styles.profileDesc}>{final_profile.deskripsi}</Text>
          {final_profile.tingkat_urgensi ? (
            <View style={[styles.urgensiBadge, { backgroundColor: warna + '18' }]}>
              <Text style={[styles.urgensiText, { color: warna }]}>{final_profile.tingkat_urgensi}</Text>
            </View>
          ) : null}
        </View>

        {/* Recommendations */}
        <View style={styles.recomCard}>
          <View style={styles.recomHeader}>
            <View style={styles.recomIconWrap}>
              <Bot size={17} color="#176236" />
            </View>
            <Text style={styles.recomTitle}>Rekomendasi Tindakan</Text>
          </View>

          {tips.length > 0 ? (
            <View style={styles.recomList}>
              {tips.map((tip, i) => (
                <View key={i} style={styles.recomItem}>
                  <CheckCircle2 size={18} color={warna} style={styles.recomCheckIcon} />
                  <Text style={styles.recomText}>{tip}.</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.recomText}>{rekomendasiText}</Text>
          )}
        </View>

        {/* Additional profiles */}
        {otherProfiles.length > 0 && (
          <View style={styles.otherProfiles}>
            <Text style={styles.otherTitle}>Profil Lain yang Terdeteksi</Text>
            <View style={styles.otherBadges}>
              {otherProfiles.map((p) => (
                <View key={p.kode_profil} style={styles.otherBadge}>
                  <Text style={styles.otherBadgeText}>
                    {p.kode_profil} · {p.nama_profil} ({Math.round(p.persentase)}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* CTA bottom */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Chat', {
            consultation_id: consultation_id,
          })}
          activeOpacity={0.85}
        >
          <View style={styles.ctaTextWrap}>
            <Text style={styles.ctaTitle}>Mulai Konsultasi Interaktif</Text>
            <Text style={styles.ctaSub}>bersama Jhoko AI</Text>
          </View>
          <View style={styles.ctaIconWrap}>
            <Bot size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

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
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 20,
    width: 176,
    height: 176,
    alignSelf: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScore: {
    fontSize: 30,
    fontWeight: '800',
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#6b7280',
    marginTop: 2,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  profileDesc: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  urgensiBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  urgensiText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recomCard: {
    borderWidth: 1,
    borderColor: '#cfe9d6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  recomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  recomIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eaf5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recomTitle: {
    fontWeight: '700',
    color: '#155c33',
    fontSize: 16,
  },
  recomList: {
    gap: 12,
  },
  recomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recomCheckIcon: {
    marginTop: 2,
  },
  recomText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  otherProfiles: {
    marginBottom: 20,
  },
  otherTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  otherBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  otherBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  otherBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  ctaWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  ctaBtn: {
    backgroundColor: '#1f7a40',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaTextWrap: {},
  ctaTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  ctaSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  ctaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
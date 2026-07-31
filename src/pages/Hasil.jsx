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

  // Fallback data jika dibuka dari Riwayat karena database history tidak menyertakan deskripsi & rekomendasi secara lengkap
  const FALLBACK_DESKRIPSI = {
    P0: "Mahasiswa yang secara umum menunjukkan perilaku akademis rata-rata, memiliki beberapa area positif namun masih memerlukan pengembangan konsistensi.",
    P1: "Mahasiswa yang menunjukkan tingkat kedisiplinan yang sangat baik dalam kehadiran kelas, ketepatan waktu, dan pemenuhan aturan perkuliahan.",
    P2: "Mahasiswa yang menunjukkan integritas akademik yang tinggi, selalu mengerjakan tugas dan ujian secara jujur tanpa indikasi kecurangan.",
    P3: "Mahasiswa yang menunjukkan sikap komunikatif, kooperatif, serta berperan aktif dan positif dalam diskusi maupun kerja kelompok.",
    P4: "Mahasiswa yang mandiri dalam proses belajar serta aktif berpartisipasi dalam organisasi, kegiatan kemahasiswaan, atau sosial.",
    P5: "Mahasiswa yang menunjukkan kecenderungan kurang disiplin dalam pemenuhan kewajiban akademis dan memerlukan pengawasan lebih lanjut.",
    P6: "Mahasiswa yang menunjukkan indikasi ketidakjujuran akademik atau pelanggaran tata tertib kampus.",
    P7: "Mahasiswa yang menghadapi kendala belajar signifikan atau memerlukan bantuan bimbingan khusus untuk memulihkan performa akademisnya.",
    P8: "Mahasiswa berkarakter unggul yang menunjukkan kombinasi luar biasa antara performa akademik tinggi, kedisiplinan, integritas, dan keaktifan positif."
  };

  const FALLBACK_REKOMENDASI = {
    P0: "Pertahankan hal-hal positif yang sudah Anda lakukan. Cobalah untuk lebih konsisten dalam disiplin kehadiran, pengumpulan tugas, serta komunikasi dengan dosen. Buatlah target harian atau meningguan sederhana untuk meningkatkan performa akademik Anda secara bertahap.",
    P1: "Pertahankan konsistensi kehadiran dan ketepatan waktu Anda. Teruskan kebiasaan baik ini untuk menjadi teladan bagi rekan mahasiswa lainnya. Manfaatkan manajemen waktu Anda yang sangat baik untuk mempersiapkan diri menghadapi tantangan akademik berikutnya.",
    P2: "Jaga dan pertahankan integritas akademik Anda yang sangat baik. Sikap jujur dalam pengerjaan tugas dan ujian adalah pondasi utama kesuksesan jangka panjang. Menjadi asisten dosen atau tutor sebaya adalah pilihan baik untuk mengasah kepemimpinan Anda.",
    P3: "Teruskan komunikasi yang baik dan kooperatif dengan dosen maupun sesama mahasiswa. Keaktifan dan keramahan Anda dalam kerja kelompok merupakan kontribusi yang sangat berharga. Cobalah memimpin inisiatif kelompok diskusi di masa mendatang.",
    P4: "Keseimbangan antara kemandirian belajar dan keaktifan berorganisasi Anda sudah sangat baik. Teruskan semangat berkegiatan dengan tetap menjaga fokus akademik utama. Rencanakan skala prioritas mingguan agar performa tetap seimbang.",
    P5: "Lakukan perbaikan dalam kedisiplinan belajar dan ketepatan waktu. Cobalah membuat jadwal belajar yang lebih teratur dan hindari menunda-nunda tugas. Berkonsultasilah dengan dosen pembimbing atau teman dekat untuk membantu menjaga fokus Anda.",
    P6: "Lakukan evaluasi terhadap perilaku yang bertentangan dengan aturan akademik. Pahami kembali kode etik dan tata tertib kampus agar pelanggaran tidak terulang. Berkonsultasilah dengan dosen wali atau pihak terkait untuk menyusun langkah perbaikan dan membangun kembali integritas akademik.",
    P7: "Segera komunikasikan kendala belajar Anda kepada dosen pengampu atau dosen pembimbing akademik. Mintalah pendampingan ekstra berupa bimbingan belajar tambahan atau bimbingan dari senior untuk memulihkan pemahaman akademis Anda.",
    P8: "Selamat atas konsistensi karakter unggul yang Anda tunjukkan di berbagai bidang. Pertahankan motivasi belajar tinggi ini dan beranikan diri untuk mengikuti kompetisi mahasiswa berprestasi, program riset, atau pengajuan beasiswa nasional."
  };

  const matchedScore = (scores || []).find((s) => s.kode_profil === final_profile.kode_profil);
  const tingkatUrgensi = final_profile.tingkat_urgensi || matchedScore?.tingkat_urgensi || '';
  const deskripsiText = final_profile.deskripsi || FALLBACK_DESKRIPSI[final_profile.kode_profil] || '';
  const rekomendasiText = final_profile.rekomendasi_tindakan || FALLBACK_REKOMENDASI[final_profile.kode_profil] || '';

  const warna = skorWarna(skor);

  // Parse rekomendasi_tindakan menjadi array tips
  const tips = rekomendasiText
    .split(/[.!]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10)
    .slice(0, 4); // Max 4 tips

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
          <Text style={styles.profileDesc}>{deskripsiText}</Text>
          {tingkatUrgensi ? (
            <View style={[styles.urgensiBadge, { backgroundColor: warna + '18' }]}>
              <Text style={[styles.urgensiText, { color: warna }]}>{tingkatUrgensi}</Text>
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

        {/* 9 Profiles Percentage List */}
        <View style={styles.allProfilesCard}>
          <Text style={styles.allProfilesTitle}>
            Persentase Kecocokan 9 Profil Akademik
          </Text>
          <Text style={styles.allProfilesSub}>
            Peringkat kesesuaian berdasarkan inferensi Forward Chaining:
          </Text>

          <View style={styles.profilesList}>
            {(() => {
              // Priority list of all 9 profiles
              const rawScores = scores && scores.length > 0 ? scores : [];
              const sorted = [...rawScores].sort((a, b) => {
                if (a.peringkat && b.peringkat) return a.peringkat - b.peringkat;
                return (b.persentase || 0) - (a.persentase || 0);
              });

              return sorted.map((item, index) => {
                const pct = item.persentase !== undefined ? Math.round(item.persentase) : 0;
                const isTop = item.is_match || item.kode_profil === final_profile.kode_profil || index === 0;

                return (
                  <View
                    key={item.kode_profil || index}
                    style={[
                      styles.profileRowItem,
                      isTop && styles.profileRowItemTop,
                    ]}
                  >
                    <View style={styles.profileRowHeader}>
                      <View style={styles.profileRowLeft}>
                        <View style={[styles.rankBadge, isTop && styles.rankBadgeTop]}>
                          <Text style={[styles.rankText, isTop && styles.rankTextTop]}>
                            #{item.peringkat || index + 1}
                          </Text>
                        </View>
                        <Text style={[styles.profileCodeName, isTop && styles.profileCodeNameTop]}>
                          {item.kode_profil} – {item.nama_profil}
                        </Text>
                      </View>
                      <Text style={[styles.profilePctText, isTop && styles.profilePctTextTop]}>
                        {pct}%
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${Math.max(5, Math.min(100, pct))}%` },
                          isTop && styles.barFillTop,
                        ]}
                      />
                    </View>

                    {isTop && (
                      <View style={styles.topMatchTag}>
                        <Text style={styles.topMatchTagText}>★ Kecocokan Utama (100%)</Text>
                      </View>
                    )}
                  </View>
                );
              });
            })()}
          </View>
        </View>
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
    paddingBottom: 20,
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
  allProfilesCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginBottom: 24,
  },
  allProfilesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  allProfilesSub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 16,
  },
  profilesList: {
    gap: 12,
  },
  profileRowItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  profileRowItemTop: {
    borderColor: '#176236',
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
  },
  profileRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profileRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rankBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankBadgeTop: {
    backgroundColor: '#176236',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
  },
  rankTextTop: {
    color: '#fff',
  },
  profileCodeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  profileCodeNameTop: {
    fontWeight: '700',
    color: '#176236',
  },
  profilePctText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6b7280',
  },
  profilePctTextTop: {
    color: '#176236',
    fontSize: 15,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#9ca3af',
    borderRadius: 4,
  },
  barFillTop: {
    backgroundColor: '#176236',
  },
  topMatchTag: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  topMatchTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#155c33',
    letterSpacing: 0.5,
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
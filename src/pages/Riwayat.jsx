import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, ChevronRight, RefreshCw } from 'lucide-react-native';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { apiGetHistory, apiGetHistoryDetail, getRealProfileScore } from '../utils/api';

function formatTanggal(isoString) {
  const d = new Date(isoString);
  const namaBulan = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];
  return `${d.getDate()} ${namaBulan[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Riwayat() {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(null); // consultation_id being loaded
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score' (persentase tertinggi) | 'date' (terbaru)

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiGetHistory(token);
      const items = res.data.items || [];
      const { apiGetHistoryDetail, calculateAnswerScore } = require('../utils/api');

      // Fetch detail for each item to compute exact answer score (e.g. 87%)
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          try {
            const detailRes = await apiGetHistoryDetail(token, item.consultation_id);
            const detail = detailRes.data;
            const score = calculateAnswerScore(detail?.jawaban_raw);
            return {
              ...item,
              ...detail,
              calculated_score: score !== null ? score : item.persentase_utama,
            };
          } catch {
            return item;
          }
        })
      );
      setHistory(itemsWithDetails);
    } catch (err) {
      setError(err.message || 'Gagal memuat riwayat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  // Refetch when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (token) fetchHistory();
    });
    return unsubscribe;
  }, [navigation, token]);

  const handleItemPress = async (item) => {
    setLoadingDetail(item.consultation_id);
    try {
      const res = await apiGetHistoryDetail(token, item.consultation_id);
      const detail = res.data;
      navigation.navigate('Hasil', {
        apiResult: {
          consultation_id: detail.consultation_id,
          created_at: detail.created_at,
          final_profile: detail.final_profile,
          scores: detail.scores,
          jawaban_raw: detail.jawaban_raw,
        },
      });
    } catch (err) {
      setError(err.message || 'Gagal memuat detail.');
    } finally {
      setLoadingDetail(null);
    }
  };

  // Sort history by real behavior score (100% P8 -> 70% P4 -> 7% P7) so 100% is never buried!
  const sortedHistory = [...history].sort((a, b) => {
    const scoreA = getRealProfileScore(a);
    const scoreB = getRealProfileScore(b);

    if (sortBy === 'score') {
      if (scoreB !== scoreA) return scoreB - scoreA;
      // Secondary sort: date descending
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    } else {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Beranda')} style={styles.backBtn}>
          <ArrowLeft size={22} color="#155c33" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Konsultasi</Text>
      </View>

      {loading ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color="#176236" />
          <Text style={styles.loadingText}>Memuat riwayat...</Text>
        </View>
      ) : error && history.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchHistory}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {history.length > 0 ? (
            /* Populated State */
            <View style={styles.contentWrap}>
              {/* Green Header Card */}
              <View style={styles.greenCard}>
                <Text style={styles.cardLabel}>TOTAL SESI</Text>
                <Text style={styles.cardCount}>{history.length} Konsultasi</Text>
                <Text style={styles.cardSub}>
                  Perjalanan pertumbuhan akademismu tercatat di sini. Peringkat teratas menunjukkan skor hasil murni tertinggi.
                </Text>
              </View>

              {/* Sort Filter Bar */}
              <View style={styles.filterRow}>
                <Text style={styles.filterTitle}>URUTKAN BERDASARKAN:</Text>
                <View style={styles.filterTabs}>
                  <TouchableOpacity
                    onPress={() => setSortBy('score')}
                    style={[styles.filterTab, sortBy === 'score' && styles.filterTabActive]}
                  >
                    <Text style={[styles.filterTabText, sortBy === 'score' && styles.filterTabTextActive]}>
                      ★ Skor Tertinggi
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSortBy('date')}
                    style={[styles.filterTab, sortBy === 'date' && styles.filterTabActive]}
                  >
                    <Text style={[styles.filterTabText, sortBy === 'date' && styles.filterTabTextActive]}>
                      Terbaru
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* History List */}
              <View style={styles.list}>
                {sortedHistory.map((item, index) => {
                  const pct = getRealProfileScore(item);
                  const isTopScore = index === 0 && sortBy === 'score';
                  const isHigh = pct >= 70;
                  const isLow = pct < 40;

                  return (
                    <TouchableOpacity
                      key={item.consultation_id}
                      style={[
                        styles.listItem,
                        isTopScore && styles.listItemTopScore,
                        isLow && !isTopScore && { borderColor: '#fee2e2' },
                      ]}
                      onPress={() => handleItemPress(item)}
                      activeOpacity={0.8}
                      disabled={loadingDetail === item.consultation_id}
                    >
                      <View style={styles.listItemLeft}>
                        <View style={styles.itemBadgeRow}>
                          <Text style={styles.itemDate}>{formatTanggal(item.created_at)}</Text>
                          {isTopScore && (
                            <View style={styles.topScoreBadge}>
                              <Text style={styles.topScoreBadgeText}>★ PENCAPAIAN TERBAIK</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.itemName}>{item.nama_profil}</Text>
                        <Text style={styles.itemPct}>
                          {item.kode_profil} · {item.tingkat_urgensi || 'N/A'}
                        </Text>
                      </View>

                      {/* Percentage Badge */}
                      <View
                        style={[
                          styles.scoreBadgeWrap,
                          isTopScore && styles.scoreBadgeWrapTop,
                          isLow && !isTopScore && { backgroundColor: '#fef2f2' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scoreBadgeText,
                            isTopScore && styles.scoreBadgeTextTop,
                            isLow && !isTopScore && { color: '#ef4444' },
                          ]}
                        >
                          {pct}%
                        </Text>
                      </View>

                      {loadingDetail === item.consultation_id ? (
                        <ActivityIndicator size="small" color="#176236" style={{ marginLeft: 8 }} />
                      ) : (
                        <ChevronRight size={18} color="#9ca3af" style={{ marginLeft: 4 }} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            /* Empty State */
            <View style={styles.contentWrap}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardText}>
                  Belum ada riwayat konsultasi. Yuk, mulai evaluasi perilaku akademik Anda sekarang!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.navigate('Konsultasi')}
                activeOpacity={0.8}
              >
                <RefreshCw size={16} color="#fff" />
                <Text style={styles.startBtnText}>Mulai Konsultasi Sekarang</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#155c33',
    fontSize: 18,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#176236',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  contentWrap: {
    width: '100%',
  },
  greenCard: {
    backgroundColor: '#176236',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#0f3d22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cardCount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
  },
  cardSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  list: {
    gap: 12,
    marginTop: 16,
  },
  filterRow: {
    marginTop: 20,
    marginBottom: 4,
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterTabActive: {
    backgroundColor: '#176236',
    borderColor: '#176236',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  listItemTopScore: {
    borderColor: '#176236',
    borderWidth: 1.5,
    backgroundColor: '#f0fdf4',
  },
  listItemLeft: {
    gap: 4,
    flex: 1,
  },
  itemBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topScoreBadge: {
    backgroundColor: '#176236',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topScoreBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemDate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#176236',
  },
  itemPct: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  scoreBadgeWrap: {
    backgroundColor: '#eaf5ee',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
  },
  scoreBadgeWrapTop: {
    backgroundColor: '#176236',
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#176236',
  },
  scoreBadgeTextTop: {
    color: '#fff',
  },
  emptyCard: {
    backgroundColor: '#176236',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    minHeight: 140,
    justifyContent: 'center',
    shadowColor: '#0f3d22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyCardText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  startBtn: {
    backgroundColor: '#1f7a40',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

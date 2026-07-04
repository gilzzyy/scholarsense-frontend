import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, ChevronDown, ChevronRight, RefreshCw, Trash2 } from 'lucide-react-native';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function Riwayat() {
  const navigation = useNavigation();
  const { history, clearHistory } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Semua');

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

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {history.length > 0 ? (
          /* Populated State (Gambar 1) */
          <View style={styles.contentWrap}>
            {/* Green Header Card */}
            <View style={styles.greenCard}>
              <Text style={styles.cardLabel}>TOTAL SESI</Text>
              <Text style={styles.cardCount}>{history.length} Konsultasi</Text>
              <Text style={styles.cardSub}>
                Perjalanan pertumbuhan akademismu tercatat di sini.
              </Text>
            </View>

            {/* Filter and Utility Row */}
            <View style={styles.filterRow}>
              <View style={styles.filterLeft}>
                <TouchableOpacity
                  style={[styles.filterBtn, activeFilter === 'Semua' && styles.filterBtnActive]}
                  onPress={() => setActiveFilter('Semua')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, activeFilter === 'Semua' && styles.filterTextActive]}>
                    Semua
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.8}>
                  <Text style={styles.dropdownText}>Filter</Text>
                  <Calendar size={14} color="#111827" />
                  <ChevronDown size={14} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* Hapus Semua Helper Button to showcase empty state */}
              <TouchableOpacity onPress={clearHistory} style={styles.clearBtn} activeOpacity={0.7}>
                <Trash2 size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* History List */}
            <View style={styles.list}>
              {history.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItem}
                  onPress={() => {
                    // Navigate to results or similar page if we click it
                    navigation.navigate('Hasil', {
                      hasil: [{ kode: item.kode, nama: item.nama }],
                      jawaban: item.jawaban,
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.listItemLeft}>
                    <Text style={styles.itemDate}>{item.tanggal}</Text>
                    <Text style={styles.itemName}>{item.nama}</Text>
                  </View>
                  <ChevronRight size={18} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Empty State (Gambar 2) */
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#f3f4f6',
  },
  filterBtnActive: {
    backgroundColor: '#176236',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#fff',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: '#e5e7eb',
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  clearBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  list: {
    gap: 12,
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
  listItemLeft: {
    gap: 4,
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

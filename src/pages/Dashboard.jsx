import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Bell, Heart, MessageCircle, BarChart3, ChevronRight, LogOut } from 'lucide-react-native';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { apiGetDashboard } from '../utils/api';

const services = [
  {
    icon: Heart,
    title: 'Konsultasi Perilaku',
    desc: 'Evaluasi diri & tindakan nyata.',
    target: 'Konsultasi',
  },
  {
    icon: MessageCircle,
    title: 'Chat dengan Asisten AI',
    desc: 'Konsultasi langsung dengan AI.',
    target: 'Chat',
  },
];

export default function Dashboard() {
  const navigation = useNavigation();
  const { user, token, logout } = useAuth();
  const firstName = user?.nama_lengkap?.split(' ')[0] || 'Mahasiswa';

  const [dashData, setDashData] = useState(null);
  const [loadingDash, setLoadingDash] = useState(true);

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiGetDashboard(token);
      setDashData(res.data);
    } catch {
      // Silently fail – use fallback content
    } finally {
      setLoadingDash(false);
    }
  }, [token]);

  // Refresh dashboard setiap kali layar difokuskan (misal setelah selesai konsultasi)
  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  const motivTitle = dashData?.quote
    || 'Bangun Karakter Akademik Unggul, Mulai dari Evaluasi Diri hingga Sukses Masa Depan.';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Green header */}
        <View style={styles.greenHeader}>
          <SafeAreaView>
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{firstName[0]}</Text>
                </View>
                <Text style={styles.headerBrand}>ScholarSense</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.bellBtn}>
                  <Bell size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bellBtn} onPress={handleLogout}>
                  <LogOut size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.greeting}>
              {dashData?.welcome_message || `Halo, ${firstName}`}
            </Text>
            <Text style={styles.greetingSub}>Selamat Datang Di ScholarSense</Text>

            <View style={styles.motivCard}>
              {loadingDash ? (
                <ActivityIndicator color="#176236" />
              ) : (
                <>
                  <Text style={styles.motivTitle}>{motivTitle}</Text>
                  <Text style={styles.motivSub}>
                    Yuk, mulai konsultasi dan jadi versi terbaik dirimu bersama ScholarSense.
                  </Text>
                </>
              )}
            </View>

            {/* Last consultation badge */}
            {dashData?.last_consultation && (
              <TouchableOpacity
                style={styles.lastConsultCard}
                onPress={() =>
                  navigation.navigate('Riwayat')
                }
                activeOpacity={0.85}
              >
                <View style={styles.lastConsultLeft}>
                  <Text style={styles.lastConsultLabel}>KONSULTASI TERAKHIR</Text>
                  <Text style={styles.lastConsultName}>{dashData.last_consultation.nama_profil}</Text>
                </View>
                <View style={styles.lastConsultBadge}>
                  <Text style={styles.lastConsultPct}>{dashData.last_consultation.persentase_utama}%</Text>
                </View>
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </View>

        {/* Services card */}
        <View style={styles.servicesWrap}>
          <View style={styles.servicesCard}>
            <Text style={styles.servicesTitle}>Mulai Konsultasi</Text>
            <Text style={styles.servicesSub}>
              Terdapat layanan yang sesuai dengan kebutuhanmu.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesScroll}
            >
              {services.map(({ icon: Icon, title, desc, target }) => (
                <TouchableOpacity
                  key={title}
                  style={styles.serviceItem}
                  onPress={() => {
                    if (target === 'Chat') {
                      // Langsung ke Chat — jika ada konsultasi terakhir, kirim ID-nya
                      navigation.navigate('Chat', {
                        consultation_id: dashData?.last_consultation?.consultation_id || null,
                      });
                    } else {
                      navigation.navigate(target);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.serviceIcon}>
                    <Icon size={18} color="#176236" />
                  </View>
                  <Text style={styles.serviceItemTitle}>{title}</Text>
                  <Text style={styles.serviceItemDesc}>{desc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Konsultasi')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Mulai Konsultasi & Evaluasi Perilaku</Text>
            <ChevronRight size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  greenHeader: {
    backgroundColor: '#155c33',
    paddingBottom: 64,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2f8f52',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  headerBrand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 24,
  },
  greetingSub: {
    color: '#cfe9d6',
    fontSize: 14,
    marginTop: 2,
  },
  motivCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#0f3d22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  motivTitle: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 15,
    lineHeight: 22,
  },
  motivSub: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  lastConsultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  lastConsultLeft: {
    gap: 2,
  },
  lastConsultLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lastConsultName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  lastConsultBadge: {
    backgroundColor: '#2f8f52',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lastConsultPct: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  servicesWrap: {
    paddingHorizontal: 24,
    marginTop: -28,
  },
  servicesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  servicesTitle: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 16,
  },
  servicesSub: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  servicesScroll: {
    gap: 12,
    marginTop: 16,
    paddingBottom: 4,
  },
  serviceItem: {
    minWidth: 140,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  serviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eaf5ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceItemTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111827',
    lineHeight: 18,
  },
  serviceItemDesc: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    lineHeight: 16,
  },
  ctaBtn: {
    backgroundColor: '#1f7a40',
    borderRadius: 9999,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

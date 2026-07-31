import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Bell,
  Activity,
} from "lucide-react-native";
import StatusBar from "../components/StatusBar";
import { useAuth } from "../context/AuthContext";
import { apiGetHistory, apiGetHistoryDetail, apiHealthCheck, getRealProfileScore } from "../utils/api";
import tw from "../utils/tw";

function timeAgo(isoString) {
  if (!isoString) return '';
  let dateStr = String(isoString);
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
    dateStr += 'Z';
  }
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now - d;
  if (isNaN(diffMs) || diffMs <= 0) return 'Baru saja';
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Kemarin';
  return `${diffDay} hari lalu`;
}

export default function Notifikasi() {
  const navigation = useNavigation();
  const { token, markNotifAsRead } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  useEffect(() => {
    // Mark notifications as read when user views this page
    if (markNotifAsRead) markNotifAsRead();

    (async () => {
      try {
        // Fetch health check status
        const healthRes = await apiHealthCheck().catch(() => null);
        if (healthRes?.data) {
          setSystemStatus(healthRes.data);
        }

        if (token) {
          const res = await apiGetHistory(token);
          const items = res.data.items || [];
          const { calculateAnswerScore } = require("../utils/api");

          const notifs = await Promise.all(
            items.map(async (item) => {
              let score = Math.round(item.persentase_utama || 0);
              try {
                const detailRes = await apiGetHistoryDetail(token, item.consultation_id);
                const detail = detailRes.data;
                const calculated = calculateAnswerScore(detail?.jawaban_raw);
                if (calculated !== null) score = calculated;
              } catch {
                // Silently fallback to default score
              }

              return {
                id: item.consultation_id,
                title: `Konsultasi: ${item.nama_profil} (${score}%)`,
                desc: `Hasil analisis perilaku akademik Anda: ${score}%. Profil: ${item.kode_profil} — ${item.nama_profil}. Tingkat urgensi: ${item.tingkat_urgensi || 'N/A'}.`,
                time: timeAgo(item.created_at),
                icon: item.tingkat_urgensi?.includes('Positif') ? CheckCircle2 : Sparkles,
                color: 'primary-600',
              };
            })
          );
          setNotifications(notifs);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, [token, markNotifAsRead]);

  const handleNotificationPress = async (consultationId) => {
    if (!token || loadingDetailId) return;
    setLoadingDetailId(consultationId);
    try {
      const res = await apiGetHistoryDetail(token, consultationId);
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
    } catch {
      navigation.navigate('Riwayat');
    } finally {
      setLoadingDetailId(null);
    }
  };

  return (
    <View style={tw`flex-1 bg-[#F9FBFA]`}>
      <StatusBar />

      {/* Header */}
      <View style={tw`bg-white pt-12 border-b border-gray-100`}>
        <View style={tw`flex-row items-center gap-3 px-5 py-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-1`}>
            <ArrowLeft size={20} color={tw.color("primary-700")} />
          </TouchableOpacity>
          <Text style={tw`font-bold text-primary-700 text-lg flex-1`}>Notifikasi</Text>
        </View>
      </View>

      {loading ? (
        <View style={tw`flex-1 items-center justify-center gap-3`}>
          <ActivityIndicator size="large" color={tw.color('primary-600')} />
          <Text style={tw`text-gray-400 text-sm`}>Memuat notifikasi...</Text>
        </View>
      ) : (
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-5 pb-8`}>
          {/* System Health Status Notice */}
          {systemStatus && (
            <View style={tw`bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-5 mb-2 flex-row items-center gap-3`}>
              <View style={tw`w-8 h-8 rounded-full bg-emerald-100 items-center justify-center`}>
                <Activity size={16} color="#059669" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`font-bold text-emerald-800 text-xs`}>System Status: {systemStatus.status?.toUpperCase() || 'ONLINE'}</Text>
                <Text style={tw`text-[11px] text-emerald-600 mt-0.5`}>
                  AI Provider ({systemStatus.ai_provider?.provider || 'Groq'}) model {systemStatus.ai_provider?.model || 'active'}
                </Text>
              </View>
            </View>
          )}

          {/* Section Header */}
          <View style={tw`flex-row justify-between items-center mt-4 mb-3`}>
            <Text style={tw`text-[11px] font-bold text-gray-400 tracking-wider`}>
              AKTIVITAS TERBARU
            </Text>
          </View>

          {notifications.length === 0 ? (
            <View style={tw`bg-white rounded-2xl p-6 items-center shadow-sm border border-gray-50 mt-2`}>
              <Bell size={32} color={tw.color('gray-300')} />
              <Text style={tw`text-gray-400 text-sm mt-3 text-center`}>
                Belum ada notifikasi.{"\n"}Lakukan konsultasi untuk memulai.
              </Text>
            </View>
          ) : (
            notifications.map((notif) => {
              const IconComp = notif.icon;
              const isLoadingThis = loadingDetailId === notif.id;

              return (
                <TouchableOpacity
                  key={notif.id}
                  onPress={() => handleNotificationPress(notif.id)}
                  activeOpacity={0.8}
                  style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50`}
                >
                  <View style={tw`flex-row items-start`}>
                    <View style={tw`w-10 h-10 rounded-xl bg-primary-50 items-center justify-center`}>
                      {isLoadingThis ? (
                        <ActivityIndicator size="small" color={tw.color('primary-600')} />
                      ) : (
                        <IconComp size={20} color={tw.color(notif.color)} />
                      )}
                    </View>
                    <View style={tw`flex-1 ml-3`}>
                      <View style={tw`flex-row justify-between items-start`}>
                        <Text style={tw`font-bold text-primary-700 text-sm flex-1`}>
                          {notif.title}
                        </Text>
                        <Text style={tw`text-[10px] text-gray-400 ml-2`}>{notif.time}</Text>
                      </View>
                      <Text style={tw`text-xs text-gray-500 mt-1.5 leading-4`}>
                        {notif.desc}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}


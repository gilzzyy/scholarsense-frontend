import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Bot,
  Medal,
  History,
  LogIn,
} from "lucide-react-native";
import StatusBar from "../components/StatusBar";
import profile from "../assets/Profile.png"; // Avatar asset
import tw from "../utils/tw";

export default function Notifikasi() {
  const navigation = useNavigation();

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

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-5 pb-8`}>
        {/* Section Header: HARI INI & TANDAI SEMUA DIBACA on the same line */}
        <View style={tw`flex-row justify-between items-center mt-5 mb-3`}>
          <Text style={tw`text-[11px] font-bold text-gray-400 tracking-wider`}>
            HARI INI
          </Text>
          <TouchableOpacity activeOpacity={0.7} style={tw`py-1`}>
            <Text style={tw`text-[11px] font-bold text-primary-600`}>
              ✓ TANDAI SEMUA DIBACA
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notif 1 - Analisis AI Selesai */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`w-10 h-10 rounded-xl bg-primary-50 items-center justify-center`}>
              <Sparkles size={20} color={tw.color("primary-600")} />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <Text style={tw`font-bold text-primary-700 text-sm flex-1`}>
                  Analisis AI Selesai
                </Text>
                <Text style={tw`text-[10px] text-gray-400 ml-2`}>2mt lalu</Text>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1.5 leading-4`}>
                Draf tesis Anda telah diproses. Sentinel-Bot mengidentifikasi 4 peningkatan struktural dan 12 penyempurnaan sitasi untuk Anda tinjau.
              </Text>
              <View style={tw`flex-row gap-2 mt-3`}>
                <TouchableOpacity
                  style={tw`bg-primary-700 py-2 px-4 rounded-full`}
                  activeOpacity={0.8}
                >
                  <Text style={tw`text-white font-bold text-[10px]`}>LIHAT LAPORAN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`border border-primary-600 py-2 px-4 rounded-full`}
                  activeOpacity={0.8}
                >
                  <Text style={tw`text-primary-600 font-bold text-[10px]`}>ABAIKAN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Notif 2 - Pengingat Konsultasi */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`w-10 h-10 rounded-xl bg-primary-50 items-center justify-center`}>
              <Calendar size={20} color={tw.color("primary-600")} />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <Text style={tw`font-bold text-gray-900 text-sm flex-1`}>
                  Pengingat Konsultasi
                </Text>
                <Text style={tw`text-[10px] text-gray-400 ml-2`}>1j lalu</Text>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1.5 leading-4`}>
                Sesi mendatang dengan <Text style={tw`font-bold text-primary-700`}>Dr. Sarah Miller</Text> dalam 30 menit. Topik: Metodologi Penelitian Lanjutan.
              </Text>
              <View style={tw`flex-row items-center justify-between mt-3`}>
                <Image source={profile} style={tw`w-7 h-7 rounded-full`} />
                <TouchableOpacity
                  style={tw`bg-[#0c3a20] py-2 px-4 rounded-full flex-row items-center gap-1.5`}
                  activeOpacity={0.8}
                >
                  <LogIn size={11} color="white" />
                  <Text style={tw`text-white font-bold text-[10px]`}>GABUNG RUANGAN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: KEMARIN */}
        <Text style={tw`text-[11px] font-bold text-gray-400 tracking-wider mt-3 mb-3`}>
          KEMARIN
        </Text>

        {/* Notif 3 - Pesan dari Sentinel-Bot */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`w-10 h-10 rounded-xl bg-primary-50 items-center justify-center`}>
              <Bot size={20} color={tw.color("primary-600")} />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <Text style={tw`font-bold text-gray-900 text-sm flex-1`}>
                  Pesan dari Sentinel-Bot
                </Text>
                <Text style={tw`text-[10px] text-gray-400 ml-2`}>Kemarin, 16:15</Text>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1.5 leading-4 italic`}>
                "Saya menemukan 3 makalah penelitian baru yang sesuai dengan kriteria pencarian terbaru Anda untuk 'Etika Komputasi Kuantum'. Apakah Anda ingin menambahkannya ke perpustakaan Anda?"
              </Text>
            </View>
          </View>
        </View>

        {/* Notif 4 - Pencapaian Baru Terbuka! */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`w-10 h-10 rounded-xl bg-[#c5e6cc] items-center justify-center`}>
              <Medal size={20} color={tw.color("primary-600")} />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <Text style={tw`font-bold text-gray-900 text-sm flex-1`}>
                  Pencapaian Baru Terbuka!
                </Text>
                <Text style={tw`text-[10px] text-gray-400 ml-2`}>Kemarin, 10:30</Text>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1.5 leading-4`}>
                Selamat! Anda mendapatkan lencana <Text style={tw`font-bold text-primary-600`}>"Peneliti Metodis"</Text> karena mempertahankan tren sitasi selama 7 hari berturut-turut.
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION: SEBELUMNYA */}
        <Text style={tw`text-[11px] font-bold text-gray-400 tracking-wider mt-3 mb-3`}>
          SEBELUMNYA
        </Text>

        {/* Notif 5 - Peningkatan Sistem */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-50`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`w-10 h-10 rounded-xl bg-blue-50 items-center justify-center`}>
              <History size={20} color={tw.color("blue-600")} />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <View style={tw`flex-row justify-between items-start`}>
                <Text style={tw`font-bold text-gray-900 text-sm flex-1`}>
                  Peningkatan Sistem
                </Text>
                <Text style={tw`text-[10px] text-gray-400 ml-2`}>12 Okt</Text>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1.5 leading-4`}>
                ScholarSense v2.4 kini sudah tersedia. Jelajahi fitur papan tulis kolaboratif baru pada konsultasi Anda berikutnya.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

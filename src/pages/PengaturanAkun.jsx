import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ShieldCheck, Trash2, ChevronRight, User as UserIcon } from "lucide-react-native";
import StatusBar from "../components/StatusBar";
import { useAuth } from "../context/AuthContext";
import { getAvatarUrl } from "../utils/api";
import profile from "../assets/Profile.png";
import tw from "../utils/tw";

export default function PengaturanAkun() {
  const navigation = useNavigation();
  const { user, deleteAccount } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const nama = user?.nama_lengkap || user?.nama || "Mahasiswa";
  const nim = user?.nim || "-";
  const email = user?.email || "-";
  const avatarUrl = getAvatarUrl(user?.foto_profil);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hapus Akun Permanen",
      "Apakah Anda yakin ingin menghapus akun ini secara permanen? Semua riwayat konsultasi dan data obrolan akan dihapus dan tidak dapat dikembalikan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Permanen",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
            } catch (err) {
              Alert.alert("Gagal Hapus Akun", err.message || "Terjadi kesalahan saat menghapus akun.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
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
          <Text style={tw`font-bold text-primary-700 text-lg`}>Pengaturan Akun</Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-5 pt-6`} contentContainerStyle={tw`pb-8`}>
        {/* Profile Card */}
        <View style={tw`bg-white rounded-3xl p-5 flex-row items-center gap-4 shadow-sm border border-gray-50 mb-6`}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={tw`w-20 h-20 rounded-full border border-gray-100`}
            />
          ) : (
            <Image
              source={profile}
              style={tw`w-20 h-20 rounded-full border border-gray-100`}
            />
          )}
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>{nama}</Text>
            <Text style={tw`text-xs text-gray-400 mt-1`}>NIM: {nim}</Text>
            <Text style={tw`text-xs text-primary-700 font-medium mt-0.5`}>{email}</Text>
          </View>
        </View>

        {/* Menu Card */}
        <View style={tw`bg-white rounded-3xl p-4 shadow-sm border border-gray-50`}>
          {/* Ubah Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("UbahPassword")}
            style={tw`flex-row items-center justify-between py-3 px-1`}
            activeOpacity={0.7}
          >
            <View style={tw`flex-row items-center gap-3.5`}>
              <View style={tw`w-10 h-10 rounded-2xl bg-primary-50 items-center justify-center`}>
                <ShieldCheck size={20} color={tw.color("primary-600")} />
              </View>
              <Text style={tw`text-gray-700 font-semibold text-sm`}>Ubah Password</Text>
            </View>
            <ChevronRight size={20} color={tw.color("gray-400")} />
          </TouchableOpacity>

          {/* Separator line */}
          <View style={tw`h-[1px] bg-gray-100 my-1 ml-14`} />

          {/* Hapus Akun */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={deleting}
            style={tw`flex-row items-center justify-between py-3 px-1`}
            activeOpacity={0.7}
          >
            <View style={tw`flex-row items-center gap-3.5`}>
              <View style={tw`w-10 h-10 rounded-2xl bg-red-50 items-center justify-center`}>
                {deleting ? (
                  <ActivityIndicator size="small" color="#EF4444" />
                ) : (
                  <Trash2 size={18} color="#EF4444" />
                )}
              </View>
              <Text style={tw`text-red-500 font-semibold text-sm`}>
                {deleting ? "Menghapus Akun..." : "Hapus Akun"}
              </Text>
            </View>
            <ChevronRight size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


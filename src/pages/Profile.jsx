import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  Settings,
  LogOut,
  Pencil,
  ChevronRight,
} from "lucide-react-native";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import profile from "../assets/Profile.png";
import tw from "../utils/tw";

export default function Profile() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const nama = user?.nama || "Andi Pratama";
  const nim = user?.nim || "2201234567";
  const email = user?.email || "andi.pratama@kampus.ac.id";

  const handleLogout = () => {
    logout();
    navigation.navigate("Login");
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar dark />

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-8`}>
        {/* Header */}
        <View style={tw`px-6 pt-12 pb-4`}>
          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-3xl font-bold text-primary-700`}>Profil</Text>
              <Text style={tw`text-gray-400 text-sm`}>
                Kelola informasi akun dan pengaturan.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifikasi")}
              style={tw`w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center relative`}
            >
              <Bell size={20} color={tw.color("gray-800")} />
              {/* Red dot indicator */}
              <View style={tw`absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500`} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card */}
        <View style={tw`px-6 mt-6`}>
          <View style={tw`bg-white rounded-3xl p-6 items-center text-center shadow-sm`}>
            <Image
              source={profile}
              style={tw`w-28 h-28 rounded-full`}
            />

            <Text style={tw`text-2xl font-bold mt-5 text-gray-900`}>{nama}</Text>
            <Text style={tw`text-gray-400 mt-1`}>NIM {nim}</Text>
            <Text style={tw`text-gray-500 text-sm mt-0.5`}>{email}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfil")}
              style={tw`mt-5 border border-gray-200 rounded-xl px-5 py-2 flex-row items-center gap-2`}
            >
              <Text style={tw`text-gray-700 font-semibold text-sm`}>Edit Profil</Text>
              <Pencil size={17} color={tw.color("gray-700")} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu List */}
        <View style={tw`px-6 mt-6 gap-4`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PengaturanAkun")}
            style={tw`bg-white rounded-2xl p-5 flex-row justify-between items-center shadow-sm`}
          >
            <View style={tw`flex-row items-center gap-3`}>
              <Settings size={20} color={tw.color("gray-700")} />
              <Text style={tw`text-gray-700 font-medium`}>Pengaturan Akun</Text>
            </View>
            <ChevronRight size={20} color={tw.color("gray-400")} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Notifikasi")}
            style={tw`bg-white rounded-2xl p-5 flex-row justify-between items-center shadow-sm`}
          >
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-9 h-9 rounded-xl bg-primary-50 items-center justify-center`}>
                <Bell size={20} color={tw.color("primary-600")} />
              </View>
              <Text style={tw`text-gray-700 font-medium`}>Notifikasi</Text>
            </View>
            <ChevronRight size={20} color={tw.color("gray-400")} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={tw`bg-white rounded-2xl p-5 flex-row items-center gap-3 shadow-sm`}
          >
            <LogOut size={20} color={tw.color("red-500")} />
            <Text style={tw`text-red-500 font-semibold`}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}
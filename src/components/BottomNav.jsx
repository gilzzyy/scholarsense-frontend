import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Home, MessageSquare, FileText, User } from "lucide-react-native";
import tw from "../utils/tw";

const navItems = [
  { to: "Beranda", icon: Home, label: "Beranda" },
  { to: "Konsultasi", icon: MessageSquare, label: "Konsultasi" },
  { to: "Riwayat", icon: FileText, label: "Riwayat" },
  { to: "Profil", icon: User, label: "Profil" },
];

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={tw`border-t border-gray-100 bg-white pb-5 pt-2`}>
      <View style={tw`flex-row items-center justify-around px-2`}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = 
            route.name === to || 
            (to === "Profil" && ["Profil", "PengaturanAkun", "UbahPassword", "EditProfil"].includes(route.name));
          const iconColor = isActive ? tw.color("primary-600") : tw.color("gray-400");

          return (
            <TouchableOpacity
              key={to}
              onPress={() => navigation.navigate(to)}
              style={tw`flex-col items-center py-1 px-3 rounded-xl`}
              activeOpacity={0.7}
            >
              <Icon size={22} strokeWidth={2} color={iconColor} />
              <Text style={tw`text-[11px] font-medium mt-1 ${isActive ? "text-primary-600" : "text-gray-400"}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

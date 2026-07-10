import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Camera, Image as LucideImage, ChevronsUpDown } from "lucide-react-native";
import StatusBar from "../components/StatusBar";
import { useAuth } from "../context/AuthContext";
import tw from "../utils/tw";

export default function EditProfil() {
  const navigation = useNavigation();
  const { user, register } = useAuth();

  const [nama, setNama] = useState(user?.nama || "Andi Pratama");
  const [nim, setNim] = useState(user?.nim || "24111077");
  const [email, setEmail] = useState(user?.email || "ahmad.pratama@univ.ac.id");

  const handleSave = () => {
    // Simulasikan penyimpanan
    if (register) {
      register({ namaLengkap: nama, nim, email });
    }
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-[#F9FBFA]`}>
      <StatusBar />

      {/* Header with perfectly centered title */}
      <View style={tw`bg-white pt-12 border-b border-gray-100`}>
        <View style={tw`flex-row items-center px-5 py-3 relative`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-1 absolute left-5 z-10`}>
            <ArrowLeft size={20} color={tw.color("primary-700")} />
          </TouchableOpacity>
          <Text style={tw`font-bold text-primary-700 text-lg text-center flex-1`}>
            Edit Profil
          </Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-6 pt-8 pb-36`}>
        {/* Foto Profil Section */}
        <View style={tw`items-center mb-8`}>
          <View style={tw`relative`}>
            {/* Circular Placeholder */}
            <View style={tw`w-28 h-28 rounded-full bg-[#E8ECFF] items-center justify-center border-4 border-white shadow-sm`}>
              <LucideImage size={38} color="#7C8BFF" />
            </View>
            {/* Camera Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={tw`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0c3a20] items-center justify-center border-2 border-white`}
            >
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-[11px] font-bold text-gray-400 tracking-widest mt-4`}>
            UBAH FOTO PROFIL
          </Text>
        </View>

        {/* Input Fields */}
        <View style={tw`gap-5`}>
          {/* Nama Lengkap */}
          <View>
            <Text style={tw`text-xs text-gray-500 font-semibold mb-2`}>Nama Lengkap</Text>
            <TextInput
              value={nama}
              onChangeText={setNama}
              style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-800 shadow-sm`}
            />
          </View>

          {/* NIM */}
          <View>
            <Text style={tw`text-xs text-gray-500 font-semibold mb-2`}>NIM</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex-row justify-between items-center shadow-sm`}
            >
              <Text style={tw`text-sm text-gray-800`}>{nim}</Text>
              <ChevronsUpDown size={18} color={tw.color("gray-400")} />
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View>
            <Text style={tw`text-xs text-gray-500 font-semibold mb-2`}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-800 shadow-sm`}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons Container (Fixed overlay at the bottom) */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 pb-8 shadow-sm`}>
        <TouchableOpacity
          onPress={handleSave}
          style={tw`bg-[#176236] py-4 rounded-2xl items-center shadow-sm mb-3`}
          activeOpacity={0.8}
        >
          <Text style={tw`text-white font-bold text-sm`}>Simpan Perubahan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`py-2 items-center`}
          activeOpacity={0.7}
        >
          <Text style={tw`text-gray-500 font-semibold text-sm`}>Batal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

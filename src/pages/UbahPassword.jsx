import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react-native";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";
import tw from "../utils/tw";

export default function UbahPassword() {
  const navigation = useNavigation();

  // States for password inputs
  const [currentPassword, setCurrentPassword] = useState("12345678");
  const [newPassword, setNewPassword] = useState("12345678");
  const [confirmPassword, setConfirmPassword] = useState("12345678");

  // States for visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    // Simulasikan penyimpanan
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-[#F9FBFA]`}>
      <StatusBar />

      {/* Header - Left Aligned matching the mockup */}
      <View style={tw`bg-white pt-12 border-b border-gray-100`}>
        <View style={tw`flex-row items-center gap-3 px-5 py-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-1`}>
            <ArrowLeft size={20} color={tw.color("primary-700")} />
          </TouchableOpacity>
          <Text style={tw`font-bold text-primary-700 text-lg`}>Ubah Password</Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-5 pt-5 pb-10`}>
        {/* Info text */}
        <Text style={tw`text-sm text-gray-500 mb-6 leading-5`}>
          Pastikan kata sandi Anda kuat untuk melindungi akun Anda.
        </Text>

        {/* Card Form */}
        <View style={tw`bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6`}>
          {/* PASSWORD SAAT INI */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-[10px] font-bold text-primary-700 tracking-widest mb-1.5`}>
              PASSWORD SAAT INI
            </Text>
            <View style={tw`flex-row items-center bg-[#F4F9F6] border border-[#E0ECE6] rounded-2xl px-4 py-3`}>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                style={tw`flex-1 text-sm text-gray-800 p-0`}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={tw`p-1`}>
                {showCurrent ? (
                  <EyeOff size={18} color={tw.color("gray-500")} />
                ) : (
                  <Eye size={18} color={tw.color("gray-500")} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* PASSWORD BARU */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-[10px] font-bold text-primary-700 tracking-widest mb-1.5`}>
              PASSWORD BARU
            </Text>
            <View style={tw`flex-row items-center bg-[#F4F9F6] border border-[#E0ECE6] rounded-2xl px-4 py-3`}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                style={tw`flex-1 text-sm text-gray-800 p-0`}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={tw`p-1`}>
                {showNew ? (
                  <EyeOff size={18} color={tw.color("gray-500")} />
                ) : (
                  <Eye size={18} color={tw.color("gray-500")} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* KONFIRMASI PASSWORD BARU */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-[10px] font-bold text-primary-700 tracking-widest mb-1.5`}>
              KONFIRMASI PASSWORD BARU
            </Text>
            <View style={tw`flex-row items-center bg-[#F4F9F6] border border-[#E0ECE6] rounded-2xl px-4 py-3`}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                style={tw`flex-1 text-sm text-gray-800 p-0`}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={tw`p-1`}>
                {showConfirm ? (
                  <EyeOff size={18} color={tw.color("gray-500")} />
                ) : (
                  <Eye size={18} color={tw.color("gray-500")} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* KRITERIA KEAMANAN */}
          <View style={tw`mb-6`}>
            <Text style={tw`text-xs font-bold text-gray-700 mb-3 tracking-wide`}>
              KRITERIA KEAMANAN:
            </Text>
            <View style={tw`gap-2.5`}>
              {/* Kriteria 1 */}
              <View style={tw`flex-row items-center gap-2.5`}>
                <View style={tw`w-4 h-4 rounded-full bg-primary-600 items-center justify-center`}>
                  <Check size={10} color="white" strokeWidth={4} />
                </View>
                <Text style={tw`text-xs text-gray-600`}>Minimal 8 karakter</Text>
              </View>

              {/* Kriteria 2 */}
              <View style={tw`flex-row items-center gap-2.5`}>
                <View style={tw`w-4 h-4 rounded-full bg-primary-600 items-center justify-center`}>
                  <Check size={10} color="white" strokeWidth={4} />
                </View>
                <Text style={tw`text-xs text-gray-600`}>Huruf besar (A-Z)</Text>
              </View>

              {/* Kriteria 3 */}
              <View style={tw`flex-row items-center gap-2.5`}>
                <View style={tw`w-4 h-4 rounded-full bg-primary-600 items-center justify-center`}>
                  <Check size={10} color="white" strokeWidth={4} />
                </View>
                <Text style={tw`text-xs text-gray-600`}>Angka (0-9)</Text>
              </View>
            </View>
          </View>

          {/* Button Simpan */}
          <TouchableOpacity
            onPress={handleSave}
            style={tw`bg-[#176236] py-3.5 rounded-2xl items-center shadow-md`}
            activeOpacity={0.8}
          >
            <Text style={tw`text-white font-bold text-sm`}>Simpan Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Camera, Image as LucideImage, AlertCircle } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import StatusBar from "../components/StatusBar";
import { useAuth } from "../context/AuthContext";
import { getAvatarUrl } from "../utils/api";
import tw from "../utils/tw";

export default function EditProfil() {
  const navigation = useNavigation();
  const { user, updateProfile, uploadAvatar } = useAuth();

  const [nama, setNama] = useState(user?.nama_lengkap || user?.nama || "");
  const [nim, setNim] = useState(user?.nim || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const avatarUrl = getAvatarUrl(user?.foto_profil);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Izin Ditolak", "Izin akses galeri dibutuhkan untuk mengubah foto profil.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setUploadingAvatar(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
          await uploadAvatar(imageUri);
          setSuccessMsg("Foto profil berhasil diperbarui.");
        } catch (err) {
          setErrorMsg(err.message || "Gagal mengunggah foto profil.");
        } finally {
          setUploadingAvatar(false);
        }
      }
    } catch (err) {
      setErrorMsg("Gagal membuka galeri foto.");
    }
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim() || !nim.trim() || !email.trim()) {
      setErrorMsg("Nama lengkap, NIM, dan Email wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        nama_lengkap: nama.trim(),
        nim: nim.trim(),
        email: email.trim(),
      });
      setSuccessMsg("Profil berhasil diperbarui.");
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-[#F9FBFA]`}
    >
      <StatusBar />

      {/* Header */}
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

      <ScrollView 
        style={tw`flex-1`} 
        contentContainerStyle={tw`px-6 pt-8 pb-36`}
        keyboardShouldPersistTaps="handled"
      >
        {/* Foto Profil Section */}
        <View style={tw`items-center mb-6`}>
          <View style={tw`relative`}>
            {/* Avatar Display */}
            <View style={tw`w-28 h-28 rounded-full bg-[#E8ECFF] items-center justify-center border-4 border-white shadow-sm overflow-hidden`}>
              {uploadingAvatar ? (
                <ActivityIndicator size="large" color="#176236" />
              ) : avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={tw`w-full h-full rounded-full`} />
              ) : (
                <LucideImage size={38} color="#7C8BFF" />
              )}
            </View>
            {/* Camera Button */}
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={uploadingAvatar || saving}
              activeOpacity={0.8}
              style={tw`absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#0c3a20] items-center justify-center border-2 border-white`}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handlePickImage} disabled={uploadingAvatar || saving}>
            <Text style={tw`text-[11px] font-bold text-primary-700 tracking-widest mt-4`}>
              {uploadingAvatar ? "MENGUNGGAH..." : "UBAH FOTO PROFIL"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Messages */}
        {errorMsg ? (
          <View style={tw`bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex-row items-center gap-2.5`}>
            <AlertCircle size={16} color="#DC2626" />
            <Text style={tw`text-xs text-red-600 flex-1 font-medium`}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={tw`bg-green-50 border border-green-200 rounded-2xl p-4 mb-5`}>
            <Text style={tw`text-xs text-green-700 font-medium text-center`}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Input Fields */}
        <View style={tw`gap-5`}>
          {/* Nama Lengkap */}
          <View>
            <Text style={tw`text-xs text-gray-500 font-semibold mb-2`}>Nama Lengkap</Text>
            <TextInput
              value={nama}
              onChangeText={setNama}
              editable={!saving}
              style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-800 shadow-sm`}
            />
          </View>

          {/* NIM */}
          <View>
            <Text style={tw`text-xs text-gray-500 font-semibold mb-2`}>NIM</Text>
            <TextInput
              value={nim}
              onChangeText={setNim}
              editable={!saving}
              keyboardType="numeric"
              style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-800 shadow-sm`}
            />
          </View>

          {/* Email */}
          <View>
            <Text style={tw`text-xs text-gray-500 font-semibold mb-2`}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              editable={!saving}
              keyboardType="email-address"
              autoCapitalize="none"
              style={tw`bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-800 shadow-sm`}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons Container */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-4 pb-8 shadow-sm`}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || uploadingAvatar}
          style={tw`bg-[#176236] py-4 rounded-2xl items-center shadow-sm mb-3 ${saving ? 'opacity-70' : ''}`}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={tw`text-white font-bold text-sm`}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={saving}
          style={tw`py-2 items-center`}
          activeOpacity={0.7}
        >
          <Text style={tw`text-gray-500 font-semibold text-sm`}>Batal</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


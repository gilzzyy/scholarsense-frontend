import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, AlertCircle } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    setError('');
    if (!identifier || !password) {
      setError('Email/NIM dan password wajib diisi.');
      return;
    }
    // TODO: integrasi -> POST /api/auth/login (lihat AuthContext.jsx)
    login({ identifier });
    navigation.navigate('Beranda');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>
            Masuk Ke Akun <Text style={styles.green}>ScholarSense</Text> Anda
          </Text>
        </View>

        <View style={styles.form}>
          {/* Email/NIM */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email/NIM</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Mail size={16} color="#176236" />
              </View>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Masukkan email atau NIM"
                placeholderTextColor="#9aa39d"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Lock size={16} color="#176236" />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9aa39d"
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={14} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Lupa password */}
          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={styles.forgotText}>lupa Password ?</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity style={styles.btnPrimary} onPress={onSubmit} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Masuk</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.btnGoogle} activeOpacity={0.7}>
            <Text style={styles.btnGoogleText}>Masuk dengan Google</Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Daftar Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  green: {
    color: '#176236',
    fontWeight: '600',
  },
  form: {
    marginTop: 40,
    gap: 16,
  },
  fieldGroup: {},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#f3f6f4',
    borderRadius: 14,
    paddingVertical: 14,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    flex: 1,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#176236',
    fontSize: 12,
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: '#1f7a40',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  btnGoogle: {
    backgroundColor: '#f3f4f6',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnGoogleText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 12,
    color: '#176236',
    fontWeight: '600',
  },
});

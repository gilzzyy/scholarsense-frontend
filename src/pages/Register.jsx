import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, User, CreditCard, Mail, Lock, AlertCircle, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

function Field({ label, icon: Icon, type = 'text', placeholder, value, onChangeText, editable = true }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <View style={styles.inputIcon}>
          <Icon size={16} color="#176236" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9aa39d"
          secureTextEntry={type === 'password'}
          keyboardType={type === 'email' ? 'email-address' : 'default'}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          style={styles.input}
          editable={editable}
        />
      </View>
    </View>
  );
}

export default function Register() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [form, setForm] = useState({
    namaLengkap: '',
    nim: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async () => {
    setError('');
    if (!form.namaLengkap || !form.nim || !form.email || !form.password) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    if (!agree) {
      setError('Kamu harus menyetujui Syarat & Ketentuan terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nama_lengkap: form.namaLengkap,
        nim: form.nim,
        email: form.email,
        password: form.password,
        konfirmasi_password: form.confirmPassword,
      });
      setSuccess(true);
      // Navigate ke Login setelah register berhasil (API tidak return token)
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#155c33" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Buat Akun</Text>
            <Text style={styles.headerSub}>Daftar mahasiswa baru</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Field
            label="Nama Lengkap"
            icon={User}
            placeholder="Nama Sesuai KTM"
            value={form.namaLengkap}
            onChangeText={onChange('namaLengkap')}
            editable={!loading}
          />
          <Field
            label="NIM"
            icon={CreditCard}
            placeholder="Nomor Induk Mahasiswa"
            value={form.nim}
            onChangeText={onChange('nim')}
            editable={!loading}
          />
          <Field
            label="Email"
            icon={Mail}
            type="email"
            placeholder="email@kampus.ac.id"
            value={form.email}
            onChangeText={onChange('email')}
            editable={!loading}
          />
          <Field
            label="Password"
            icon={Lock}
            type="password"
            placeholder="Min 8 karakter"
            value={form.password}
            onChangeText={onChange('password')}
            editable={!loading}
          />
          <Field
            label="Konfirmasi Password"
            icon={Lock}
            type="password"
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChangeText={onChange('confirmPassword')}
            editable={!loading}
          />

          {/* Success */}
          {success ? (
            <View style={styles.successBox}>
              <Check size={14} color="#15803d" />
              <Text style={styles.successText}>Registrasi berhasil! Mengarahkan ke halaman login...</Text>
            </View>
          ) : null}

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={14} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkRow}
            activeOpacity={0.7}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree && <Check size={12} color="#fff" strokeWidth={3} />}
            </View>
            <Text style={styles.checkText}>
              Saya setuju dengan <Text style={styles.green}>Syarat & Ketentuan</Text> dan{' '}
              <Text style={styles.green}>Kebijakan Privasi</Text>
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={onSubmit}
            activeOpacity={0.85}
            disabled={loading || success}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnPrimaryText}>Daftar Akun</Text>
            )}
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Masuk Sini</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: -2,
  },
  form: {
    marginTop: 20,
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
  successBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  successText: {
    color: '#15803d',
    fontSize: 12,
    flex: 1,
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
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#176236',
    borderColor: '#176236',
  },
  checkText: {
    flex: 1,
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  green: {
    color: '#176236',
    fontWeight: '500',
  },
  btnPrimary: {
    backgroundColor: '#1f7a40',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 4,
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

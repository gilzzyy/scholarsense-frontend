import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Construction } from 'lucide-react-native';
import BottomNav from '../components/BottomNav';

export default function Placeholder() {
  const navigation = useNavigation();
  const route = useRoute();
  const title = route.params?.title || 'Halaman';
  const note = route.params?.note || 'Bagian frontend ini berada di luar scope yang ditugaskan ke kamu.';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Beranda')}>
          <ArrowLeft size={20} color="#155c33" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Construction size={26} color="#176236" />
        </View>
        <Text style={styles.mainText}>Halaman ini dikerjakan rekan tim lain</Text>
        <Text style={styles.noteText}>{note}</Text>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#155c33',
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eaf5ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 16,
    textAlign: 'center',
  },
  noteText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
});

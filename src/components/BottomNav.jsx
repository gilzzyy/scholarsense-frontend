import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, MessageSquare, FileText, User } from 'lucide-react-native';

const navItems = [
  { to: 'Beranda', icon: Home, label: 'Beranda' },
  { to: 'Konsultasi', icon: MessageSquare, label: 'Konsultasi' },
  { to: 'Riwayat', icon: FileText, label: 'Riwayat' },
  { to: 'Profil', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = route.name === to;
          return (
            <TouchableOpacity
              key={to}
              onPress={() => navigation.navigate(to)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Icon
                size={22}
                strokeWidth={2}
                color={isActive ? '#176236' : '#9ca3af'}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#fff',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9ca3af',
  },
  labelActive: {
    color: '#176236',
  },
});

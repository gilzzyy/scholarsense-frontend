import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Paperclip, Mic, Send, Info, CheckCheck } from 'lucide-react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';

function hitungSkor(jawaban) {
  if (!jawaban) return 82; // Default mock score
  const entries = Object.values(jawaban);
  if (!entries.length) return 82;
  return Math.round((entries.filter(Boolean).length / entries.length) * 100);
}

// Bot responses based on profile codes
const BOT_RESPONSES = {
  P1: [
    "Mantap! Kedisiplinan waktu kamu sudah sangat baik. Adakah strategi khusus yang ingin kamu bagikan?",
    "Pertahankan fokusmu. Untuk jangka panjang, pastikan kamu juga meluangkan waktu untuk istirahat agar tidak burnout.",
  ],
  P2: [
    "Integritas adalah nilai yang sangat mahal. Saya sangat mengapresiasi kejujuran akademikmu.",
    "Tetap pertahankan prinsip jujur ini ya, baik dalam tugas kecil maupun ujian besar nantinya.",
  ],
  P3: [
    "Kerjasama tim dan komunikasi adalah kunci sukses di dunia kerja. Kamu sudah di jalur yang benar!",
    "Bagus sekali. Adakah hambatan komunikasi kelompok yang sedang kamu hadapi saat ini?",
  ],
  P4: [
    "Kemandirian belajar yang dipadukan dengan aktif berorganisasi adalah kombinasi yang sangat bagus.",
    "Bagaimana caramu menjaga motivasi belajar mandiri di tengah kesibukan rapat organisasi?",
  ],
  P5: [
    "Saya mengerti, kadang tugas menumpuk membuat kita stres. Yuk, coba bagi tugas besar menjadi bagian-bagian kecil.",
    "Mari kita buat komitmen kecil minggu ini untuk mengumpulkan tugas minimal 1 hari sebelum tenggat waktu.",
  ],
  P6: [
    "Itu adalah tantangan yang sangat wajar dihadapi aktivis kampus. Skala prioritas harus benar-benar diperketat.",
    "Cobalah untuk berani menolak ajakan rapat jika memang berbenturan langsung dengan deadline tugas penting.",
  ],
  P7: [
    "Setiap orang bisa berbuat salah. Yang terpenting adalah komitmen kita untuk memperbaiki diri mulai hari ini.",
    "Saya menyarankan kamu berdiskusi dengan Dosen PA untuk mencari solusi pemulihan nilai akademik.",
  ],
  P8: [
    "Penyesuaian lingkungan baru memang butuh waktu. Jangan memikul semua beban sendirian ya.",
    "Bagaimana kalau kamu coba berdiskusi dengan teman dekat atau mencari kelompok belajar yang suportif?",
  ],
  P9: [
    "Kondisi studimu saat ini butuh perhatian khusus. Mari kita identifikasi masalah kehadiran atau tugas bersama.",
    "Sangat penting untuk segera menemui Ketua Program Studi agar mendapat arahan resmi kelanjutan studimu.",
  ],
  P10: [
    "Luar biasa! Karakter unggulmu adalah aset berharga. Teruskan pencapaian hebat ini.",
    "Saya sangat mendukung jika kamu ingin mengikuti seleksi Mahasiswa Berprestasi tingkat fakultas!",
  ],
};

export default function Chat() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const scrollViewRef = useRef();

  const { hasil, jawaban } = route.params || {};
  const profil = hasil?.[0] || { kode: 'P6', nama: 'Sibuk Organisasi' };
  const skor = hitungSkor(jawaban);
  const userName = user?.nama || 'Dimas';

  // Get initial messages
  const initialBotText = `Halo ${userName}! Saya melihat hasil evaluasi mandiri kamu menunjukkan profil '${profil.nama}' dengan skor ${skor}%. ${
    profil.kode === 'P6'
      ? "HMP memang tempat yang luar biasa untuk berkembang, tapi mari kita diskusikan bagaimana caramu mengatur waktu agar IPK kuliahmu tetap aman. Apa kendala terbesar yang kamu rasakan minggu ini?"
      : "Mari kita diskusikan langkah terbaik untuk mendukung pengembangan diri dan performa akademikmu. Ada kendala khusus yang ingin kamu ceritakan?"
  }`;

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: initialBotText,
      time: '10:02 AM',
    },
    // Mock user message matching the screenshot if it's the mock screen
    ...(route.params
      ? []
      : [
          {
            id: '2',
            sender: 'user',
            text: 'Halo Sentinel-Bot, iya nih. Saya sering merasa tidak enak untuk menolak ajakan rapat dari ketua HMP, padahal di saat yang sama ada tugas kuliah yang harus dikumpul besok pagi.',
            time: '10:04 AM',
          },
          {
            id: '3',
            sender: 'bot',
            text: 'Itu adalah tantangan yang sangat wajar dihadapi aktivis kampus, skala prioritas memang harus ditekankan. Belajarlah berkata tidak demi tugas akademikmu.',
            time: '10:05 AM',
          },
        ]),
  ]);

  const [inputText, setInputText] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newUserMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: inputText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');

    // Trigger simulated bot response
    setTimeout(() => {
      const responses = BOT_RESPONSES[profil.kode] || BOT_RESPONSES.P5;
      const responseText = responses[responseIndex % responses.length];
      setResponseIndex((prev) => prev + 1);

      const newBotMessage = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#111827" />
          </TouchableOpacity>

          {/* Cybernetic Bot Avatar */}
          <View style={styles.avatarWrap}>
            <Svg width={40} height={40} viewBox="0 0 40 40">
              <Circle cx="20" cy="20" r="18" fill="#176236" />
              <Circle cx="20" cy="20" r="15" fill="#16213A" />
              {/* Glowing cyan eyes */}
              <Rect x="12" y="18" width="6" height="3" rx="1.5" fill="#22d3ee" />
              <Rect x="22" y="18" width="6" height="3" rx="1.5" fill="#22d3ee" />
              {/* Cyber light dot */}
              <Circle cx="20" cy="11" r="2" fill="#22d3ee" />
            </Svg>
            <View style={styles.onlineBadgeDot} />
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.botName}>Sentinel-Bot</Text>
            <Text style={styles.botSubtitle}>ASISTEN KONSELOR AKADEMIK</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.statusWrap}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ONLINE</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn}>
            <Info size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <View style={styles.chatArea}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <View key={msg.id} style={[styles.messageRow, isBot ? styles.rowBot : styles.rowUser]}>
                <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                  <Text style={[styles.messageText, isBot ? styles.textBot : styles.textUser]}>
                    {msg.text}
                  </Text>
                </View>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageTime}>{msg.time}</Text>
                  {!isBot && <CheckCheck size={14} color="#155c33" style={styles.checkIcon} />}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Paperclip size={22} color="#4b5563" />
          </TouchableOpacity>

          <View style={styles.textInputWrap}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ketik pesan curhatmu di sini..."
              placeholderTextColor="#9ca3af"
              style={styles.input}
              multiline
            />
            <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
              <Mic size={20} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn} activeOpacity={0.85}>
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  avatarWrap: {
    position: 'relative',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  headerTextWrap: {
    justifyContent: 'center',
  },
  botName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#176236',
  },
  botSubtitle: {
    fontSize: 8,
    fontWeight: '600',
    color: '#0d9488',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0d9488',
    letterSpacing: 1,
  },
  infoBtn: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
  },
  messagesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  messageRow: {
    maxWidth: '85%',
    gap: 4,
  },
  rowBot: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  rowUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleBot: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#176236',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  textBot: {
    color: '#374151',
  },
  textUser: {
    color: '#ffffff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  checkIcon: {
    marginTop: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  attachBtn: {
    padding: 6,
  },
  textInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1f2937',
    maxHeight: 80,
  },
  micBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#176236',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

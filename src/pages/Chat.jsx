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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Paperclip, Mic, Send, Info, CheckCheck } from 'lucide-react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { apiGetChatHistory, apiSendChatMessage } from '../utils/api';

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Chat() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, token } = useAuth();
  const scrollViewRef = useRef();

  const consultation_id = route.params?.consultation_id;
  const userName = user?.nama_lengkap?.split(' ')[0] || 'Mahasiswa';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Fetch chat history on mount
  useEffect(() => {
    if (!consultation_id || !token) {
      setLoadingHistory(false);
      return;
    }

    (async () => {
      try {
        const res = await apiGetChatHistory(token, consultation_id);
        const items = res.data.items || [];
        const mapped = items.map((item) => ({
          id: String(item.id),
          sender: item.role === 'model' ? 'bot' : 'user',
          text: item.message,
          time: formatTime(item.created_at),
        }));
        setMessages(mapped);
      } catch {
        // No history yet, that's ok
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, [consultation_id, token]);

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: inputText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    const msgText = inputText;
    setInputText('');
    setSending(true);
    setError('');

    try {
      const res = await apiSendChatMessage(token, consultation_id, msgText);
      const botReply = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: res.data.message,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setError(err.message || 'Gagal mengirim pesan. Coba lagi.');
    } finally {
      setSending(false);
    }
  };

  // Show error if no consultation_id
  if (!consultation_id) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={22} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.botName}>Jhoko AI</Text>
          </View>
        </View>
        <View style={styles.noChatWrap}>
          <Text style={styles.noChatText}>
            Lakukan konsultasi terlebih dahulu untuk memulai chat dengan Jhoko AI.
          </Text>
          <TouchableOpacity
            style={styles.noChatBtn}
            onPress={() => navigation.navigate('Konsultasi')}
          >
            <Text style={styles.noChatBtnText}>Mulai Konsultasi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.botName}>Jhoko AI</Text>
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
        {loadingHistory ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#176236" />
            <Text style={styles.loadingText}>Memuat riwayat chat...</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            contentContainerStyle={styles.messagesScroll}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && (
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>
                  Hai {userName}! 👋{'\n'}Kirim pesan untuk mulai konsultasi dengan Jhoko AI.
                </Text>
              </View>
            )}

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

            {/* Typing indicator */}
            {sending && (
              <View style={[styles.messageRow, styles.rowBot]}>
                <View style={[styles.bubble, styles.bubbleBot]}>
                  <Text style={styles.typingText}>Jhoko sedang mengetik...</Text>
                </View>
              </View>
            )}

            {/* Error */}
            {error ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </ScrollView>
        )}
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
              editable={!sending}
            />
            <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
              <Mic size={20} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
            activeOpacity={0.85}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={18} color="#fff" />
            )}
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyChat: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyChatText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  noChatWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  noChatText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  noChatBtn: {
    backgroundColor: '#176236',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  noChatBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
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
  typingText: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
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
  errorWrap: {
    alignSelf: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    textAlign: 'center',
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
  sendBtnDisabled: {
    opacity: 0.7,
  },
});

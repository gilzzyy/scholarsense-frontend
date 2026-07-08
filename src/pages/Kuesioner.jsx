import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, X, CheckCircle2 } from 'lucide-react-native';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { apiGetQuestions, apiSubmitConsultation } from '../utils/api';

export default function Kuesioner() {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // [{question_id, answer}]
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Fetch questions from API
  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetQuestions(token);
        const items = res.data.items || res.data;
        // Sort by nomor_urut to ensure correct order
        items.sort((a, b) => a.nomor_urut - b.nomor_urut);
        setQuestions(items);
      } catch (err) {
        setErrorMsg('Gagal memuat pertanyaan. Periksa koneksi internet Anda.');
      } finally {
        setLoadingQuestions(false);
      }
    })();
  }, [token]);

  const total = questions.length;
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, total - 1));
  const soal = questions[safeIndex];
  const progress = total > 0 ? ((safeIndex + 1) / total) * 100 : 0;

  const animateOut = (callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const jawab = async (nilai) => {
    if (isTransitioning || !soal || submitting) return;
    setIsTransitioning(true);

    // Record answer using question_id from API
    const questionId = soal.id || soal.question_id;
    const newAnswers = [...answers, { question_id: questionId, answer: nilai }];
    setAnswers(newAnswers);

    if (index < total - 1) {
      animateOut(() => {
        setIndex((i) => i + 1);
        setIsTransitioning(false);
      });
    } else {
      // All questions answered → submit to API
      setSubmitting(true);
      try {
        const res = await apiSubmitConsultation(token, newAnswers);
        const apiResult = res.data;
        navigation.navigate('Processing', { apiResult, answers: newAnswers });
      } catch (err) {
        setErrorMsg(err.message || 'Gagal mengirim jawaban.');
        setSubmitting(false);
        setIsTransitioning(false);
      }
    }
  };

  const kembali = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (index === 0) {
      navigation.navigate('Konsultasi');
      setIsTransitioning(false);
    } else {
      // Remove last answer when going back
      setAnswers((prev) => prev.slice(0, -1));
      animateOut(() => {
        setIndex((i) => i - 1);
        setIsTransitioning(false);
      });
    }
  };

  // Loading state
  if (loadingQuestions) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.headerWrap}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Konsultasi')}>
              <ArrowLeft size={20} color="#155c33" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Konsultasi</Text>
          </View>
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#176236" />
          <Text style={styles.loadingText}>Memuat pertanyaan...</Text>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  // Error state
  if (errorMsg && questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.headerWrap}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Konsultasi')}>
              <ArrowLeft size={20} color="#155c33" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Konsultasi</Text>
          </View>
        </View>
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setErrorMsg('');
              setLoadingQuestions(true);
              (async () => {
                try {
                  const res = await apiGetQuestions(token);
                  const items = res.data.items || res.data;
                  items.sort((a, b) => a.nomor_urut - b.nomor_urut);
                  setQuestions(items);
                } catch {
                  setErrorMsg('Gagal memuat pertanyaan.');
                } finally {
                  setLoadingQuestions(false);
                }
              })();
            }}
          >
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
        <BottomNav />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={kembali}>
            <ArrowLeft size={20} color="#155c33" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Konsultasi</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
        </View>

        {/* Question card */}
        <Animated.View
          style={[
            styles.questionCard,
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.questionText}>{soal?.teks_pertanyaan || soal?.teks}</Text>
        </Animated.View>

        {/* Error message */}
        {errorMsg ? (
          <Text style={[styles.errorText, { marginTop: 16 }]}>{errorMsg}</Text>
        ) : null}

        {/* Submitting indicator */}
        {submitting ? (
          <View style={styles.submittingWrap}>
            <ActivityIndicator size="large" color="#176236" />
            <Text style={styles.loadingText}>Mengirim jawaban...</Text>
          </View>
        ) : (
          <>
            {/* Answer buttons */}
            <View style={styles.answerRow}>
              <TouchableOpacity
                style={styles.btnNo}
                onPress={() => jawab(false)}
                activeOpacity={0.85}
              >
                <X size={20} color="#fff" strokeWidth={2.5} />
                <Text style={styles.btnAnswerText}>TIDAK</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnYes}
                onPress={() => jawab(true)}
                activeOpacity={0.85}
              >
                <CheckCircle2 size={20} color="#fff" strokeWidth={2.5} />
                <Text style={styles.btnAnswerText}>YA</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerNote}>
              Jawablah dengan jujur untuk hasil refleksi yang akurat
            </Text>
          </>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerWrap: {
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
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#176236',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  submittingWrap: {
    marginTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  progressWrap: {
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#176236',
    borderRadius: 9999,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    fontWeight: '500',
  },
  questionCard: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    shadowColor: '#0f3d22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  questionText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  answerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  btnNo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#ef4444',
  },
  btnYes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#155c33',
  },
  btnAnswerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 32,
    lineHeight: 18,
  },
});

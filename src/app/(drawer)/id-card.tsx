import React, { useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CheckCircle2,
  ExternalLink,
  Info,
  QrCode,
  Share2,
  ShieldCheck,
} from 'lucide-react-native';
import { DigitalIdCard } from '../../components/DigitalIdCard';
import { MOCK_STUDENT_ID_CARD } from '../../data/mockData';

const VERIFICATION_BASE_URL = 'https://portal.hu.edu.so/verify';

export default function IdCardScreen() {
  const insets = useSafeAreaInsets();
  const [isSharing, setIsSharing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [actionMessage, setActionMessage] = useState(
    'Verification actions use a demonstration portal address in this build.',
  );

  const verificationUrl = useMemo(
    () =>
      `${VERIFICATION_BASE_URL}?studentId=${encodeURIComponent(
        MOCK_STUDENT_ID_CARD.studentId,
      )}`,
    [],
  );

  const announce = (message: string) => {
    setActionMessage(message);
    AccessibilityInfo.announceForAccessibility(message);
  };

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);
    try {
      const result = await Share.share({
        title: `Verify ${MOCK_STUDENT_ID_CARD.studentId}`,
        message: [
          'Hormuud University digital credential demo',
          `${MOCK_STUDENT_ID_CARD.fullName} · ${MOCK_STUDENT_ID_CARD.studentId}`,
          `Verification link: ${verificationUrl}`,
        ].join('\n'),
      });

      if (result.action === Share.sharedAction) {
        announce('Verification details shared successfully.');
      } else {
        announce('Share sheet closed without sharing.');
      }
    } catch {
      Alert.alert(
        'Unable to share',
        'The phone could not open its share sheet. Please try again.',
        [{ text: 'OK' }],
      );
      announce('Verification details could not be shared.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleOpenVerification = async () => {
    if (isOpening) return;

    setIsOpening(true);
    try {
      const canOpen = await Linking.canOpenURL(verificationUrl);
      if (!canOpen) {
        throw new Error('No application can open the verification URL.');
      }

      await Linking.openURL(verificationUrl);
      announce('Verification portal opened in your browser.');
    } catch {
      Alert.alert(
        'Verification portal unavailable',
        'The browser could not open the demonstration verification link. Check your connection and try again.',
        [{ text: 'OK' }],
      );
      announce('The verification portal could not be opened.');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#002147" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
      >
        <View style={styles.introCard}>
          <View style={styles.introTopRow}>
            <View style={styles.introIcon}>
              <ShieldCheck size={24} color="#FFBE33" />
            </View>
            <View style={styles.introCopy}>
              <Text style={styles.eyebrow}>DIGITAL CAMPUS PASS</Text>
              <Text style={styles.introTitle}>Your student credential</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.introBody}>
            Present the photo side when requested, or flip the card to show its QR gate pass.
          </Text>
        </View>

        <View style={styles.flipHint} accessible accessibilityRole="text">
          <View style={styles.hintIcon}>
            <Info size={16} color="#002147" />
          </View>
          <View style={styles.hintCopy}>
            <Text style={styles.hintTitle}>Tap the card to flip it</Text>
            <Text style={styles.hintText}>The reverse side contains the QR and barcode view.</Text>
          </View>
        </View>

        <DigitalIdCard cardData={MOCK_STUDENT_ID_CARD} />

        <View style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <View style={styles.verificationIcon}>
              <QrCode size={20} color="#006C48" />
            </View>
            <View style={styles.verificationCopy}>
              <Text style={styles.verificationTitle}>Credential verification</Text>
              <Text style={styles.verificationSubtitle}>
                Share the student reference or open the web verification page.
              </Text>
            </View>
          </View>

          <View style={styles.studentReference} accessible accessibilityRole="text">
            <Text style={styles.referenceLabel}>STUDENT REFERENCE</Text>
            <Text style={styles.referenceValue}>{MOCK_STUDENT_ID_CARD.studentId}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={handleShare}
              disabled={isSharing || isOpening}
              accessibilityRole="button"
              accessibilityLabel="Share digital credential verification details"
              accessibilityHint="Opens the phone's native share sheet"
              accessibilityState={{ disabled: isSharing || isOpening, busy: isSharing }}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressedSecondary,
                (isSharing || isOpening) && styles.disabledButton,
              ]}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="#002147" />
              ) : (
                <Share2 size={18} color="#002147" />
              )}
              <Text style={styles.secondaryButtonText}>
                {isSharing ? 'Opening…' : 'Share'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleOpenVerification}
              disabled={isOpening || isSharing}
              accessibilityRole="link"
              accessibilityLabel="Open digital credential verification portal"
              accessibilityHint="Opens the demonstration verification page in your browser"
              accessibilityState={{ disabled: isOpening || isSharing, busy: isOpening }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressedPrimary,
                (isOpening || isSharing) && styles.disabledButton,
              ]}
            >
              {isOpening ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ExternalLink size={18} color="#FFFFFF" />
              )}
              <Text style={styles.primaryButtonText}>
                {isOpening ? 'Opening…' : 'Open portal'}
              </Text>
            </Pressable>
          </View>

          <View
            style={styles.actionMessage}
            accessible
            accessibilityRole="text"
            accessibilityLiveRegion="polite"
          >
            <CheckCircle2 size={15} color="#64748B" />
            <Text style={styles.actionMessageText}>{actionMessage}</Text>
          </View>
        </View>

        <View style={styles.noticeCard} accessible accessibilityRole="text">
          <ShieldCheck size={19} color="#006C48" />
          <View style={styles.noticeCopy}>
            <Text style={styles.noticeTitle}>Use your credential responsibly</Text>
            <Text style={styles.noticeText}>
              This screen contains demonstration identity and verification data. A production release
              should connect it to the university registrar and revoke screenshots or links when a
              credential expires.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  introCard: {
    width: '100%',
    padding: 18,
    backgroundColor: '#002147',
    borderRadius: 20,
  },
  introTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  introIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 190, 51, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 190, 51, 0.35)',
  },
  introCopy: {
    flex: 1,
  },
  eyebrow: {
    color: '#FFBE33',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  introTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '800',
    marginTop: 2,
  },
  introBody: {
    color: '#D7E1EC',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  statusPill: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    backgroundColor: '#E8F5EF',
    borderRadius: 999,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#006C48',
  },
  statusText: {
    color: '#006C48',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  flipHint: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginTop: 14,
    padding: 12,
    backgroundColor: '#EAF0F6',
    borderWidth: 1,
    borderColor: '#D2DDE8',
    borderRadius: 14,
  },
  hintIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  hintCopy: {
    flex: 1,
  },
  hintTitle: {
    color: '#102A43',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  hintText: {
    color: '#526477',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 1,
  },
  verificationCard: {
    width: '100%',
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE4EC',
    borderRadius: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  verificationIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5EF',
  },
  verificationCopy: {
    flex: 1,
  },
  verificationTitle: {
    color: '#172033',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  verificationSubtitle: {
    color: '#526477',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  studentReference: {
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: '#F4F7FA',
    borderWidth: 1,
    borderColor: '#E1E7EE',
    borderRadius: 12,
  },
  referenceLabel: {
    color: '#64748B',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  referenceValue: {
    color: '#002147',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    minHeight: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F4F7FA',
    borderWidth: 1,
    borderColor: '#BFCBD8',
    borderRadius: 13,
  },
  secondaryButtonText: {
    color: '#002147',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    minHeight: 48,
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    backgroundColor: '#002147',
    borderRadius: 13,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.58,
  },
  pressedSecondary: {
    backgroundColor: '#E7EDF3',
    transform: [{ scale: 0.99 }],
  },
  pressedPrimary: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  actionMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 12,
  },
  actionMessageText: {
    flex: 1,
    color: '#526477',
    fontSize: 12,
    lineHeight: 17,
  },
  noticeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginTop: 12,
    padding: 15,
    backgroundColor: '#ECF7F2',
    borderWidth: 1,
    borderColor: '#B9DCCB',
    borderRadius: 16,
  },
  noticeCopy: {
    flex: 1,
  },
  noticeTitle: {
    color: '#124C39',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  noticeText: {
    color: '#325E50',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
});

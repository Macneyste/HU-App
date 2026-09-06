/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Hormuud University (HU) Mobile Application
 *  Digital Student ID Card Component
 *
 *  Features:
 *   - 60fps 3D Card Flip Animation using React Native Reanimated v3
 *   - Front Face: HU Branding, Photo, Student ID, Program, Expiry Date
 *   - Back Face: High-Density Dynamic QR Code, Barcode, Gate Security Pass
 *   - NativeWind v4 styling & HU brand tokens (#002147, #00875A, #FFAB00)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';
import {
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
} from 'lucide-react-native';
import type { StudentIdCard } from '../types';

interface DigitalIdCardProps {
  cardData: StudentIdCard;
  onScanPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 36, 360);
const CARD_HEIGHT = CARD_WIDTH * 1.58; // Standard ISO 7810 ID card ratio ~ 1:1.58

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ cardData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipRotation = useSharedValue(0);

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
    flipRotation.value = withSpring(isFlipped ? 0 : 180, {
      damping: 14,
      stiffness: 90,
      mass: 0.8,
    });
  };

  // Reanimated 3D Transform for the front face
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotateY}deg` },
      ],
      zIndex: flipRotation.value < 90 ? 10 : 0,
      opacity: flipRotation.value < 90 ? 1 : 0,
    };
  });

  // Reanimated 3D Transform for the back face
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    return {
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotateY}deg` },
      ],
      zIndex: flipRotation.value >= 90 ? 10 : 0,
      opacity: flipRotation.value >= 90 ? 1 : 0,
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={toggleFlip}
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        {/* ─── FRONT SIDE OF THE CARD ────────────────────────────────────── */}
        <Animated.View style={[styles.cardSurface, styles.frontCard, frontAnimatedStyle]}>
          {/* Top Navy Banner & University Crest */}
          <View style={styles.frontHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.huLogoBadge}>
                <Building2 size={20} color="#FFAB00" />
              </View>
              <View>
                <Text style={styles.universityTitle}>HORMUUD UNIVERSITY</Text>
                <Text style={styles.universityMotto}>Knowledge · Integrity · Excellence</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={14} color="#00875A" />
              <Text style={styles.verifiedText}>ACTIVE</Text>
            </View>
          </View>

          {/* Student Photo & Gold Halo */}
          <View style={styles.photoContainer}>
            <View style={styles.photoBorder}>
              <Image
                source={{ uri: cardData.photo }}
                style={styles.studentImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.idBadgePill}>
              <Text style={styles.idBadgeText}>{cardData.studentId}</Text>
            </View>
          </View>

          {/* Student Identity Information */}
          <View style={styles.identityDetails}>
            <Text style={styles.studentName} numberOfLines={1}>
              {cardData.fullName}
            </Text>
            <Text style={styles.facultyText} numberOfLines={1}>
              {cardData.faculty}
            </Text>
            <Text style={styles.programText} numberOfLines={1}>
              {cardData.program}
            </Text>
          </View>

          {/* Card Footer Dates & Hologram */}
          <View style={styles.frontFooter}>
            <View>
              <Text style={styles.dateLabel}>VALID THRU</Text>
              <View style={styles.dateRow}>
                <Calendar size={12} color="#002147" style={{ marginRight: 4 }} />
                <Text style={styles.dateValue}>{cardData.expiryDate}</Text>
              </View>
            </View>

            <View style={styles.hologramChip}>
              <Sparkles size={14} color="#FFAB00" />
              <Text style={styles.hologramText}>HU-SECURE</Text>
            </View>

            <View style={styles.flipHintContainer}>
              <RotateCcw size={14} color="#64748B" />
              <Text style={styles.flipHintText}>Tap to flip</Text>
            </View>
          </View>
        </Animated.View>

        {/* ─── BACK SIDE OF THE CARD ─────────────────────────────────────── */}
        <Animated.View style={[styles.cardSurface, styles.backCard, backAnimatedStyle]}>
          {/* Back Header */}
          <View style={styles.backHeader}>
            <View style={styles.backHeaderBadge}>
              <QrCode size={16} color="#002147" />
              <Text style={styles.backHeaderTitle}>CAMPUS PASS & VERIFICATION</Text>
            </View>
            <Text style={styles.backIdText}>{cardData.studentId}</Text>
          </View>

          {/* QR Code Container with High Scan Contrast */}
          <View style={styles.qrWrapper}>
            <View style={styles.qrWhiteBox}>
              <QRCode
                value={cardData.qrData}
                size={160}
                color="#002147"
                backgroundColor="#FFFFFF"
                logoSize={30}
                logoMargin={2}
                logoBorderRadius={15}
              />
            </View>
            <Text style={styles.scanInstruction}>
              Scan at Library Turnstiles & Campus Security Gates
            </Text>
          </View>

          {/* Simulated Digital Barcode Strip */}
          <View style={styles.barcodeSection}>
            <View style={styles.barcodeLines}>
              {Array.from({ length: 44 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.barcodeBar,
                    {
                      width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
                      backgroundColor: i % 7 === 0 ? 'transparent' : '#0F172A',
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.barcodeDigits}>{cardData.barcode}</Text>
          </View>

          {/* Emergency & Terms Policy Footer */}
          <View style={styles.backFooter}>
            <Text style={styles.termsText}>
              Property of Hormuud University, Mogadishu, Somalia. If found, please return to
              Admissions Office or call +252 61 200 0000.
            </Text>
            <View style={styles.flipHintContainer}>
              <RotateCcw size={14} color="#64748B" />
              <Text style={styles.flipHintText}>Tap to front</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  cardSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 22,
    backfaceVisibility: 'hidden',
    shadowColor: '#002147',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  frontCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 18,
    justifyContent: 'space-between',
  },
  backCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 18,
    justifyContent: 'space-between',
  },
  frontHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  huLogoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#002147',
    alignItems: 'center',
    justifyContent: 'center',
  },
  universityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#002147',
    letterSpacing: 0.8,
  },
  universityMotto: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00875A',
    letterSpacing: 0.5,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  photoBorder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3.5,
    borderColor: '#FFAB00',
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  studentImage: {
    width: '100%',
    height: '100%',
  },
  idBadgePill: {
    marginTop: -12,
    backgroundColor: '#002147',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  idBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  identityDetails: {
    alignItems: 'center',
    marginVertical: 4,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#002147',
    textAlign: 'center',
    marginBottom: 4,
  },
  facultyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00875A',
    textAlign: 'center',
  },
  programText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
  },
  frontFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002147',
  },
  hologramChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  hologramText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  flipHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flipHintText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  backHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#002147',
    letterSpacing: 0.5,
  },
  backIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  qrWhiteBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  scanInstruction: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 240,
  },
  barcodeSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  barcodeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    gap: 2,
    width: '100%',
  },
  barcodeBar: {
    height: '100%',
    borderRadius: 1,
  },
  barcodeDigits: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#475569',
    fontWeight: '700',
    marginTop: 4,
    fontFamily: 'Courier',
  },
  backFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 6,
  },
  termsText: {
    fontSize: 8.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 12,
  },
});

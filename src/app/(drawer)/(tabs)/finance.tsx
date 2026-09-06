/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Hormuud University (HU) Mobile Application
 *  Finance & Local Mobile Payment Integration Screen
 *
 *  Features:
 *   - Balance Sheet: Total Tuition Fee, Amount Paid, Remaining Balance
 *   - Circular Progress of Tuition Settlement
 *   - Mobile Payment Gateway Modal: EVC Plus, Sahal, Zaad with phone input
 *   - Transaction History with Status Badges
 *   - Currency in USD (Somalia Higher Ed standard)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Phone,
  DollarSign,
  X,
  CreditCard,
} from 'lucide-react-native';
import { MOCK_FINANCE } from '../../../data/mockData';
import type { PaymentMethod } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppHeader } from '../../../components/ui/AppHeader';
import { colors } from '../../../theme';

export default function FinanceScreen() {
  const [finance, setFinance] = useState(MOCK_FINANCE);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('evc_plus');
  const [phoneNumber, setPhoneNumber] = useState('615000000');
  const [amountToPay, setAmountToPay] = useState('600');
  const [isProcessing, setIsProcessing] = useState(false);

  const percentagePaid = Math.min(100, Math.round((finance.amountPaid / finance.totalTuition) * 100));

  const handlePayNow = () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      Alert.alert('Invalid Number', 'Please enter a valid Somali mobile money number (e.g. 61xxxxxxx)');
      return;
    }

    const payNum = parseFloat(amountToPay);
    if (isNaN(payNum) || payNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }

    if (payNum > finance.remainingBalance) {
      Alert.alert(
        'Amount Exceeds Balance',
        `The maximum payment you can make is $${finance.remainingBalance.toLocaleString()}.`,
      );
      return;
    }

    setIsProcessing(true);

    // Simulate mobile USSD prompt push
    setTimeout(() => {
      setIsProcessing(false);
      setModalVisible(false);

      const refNum = `${selectedMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`;
      Alert.alert(
        'Demo Payment Approved',
        `The $${payNum.toLocaleString()} prototype payment was recorded for +252 ${phoneNumber}. No real mobile-money charge was made. Ref: ${refNum}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Update local state to reflect settlement
              setFinance((prev) => ({
                ...prev,
                amountPaid: prev.amountPaid + payNum,
                remainingBalance: Math.max(0, prev.remainingBalance - payNum),
                payments: [
                  {
                    id: `pay_${Date.now()}`,
                    description:
                      payNum === prev.remainingBalance
                        ? 'Tuition Fee — Semester 6 (Final Installment)'
                        : 'Tuition Fee — Semester 6 (Partial Installment)',
                    amount: payNum,
                    paidAmount: payNum,
                    dueDate: new Date().toISOString().split('T')[0],
                    paidDate: new Date().toISOString().split('T')[0],
                    status: 'completed',
                    method: selectedMethod,
                    referenceNumber: refNum,
                  },
                  ...prev.payments,
                ],
              }));
            },
          },
        ]
      );
    }, 1200);
  };

  return (
    <View className="flex-1 bg-hu-bg">
      <StatusBar barStyle="light-content" backgroundColor={colors.navyDark} />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <AppHeader
        eyebrow="Student accounts"
        title="Tuition & payments"
        subtitle="Track balances, installments and receipts."
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
      >
        {/* ─── Balance Sheet Summary Card ────────────────────────────── */}
        <Card shadow="md" style={{ marginBottom: 16, backgroundColor: '#002147' }}>
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                Outstanding Tuition Balance
              </Text>
              <Text className="text-white text-3xl font-black mt-1">
                ${finance.remainingBalance.toLocaleString()}
              </Text>
              <Text className="text-hu-accent text-xs font-semibold mt-1">
                Due Date: {finance.nextDueDate}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setAmountToPay(String(finance.remainingBalance));
                setModalVisible(true);
              }}
              disabled={finance.remainingBalance === 0}
              accessibilityRole="button"
              accessibilityLabel="Pay tuition balance"
              accessibilityState={{ disabled: finance.remainingBalance === 0 }}
              className="bg-hu-secondary px-4 py-2.5 rounded-xl flex-row items-center shadow-md"
            >
              <CreditCard size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text className="text-white font-extrabold text-xs">
                {finance.remainingBalance === 0 ? 'Paid in Full' : 'Pay Now'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View className="mt-2">
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-gray-300 text-xs font-bold">Settlement Progress</Text>
              <Text className="text-hu-accent text-xs font-black">{percentagePaid}% Paid</Text>
            </View>
            <View className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <View
                style={{ width: `${percentagePaid}%` }}
                className="h-full bg-hu-secondary rounded-full"
              />
            </View>
          </View>

          {/* Breakdown Stats Row */}
          <View className="flex-row justify-between mt-5 pt-4 border-t border-white/10">
            <View>
              <Text className="text-gray-400 text-[11px] font-bold uppercase">Total Invoiced</Text>
              <Text className="text-white text-sm font-extrabold mt-0.5">
                ${finance.totalTuition.toLocaleString()}
              </Text>
            </View>
            <View>
              <Text className="text-gray-400 text-[11px] font-bold uppercase">Amount Cleared</Text>
              <Text className="text-hu-secondary-light text-sm font-extrabold mt-0.5">
                ${finance.amountPaid.toLocaleString()}
              </Text>
            </View>
            <View>
              <Text className="text-gray-400 text-[11px] font-bold uppercase">Status</Text>
              <Text className="text-amber-400 text-sm font-extrabold mt-0.5">
                {finance.remainingBalance === 0 ? 'Fully Paid' : 'Partially Paid'}
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── Payment Gateway Selection Drawer / Modal ──────────────── */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="bg-white rounded-t-[32px] p-6 shadow-2xl">
              <View className="flex-row justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <View>
                  <Text className="text-hu-primary font-black text-lg">
                    Somali Mobile Gateway
                  </Text>
                  <Text className="text-gray-400 text-xs">Direct push to handset</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close payment panel"
                  className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
                >
                  <X size={18} color="#475569" />
                </TouchableOpacity>
              </View>

              {/* Provider Selection (EVC Plus, Sahal, Zaad) */}
              <Text className="text-gray-700 text-xs font-bold mb-2 uppercase">
                Choose Provider
              </Text>
              <View className="flex-row gap-2.5 mb-5">
                {(['evc_plus', 'sahal', 'zaad'] as PaymentMethod[]).map((method) => {
                  const isSelected = selectedMethod === method;
                  const label =
                    method === 'evc_plus'
                      ? 'EVC Plus (Hormuud)'
                      : method === 'sahal'
                      ? 'Sahal (Golis)'
                      : 'Zaad (Telesom)';

                  return (
                    <TouchableOpacity
                      key={method}
                      onPress={() => setSelectedMethod(method)}
                      activeOpacity={0.8}
                      accessibilityRole="radio"
                      accessibilityLabel={label}
                      accessibilityState={{ selected: isSelected }}
                      className={`flex-1 p-3 rounded-2xl border items-center ${
                        isSelected
                          ? 'bg-hu-primary/5 border-hu-primary'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <View
                        className={`w-3.5 h-3.5 rounded-full border mb-1.5 items-center justify-center ${
                          isSelected ? 'border-hu-primary bg-hu-primary' : 'border-gray-400'
                        }`}
                      />
                      <Text
                        className={`text-[11px] font-bold text-center ${
                          isSelected ? 'text-hu-primary' : 'text-gray-600'
                        }`}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Amount Input */}
              <View className="mb-4">
                <Text className="text-gray-700 text-xs font-bold mb-1.5">
                  Payment Amount ($ USD)
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 bg-gray-50">
                  <DollarSign size={18} color="#002147" />
                  <TextInput
                    value={amountToPay}
                    onChangeText={setAmountToPay}
                    keyboardType="numeric"
                    className="flex-1 py-3 px-2 text-base font-bold text-gray-900"
                  />
                </View>
              </View>

              {/* Phone Number Input */}
              <View className="mb-6">
                <Text className="text-gray-700 text-xs font-bold mb-1.5">
                  Mobile Money Phone Number
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 bg-gray-50">
                  <Text className="text-gray-600 font-bold text-sm mr-2">+252</Text>
                  <Phone size={16} color="#64748B" style={{ marginRight: 6 }} />
                  <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    placeholder="61xxxxxxx"
                    className="flex-1 py-3 text-base font-bold text-gray-900"
                  />
                </View>
              </View>

              <Button
                title={isProcessing ? 'Dispatching USSD Prompt...' : `Send $${amountToPay} via ${selectedMethod === 'evc_plus' ? 'EVC Plus' : selectedMethod.toUpperCase()}`}
                onPress={handlePayNow}
                loading={isProcessing}
                variant="secondary"
                fullWidth
                size="lg"
                accessibilityHint="Records a local demo payment without charging real mobile money"
              />
            </View>
          </View>
        </Modal>

        {/* ─── Transaction History ─────────────────────────────────────── */}
        <Text className="text-hu-primary font-black text-sm mb-3">
          Payment Transactions & Receipts
        </Text>

        {finance.payments.map((p) => (
          <Card
            key={p.id}
            shadow="sm"
            style={{ marginBottom: 10 }}
            onPress={() => Alert.alert(
              'Payment Receipt',
              `${p.description}\nAmount: $${p.amount.toLocaleString()}\nStatus: ${p.status}\nReference: ${p.referenceNumber ?? 'Pending'}`,
            )}
            accessibilityLabel={`Open receipt for ${p.description}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                    p.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}
                >
                  {p.status === 'completed' ? (
                    <CheckCircle2 size={20} color="#00875A" />
                  ) : (
                    <Clock size={20} color="#B45309" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm" numberOfLines={1}>
                    {p.description}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {p.paidDate ? `Paid on ${p.paidDate}` : `Due: ${p.dueDate}`}
                    {p.referenceNumber ? ` · ${p.referenceNumber}` : ''}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-gray-900 font-black text-sm">
                  ${p.amount.toLocaleString()}
                </Text>
                <View className="mt-1">
                  <Badge
                    label={p.status.toUpperCase()}
                    variant={p.status === 'completed' ? 'success' : 'warning'}
                    size="sm"
                  />
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

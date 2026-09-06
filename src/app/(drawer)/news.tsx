import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BellRing,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  Clock3,
  Megaphone,
  Newspaper,
  Share2,
  X,
} from 'lucide-react-native';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import type { Announcement } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

type NewsFilter = 'all' | Announcement['category'];

const FILTERS: Array<{ key: NewsFilter; label: string }> = [
  { key: 'all', label: 'All updates' },
  { key: 'academic', label: 'Academic' },
  { key: 'event', label: 'Events' },
  { key: 'general', label: 'Campus' },
];

const categoryLabel = (category: Announcement['category']) => {
  if (category === 'academic') return 'ACADEMIC';
  if (category === 'event') return 'EVENT';
  if (category === 'urgent') return 'URGENT';
  return 'CAMPUS';
};

const categoryVariant = (
  category: Announcement['category'],
): 'primary' | 'warning' | 'danger' | 'neutral' => {
  if (category === 'academic') return 'primary';
  if (category === 'event') return 'warning';
  if (category === 'urgent') return 'danger';
  return 'neutral';
};

const formatDate = (value: string, long = false) =>
  new Date(value).toLocaleDateString('en-US', {
    month: long ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function NewsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    MOCK_ANNOUNCEMENTS.map((item) => ({ ...item })),
  );
  const [filter, setFilter] = useState<NewsFilter>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = useMemo(
    () =>
      filter === 'all'
        ? announcements
        : announcements.filter((announcement) => announcement.category === filter),
    [announcements, filter],
  );
  const unreadCount = announcements.filter((announcement) => !announcement.isRead).length;

  const openAnnouncement = (announcement: Announcement) => {
    const openedAnnouncement = { ...announcement, isRead: true };
    setAnnouncements((current) =>
      current.map((item) => (item.id === announcement.id ? openedAnnouncement : item)),
    );
    setSelectedAnnouncement(openedAnnouncement);
  };

  const markAllRead = () => {
    setAnnouncements((current) => current.map((item) => ({ ...item, isRead: true })));
    if (selectedAnnouncement) {
      setSelectedAnnouncement({ ...selectedAnnouncement, isRead: true });
    }
  };

  const shareAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    try {
      await Share.share({
        title: selectedAnnouncement.title,
        message: [
          selectedAnnouncement.title,
          selectedAnnouncement.summary,
          '',
          `Published ${formatDate(selectedAnnouncement.publishedAt, true)} by Hormuud University.`,
        ].join('\n'),
      });
    } catch {
      Alert.alert('Unable to share', 'Your device could not open the share menu. Please try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#002147" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <Newspaper size={25} color="#FFAB00" />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>HU NEWSROOM</Text>
              <Text style={styles.heroTitle}>Campus Updates</Text>
              <Text style={styles.heroSubtitle}>Trusted notices from your university</Text>
            </View>
          </View>

          <View style={styles.unreadPanel}>
            <View style={styles.unreadSummary}>
              <View style={styles.unreadIcon}>
                <BellRing size={18} color="#002147" />
              </View>
              <View>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
                <Text style={styles.unreadLabel}>
                  {unreadCount === 1 ? 'unread announcement' : 'unread announcements'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.78}
              disabled={unreadCount === 0}
              onPress={markAllRead}
              accessibilityRole="button"
              accessibilityLabel="Mark all announcements as read"
              accessibilityState={{ disabled: unreadCount === 0 }}
              style={[styles.markReadButton, unreadCount === 0 && styles.markReadButtonDisabled]}
            >
              <CheckCheck size={16} color={unreadCount === 0 ? '#94A3B8' : '#00875A'} />
              <Text style={[styles.markReadText, unreadCount === 0 && styles.markReadTextDisabled]}>
                {unreadCount === 0 ? 'All read' : 'Mark all read'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            accessibilityRole="tablist"
          >
            {FILTERS.map((item) => {
              const selected = item.key === filter;
              const count =
                item.key === 'all'
                  ? announcements.length
                  : announcements.filter((announcement) => announcement.category === item.key).length;
              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.78}
                  onPress={() => setFilter(item.key)}
                  accessibilityRole="tab"
                  accessibilityLabel={`${item.label}, ${count} announcements`}
                  accessibilityState={{ selected }}
                  style={[styles.filterButton, selected && styles.filterButtonSelected]}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                    {item.label}
                  </Text>
                  <View style={[styles.filterCount, selected && styles.filterCountSelected]}>
                    <Text style={[styles.filterCountText, selected && styles.filterCountTextSelected]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>
                {filter === 'all'
                  ? 'Latest announcements'
                  : `${FILTERS.find((item) => item.key === filter)?.label ?? 'Campus'} updates`}
              </Text>
              <Text style={styles.sectionSubtitle}>Tap an update to read the full notice</Text>
            </View>
            <Text style={styles.resultCount}>{filteredAnnouncements.length}</Text>
          </View>

          {filteredAnnouncements.length === 0 ? (
            <Card shadow="sm">
              <View style={styles.emptyState}>
                <Megaphone size={30} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No announcements here</Text>
                <Text style={styles.emptyText}>Choose another category to see campus updates.</Text>
              </View>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <TouchableOpacity
                key={announcement.id}
                activeOpacity={0.82}
                onPress={() => openAnnouncement(announcement)}
                accessibilityRole="button"
                accessibilityLabel={`${announcement.isRead ? '' : 'Unread. '}${announcement.title}`}
                accessibilityHint="Opens the full announcement"
                style={styles.newsPressable}
              >
                <Card shadow="sm" padding={0}>
                  <View style={styles.newsCard}>
                    <View style={styles.cardAccent} />
                    <View style={styles.newsContent}>
                      <View style={styles.newsMetaRow}>
                        <Badge
                          label={categoryLabel(announcement.category)}
                          variant={categoryVariant(announcement.category)}
                          size="sm"
                        />
                        <View style={styles.dateRow}>
                          <Clock3 size={12} color="#94A3B8" />
                          <Text style={styles.dateText}>{formatDate(announcement.publishedAt)}</Text>
                        </View>
                        {!announcement.isRead && (
                          <View
                            accessibilityLabel="Unread"
                            style={styles.unreadDot}
                          />
                        )}
                      </View>

                      <Text style={styles.newsTitle}>{announcement.title}</Text>
                      <Text style={styles.newsSummary} numberOfLines={2}>
                        {announcement.summary}
                      </Text>

                      <View style={styles.readRow}>
                        <Text style={styles.readText}>
                          {announcement.isRead ? 'Read again' : 'Read announcement'}
                        </Text>
                        <ChevronRight size={17} color="#00875A" />
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}

          <View style={styles.sourceNotice}>
            <Megaphone size={17} color="#B45309" />
            <Text style={styles.sourceNoticeText}>
              Urgent notices are also sent through official HU email and SMS channels.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={selectedAnnouncement !== null}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setSelectedAnnouncement(null)}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSelectedAnnouncement(null)}
            accessibilityRole="button"
            accessibilityLabel="Close announcement"
            style={StyleSheet.absoluteFill}
          />

          {selectedAnnouncement && (
            <View style={styles.modalSheet} accessibilityViewIsModal>
              <View style={styles.sheetHandle} />
              <View style={styles.modalTopRow}>
                <Badge
                  label={categoryLabel(selectedAnnouncement.category)}
                  variant={categoryVariant(selectedAnnouncement.category)}
                  size="sm"
                />
                <TouchableOpacity
                  activeOpacity={0.72}
                  onPress={() => setSelectedAnnouncement(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Close announcement"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.closeButton}
                >
                  <X size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <Text style={styles.modalTitle}>{selectedAnnouncement.title}</Text>
                <View style={styles.modalDateRow}>
                  <CalendarDays size={14} color="#64748B" />
                  <Text style={styles.modalDate}>
                    Published {formatDate(selectedAnnouncement.publishedAt, true)}
                  </Text>
                </View>
                <View style={styles.modalDivider} />
                <Text style={styles.modalLead}>{selectedAnnouncement.summary}</Text>
                <Text style={styles.modalBody}>{selectedAnnouncement.content}</Text>
                <Text style={styles.modalBody}>
                  Students who need clarification should contact their department office using their
                  official university email address.
                </Text>
              </ScrollView>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={shareAnnouncement}
                accessibilityRole="button"
                accessibilityLabel={`Share ${selectedAnnouncement.title}`}
                style={styles.shareButton}
              >
                <Share2 size={18} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Share Announcement</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FA' },
  scrollContent: { paddingBottom: 36 },
  hero: {
    backgroundColor: '#002147',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(255,171,0,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,171,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1, marginLeft: 12 },
  eyebrow: { color: '#FFAB00', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  heroTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', marginTop: 2 },
  heroSubtitle: { color: '#CBD5E1', fontSize: 11, fontWeight: '600', marginTop: 2 },
  unreadPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 12,
    marginTop: 20,
  },
  unreadSummary: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  unreadIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  unreadCount: { color: '#002147', fontSize: 17, fontWeight: '900', lineHeight: 19 },
  unreadLabel: { color: '#64748B', fontSize: 10, fontWeight: '700', marginTop: 1, maxWidth: 105 },
  markReadButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 11,
  },
  markReadButtonDisabled: { backgroundColor: '#F1F5F9' },
  markReadText: { color: '#047857', fontSize: 11, fontWeight: '900' },
  markReadTextDisabled: { color: '#94A3B8' },
  body: { paddingHorizontal: 16, paddingTop: 18 },
  filterList: { gap: 8, paddingBottom: 5 },
  filterButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 13,
  },
  filterButtonSelected: { backgroundColor: '#002147', borderColor: '#002147' },
  filterText: { color: '#475569', fontSize: 12, fontWeight: '800' },
  filterTextSelected: { color: '#FFFFFF' },
  filterCount: {
    minWidth: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterCountSelected: { backgroundColor: 'rgba(255,255,255,0.15)' },
  filterCountText: { color: '#64748B', fontSize: 9, fontWeight: '900' },
  filterCountTextSelected: { color: '#FFAB00' },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 19,
    marginBottom: 12,
  },
  sectionTitle: { color: '#002147', fontSize: 17, fontWeight: '900' },
  sectionSubtitle: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 },
  resultCount: {
    color: '#002147',
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  newsPressable: { marginBottom: 11 },
  newsCard: { flexDirection: 'row', overflow: 'hidden', borderRadius: 16 },
  cardAccent: { width: 4, backgroundColor: '#00875A' },
  newsContent: { flex: 1, padding: 15 },
  newsMetaRow: { flexDirection: 'row', alignItems: 'center' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 9 },
  dateText: { color: '#94A3B8', fontSize: 10, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFAB00', marginLeft: 'auto' },
  newsTitle: { color: '#0F172A', fontSize: 15, fontWeight: '900', lineHeight: 20, marginTop: 10 },
  newsSummary: { color: '#64748B', fontSize: 11.5, lineHeight: 17, marginTop: 5 },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 11,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  readText: { color: '#00875A', fontSize: 11, fontWeight: '900', marginRight: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 30 },
  emptyTitle: { color: '#1E293B', fontSize: 14, fontWeight: '900', marginTop: 10 },
  emptyText: { color: '#64748B', fontSize: 11, marginTop: 3 },
  sourceNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 13,
    marginTop: 4,
  },
  sourceNoticeText: { flex: 1, color: '#78520C', fontSize: 11, lineHeight: 16, fontWeight: '600' },
  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.64)' },
  modalSheet: {
    maxHeight: '82%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 22,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTopRow: { minHeight: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalScroll: { flexGrow: 0 },
  modalTitle: { color: '#0F172A', fontSize: 22, lineHeight: 28, fontWeight: '900', marginTop: 9 },
  modalDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  modalDate: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 17 },
  modalLead: { color: '#002147', fontSize: 14, lineHeight: 21, fontWeight: '800' },
  modalBody: { color: '#475569', fontSize: 13, lineHeight: 21, marginTop: 13 },
  shareButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#00875A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  shareButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
});

import React, { useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bookmark,
  BookOpen,
  Check,
  Download,
  GraduationCap,
  Search,
  SearchX,
  X,
} from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
}

const BOOKS: BookItem[] = [
  {
    id: 'b1',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    category: 'Computer Science',
    pages: 1312,
  },
  {
    id: 'b2',
    title: 'Database System Concepts (7th Edition)',
    author: 'Abraham Silberschatz, Henry F. Korth',
    category: 'Databases',
    pages: 1376,
  },
  {
    id: 'b3',
    title: 'Computer Networking: A Top-Down Approach',
    author: 'James Kurose, Keith Ross',
    category: 'Networking',
    pages: 864,
  },
  {
    id: 'b4',
    title: 'Modern Software Engineering',
    author: 'David Farley',
    category: 'Software Engineering',
    pages: 256,
  },
];

const DOWNLOAD_DELAY_MS = 850;

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);
  const downloadTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(() => new Set());
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(() => new Set());

  React.useEffect(() => {
    return () => {
      Object.values(downloadTimers.current).forEach(clearTimeout);
    };
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return BOOKS;

    return BOOKS.filter((book) =>
      [book.title, book.author, book.category].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [searchQuery]);

  const announce = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  const toggleBookmark = (book: BookItem) => {
    const willBookmark = !bookmarkedIds.has(book.id);
    setBookmarkedIds((current) => {
      const next = new Set(current);
      if (willBookmark) next.add(book.id);
      else next.delete(book.id);
      return next;
    });
    announce(`${book.title} ${willBookmark ? 'saved to bookmarks' : 'removed from bookmarks'}.`);
  };

  const handleDownload = (book: BookItem) => {
    if (downloadingIds.has(book.id)) return;

    if (downloadedIds.has(book.id)) {
      setDownloadedIds((current) => {
        const next = new Set(current);
        next.delete(book.id);
        return next;
      });
      announce(`${book.title} removed from this demo session.`);
      return;
    }

    setDownloadingIds((current) => new Set(current).add(book.id));
    announce(`Preparing ${book.title} for offline demo access.`);

    downloadTimers.current[book.id] = setTimeout(() => {
      setDownloadingIds((current) => {
        const next = new Set(current);
        next.delete(book.id);
        return next;
      });
      setDownloadedIds((current) => new Set(current).add(book.id));
      delete downloadTimers.current[book.id];
      announce(`${book.title} is available for this demo session.`);
    }, DOWNLOAD_DELAY_MS);
  };

  const showJournalInfo = () => {
    Alert.alert(
      'HU Research Hub demo',
      'The live journals catalogue is not connected in this demo build. The university library can connect this area to its licensed databases before release.',
      [{ text: 'Got it' }],
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
    announce('Search cleared.');
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#002147" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 20 },
        ]}
      >
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <GraduationCap size={24} color="#FFBE33" />
          </View>
          <View style={styles.introCopy}>
            <Text style={styles.eyebrow}>ACADEMIC RESOURCES</Text>
            <Text style={styles.introTitle}>Study, save, and revisit</Text>
            <Text style={styles.introBody}>
              Browse recommended textbooks for your current semester.
            </Text>
          </View>
        </View>

        <View style={styles.demoNotice} accessible accessibilityRole="text">
          <View style={styles.demoDot} />
          <Text style={styles.demoText}>
            Demo catalogue · bookmarks and offline status last for this session only
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search books, authors, or subjects"
            placeholderTextColor="#64748B"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
            style={styles.searchInput}
            accessibilityLabel="Search the library catalogue"
            accessibilityHint="Search by book title, author, or subject"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={clearSearch}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel="Clear library search"
              style={({ pressed }) => [styles.clearButton, pressed && styles.pressedSubtle]}
            >
              <X size={18} color="#475569" />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={showJournalInfo}
          accessibilityRole="button"
          accessibilityLabel="HU International Journals demo"
          accessibilityHint="Shows information about the research hub demo"
          style={({ pressed }) => [styles.journalCard, pressed && styles.pressedCard]}
        >
          <View style={styles.journalCopy}>
            <Badge label="RESEARCH HUB" variant="warning" size="sm" />
            <Text style={styles.journalTitle}>HU International Journals</Text>
            <Text style={styles.journalBody}>
              A future home for peer-reviewed articles and faculty research.
            </Text>
            <Text style={styles.journalAction}>Learn about this demo →</Text>
          </View>
          <View style={styles.journalIcon}>
            <BookOpen size={24} color="#FFBE33" />
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Semester textbooks</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'result' : 'results'}
            </Text>
          </View>
          {bookmarkedIds.size > 0 && (
            <View style={styles.savedCount}>
              <Bookmark size={14} color="#006C48" fill="#006C48" />
              <Text style={styles.savedCountText}>{bookmarkedIds.size} saved</Text>
            </View>
          )}
        </View>

        {filteredBooks.length === 0 ? (
          <View style={styles.emptyState} accessible accessibilityRole="text">
            <View style={styles.emptyIcon}>
              <SearchX size={28} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>No matching resources</Text>
            <Text style={styles.emptyBody}>
              Try a shorter title, an author surname, or a broader subject.
            </Text>
            <Pressable
              onPress={clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search and show all textbooks"
              style={({ pressed }) => [styles.emptyButton, pressed && styles.pressedPrimary]}
            >
              <Text style={styles.emptyButtonText}>Show all textbooks</Text>
            </Pressable>
          </View>
        ) : (
          filteredBooks.map((book) => {
            const isBookmarked = bookmarkedIds.has(book.id);
            const isDownloaded = downloadedIds.has(book.id);
            const isDownloading = downloadingIds.has(book.id);

            return (
              <View key={book.id} style={styles.bookCard}>
                <View style={styles.bookMainRow}>
                  <View style={styles.bookIcon}>
                    <BookOpen size={21} color="#002147" />
                  </View>
                  <View style={styles.bookCopy}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor} numberOfLines={2}>
                      {book.author}
                    </Text>
                  </View>
                </View>

                <View style={styles.metadataRow}>
                  <Badge label={book.category} variant="neutral" size="sm" />
                  <Text style={styles.pageCount}>{book.pages.toLocaleString()} pages</Text>
                  {isDownloaded && (
                    <View style={styles.offlineStatus}>
                      <Check size={13} color="#006C48" strokeWidth={3} />
                      <Text style={styles.offlineStatusText}>Demo offline</Text>
                    </View>
                  )}
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => toggleBookmark(book)}
                    accessibilityRole="button"
                    accessibilityLabel={`${isBookmarked ? 'Remove' : 'Add'} ${book.title} ${
                      isBookmarked ? 'from' : 'to'
                    } bookmarks`}
                    accessibilityState={{ selected: isBookmarked }}
                    style={({ pressed }) => [
                      styles.secondaryAction,
                      isBookmarked && styles.secondaryActionSelected,
                      pressed && styles.pressedSubtle,
                    ]}
                  >
                    <Bookmark
                      size={18}
                      color={isBookmarked ? '#006C48' : '#475569'}
                      fill={isBookmarked ? '#006C48' : 'transparent'}
                    />
                    <Text
                      style={[
                        styles.secondaryActionText,
                        isBookmarked && styles.secondaryActionTextSelected,
                      ]}
                    >
                      {isBookmarked ? 'Saved' : 'Bookmark'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDownload(book)}
                    disabled={isDownloading}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isDownloading
                        ? `Preparing ${book.title}`
                        : isDownloaded
                          ? `Remove ${book.title} from demo offline access`
                          : `Make ${book.title} available for demo offline access`
                    }
                    accessibilityHint="This is a session-only demonstration and does not save a permanent file"
                    accessibilityState={{ disabled: isDownloading, busy: isDownloading }}
                    style={({ pressed }) => [
                      styles.primaryAction,
                      isDownloaded && styles.primaryActionDownloaded,
                      pressed && !isDownloading && styles.pressedPrimary,
                    ]}
                  >
                    {isDownloading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : isDownloaded ? (
                      <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <Download size={18} color="#FFFFFF" />
                    )}
                    <Text style={styles.primaryActionText}>
                      {isDownloading ? 'Preparing…' : isDownloaded ? 'Available' : 'Demo offline'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  introCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18,
    backgroundColor: '#002147', borderRadius: 20,
  },
  introIcon: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255, 190, 51, 0.14)', borderWidth: 1,
    borderColor: 'rgba(255, 190, 51, 0.35)',
  },
  introCopy: { flex: 1 },
  eyebrow: { color: '#FFBE33', fontSize: 11, lineHeight: 15, fontWeight: '800', letterSpacing: 0.9 },
  introTitle: { color: '#FFFFFF', fontSize: 20, lineHeight: 26, fontWeight: '800', marginTop: 2 },
  introBody: { color: '#D7E1EC', fontSize: 13, lineHeight: 19, marginTop: 3 },
  demoNotice: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFF8E8',
    borderColor: '#F4D58A', borderWidth: 1, borderRadius: 12,
  },
  demoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9A6400' },
  demoText: { flex: 1, color: '#6D4A00', fontSize: 12, lineHeight: 17, fontWeight: '600' },
  searchContainer: {
    minHeight: 52, marginTop: 14, marginBottom: 14, paddingLeft: 15, paddingRight: 4,
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D7E0EA', borderRadius: 15, shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  searchInput: { flex: 1, minHeight: 50, paddingVertical: 12, color: '#172033', fontSize: 15 },
  clearButton: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  journalCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE4EC', borderRadius: 18,
  },
  journalCopy: { flex: 1 },
  journalTitle: { color: '#102A43', fontSize: 16, lineHeight: 22, fontWeight: '800', marginTop: 8 },
  journalBody: { color: '#526477', fontSize: 13, lineHeight: 19, marginTop: 3 },
  journalAction: { color: '#006C48', fontSize: 13, lineHeight: 18, fontWeight: '700', marginTop: 8 },
  journalIcon: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#002147',
  },
  sectionHeader: {
    minHeight: 50, marginTop: 24, marginBottom: 10, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  sectionTitle: { color: '#102A43', fontSize: 17, lineHeight: 23, fontWeight: '800' },
  sectionSubtitle: { color: '#64748B', fontSize: 12, lineHeight: 17, marginTop: 1 },
  savedCount: {
    minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, backgroundColor: '#E8F5EF', borderRadius: 999,
  },
  savedCountText: { color: '#006C48', fontSize: 12, fontWeight: '700' },
  bookCard: {
    marginBottom: 12, padding: 16, backgroundColor: '#FFFFFF', borderWidth: 1,
    borderColor: '#DCE4EC', borderRadius: 18, shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  bookMainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bookIcon: {
    width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E8EEF5',
  },
  bookCopy: { flex: 1 },
  bookTitle: { color: '#172033', fontSize: 15, lineHeight: 21, fontWeight: '800' },
  bookAuthor: { color: '#526477', fontSize: 13, lineHeight: 19, marginTop: 3 },
  metadataRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 13 },
  pageCount: { color: '#64748B', fontSize: 12, lineHeight: 17 },
  offlineStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  offlineStatusText: { color: '#006C48', fontSize: 12, lineHeight: 17, fontWeight: '700' },
  actionRow: {
    flexDirection: 'row', gap: 10, marginTop: 15, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#E8EDF3',
  },
  secondaryAction: {
    minHeight: 46, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingHorizontal: 10, backgroundColor: '#F4F7FA', borderWidth: 1,
    borderColor: '#D7E0EA', borderRadius: 13,
  },
  secondaryActionSelected: { backgroundColor: '#E8F5EF', borderColor: '#A8D5C3' },
  secondaryActionText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  secondaryActionTextSelected: { color: '#006C48' },
  primaryAction: {
    minHeight: 46, flex: 1.25, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7, paddingHorizontal: 10, backgroundColor: '#002147',
    borderRadius: 13,
  },
  primaryActionDownloaded: { backgroundColor: '#006C48' },
  primaryActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  emptyState: {
    alignItems: 'center', paddingHorizontal: 24, paddingVertical: 34, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#DCE4EC', borderRadius: 18,
  },
  emptyIcon: {
    width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EEF2F6',
  },
  emptyTitle: { color: '#172033', fontSize: 17, lineHeight: 23, fontWeight: '800', marginTop: 14 },
  emptyBody: { color: '#526477', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 5 },
  emptyButton: {
    minHeight: 46, marginTop: 18, paddingHorizontal: 18, alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#002147', borderRadius: 13,
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  pressedSubtle: { opacity: 0.68 },
  pressedPrimary: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  pressedCard: { opacity: 0.86, transform: [{ scale: 0.995 }] },
});

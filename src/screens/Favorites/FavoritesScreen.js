// CineVerse — Favorites Screen
import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {useFavoritesList} from '../../hooks/useFavorites';
import {removeFavorite} from '../../storage/storageService';
import {buildPosterUrl} from '../../api/imageService';
import {
  getTitle,
  getReleaseDate,
  getYear,
  formatRating,
} from '../../utils/helpers';
import {NoItemsState} from '../../components/states/StateComponents';
import {ROUTES} from '../../navigation/AppNavigator';

function FavoriteItem({item, onPress, onRemove}) {
  const title = getTitle(item);
  const year = getYear(getReleaseDate(item));
  const rating = formatRating(item.vote_average);
  const posterUrl = buildPosterUrl(item.poster_path);
  const isTV = item.media_type === 'tv';

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      accessibilityLabel={title}
      accessibilityRole="button">
      <View style={styles.poster}>
        {posterUrl ? (
          <FastImage
            source={{uri: posterUrl, priority: FastImage.priority.normal}}
            style={styles.posterImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[styles.posterImage, styles.posterPlaceholder]}>
            <Icon
              name={isTV ? 'tv-outline' : 'film-outline'}
              size={24}
              color={Colors.textMuted}
            />
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <View style={[styles.typeBadge, isTV && styles.tvBadge]}>
            <Text style={[styles.typeLabel, isTV && styles.tvLabel]}>
              {isTV ? 'TV' : 'Movie'}
            </Text>
          </View>
        </View>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.itemMeta}>
          {year ? <Text style={styles.itemYear}>{year}</Text> : null}
          <View style={styles.ratingRow}>
            <Icon name="star" size={11} color={Colors.accentGold} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => onRemove(item)}
        accessibilityLabel={`Remove ${title} from favorites`}
        accessibilityRole="button">
        <Icon name="heart-dislike-outline" size={20} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen({navigation}) {
  const {favorites, loading, refresh} = useFavoritesList();

  // Refresh list when screen gets focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handlePress = useCallback(
    item => {
      if (item.media_type === 'tv') {
        navigation.navigate(ROUTES.TV_DETAILS, {seriesId: item.id, show: item});
      } else {
        navigation.navigate(ROUTES.MOVIE_DETAILS, {
          movieId: item.id,
          movie: item,
        });
      }
    },
    [navigation],
  );

  const handleRemove = useCallback(
    async item => {
      await removeFavorite(item);
      refresh();
    },
    [refresh],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Icon name="heart" size={22} color={Colors.accent} />
        <Text style={styles.headerTitle}>Favorites</Text>
        {favorites.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favorites.length}</Text>
          </View>
        )}
      </View>

      {loading ? null : favorites.length === 0 ? (
        <NoItemsState type="favorites" />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, idx) => `fav_${item.id}_${idx}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <FavoriteItem
              item={item}
              onPress={handlePress}
              onRemove={handleRemove}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
        />
      )}
    </View>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerTitle: {...Typography.sectionTitle, color: Colors.textPrimary},
  countBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  countText: {color: '#fff', fontSize: 12, fontWeight: '700'},
  list: {padding: Spacing.screenPadding, gap: Spacing.sm},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    gap: Spacing.md,
    padding: Spacing.sm,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
    flexShrink: 0,
  },
  posterImage: {width: '100%', height: '100%'},
  posterPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {flex: 1, gap: 6},
  itemHeader: {flexDirection: 'row', alignItems: 'center'},
  typeBadge: {
    backgroundColor: Colors.accent + '33',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  tvBadge: {
    backgroundColor: Colors.accentBlue + '33',
    borderColor: Colors.accentBlue,
  },
  typeLabel: {
    color: Colors.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tvLabel: {color: Colors.accentBlue},
  itemTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  itemMeta: {flexDirection: 'row', alignItems: 'center', gap: 10},
  itemYear: {color: Colors.textMuted, fontSize: 13},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 3},
  ratingText: {color: Colors.accentGold, fontSize: 12, fontWeight: '700'},
  removeBtn: {padding: Spacing.sm},
  separator: {height: Spacing.sm},
});

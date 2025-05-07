import { useEffect, useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { CurrencyInfo } from '../types/currency';
import CurrencySearchIndex from '../services/currencySearchIndex';
import useDebounce from '../hooks/useDebounce';

type CurrencySearchBarProps = {
  currencies: CurrencyInfo[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchResults: (results: CurrencyInfo[]) => void;
};

const CurrencySearchBar = ({
  currencies,
  searchQuery,
  setSearchQuery,
  onSearchResults,
}: CurrencySearchBarProps) => {
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);
  const iconWidth = useSharedValue(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const searcherRef = useRef<CurrencySearchIndex | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    searcherRef.current = new CurrencySearchIndex(currencies);
  }, [currencies]);

  useEffect(() => {
    if (isFocused) {
      iconWidth.value = withTiming(40, { duration: 200 });
      iconOpacity.value = withTiming(1, { duration: 200 });
      iconScale.value = withTiming(1, { duration: 200 });
    } else {
      iconWidth.value = withTiming(0, { duration: 200 });
      iconOpacity.value = withTiming(0, { duration: 200 });
      iconScale.value = withTiming(0.5, { duration: 200 });
    }
  }, [isFocused]);

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    width: iconWidth.value,
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.blur();
    onSearchResults(currencies);
  };

  const performSearch = (query: string) => {
    if (searcherRef.current) {
      const results = searcherRef.current.search(query);
      onSearchResults(results);
    }
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View className="border-b border-gray-200 px-2 py-4" testID="search-bar">
      <View className="w-full flex-row items-center">
        <Animated.View style={[animatedIconStyle]} pointerEvents={isFocused ? 'auto' : 'none'}>
          {isFocused && (
            <TouchableOpacity
              onPress={handleClear}
              className="flex-1 items-center justify-center"
              testID="arrow-back-button">
              <Ionicons name="arrow-back-outline" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </Animated.View>
        <Animated.View className="flex-1">
          <TextInput
            ref={inputRef}
            className="h-11 rounded-lg border border-gray-300 px-4"
            placeholder="Search currency"
            value={searchQuery}
            onChangeText={handleQueryChange}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            cursorColor="#6a7282"
          />
        </Animated.View>
        <Animated.View style={[animatedIconStyle]} pointerEvents={isFocused ? 'auto' : 'none'}>
          {isFocused && (
            <TouchableOpacity
              onPress={handleClear}
              className="flex-1 items-center justify-center"
              testID="close-button">
              <Ionicons name="close-outline" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default CurrencySearchBar;

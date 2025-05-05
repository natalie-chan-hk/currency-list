import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type CurrencySearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const CurrencySearchBar = ({
  searchQuery,
  setSearchQuery,
}: CurrencySearchBarProps) => {
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);
  const iconWidth = useSharedValue(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

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

  const animatedIconStyle = useAnimatedStyle(() => ({
    width: iconWidth.value,
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.blur();
  };

  return (
    <View className="py-4 px-2 border-b border-gray-200">
      <View className="w-full flex-row items-center">
        <Animated.View style={[animatedIconStyle]} pointerEvents={isFocused ? 'auto' : 'none'}>
          <TouchableOpacity onPress={handleClear} className="flex-1 justify-center items-center">
            <Ionicons name="arrow-back-outline" size={20} color="gray" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View className="flex-1">
          <TextInput
            ref={inputRef}
            className="h-10 border border-gray-300 rounded-lg px-4"
            placeholder="Search currency"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </Animated.View>

        <Animated.View style={[animatedIconStyle]} pointerEvents={isFocused ? 'auto' : 'none'}>
          <TouchableOpacity onPress={handleClear} className="flex-1 justify-center items-center">
            <Ionicons name="close-outline" size={20} color="gray" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};
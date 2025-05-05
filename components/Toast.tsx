import { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide?: () => void;
};

const Toast = ({ message, type = 'info', duration = 2000, onHide }: ToastProps) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={32} color="#006045" />;
      case 'error':
        return <Ionicons name="alert-sharp" size={32} color="#9f0712" />
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
      className={`absolute bottom-8 left-4 right-4 z-50 rounded-lg p-4 shadow-sm ${getBackgroundColor()}`}
    >
        <View className="flex-row items-center">
            {renderIcon()}
            <Text className={`pl-2 font-medium ${getTextColor()}`}>{message}</Text>
        </View>
    </Animated.View>
  );
};

export default Toast; 
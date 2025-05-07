import { useEffect, useRef } from 'react';
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
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Start the animation sequence
    animationRef.current = Animated.sequence([
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
    ]);

    animationRef.current.start(() => {
      // Defer onHide to avoid scheduling updates during effect
      setTimeout(() => {
        onHide?.();
      }, 0);
    });

    // Clean up animation on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [duration, onHide]);

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
        return <Ionicons name="alert-sharp" size={32} color="#9f0712" />;
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
      className={`absolute bottom-8 left-4 right-4 z-50 rounded-lg p-4 shadow-sm ${getBackgroundColor()}`}>
      <View className="flex-row items-center">
        {renderIcon()}
        <Text className={`pl-2 font-medium ${getTextColor()}`}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;

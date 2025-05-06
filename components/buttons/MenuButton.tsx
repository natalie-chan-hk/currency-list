import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export interface MenuButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  title,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`p-3 rounded-lg mb-2 shadow-xs ${
        disabled ? 'bg-gray-300' : 'bg-blue-100'
      }`}
    >
      <Text className={`text-blue-900 text-center font-medium ${
        disabled ? 'opacity-50' : ''
      }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

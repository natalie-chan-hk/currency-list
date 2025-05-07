import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export type MenuButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
};

export const MenuButton = ({ title, onPress, disabled, testID }: MenuButtonProps) => {
  const backgroundColor = disabled ? 'bg-gray-300' : 'bg-blue-100';
  const textColor = disabled ? 'text-gray-500' : 'text-blue-900';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`mb-2 rounded-lg p-4 ${backgroundColor}`}
      testID={testID}>
      <Text className={`text-center font-medium ${textColor}`}>{title}</Text>
    </TouchableOpacity>
  );
};

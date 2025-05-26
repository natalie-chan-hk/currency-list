import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export type MenuButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  testID?: string;
};

export const MenuButton = ({ title, onPress, disabled, testID, isLoading }: MenuButtonProps) => {
  const backgroundColor = disabled ? 'bg-gray-300' : 'bg-blue-100';
  const textColor = disabled ? 'text-gray-500' : 'text-blue-900';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`mb-2 inline-flex flex-row items-center justify-center gap-x-4 rounded-lg p-4 ${backgroundColor}`}
      testID={testID}>
      <Text className={`text-center font-medium ${textColor}`}>{title}</Text>
      {isLoading && <ActivityIndicator size={20} color="#1c398e" testID="loading-indicator" />}
    </TouchableOpacity>
  );
};

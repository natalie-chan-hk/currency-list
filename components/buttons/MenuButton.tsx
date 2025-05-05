import { TouchableOpacity, Text } from 'react-native';

type MenuButtonProps = {
    title: string;
    onPress: () => void;
    style?: string
  };

export const MenuButton = ({ title = "--", onPress = () => {}, style = "bg-blue-100 p-3 rounded-lg mb-2 shadow-xs"
}: MenuButtonProps) => {
  return (
    <TouchableOpacity
    className={style}
    onPress={onPress}
  >
    <Text className="text-white text-blue-900 text-center font-medium">
      {title}
    </Text>
  </TouchableOpacity>
  );
};

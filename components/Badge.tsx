import { View, Text } from 'react-native';
type BadgeProps = {
  title: string;
  style?: string;
  textStyle?: string
};

export const Badge = ({ title = "--", style = "bg-gray-900 rounded-full w-10 h-10 flex items-center justify-center mr-2", textStyle= "text-white font-medium"
}: BadgeProps) => {
  return (
    <View className={style}>
        <Text className={textStyle}>
            {title}
        </Text>
    </View>
  );
};

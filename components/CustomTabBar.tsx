import { View, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HOME_ROUTE} from '../constants/menu';

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
    return (
      <View className="flex-row bg-white border-t border-gray-200 h-16">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = route.name === HOME_ROUTE ? 'menu' : 'search';
  
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className={`flex-1 items-center justify-center ${
                isFocused ? 'bg-gray-50' : ''
              }`}
            >
              <Ionicons
                name={isFocused ? icon : `${icon}-outline`}
                size={24}
                color={isFocused ? '#000' : '#666'}
              />
              <Text
                className={`text-xs mt-1 ${
                  isFocused ? 'text-black' : 'text-gray-600'
                }`}
              >
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

export default CustomTabBar;
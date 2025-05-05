import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CustomTabBar from './CustomTabBar';
import SearchTab from './tabs/SearchTab';
import HomeTab from './tabs/HomeTab';
import { RootTabParamList } from './tabs/type';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const DemoActivity = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: true,
          animation: 'shift',
        }}
      >
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Search" component={SearchTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 
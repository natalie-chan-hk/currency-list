import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SearchPage from './pages/SearchPage';
import HomePage from './pages/HomePage';
import { RootStackParamList } from './pages/type';

const Stack = createStackNavigator<RootStackParamList>();

export const DemoActivity = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Search" component={SearchPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

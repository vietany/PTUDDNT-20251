import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Import các màn hình
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import GroupScreen from './src/screens/GroupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FridgeScreen from './src/screens/FridgeScreen';
import ShoppingScreen from './src/screens/ShoppingScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import MealScreen from './src/screens/MealScreen';
import RecipeScreen from './src/screens/RecipeScreen';
import ReportScreen from './src/screens/ReportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const LoggedInStack = createNativeStackNavigator();

// Stack cho người chưa đăng nhập
const AuthStack = ({ setIsLoggedIn }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
        {props => <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Tab Chính (Bottom Tab)
const MainTabs = ({ setIsLoggedIn }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName = 'alert';
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Group') iconName = 'people';
        else if (route.name === 'Profile') iconName = 'person';
        else if (route.name === 'Fridge') iconName = 'snow';
        else if (route.name === 'Shopping') iconName = 'cart';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#27ae60',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{title: "Tổng quan"}} />
    <Tab.Screen name="Fridge" component={FridgeScreen} options={{title: "Tủ lạnh"}} />
    <Tab.Screen name="Shopping" component={ShoppingScreen} options={{title: "Đi chợ"}} />
    <Tab.Screen name="Group" component={GroupScreen} options={{title: "Nhóm"}} />
    <Tab.Screen name="Profile" options={{title: "Cá nhân"}}>
        {props => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Tab.Screen>
  </Tab.Navigator>
);

// Stack cho người ĐÃ đăng nhập (Chứa Tabs + Màn hình chi tiết)
const LoggedInNavigator = ({ setIsLoggedIn }) => (
    <LoggedInStack.Navigator>
        {/* Màn hình chính là bộ Tab */}
        <LoggedInStack.Screen name="MainTabs" options={{headerShown: false}}>
            {props => <MainTabs {...props} setIsLoggedIn={setIsLoggedIn} />}
        </LoggedInStack.Screen>
        
        {/* Các màn hình chi tiết (nằm đè lên Tab) */}
        <LoggedInStack.Screen 
            name="CategoryDetail" 
            component={CategoryDetailScreen} 
            options={{title: 'Chi tiết danh mục', headerBackTitleVisible: false}} 
        />
        <LoggedInStack.Screen name="Meal" component={MealScreen} options={{title: 'Lên Lịch Ăn'}} />
        <LoggedInStack.Screen name="Recipe" component={RecipeScreen} options={{title: 'Kho Công Thức'}} />
        <LoggedInStack.Screen name="Report" component={ReportScreen} options={{title: 'Báo Cáo'}} />
    </LoggedInStack.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInNavigator setIsLoggedIn={setIsLoggedIn} /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
}

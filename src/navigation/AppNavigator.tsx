import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ListScreen } from '../screens/ListScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { LoadingView } from '../components/LoadingView';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingView message="Connecting to BookShelf..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={currentUser ? 'List' : 'Home'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {!currentUser ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

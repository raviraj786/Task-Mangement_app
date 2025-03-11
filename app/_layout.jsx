import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar, ActivityIndicator } from 'react-native';

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" color="#0000ff" />} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="HomeScreen"
                options={{
                  headerShown: false,
                 
                }}
              />

              <Stack.Screen
                name="AddTaskScreen"
                options={{ headerShown: true }}
              />
            </Stack>
            <StatusBar hidden={true} />
          </PaperProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

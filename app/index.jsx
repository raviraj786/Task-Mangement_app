import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userToken = await AsyncStorage.getItem("token");
      // console.log(userToken)
      if (userToken) {
        router.replace("/HomeScreen"); 
      } else {
        router.replace("/login"); 
      }
    };
    checkAuth();
  }, []);

  return null; 
}

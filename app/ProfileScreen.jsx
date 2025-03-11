import React, { useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const MyTaskScreen = () => {
  const [tasks, setTasks] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Task ${i + 1}`,
      description: `This is the description for Task ${i + 1}`,
    }))
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const userdata = useSelector((state) => state?.auth);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          dispatch(logout());
          router.replace("/login");
        },
      },
    ]);
  };

  if (!userdata) {
    return <Text>No user logged in.</Text>;
  }

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          {/* <Text style={styles.profileName}>👤 {userdata.status}</Text> */}
          <Text style={styles.profileName}>👤 {userdata?.user?.username}</Text>
          <Text style={styles.profileEmail}>
            📧 Email: {userdata?.user?.email}
          </Text>
          <Text style={styles.profileTasks}>
            📋 Total Tasks: {userdata?.user?.tasks?.length}
          </Text>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonText}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  profileEmail: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 4,
  },
  profileTasks: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default MyTaskScreen;

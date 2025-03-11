import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { addTask } from "../../redux/tasksSlice";
import { useDispatch } from "react-redux";

const AddTaskScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      if (title.trim().length === 0 || description.trim().length === 0) {
        alert("Please add a title and description for the task.");
        return;
      }

      dispatch(addTask({ title, description }));

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setTitle("");
        setDescription("");
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.heading}>
            Add New Task
          </Text>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
            mode="outlined"
            theme={{ colors: { text: "darkblue" } }}
            textColor="#ffffff"
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.descriptionInput}
            mode="outlined"
            multiline
            numberOfLines={5}
            left={<TextInput.Icon icon="text" color="#FFFFFF" />}
            theme={{ colors: { text: "darkgreen" } }}
          />

          <Button
            mode="contained"
            style={styles.button}
            icon="content-save"
            onPress={handleSave}
          >
            Save Task
          </Button>
        </Card.Content>
      </Card>

      {isSaved && (
        <Card style={styles.successCard}>
          <Card.Content style={styles.successContent}>
            <Text style={styles.successText}>✓ Task Saved Successfully!</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F0F4F7",
  },
  card: {
    padding: 5,
    backgroundColor: "#000",
    borderRadius: 12,
    elevation: 3,
  },
  heading: {
    marginBottom: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 20,
  },
  titleInput: {
    marginBottom: 15,
    backgroundColor: "#424242",
    color: "white",
    height: 80,
  },
  descriptionInput: {
    marginBottom: 15,
    backgroundColor: "#424242",
    color: "white",
    height: 200,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#F57C00",
  },
  successCard: {
    backgroundColor: "#388E3C",
    borderRadius: 8,
    marginTop: 10,
  },
  successContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  successText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default AddTaskScreen;

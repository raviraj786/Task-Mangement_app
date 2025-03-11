import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Card, Text, IconButton, TextInput, Button } from "react-native-paper";
import {
  useSearchParams,
  useRouter,
  navigation,
  useNavigation,
} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTask,
  deleteTask,
  fetchtask,
  upadateTask,
  updateTask,
} from "../../redux/tasksSlice";
import Header from "../../componets/Hedaer";
import { useLocalSearchParams } from "expo-router";
import FloatingUpdateButton from "../../componets/FloatingUpdateButton";
import FloatingAddTaskButton from "../../componets/FloatingAddTaskButton";

const DetailsTaskScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const { task, loading, error } = useSelector((state) => state.tasks);
  const [data, setData] = useState(...task.data);
  useEffect(() => {
    if (id) {
      dispatch(fetchtask(id));
    }
  }, [id, dispatch]);

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(deleteTask(id));
          router.push("/HomeScreen");
        },
      },
    ]);
  };

  useEffect(() => {
    if (task && task.data) {
      setData(task.data);
    }
  }, [task]);

  const [selectdata, setSelectdata] = useState(null);
  const [inputText, setInputText] = useState("");

  const handleSelect = (item) => {
    setSelectdata(item);
    setInputTitle(item.title);
    setInputDescription(item.description);
  };
  const handleUpdate = async () => {
    if (selectdata) {
      const newData = data.map((item) =>
        item.id === selectdata.id
          ? { ...item, title: inputTitle, description: inputDescription }
          : item
      );
      setData(newData);
      setSelectdata(null);

      console.log(id, inputTitle, inputDescription);

      await dispatch(
        updateTask({
          id,
          taskData: { title: inputTitle, description: inputDescription },
        })
      );
    }
    setInputTitle("");
    setInputDescription("");
  };

  const handleUpdateTask = (item) => {
    setSelectdata(item);
    setInputTitle(item.title);
    setInputDescription(item.description);
  };

  const handleAddNewTask = () => {
    console.log("first");
  };

  if (loading || !task) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      {selectdata ? (
        // Update view: sirf update karne waale fields dikhai denge
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            label="Title"
            value={inputTitle}
            onChangeText={(text) => setInputTitle(text)}
          />
          <TextInput
            style={styles.input}
            label="Description"
            value={inputDescription}
            multiline
            numberOfLines={5}
            onChangeText={(text) => setInputDescription(text)}
          />
          <Button icon="camera" mode="contained" onPress={handleUpdate}>
            Update Task
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectdata(null);
              setInputTitle("");
              setInputDescription("");
            }}
            style={{ marginTop: 10 }}
          >
            Cancel
          </Button>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.taskTitle}>Title: {item.title}</Text>
                <Text style={styles.taskDescription}>
                  Description: {item.description}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View>
        <FloatingUpdateButton
          onPress={handleUpdateTask}
          title={"Update Task"}
        />

        <FloatingAddTaskButton
          onPress={handleDelete}
          title="Delete Task"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: "#000",
    margin: 10,
    borderRadius: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    position: "absolute",
    bottom: 250,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },

  pageContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#6200ee",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  taskContainer: {
    backgroundColor: "#fff",
    // borderRadius: 8,
    // marginBottom: 15,
    padding: 15,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  taskDescription: {
    fontSize: 16,
    color: "#666",
  },
});

export default DetailsTaskScreen;

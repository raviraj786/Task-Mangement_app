import React, { useCallback, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Card,
  Text,
  ActivityIndicator,
  IconButton,
  Divider,
} from "react-native-paper";
import { deleteTask, fetchtasks } from "../../redux/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { router, useFocusEffect } from "expo-router";

const Index = () => {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const ITEMS_PER_PAGE = 5;
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);

  console.log(tasks.data.Tasks)

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchtasks());
    }, [dispatch])
  );

  const loadMoreTasks = () => {
    if (loading) return;
    setTimeout(() => setPage(page + 1), 1500);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await dispatch(deleteTask(id));
          dispatch(fetchtasks());
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchtasks());
    setRefreshing(false);
  };

  const renderTask = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <Text variant="titleLarge" style={styles.taskTitle}>
            {item?.title?.length > 20
              ? `${item.title.slice(0, 20)}...`
              : item?.title}
          </Text>
          <View style={styles.iconContainer}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() =>
                router.push(`/DetailsTaskScreen/${item.id || item._id}`)
              }
              style={styles.iconButton}
              iconColor="#000"
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item.id || item._id)}
              style={styles.iconButton}
              iconColor="#000"
            />
          </View>
        </View>
        <Divider style={styles.divider} />
        <Text variant="bodyMedium" style={styles.taskDescription}>
          {item?.description?.length > 70
            ? `${item.description.slice(0, 70)}...`
            : item?.description}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item?.createAt).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading && (!tasks || !tasks?.data?.Tasks || tasks?.data?.Tasks?.length === 0) ? (
        <ActivityIndicator size="large" color="#A0AEC0" />
      ) : tasks?.data.Tasks?.length > 0 ? (
        <FlatList
          data={tasks.data.Tasks?.slice(0, page * ITEMS_PER_PAGE)?.reverse()}
          renderItem={renderTask}
          keyExtractor={(item) => (item?.id || item?._id)?.toString()}
          onEndReached={loadMoreTasks}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#A0AEC0" />
              </View>
            )
          }
        />
      ) : (
        <Text style={styles.noTasksText}>No tasks available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f0f0" },
  card: {
    marginBottom: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    elevation: 2,
    padding: 8,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: { color: "#ffffff", fontWeight: "600", fontSize: 18 },
  taskDescription: {
    color: "#d0d0d0",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  iconContainer: { flexDirection: "row", gap: 8 },
  iconButton: { backgroundColor: "#ffffff", borderRadius: 8, margin: 0 },
  divider: { backgroundColor: "#ffffff", marginVertical: 4 },
  dateText: { color: "#ffffff", marginTop: 10 },
  loadingContainer: { paddingVertical: 16 },
  noTasksText: { textAlign: "center", marginTop: 20, color: "#000" },
});

export default Index;

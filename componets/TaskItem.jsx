// components/TaskItem.js
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Card, TouchableRipple, Text, Avatar } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';

const TaskItem = ({ task, onDelete, onEdit, onToggleComplete }) => {
  const scaleValue = new Animated.Value(1);

  const handleDelete = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onDelete(task.id));
  };

  const RightActions = () => (
    <View style={styles.rightActionContainer}>
      <TouchableRipple onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.actionText}>Delete</Text>
      </TouchableRipple>
      <TouchableRipple onPress={() => onEdit(task)} style={styles.editButton}>
        <Text style={styles.actionText}>Edit</Text>
      </TouchableRipple>
    </View>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Swipeable renderRightActions={RightActions}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <TouchableRipple onPress={() => onToggleComplete(task.id)}>
              <Avatar.Icon 
                icon={task.completed ? 'check-circle' : 'circle-outline'} 
                size={32}
                style={styles.icon}
              />
            </TouchableRipple>
            <View style={styles.textContainer}>
              <Text variant="titleMedium" style={task.completed && styles.completedText}>
                {task.title}
              </Text>
              {task.description && (
                <Text variant="bodyMedium" style={styles.description}>
                  {task.description}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    marginTop: 4,
    opacity: 0.8,
  },
  rightActionContainer: {
    flexDirection: 'row',
    width: 192,
    marginVertical: 4,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TaskItem;
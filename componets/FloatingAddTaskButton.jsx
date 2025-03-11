import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

const FloatingAddTaskButton = ({ onPress, title }) => {
  return (
    <View style={styles.fabContainer}>
      <FAB
        icon="delete" // 'plus' icon indicates adding a new item
        label={title}
        onPress={onPress}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 190,
  },
  fab: {
    backgroundColor: '#000',
  },
});

export default FloatingAddTaskButton;

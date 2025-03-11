import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

const FloatingUpdateButton = ({ onPress ,  title ,   }) => {
  return (
    <View style={styles.fabContainer}>
      <FAB
        icon="pencil" 
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
    right: 16,
  },
  fab: {
    backgroundColor: '#000', // Aap apna pasand ka color yahan de sakte hain
  },
});

export default FloatingUpdateButton;

// components/BottomSheet.js
import React, { useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';

const CustomBottomSheet = ({ children, isVisible, onDismiss, snapPoints }) => {
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef(null);
  const defaultSnapPoints = useMemo(() => ['50%', '90%'], []);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints || defaultSnapPoints}
        onDismiss={onDismiss}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
      >
        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          {children}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

export default CustomBottomSheet;
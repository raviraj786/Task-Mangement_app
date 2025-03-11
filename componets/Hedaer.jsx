import * as React from "react";
import { Appbar } from "react-native-paper";
import { Platform } from "react-native";
import { useNavigation } from "expo-router";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

const Header = () => {
  const navigation = useNavigation();

  return (
    <Appbar.Header>
      <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />
      <Appbar.Content title="Task" subtitle="Subtitle" />
      <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
    </Appbar.Header>
  );
};

export default Header;

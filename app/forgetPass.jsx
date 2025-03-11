import { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";

const forgetPass = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const data = {
        email: email,
      };
      // console.log(data);

      const response = await axios.post(
        `https://task-mangemant-backend-server.onrender.com/api/v1/forget-password`,
        data
      );
      // console.log(response.data);
      router.replace({
        pathname: "/resetPass",
        params: { email: email },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      setLoading(true);
    //   router.replace("/signup");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Please forgot password in to continue
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          label="Email"
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          textColor="#000"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {loading ? "Sending in..." : "Send OTP"}
        </Button>

        <Text variant="bodyMedium" style={{ color: "red" , alignSelf:'center' , padding:10  , fontWeight:'700'  , fontSize:16}}>
  OTP will expire in 10 minutes.
</Text>

        <View style={styles.signupContainer}>
          <Text variant="bodyMedium" style={{ color: "#000" }}>
            Don't have an account?{" "}
          </Text>
          <Button
            mode="text"
            onPress={() => router.push("/signup")}
            labelStyle={{ color: colors.onSecondary }}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default forgetPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: "#000",
  },
  buttonLabel: {
    fontSize: 16,
    color: "#fff",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
});

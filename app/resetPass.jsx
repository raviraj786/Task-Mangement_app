import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Checkbox,
} from "react-native-paper";
import { useGlobalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const resetPass = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { email } = useGlobalSearchParams();

  const handleSignup = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the terms & conditions");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = {
        email: email,
        otp: otp,
        newPssword: password,
      };
      // console.log("Sending Data:", data);

      const response = await axios.post(
        "https://task-mangemant-backend-server.onrender.com/api/v1/reset-password",
        data
      );

      // console.log("Response Data:", response.data);

      if (response?.data?.status === 200) {
        alert("Password reset successful! You can now log in.");
        router.push("/login");
      } else {
        setError(
          response.data.error || "Something went wrong, please try again."
        );
      }
    } catch (error) {
      // console.error("Error: ", error);
      if (error.response && error.response.data) {
        setError(
          error.response.data.error ||
            "Failed to reset password. Please try again."
        );
      } else {
        setError("Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Reset Password
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          label="OTP"
          mode="outlined"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          textColor="#000"
        />

        <TextInput
          label="New Password"
          mode="outlined"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
          textColor="#000"
        />

        <TextInput
          label="Confirm Password"
          mode="outlined"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          textColor="#000"
        />

        <View style={styles.termsContainer}>
          <Checkbox
            status={termsAccepted ? "checked" : "unchecked"}
            onPress={() => setTermsAccepted(!termsAccepted)}
          />
          <Text style={{ color: "#000" }}>
            I agree to the Terms & Conditions
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Confirm Password
        </Button>
        <Text
          variant="bodyMedium"
          style={{
            color: "red",
            alignSelf: "center",
            padding: 10,
            fontWeight: "700",
            fontSize: 16,
          }}
        >
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

export default resetPass;

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
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

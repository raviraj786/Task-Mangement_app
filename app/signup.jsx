import { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Checkbox,
} from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Api_url = `https://task-mangemant-backend-server.onrender.com/api/v1/singup`;

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
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

    dispatch(registerStart());

    try {
      const response = await axios.post(`${Api_url}`, {
        username,
        email,
        password,
      });

      if (response.data?.data) {
        dispatch(registerSuccess(response.data.data));
        router.push("/HomeScreen");
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Error: ", err.message);
      dispatch(
        registerFailure(
          err.response?.data || "Registration failed. Please try again."
        )
      );
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
        <Image
          source={require("../assets/signup.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text variant="headlineMedium" style={styles.title}>
          Create Account
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Join our community today
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          label="Full Name"
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          value={username}
          onChangeText={setUsername}
          autoComplete="name"
          style={styles.input}
          textColor="#000"
        />

        <TextInput
          label="Email"
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          style={styles.input}
          textColor="#000"
        />

        <TextInput
          label="Password"
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          textColor="#000"
        />

        <TextInput
          label="Confirm Password"
          mode="outlined"
          left={<TextInput.Icon icon="lock-check" />}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          textColor="#000"
        />

        <View style={styles.termsContainer}>
          <Checkbox
            status={termsAccepted ? "checked" : "unchecked"}
            onPress={() => setTermsAccepted(!termsAccepted)}
            color={colors.onSecondary}
          />
          <Text variant="bodyMedium" style={styles.termsText }>
            I agree to the{" "}
            <Text style={{ color: colors.onSecondary }}>Terms & Conditions</Text>
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSignup}
          //  loading={loading}
          // disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {"Sign Up"}
        </Button>

        <View style={styles.loginContainer}>
          <Text variant="bodyMedium"  style={{color:'#000'}}>Already have an account? </Text>
          <Button
            mode="text"
            onPress={() => router.push("/login")}
            labelStyle={{ color: colors.onSecondary }}
          >
            Login
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;

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
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 1,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
    color:'#000'
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
    backgroundColor:'#000'
  },
  buttonLabel: {
    fontSize: 16,
    color:'#ffffff'
  },
  loginContainer: {
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    color:'#000',
    fontWeight:'800'
  },
});

import { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "../lib/firebase";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!userName || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User Created:", userCredential.user);

      await setDoc(doc(collection(db, "UserHistory"), userCredential.user.email), {
        email: userCredential.user.email,
        createdAt: new Date(),
        history: [],
      });

      router.push("/");
    } catch (error) {
      console.error("Signup Error:", error);
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput
          value={userName}
          style={styles.input}
          placeholder="User Name"
          keyboardType="text"
          autoCapitalize="none"
          onChangeText={setUserName}
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          value={password}
          style={styles.input}
          placeholder="Password (min 6 chars)"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <TextInput
          value={confirmPassword}
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={setConfirmPassword}
        />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity onPress={handleSignup} style={styles.submitButton} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/Settings")} style={styles.loginRedirect}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#71CF4C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginRedirect: {
    marginTop: 10,
  },
  loginText: {
    color: "blue",
    fontSize: 14,
  },
});

export default Signup;

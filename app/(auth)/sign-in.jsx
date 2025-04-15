import { Text, View, TextInput, Alert, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebase";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "@firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const handleSignIn = async () => {
        console.log("login caled");
        setIsLoading(true);
        setErrorMessage('');

        if (email.trim().length == 0 || password.trim().length == 0) {
            setErrorMessage("Email and password are required.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            console.log("Response on signin ", res.user.email);
        }
        catch (error) {
            console.log("Error on login:", error);
            if (error.code === "auth/user-not-found") {
                setErrorMessage("No user found with this email.");
            } else if (error.code === "auth/wrong-password") {
                setErrorMessage("Incorrect password.");
            } else if (error.code === "auth/invalid-email") {
                setErrorMessage("Invalid email format.");
            } else if (error.code === "auth/too-many-requests") {
                setErrorMessage("Too many attempts. Try again later.");
            } else {
                setErrorMessage("Login failed. Please try again.");
            }
        }
        finally {
            setIsLoading(false);
            setEmail('');
            setPassword('');
            router.replace('profile');
        }


    }
    return (
        <TouchableWithoutFeedback >
            <SafeAreaView style={styles.container}>

                
                <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                    <View style={styles.inputContainer}>
                        <Text style={styles.title}>Login</Text>
                        <TextInput
                            value={email}
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            autoCorrect={false}

                        />
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            autoCapitalize="none"
                            textContentType="password"
                            secureTextEntry
                            onChangeText={setPassword}
                            
                        />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TouchableOpacity onPress={handleSignIn} style={styles.submitButton} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Login</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Link href="/sign-up" style={styles.signupText}>New User? Create an Account</Link>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                <Image source={images.google} style={styles.googleIcon} />
                <Text style={styles.googleText}>Login With Google</Text>
            </TouchableOpacity> */}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    keyboardAvoidingContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
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
    signupText: {
        marginTop: 10,
        color: "blue",
        fontSize: 14,
    },
    loggedInContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: "#D9534F",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
        justifyContent: "center",
        marginVertical: 10,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleText: {
        fontWeight: "bold",
        color: "#333",
    },
});
export default SignIn;
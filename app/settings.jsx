import { Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { Link } from "expo-router";
import app from '../lib/firebase';

const Settings = () => {
    const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged In:", userCredential.user);
        } catch (error) {
            console.error("Login Error:", error);
            setErrorMessage(error.messsage);
        }

        setIsLoading(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User Logged Out");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            {user ? (
                <View style={styles.loggedInContainer}>
                    <Text style={styles.welcomeText}>Welcome, {user.email}</Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
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
                            
                        />
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            autoCapitalize="none"
                            textContentType="password"
                            secureTextEntry
                            onChangeText={setPassword}
                            required
                        />
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TouchableOpacity onPress={handleLogin} style={styles.submitButton} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Login</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Link href="/Signup" style={styles.signupText}>New User? Create an Account</Link>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
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
});

export default Settings;

import { Text, View, TextInput, Alert, Image, ActivityIndicator, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../config/firebase";
import { Link, useRouter } from "expo-router";
import { FirebaseError } from "@firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [isloading, setIsLoading] = useState(false);

    const router = useRouter();

        const { language } = useLanguage();
    
        useEffect(() => {
            i18n.locale = language || 'en';
        }, [language]);
    

    const handleSignUp = async () => {
        console.log("handle sign up called");
        if (email == "" || password == "" || confirmPassword == "") {
            Alert.alert("Fill the Name, Email, Password Fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Password must be at least 6 characters");
            return;
        }


        setIsLoading(true);

        try {
            const authResponse = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Auth Response id :", authResponse.user);

            try {
                await updateProfile(auth.currentUser, {
                    displayName: name || "User",
                });
            } catch (profileError) {
                console.error("Profile update error:", profileError.message);
            }

            setUser(authResponse.user);
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        Alert.alert("This email is already in use.");
                        break;
                    case 'auth/invalid-email':
                        Alert.alert("Invalid email format.");
                        break;
                    default:
                        Alert.alert("Signup failed", error.message);
                }
            }
        } finally {
            setIsLoading(false);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setName("");
            setLocation("");

            router.replace('profile');
        }


    }

    return (
        <SafeAreaView style={styles.container}>
            {isloading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : user ? (
                <View style={styles.profileContainer}>
                    <Text style={styles.profileText}>{i18n.t('signUp.welcome')}, {user.displayName}!</Text>
                    <Text style={styles.infoText}>Email: {user.email}</Text>
                    {user.photoURL && (
                        <Image
                            source={{ uri: user.photoURL }}
                            style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
                        />
                    )}
                </View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('signUp.name')}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('signUp.email')}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('signUp.password')}
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('signUp.confirmPassword')}
                        value={confirmPassword}
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('signUp.location')}
                        value={location}
                        onChangeText={setLocation}
                    />


                    <Link href="/sign-in" style={styles.linkText}>
                    {i18n.t('signUp.loginLink')}
                    </Link>

                    <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isloading}>
                        <Text style={styles.buttonText}>{i18n.t('signUp.createAccount')}</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        width: "100%",
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#3498db",
        padding: 12,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    linkText: {
        color: "#3498db",
        marginTop: 10,
        textAlign: 'center',
    },
    profileContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    profileText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
    },
    infoText: {
        fontSize: 16,
        marginVertical: 4,
    },
});

export default SignUp;
const en = {
    title: 'EcoYield',
    welcome: 'Welcome to EcoYield',
    subWelcome: 'Sustainable Fertilizer Usage Optimization App',
    selectLanguage: 'Choose Preferred Language',
    tabs: {
        home: "Home",
        fr: "Fertilizer Recommendation",
        cr: "Crop Recommendation",
        nd: "Nutritens Deficiency",
        profile: "Profile"
    },
    cropRecommendation: {
        title: 'Crop Recommendation',
        uploadreport: 'Upload Soil Report',
        selectReportBtm: 'Pick Soil Report',
        remove: 'Remove File',
        getLocation: 'Get Location',
        fetchLocation: 'Fetch My Location',
        getRecommendation: 'Get Crop Recommendation',
        clear: 'Clear All',
        close: 'Close',


    },
    fertilizerRecommendation: {
        title: 'Fertilizer Recommendation',
        uploadreport: 'Upload Soil Report',
        selectReportBtm: 'Pick Soil Report',
        selectCrop: 'Select Crop',
        remove: 'Remove File',
        getLocation: 'Get Location',
        fetchLocation: 'Fetch My Location',
        getRecommendation: 'Get Fertilizer Recommendation',
        clear: 'Clear All',
        cropTypes: {
            select: '-- Select Crop --',
            maize: 'Maize',
            sugarcane: 'Sugarcane',
            cotton: 'Cotton',
            paddy: 'Paddy',
            wheat: 'Wheat',
        }
    },

    nutrientsDeficiency: {
        title: 'Nutrient Deficiency Prediction',
        uploadImage: 'Upload Image',
        captureImage: 'Capture Image',
        removeImage: 'Remove Image',
        noImage: 'No Image Selected',
        prediction: 'Prediction',
        confidence: 'Confidence',
        getPrediction: 'Get Prediction',
    },

    profile: {
        title: 'Profile',
        appLanguage: 'App Language:',
        email: 'Email:',
        logout: 'Logout',
        yourHistory: 'Your History:',
        noHistory: 'No history available.',
        notLoggedIn: "You're not logged in.",
        signIn: 'Sign In',
        createAccount: 'Create Account'
    },

    signIn: {
        title: "Login",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Password",
        loginButton: "Login",
        newUser: "New User? Create an Account",
        errors: {
            required: "Email and password are required.",
            userNotFound: "No user found with this email.",
            wrongPassword: "Incorrect password.",
            invalidEmail: "Invalid email format.",
            tooManyRequests: "Too many attempts. Try again later.",
            default: "Login failed. Please try again."
        },
        loading : {
            wait : "Please wait..."
        },

        signUp: {
            name: "Name",
            email: "Email",
            password: "Password",
            confirmPassword: "Confirm Password",
            location: "Location",
            loginLink: "Already Have an Account? Login Here",
            createAccount: "Create Account",
            alertFillFields: "Fill the Name, Email, Password Fields",
            alertPasswordMismatch: "Passwords don't match",
            alertPasswordShort: "Password must be at least 6 characters",
            alertEmailUsed: "This email is already in use.",
            alertInvalidEmail: "Invalid email format.",
            alertSignupFailed: "Signup failed",
            welcome: "Welcome",

        }


    }

}

export { en };
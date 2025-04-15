const selectSoilReport = async () => {
    console.log("soil report selected");
    try {
        const pickedFile = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
            copyToCacheDirectory: true,
        });
        console.log("Picked file : ", pickedFile.assets[0].name);
        if (!pickedFile.canceled && pickedFile.assets.length > 0) {
            setSoilReport(pickedFile.assets[0]);
        }
    } catch (err) {
        setErrorMsg('Error: Error picking file');
    }
}

const fetchAddress = async (lat, lon) => {
    try {
        const response = await axios.get(
            `https://us1.locationiq.com/v1/reverse.php?key=${process.env.EXPO_PUBLIC_LOC_API}&lat=${lat}&lon=${lon}&format=json`
        );
        setConvertedAddress(response.data.display_name);
    } catch (error) {
        setErrorMsg('Error converting location to address');
    }
};

const getLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = coords;
        setLocationData(`${latitude}, ${longitude}`);
        fetchAddress(latitude, longitude);
    } catch (error) {
        setErrorMsg('Error getting location');
    }


};
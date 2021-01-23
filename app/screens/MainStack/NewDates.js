import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Image, ScrollView, Alert, TouchableOpacity, Dimensions, Text, FlatList, PermissionsAndroid, Animated, BackHandler } from 'react-native';
import { Card, Appbar, TextInput, Snackbar } from 'react-native-paper'
import StackHeader from '../../components/StackHeader';
import color from '../../constants/color'
import Calendar from '../../components/Calendar'
import Entypo from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import * as Animatable from 'react-native-animatable'
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage'
// import AsyncStorage from "react-native-fs-store/index";
import AwesomeAlert from 'react-native-awesome-alerts'
import storageKeys from '../../constants/storageKeys'

class NewDates extends Component {
    constructor(props) {
        super(props)
        this.setData = this.setData.bind(this);
        this.state = {
            loading: true,
            refreshing: false,
            today: '',
            nameTxt: '',
            phoneNoTxt: '',
            infoTxt: '',
            dobDate: '',
            selectedImageUri: '',
            base64Image: '',
            emailTxt: '',
        }
    }
    componentDidMount() {
        this.setData()
    }
    setData = async () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + "-" + mm + "-" + dd
        this.setState({ today: today, dobDate: today })
    }
    checkStorageAndCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ])

                const permissionCamera = await PermissionsAndroid.check('android.permission.CAMERA')
                const permissionWriteStorage = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE')

                if (!permissionCamera || !permissionWriteStorage) {
                    return false
                }
                else {
                    return true
                }
            } catch (error) {
                console.log('error:', error)
                return false
            }
        }
    }
    addImage = async () => {
        const per = await this.checkStorageAndCameraPermission()
        console.log('per:', per)
        if (per) {
            this.setState({ showAlert: true })
        }
        else {
            Alert.alert('Permission Denied  ');
        }
    }
    openCamera() {
        let options = {
            title: 'You can choose one image',
            quality: 1,
            includeBase64: true,
            saveToPhotos: true,
            mediaType: 'photo',// other values 'video', 'mixed',
            storageOptions: {
                skipBackup: true
            }
        }
        this.setState({ showAlert: false })
        ImagePicker.launchCamera(options, response => {
            console.log('response:', response)
            this.setState({ showAlert: false })
            if (response.didCancel) {
                console.log('User cancelled photo picker');
                this.setState({ showAlert: false })
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                this.setState({ showAlert: false })
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                this.setState({ showAlert: false })
            } else {
                this.setState({ showAlert: false })
                let source = { uri: response.uri };
                // console.log({ source });
                this.setState({ selectedImageUri: source.uri, base64Image: response.base64 })
            }
        });
    }
    chooseFromGallery() {
        let options = {
            title: 'You can choose one image',
            quality: 0.8,
            includeBase64: true,
            saveToPhotos: true,
            mediaType: 'photo',// other values 'video', 'mixed',
            storageOptions: {
                skipBackup: true
            }
        }
        this.setState({ showAlert: false })
        ImagePicker.launchImageLibrary(options, response => {
            console.log('response:', response)
            this.setState({ showAlert: false })
            if (response.didCancel) {
                this.setState({ showAlert: false })
                console.log('User cancelled photo picker');
            } else if (response.error) {
                this.setState({ showAlert: false })
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                this.setState({ showAlert: false })
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({ showAlert: false })
                let source = { uri: response.uri };
                // console.log({ source });
                this.setState({ selectedImageUri: source.uri, base64Image: response.base64, })
            }
        });
    }
    savePersonDetails = async () => {
        console.log('saving....')
        const { nameTxt, phoneNoTxt, emailTxt, infoTxt, base64Image, dobDate, selectedImageUri } = this.state
        var formattedDate = new Date(dobDate)
        var dd = String(formattedDate.getDate()).padStart(2, '0');
        var mm = String(formattedDate.getMonth() + 1).padStart(2, '0');
        var yyyy = formattedDate.getFullYear();
        var formattedDate = yyyy + '-' + mm + '-' + dd
        console.log('formattedDate:', formattedDate)
        const personInfoBody = {
            image: selectedImageUri,
            name: nameTxt,
            phone: phoneNoTxt,
            email: emailTxt,
            info: infoTxt,
            dob: formattedDate
        }
        // console.log('personInfoBody:', personInfoBody)
        // dobDate ==
        var hasDataOnSameDate = false
        var data = await AsyncStorage.getItem(storageKeys.PEOPLE_DATA_LIST)
        var prevAllPeopleData = JSON.parse(data)
        console.log('prevAllPeopleData:', prevAllPeopleData)
        prevAllPeopleData.forEach(element => {
            if (element[0].dob == formattedDate) {
                element.push(personInfoBody)
                AsyncStorage.setItem(storageKeys.PEOPLE_DATA_LIST, JSON.stringify(prevAllPeopleData))
                hasDataOnSameDate = true
            }
        });
        if (hasDataOnSameDate === false) {
            prevAllPeopleData.push([personInfoBody])
            AsyncStorage.setItem(storageKeys.PEOPLE_DATA_LIST, JSON.stringify(prevAllPeopleData))
        }
        this.props.navigation.navigate('Calendar Dates')
    }
    render() {
        const theme = color
        const { selectedImageUri, base64Image } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: color.WHITE }}>
                <StackHeader headerText="Add New Person" goBack={() => { this.props.navigation.navigate("Calendar Dates") }} />
                <ScrollView>
                    <View style={{ backgroundColor: color.BACKGROUND, paddingVertical: 10, marginVertical: 2, }}>
                        <Text style={{ fontSize: 20, color: color.BLACK, paddingLeft: 20, fontFamily: 'monospace', fontWeight: "bold" }}>Add Details</Text>
                    </View>
                    <TouchableOpacity onPress={() => { this.addImage() }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, width: 180, height: 180, alignSelf: 'center', }}>
                            {
                                base64Image != '' ?
                                    <Image style={{ borderRadius: 100, borderWidth: 0.5, height: 160, width: 160, borderColor: color.TINT_COLOR }} source={{
                                        uri: this.state.selectedImageUri
                                    }} />
                                    :
                                    <Image style={{ borderRadius: 100, borderWidth: 0.5, height: 160, width: 160, borderColor: color.TINT_COLOR }} source={{
                                        uri: 'https://i.ibb.co/Z8fQZG6/Profile-PNG-Icon-715x715.png'
                                    }} />
                            }
                            <Icon name="camera" size={30} color={theme.TINT_COLOR} style={{ position: "absolute", bottom: 15, right: 15 }} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ marginTop: 0, marginHorizontal: 0 }}>
                        <TextInput
                            style={{ ...styles.textInputStyle }}
                            value={this.state.nameTxt}
                            mode='outlined'
                            theme={{ colors: { primary: theme.TINT_COLOR } }}
                            label='Name'
                            onChangeText={(text) => this.setState({ nameTxt: text })}
                            placeholder='Enter Name'
                            placeholderTextColor={color.TEXT_SECONDARY}
                        />
                    </View>
                    <View style={{ marginTop: 0, marginHorizontal: 0 }}>
                        <TextInput
                            style={{ ...styles.textInputStyle }}
                            value={this.state.phoneNoTxt}
                            mode='outlined'
                            theme={{ colors: { primary: theme.TINT_COLOR } }}
                            label='Mobile Number'
                            onChangeText={(text) => this.setState({ phoneNoTxt: text })}
                            placeholder='Enter Mobile Number'
                            placeholderTextColor={color.TEXT_SECONDARY}
                        />
                    </View>
                    <View style={{ marginTop: 0, marginHorizontal: 0 }}>
                        <TextInput
                            style={{ ...styles.textInputStyle }}
                            value={this.state.emailTxt}
                            mode='outlined'
                            theme={{ colors: { primary: theme.TINT_COLOR } }}
                            label='Email'
                            onChangeText={(text) => this.setState({ emailTxt: text })}
                            placeholder='Enter Email'
                            placeholderTextColor={color.TEXT_SECONDARY}
                        />
                    </View>
                    <View style={{ marginTop: 0, marginHorizontal: 0 }}>
                        <TextInput
                            style={{ ...styles.textInputStyle }}
                            value={this.state.infoTxt}
                            mode='outlined'
                            theme={{ colors: { primary: theme.TINT_COLOR, } }}
                            label='Info'
                            onChangeText={(text) => this.setState({ infoTxt: text })}
                            placeholder='Enter what you know'
                            placeholderTextColor={color.TEXT_SECONDARY}
                            multiline
                        />
                    </View>
                    <View style={{ marginBottom: 100, marginTop: 20 }}>
                        <Calendar selectedDate={(dobDate) => { this.setState({ dobDate }) }} />
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => { this.savePersonDetails() }} activeOpacity={0.8} style={{ bottom: 0, flexDirection: 'row', flex: 1, width: DeviceWidth, position: 'absolute', backgroundColor: color.TINT_COLOR, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontSize: 18, color: color.TEXT_WHITE, letterSpacing: 2 }}>SAVE</Text>
                </TouchableOpacity>
                <AwesomeAlert
                    show={this.state.showAlert}
                    message={this.state.alertMsg}
                    showProgress={false}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    progressColor={color.THEME_ORANGE}
                    contentContainerStyle={styles.buttonStyleAlert}
                    messageStyle={{
                        color: color.TEXT_PRIMARY,
                        fontSize: 17
                    }}
                    showConfirmButton={true}
                    showCancelButton={true}
                    confirmText="Choose from Gallery"
                    cancelText="Take Now"
                    confirmButtonColor={color.ATT_GREEN}
                    cancelButtonColor={color.ATT_ORANGE}
                    onConfirmPressed={() => {
                        this.chooseFromGallery()
                    }}
                    onCancelPressed={() => {
                        this.openCamera()
                    }}
                    confirmButtonTextStyle={{
                        color: color.TEXT_WHITE,
                        fontSize: 16
                    }}
                    confirmButtonStyle={{
                        padding: 10
                    }}
                    cancelButtonTextStyle={{
                        color: color.TEXT_WHITE,
                        fontSize: 16
                    }}
                    cancelButtonStyle={{
                        padding: 10
                    }}
                />
                <Snackbar
                    visible={this.state.snackbarVisibility}
                    style={{ backgroundColor: color.WHITE, marginBottom: 100, borderRadius: 5 }}
                    duration={3000}
                    onDismiss={() => this.setState({ snackbarVisibility: false })}
                    action={{
                        label: 'Ok',
                        color: color.THEME_ORANGE,
                        onPress: () => {
                            this.setState({ snackbarVisibility: false })
                        },
                    }}
                >
                    <Text style={{ color: color.THEME_ORANGE, fontSize: 15 }}>{this.state.snackbarMsg}</Text>
                </Snackbar>
            </View>
        );
    }
}
const DeviceWidth = Dimensions.get('window').width
const DeviceHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
    Container: {
        flex: 1
    },
    Tile: {
        width: DeviceWidth,
        marginTop: 10
    },
    topButton: {
        flex: 1 / 2,
        alignItems: 'center',
        backgroundColor: color.TILE,
        marginHorizontal: 5,
        paddingVertical: 5,
        justifyContent: 'center',
        borderRadius: 15,
        borderColor: color.THEME_LIGHT_ORANGE,
        borderWidth: 1
    },
    topButtonTxt: {
        color: color.THEME_LIGHT_ORANGE
    },
    textInputStyle: {
        backgroundColor: color.WHITE,
        borderRadius: 5,
        paddingHorizontal: 5,
        marginVertical: 3,
        fontSize: 15,
    },
    selectedTopButton: {
        flex: 1 / 2,
        alignItems: 'center',
        backgroundColor: color.THEME_LIGHT_ORANGE,
        marginHorizontal: 5,
        paddingVertical: 5,
        justifyContent: 'center',
        borderRadius: 15,
        borderColor: color.THEME_ORANGE,
        borderWidth: 1
    },
    selectedTopButtonTxt: {
        color: color.WHITE
    },
    progressStyleAlert: {
        backgroundColor: color.WHITE,
        borderRadius: 25,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonStyleAlert: {
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: color.WHITE,
    }
});
export default NewDates;


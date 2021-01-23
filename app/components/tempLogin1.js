import React, { useState } from "react";
import { View, Text, TextInput, Image, ScrollView, Button, ImageBackground, StatusBar, Animated, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';
import { Snackbar, } from 'react-native-paper'
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import { postRequest, getRequest } from "../../services/APIRequest";
import urls from "../../constants/urls";
import Base64 from '../../utils/Base64'
import AsyncStorage from '@react-native-community/async-storage';
import storageKeys from "../../constants/storageKeys";
import RNFetchBlob from 'rn-fetch-blob';
import { MyContext } from "../../navigation/AppNavigation";
import color from "../../constants/color";
import * as Animation from 'react-native-animatable'
import LinearGradient from "react-native-linear-gradient";

export default class Login extends React.Component {

    constructor(props) {
        super(props)
        this.scrollRef = null
        this.state = {
            username: '',
            password: '',
            snackbarVisibility: false,
            snackbarMsg: '',
            width: new Animated.Value(150),
            height: new Animated.Value(50),
            submitting: false,
            submit: "SUBMIT",
            showPassword: false
        }
    }

    async componentDidMount() {

    }

    login = async (login) => {
        try {

            const { username, password } = this.state;
            let credentials = username.trim() + ":" + password.trim();
            this.animate(login)
            let basic = "Basic " + Base64.btoa(credentials);
            let headers = { Authorization: "" + basic }
            headers = { 'Accept': 'application/json', 'Authorization': basic, 'Content-Type': 'application/x-www-form-urlencoded', };
            if (password.trim().length != 0 && username.trim().length != 0) {
                try {
                    let resp = await postRequest(urls.LOGIN, "", {}, headers)
                    let res = await resp.json()
                    console.log(res)
                    console.log("LOGIN")
                    if (resp.status == 400) {
                        this.setState({ snackbarVisibility: true, snackbarMsg: res.msg })
                        this.animateOver(login, false)
                    } else if (resp.status == 200) {
                        AsyncStorage.setItem(storageKeys.COOKIE, resp.headers.map['set-cookie'].split(';')[0]).then(() => { this.loginSuccessful(login) })
                    }
                } catch (err) {
                    console.log(err)
                    this.setState({ snackbarVisibility: true, snackbarMsg: err + "" })
                    this.animateOver(login, false)
                }
            }
            else {
                this.setState({ snackbarVisibility: true, snackbarMsg: "Enter your credentials" })
                this.animateOver(login, false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    loginSuccessful = async (login) => {
        const Cookie = await AsyncStorage.getItem(storageKeys.COOKIE);
        console.log(Cookie);
        this.setState({ cookie: Cookie });
        console.log("Andar aa gye")
        login();
        try {
            await this.getDirectoryData()
            // await this.getExtensionData()
            // await this.getProfileData()
            // this.animateOver(login, true)
        } catch (error) {
            console.log(error);
        }
    }

    getDirectoryData = async () => {
        try {
            console.log('entered')
            const directoryData = await getRequest(urls.DIGITAL_DIRECTORY)
            AsyncStorage.setItem(storageKeys.DIGITAL_DIRECTORY, JSON.stringify(directoryData))
            //
            console.log('entered2')
            const extensionData = await getRequest(urls.GET_KIET_EXTENSIONS)
            AsyncStorage.setItem(storageKeys.KIET_EXTENSION, JSON.stringify(extensionData))
            //
            console.log('entered3')
            let profileResponse = await getRequest(urls.EMPLOYEE_INFO, this.state.cookie);
            AsyncStorage.setItem(storageKeys.PROFILE_DATA, JSON.stringify(profileResponse.data[0]));
        } catch (err) {
            console.log(err)
            // AsyncStorage.setItem(storageKeys.DIGITAL_DIRECTORY, JSON.stringify({ error: true }))
        }
    }
    getExtensionData = async () => {
        try {
            console.log('entered')
            const extensionData = await getRequest(urls.GET_KIET_EXTENSIONS)
            extensionData.error = false
            AsyncStorage.setItem(storageKeys.KIET_EXTENSION, JSON.stringify(extensionData))
        } catch (err) {
            console.log(err)
            AsyncStorage.setItem(storageKeys.KIET_EXTENSION, JSON.stringify({ error: true }))
        }
    }
    getProfileData = async () => {
        try {
            console.log('entered')
            let profileResponse = await getRequest(urls.EMPLOYEE_INFO, this.state.cookie);
            AsyncStorage.setItem(storageKeys.PROFILE_DATA, JSON.stringify(profileResponse.data[0]));
        } catch (err) {
            console.log(err)
        }
    }
    animate = (login) => {
        this.username.bounceOutLeft(1500)
        this.password.bounceOutRight(1500)

        this.setState({ submitting: true })
        Animated.timing(this.state.width, {
            toValue: 90,
            duration: 300
        }).start()
        Animated.timing(this.state.height, {
            toValue: 90,
            duration: 300
        }).start()
    }

    animateOver = (login, status) => {
        this.setState({ submitting: false })
        if (status) {                                                     //login successful
            setTimeout(login, 800)
            // login()
        } else {                                                          //login failed
            Animated.timing(this.state.width, {
                toValue: 150,
                duration: 600
            }).start()
            Animated.timing(this.state.height, {
                toValue: 50,
                duration: 600
            }).start()
            this.username.bounceInLeft(1500)
            this.password.bounceInRight(1500)

        }

    }

    render() {
        const { isLoading, LoggedIn } = this.state
        const theme = color
        return (

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch', backgroundColor: color.TILE }}>
                <StatusBar translucent={true} barStyle="light-content" hidden={false} backgroundColor={'#66aeed'} />
                <LinearGradient colors={['#91d6ed', color.THEME_ORANGE]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{ justifyContent: 'center', height: 180 }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Image style={{ height: 100, width: 100, alignSelf: 'center', }} source={require('../../assets/wfms_logo.png')} resizeMode="contain" />
                    </View>
                </LinearGradient>
                <View style={{ flex: 1, backgroundColor: color.BACKGROUND }}>
                    <View style={{ backgroundColor: color.BACKGROUND, flex: 14, marginHorizontal: 20, marginTop: -20, elevation: 5, marginBottom: 30 }}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 40, color: color.THEME_ORANGE, textAlign: 'center', }}>Login</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Animation.View ref={(ref) => { this.username = ref }} >
                                <View style={{ ...styles.textInputContainer, }}>
                                    <TextInput
                                        style={{ flex: 1, paddingVertical: 15, color: color.TEXT_PRIMARY, paddingLeft: 15, fontSize: 15 }}
                                        underlineColor={color.THEME_ORANGE}
                                        placeholder="Enter Employee ID"
                                        value={this.state.username}
                                        placeholderTextColor={color.TEXT_SECONDARY}
                                        onChangeText={(username) => { this.setState({ username }) }}
                                    />
                                    <TouchableOpacity onPress={() => { this.setState({ username: '' }) }}>
                                        {
                                            this.state.username != '' &&
                                            <Icon name='close-thick' size={25} style={{ paddingRight: 10, paddingVertical: 15 }} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </Animation.View>

                            <Animation.View ref={(ref) => { this.password = ref }} >
                                <View style={{ ...styles.textInputContainer, marginTop: 20 }}>
                                    <TextInput
                                        style={{ flex: 1, paddingVertical: 15, color: color.TEXT_PRIMARY, paddingLeft: 15, fontSize: 15 }}
                                        underlineColor={color.THEME_ORANGE}
                                        placeholder="Enter Password"
                                        // multiline={true}
                                        secureTextEntry={!this.state.showPassword}
                                        value={this.state.password}
                                        placeholderTextColor={color.TEXT_SECONDARY}
                                        onChangeText={(password) => { this.setState({ password }) }}
                                    />
                                    <TouchableOpacity onPress={() => { this.setState({ showPassword: !this.state.showPassword }) }}>
                                        {
                                            this.state.showPassword ?
                                                <Icon name="eye-off" size={25} style={{ paddingRight: 10, paddingVertical: 15 }} />
                                                :
                                                <Icon name="eye" size={25} style={{ paddingRight: 10, paddingVertical: 15 }} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </Animation.View>
                            <Animation.View ref={(ref) => this.submit = ref} iterationCount={1} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
                                <MyContext.Consumer>
                                    {
                                        value => (
                                            // <Button title="Submit" style={{width:WIDTH/2}} onPress={() => { this.login(value) }} />
                                            <Animated.View style={{ justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', paddingVertical: 25, borderColor: color.WHITE, borderWidth: 1, borderRadius: 35, marginHorizontal: 65 }} >
                                                <TouchableOpacity onPress={() => { this.login(value) }} activeOpacity={1}>
                                                    <LinearGradient colors={['#91d6ed', color.THEME_ORANGE]}
                                                        start={{ x: 0, y: 1 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={{ justifyContent: 'center', height: 50, borderRadius: 35 }}
                                                    >
                                                        <Text style={{ color: color.TEXT_WHITE, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        )
                                    }
                                </MyContext.Consumer>
                            </Animation.View>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: color.WHITE, flexDirection: 'row' }}>
                            <Text style={{ color: color.TEXT_PRIMARY, textAlign: 'center', fontSize: 40, }}>KIET </Text>
                            <Text style={{ color: color.TEXT_SECONDARY, textAlign: 'center', fontSize: 40, }}> WFMS</Text>
                        </View>
                    </View>
                </View>
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

        )
    }
}

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        height: HEIGHT,
        width: WIDTH,
    },
    viewPager: {
        flex: 1,
    },
    buttonContainer: {
        borderRadius: 20,
        paddingLeft: 25,
        // shadowColor: '#000000',
        margin: 10,
        marginHorizontal: 20,
        // elevation:10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        // borderBottomWidth:0,
        marginTop: 20,
        borderColor: color.THEME_ORANGE,
        // backgroundColor:color.TEXT_SECONDARY,
        borderWidth: 1,
        borderTopRightRadius: 0,
    },
    textInputStyle: {
        flex: 1,
        paddingHorizontal: 10,
        color: color.TEXT_PRIMARY
    },
    textInputContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 15,
        alignItems: 'center',
        elevation: 6,
        backgroundColor: color.BACKGROUND,
        borderRadius: 0
    }

})


const animateToCenter = {
    0.0:
    {
        transform: [{ scale: 1 }]
    },
    1:
    {
        transform: [{ scale: 2 }]
    },
}

const coverScreenAnimation = {
    0.0:
    {
        transform: [{ scale: 1 }]
    },
    0.25:
    {
        transform: [{ scale: 3 }]
    },
    0.5:
    {
        transform: [{ scale: 8 }]
    },
    1:
    {
        transform: [{ scale: 15 }]
    },
}

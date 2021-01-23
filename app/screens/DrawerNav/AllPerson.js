import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Image, ScrollView, TouchableOpacity, Dimensions, Linking, Text, FlatList, ActivityIndicator, Animated, BackHandler, PermissionsAndroid } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import color from '../../constants/color'
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import { Card, Appbar, TextInput, Snackbar } from 'react-native-paper'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-community/async-storage'
// import AsyncStorage from "react-native-fs-store/index";
import AwesomeAlert from 'react-native-awesome-alerts';
import storageKeys from '../../constants/storageKeys';
import Contacts from 'react-native-contacts';

class AllPerson extends Component {
    constructor(props) {
        super(props)
        this.setData = this.setData.bind(this);
        this.state = {
            loading: true,
            refreshing: false,
            today: '',
            semStartDate: '',
            cookie: '',
            showAlert: false,
            markedDateData: {},
            eventDateData: {},
            snackbarVisibility: false,
            snackbarMsg: '',
            allPersonList: [],
            personAllData: []
        }
    }
    componentDidMount() {
        this.setData()
    }
    setData = async () => {
        const data = await AsyncStorage.getItem(storageKeys.PEOPLE_DATA_LIST)
        var personAllData = JSON.parse(data)
        var allPersonList = []
        personAllData.forEach(element => {
            element.forEach(elem => {
                allPersonList.push(elem)
            });
        });
        this.setState({ allPersonList: allPersonList })
    }
    saveContact = (item) => {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        ).then(() => {
            Contacts.checkPermission().then(permission => {
                // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
                if (permission === 'undefined') {
                    Contacts.requestPermission().then(permission => {
                        // ...
                    })
                }
                if (permission === 'authorized') {
                    // yay!
                    var newPerson = {
                        emailAddresses: [{
                            label: "mobile",
                            email: item.email,
                        }],
                        displayName: item.name,
                        phoneNumbers: [{ number: item.phone, label: "mobile" }]

                    }

                    Contacts.openContactForm(newPerson).then(contact => {
                        // contact has been saved
                    })
                }
                if (permission === 'denied') {
                    // x.x
                    this.setState({ snackbar: true, snackbarMsg: "Permission Denied" })
                }
            })

        })
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Appbar.Header theme={{ colors: { primary: color.BACKGROUND, } }}>
                    <Appbar.Content
                        titleStyle={{ alignSelf: 'center', fontWeight: '200', fontSize: 22, letterSpacing: 2 }}
                        title="Everyone You Know"
                        color={color.TEXT_PRIMARY}
                    />
                </Appbar.Header>
                <FlatList
                    data={this.state.allPersonList}
                    extraData={this.state.allPersonList}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity activeOpacity={1}>
                            <Card style={{ marginVertical: 2, marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 8 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={{ borderRadius: 50, borderWidth: 0.5, height: 100, width: 100, borderColor: color.TINT_COLOR }} source={{
                                        uri: item.image
                                    }} />
                                    <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 1, marginLeft: 10 }}>
                                        <View >
                                            <Text style={{ fontSize: 16, color: color.TEXT_PRIMARY }}>{item.name}</Text>
                                            <Text>{item.dob}</Text>
                                            <Text>{item.phone}</Text>
                                            <Text>{item.email}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>{item.info}</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: color.TILE, marginVertical: 10 }}></View>
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                                    <TouchableOpacity onPress={() => { this.saveContact(item) }} >
                                        <Icon name={"contacts-outline"} size={30} color={color.ATT_ORANGE} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { Linking.openURL(`tel:${item.phone}`) }} >
                                        <Icon name={"phone-outline"} size={30} color={color.ATT_GREEN} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${item.email}`) }}  >
                                        <Icon name={"email-outline"} size={30} color={color.ATT_RED} />
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    }
                />
            </View >
        );
    }
}

export default AllPerson;
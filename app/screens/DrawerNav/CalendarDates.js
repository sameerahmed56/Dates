import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Image, ScrollView, TouchableOpacity, Alert, Dimensions, Text, FlatList, ActivityIndicator, Animated, BackHandler } from 'react-native';
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
import PTRView from 'react-native-pull-to-refresh';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTask from 'react-native-background-task'

// BackgroundTask.define(() => {
//     console.log('Hello from a background task')
//     try {
//         PushNotification.createChannel(
//             {
//                 channelId: "main-channel", // (required)
//                 channelName: "My channel", // (required)
//                 channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
//                 playSound: true, // (optional) default: true
//                 soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//                 importance: 4, // (optional) default: 4. Int value of the Android notification importance
//                 vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
//             },
//             (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
//         );
//         const a = new Date(Date.now() + (2 * 1000))
//         console.log('a:', a)
//         PushNotification.localNotificationSchedule({
//             title: 'Birthday Alert',
//             date: new Date(Date.now() + (2 * 1000)), // in 60 secs
//             message: "It's My Birthday",
//             allowWhileIdle: false,
//             channelId: "main-channel"
//         });
//         // PushNotification.popInitialNotification((notification) => {
//         //     console.log('Initial Notification', notification);
//         // });
//     } catch (error) {
//         console.log('error:', error)
//     }
//     BackgroundTask.finish()
// })

class CalendarDates extends Component {
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
            singleDateData: {},
            personAllData: []
        }
    }
    componentDidMount() {
        // BackgroundTask.schedule({
        //     period: 900, // Aim to run every 15 mins - 
        // })

        // Optional: Check if the device is blocking background tasks or not
        // this.checkStatus()
        this.setData()
    }

    checkStatus = async () => {
        const status = await BackgroundTask.statusAsync()

        if (status.available) {
            // Everything's fin
            console.log('FINE')
            return
        }

        const reason = status.unavailableReason
        if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
            Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
        } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
            Alert.alert('Restricted', 'Background tasks are restricted on your device')
        }
        else {
            console.log('SOMETHING ELSE')
        }
    }
    setData = async () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + "-" + mm + "-" + dd
        // AsyncStorage.setItem(storageKeys.PEOPLE_DATA_LIST, JSON.stringify([]))
        const data = await AsyncStorage.getItem(storageKeys.PEOPLE_DATA_LIST)
        var personAllData = JSON.parse(data)
        // console.log('personAllData:', personAllData)
        var eventDateData = {}
        var markedDateData = {}
        const birthday = { key: 'birthday', color: color.WHITE, selectedDotColor: color.WHITE };
        personAllData.forEach(element => {
            var cDate = element[0].dob
            var noOfDots = []
            element.forEach(elem => {
                noOfDots.push(birthday)
            })
            markedDateData[cDate] = {
                selected: true,
                selectedColor: color.TINT_COLOR,
                dots: noOfDots
            }
            eventDateData[cDate] = [
                element
            ]
        });
        this.setState({ markedDateData: markedDateData, eventDateData: eventDateData, })
    }
    pushNotification() {
        console.log('r')
        try {
            PushNotification.createChannel(
                {
                    channelId: "main-channel", // (required)
                    channelName: "My channel", // (required)
                    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                    playSound: true, // (optional) default: true
                    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                    importance: 4, // (optional) default: 4. Int value of the Android notification importance
                    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                },
                (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
            );
            const a = new Date(Date.now() + (2 * 1000))
            console.log('a:', a)
            PushNotification.localNotificationSchedule({
                title: 'Birthday Alert',
                date: new Date(Date.now() + (2 * 1000)), // in 60 secs
                message: "It's My Birthday",
                allowWhileIdle: false,
                channelId: "main-channel"
            });
            // PushNotification.popInitialNotification((notification) => {
            //     console.log('Initial Notification', notification);
            // });
        } catch (error) {
            console.log('error:', error)
        }
    }
    render() {
        const theme = color
        const { markedDateData, eventDateData, showAlert, refreshing } = this.state
        const renderItem = (item, firstItemInDay) => {
            console.log('rendering', item)
            return (
                <FlatList
                    data={item}
                    extraData={item}
                    initialNumToRender={0}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity onPress={() => { console.log(item) }} activeOpacity={1}>
                            <Card style={{ marginVertical: 5, marginHorizontal: 8, paddingVertical: 10, paddingHorizontal: 8 }}>
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
                            </Card>
                        </TouchableOpacity>
                    }
                />
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <Appbar.Header color={color.TEXT_PRIMARY} theme={{ colors: { primary: color.WHITE, } }}>

                    <Appbar.Content
                        titleStyle={{ alignSelf: 'center', fontWeight: '200', fontSize: 25, paddingLeft: 42, letterSpacing: 2 }}
                        title="Dates"
                        color={color.TINT_COLOR_DARKER}
                    />

                    <Appbar.Action
                        icon="bell"
                        color={color.TINT_GREY_DARK}
                        onPress={() => { this.pushNotification() }} />
                </Appbar.Header>
                <Agenda
                    current={this.state.today}
                    // maxDate={this.state.today}
                    // minDate={this.state.semStartDate}
                    monthFormat={'MMMM yyyy'}
                    // hideExtraDays={true}
                    onDayPress={(day) => { console.log('selected day', day) }}
                    // loadItemsForMonth={(month) => { console.log('data loaded') }}
                    onMonthChange={(month) => { console.log('month changed', month) }}
                    pastScrollRange={12}
                    firstDay={1}
                    // futureScrollRange={0}
                    theme={{
                        backgroundColor: color.TILE,
                        calendarBackground: color.TINT_COLOR_LIGHTER,
                        selectedDayBackgroundColor: color.TINT_COLOR_DARKER,
                        selectedDayTextColor: color.TEXT_WHITE,
                        todayTextColor: color.BLACK,
                        textDisabledColor: color.GREY,
                        dayTextColor: color.TEXT_PRIMARY,
                        agendaKnobColor: color.TINT_COLOR_DARKER,
                        agendaDayTextColor: color.TEXT_SECONDARY,
                        agendaDayNumColor: color.TEXT_PRIMARY,
                        dotColor: color.ATT_GREEN,
                        agendaTodayColor: color.TINT_COLOR,
                        selectedDotColor: color.ATT_RED,
                        'stylesheet.calendar.header': { week: { marginTop: Platform.OS == 'ios' ? 6 : 2, flexDirection: 'row', justifyContent: 'space-between' } }

                    }}
                    items={this.state.eventDateData}
                    renderItem={(item) => { return (renderItem(item)) }}
                    markedDates={this.state.markedDateData}
                    markingType={'multi-dot'}
                    renderEmptyData={() => {
                        return (
                            <Card style={{ marginVertical: 5, marginHorizontal: 8, width: '80%', paddingVertical: 10, paddingHorizontal: 8 }}>
                                <View>
                                    <Text>
                                        NO DATA
                                    </Text>
                                </View>
                            </Card>
                        );
                    }}
                />
                <View style={{ backgroundColor: theme.WHITE, position: 'absolute', bottom: 30, left: 30, borderRadius: 28, height: 56, width: 56, justifyContent: 'center', alignItems: 'center', elevation: 8 }}  >
                    <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => { this.setData() }}>
                        <Icon name="reload" color={color.TINT_COLOR} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: theme.WHITE, position: 'absolute', bottom: 30, right: 30, borderRadius: 28, height: 56, width: 56, justifyContent: 'center', alignItems: 'center', elevation: 8 }}  >
                    <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => { this.props.navigation.navigate('New Dates') }}>
                        <Icon name="plus" color={color.TINT_COLOR} size={25} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default CalendarDates;
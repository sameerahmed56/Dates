import React, { Profiler, useState } from "react";
import { View, Text, Image, TouchableHighlight, Animated, PanResponder, StatusBar, Dimensions } from 'react-native';
import SplashScreen, { isLoggedIn } from '../screens/Splash/SplashScreen'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as Animatable from "react-native-animatable";
import colors from '../constants/color'
import { enableScreens } from 'react-native-screens'
//screen

import NewDates from "../screens/MainStack/NewDates";
import CalendarDates from '../screens/DrawerNav/CalendarDates'
import AllPerson from "../screens/DrawerNav/AllPerson";
import AllNotification from "../screens/MainStack/AllNotification";
import Profile from "../screens/DrawerNav/Profile";

const SIZE = 80;
export default class AppNavigation extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            LoggedIn: false,
        }
    }

    async componentDidMount() {

    }


    render() {
        const { isLoading, LoggedIn } = this.state
        return (
            <DrawerNavigator />
        )
    }
}
const StackNavigator = createStackNavigator();
const MainStack = (props) => (
    <StackNavigator.Navigator
        initialRouteName="Calendar Dates"
        mode="card"
        headerMode="none"
    >
        <StackNavigator.Screen name="Calendar Dates" component={CalendarDates} />
        <StackNavigator.Screen name="New Dates" component={NewDates} />
        <StackNavigator.Screen name="All Notification" component={AllNotification} />
    </StackNavigator.Navigator>

)
const Drawer = createDrawerNavigator();
const DrawerNavigator = (props) => {
    return (
        <Drawer.Navigator
            drawerType="front"
            openByDefault={false}
            edgeWidth={120}
            backBehavior="history"
            overlayColor="transparent"
            drawerPosition="left"
            keyboardDismissMode="on-drag"
            detachInactiveScreens={false}
            // goBack="goBack"
            screenOptions={({ route }) => ({

                drawerIcon: ({ focused, color, size }) => {
                    let iconName;
                    let sizeIcon = focused ? size + 4 : size
                    let colorIcon = focused ? colors.TINT_COLOR : colors.TEXT_PRIMARY
                    if (route.name === 'Calendar Dates') {
                        iconName = focused ? 'timetable' : 'timetable'
                        return <Icon name={iconName} size={sizeIcon} color={colorIcon} />
                    }
                    else if (route.name === 'All Person') {
                        iconName = focused ? 'account-plus' : 'account-plus-outline'
                        return <Icon name={iconName} size={sizeIcon} color={colorIcon} />
                    }
                    else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account'
                        return <Icon name={iconName} size={sizeIcon} color={colorIcon} />
                    }
                },
            })}
            drawerContentOptions={{
                activeTintColor: colors.TINT_COLOR,
                inactiveTintColor: colors.TEXT_PRIMARY,
                keyboardHidesTabBar: true,
                activeBackgroundColor: colors.TILE, //60708d
                inactiveBackgroundColor: colors.WHITE, //00223d 
                adaptive: true,

            }}

            drawerStyle={{
                backgroundColor: colors.BACKGROUND,
                width: DeviceWidth / 1.5,
                justifyContent: "center",
                // borderLeftColor: color.TINT_COLOR,
                // borderTopColor: color.TINT_COLOR,
                // borderLeftWidth: 2,
                // borderTopWidth: 2,
                // paddingTop: 50
            }}
        >
            <Drawer.Screen name="Calendar Dates" component={MainStack} />
            <Drawer.Screen name="Profile" component={Profile} />
            <Drawer.Screen name="All Person" component={AllPerson} />
        </Drawer.Navigator>
    )
}
const DeviceWidth = Dimensions.get('window').width
const DeviceHeight = Dimensions.get('window').height
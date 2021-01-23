import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
// import DatePicker from 'react-native-datepicker'
import DatePicker from 'react-native-date-picker'
import color from '../constants/color'

export default class Calendar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            days: [],
            selected: 5,
            date: new Date()
        }
    }

    componentDidMount() {
        let date = new Date()
        console.log(date)
        this.dateChange(date)
    }

    dateClicked = (index, day) => {
        this.setState({ selected: index, date: day.value })
        this.props.selectedDate(day.value)
    }

    dateChange = (selectedDate) => {
        this.setState({ date: selectedDate })

        let sliderDate = []

        for (let i = 3; i > 0; i--) {
            let date = new Date(selectedDate)
            date.setDate(date.getDate() - i);
            sliderDate.push({ key: getDay(date.getDay()), value: date })
        }

        let date = new Date(selectedDate)
        sliderDate.push({ key: getDay(date.getDay()), value: date })

        for (let i = 1; i <= 3; i++) {
            let date = new Date(selectedDate)
            date.setDate(date.getDate() + i);
            sliderDate.push({ key: getDay(date.getDay()), value: date })
        }
        this.setState({ days: sliderDate }, () => { this.dateClicked(3, this.state.days[3]) })
        // this.dateClicked(3,this.state.days[3])
    }

    render() {
        return (
            <View style={{ backgroundColor: color.WHITE, paddingTop: 20, width: deviceWidth * 4 / 5, borderRadius: 30, borderColor: color.BORDER, borderWidth: 1, justifyContent: 'space-evenly', alignSelf: 'center', marginTop: 20, marginBottom: 5, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <DatePicker
                        style={{ height: 30 }}
                        date={this.state.date}
                        mode="date"
                        format="YYYY-MM-DD"
                        androidVariant="iosClone"
                        minDate="2020-05-01"
                        maxDate={this.state.date}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => {
                            this.dateChange(date)
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    {
                        this.state.days.map((day, index) => {

                            return (
                                <TouchableOpacity onPress={() => { this.dateClicked(index, day) }} activeOpacity={0.8}>
                                    <View style={{ alignItems: 'center' }}>

                                        <View
                                            key={index}
                                            style={[
                                                { flexDirection: "column", alignItems: 'center', borderRadius: 10, paddingVertical: 5 },
                                                this.state.selected == index ? styles.selectedDate : {}
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    { fontSize: 13, fontWeight: 'bold', marginVertical: 7 },
                                                    this.state.selected == index ? { color: color.ACTIVE_TAB_ICON } : { color: color.TINT_COLOR }
                                                ]}
                                            >
                                                {day.key}
                                            </Text>
                                            <Text style={{ borderRadius: 100, aspectRatio: 1, padding: 5, textAlign: 'center', ...styles.buttonContainer }}>{day.value.getDate()}</Text>
                                        </View>
                                        {
                                            this.state.selected == index ?
                                                <View style={{ ...styles.TriangleShapeCSS }}></View>
                                                :
                                                <View style={{ height: 15 }}></View>

                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    dateNmonth: { color: color.TINT_COLOR, fontWeight: 'bold', borderBottomColor: color.ACTIVE_TAB_ICON, borderBottomWidth: 2, borderRadius: 2, marginBottom: 10 },

    buttonContainer: {
        backgroundColor: color.WHITE,
        shadowColor: '#000000',
        elevation: 5,
        color: color.TINT_COLOR
    },

    TriangleShapeCSS: {

        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color.TINT_COLOR,
        marginTop: 6, marginBottom: -10
    },
    selectedDate: {
        backgroundColor: color.TINT_COLOR,
        borderRadius: 50,
        paddingHorizontal: 5
    }
})

const deviceWidth = Dimensions.get('window').width

const getDay = (num) => {
    switch (num) {
        case 0:
            return "SUN"
        case 1:
            return "MON"
        case 2:
            return "TUE"
        case 3:
            return "WED"
        case 4:
            return "THU"
        case 5:
            return "FRI"
        case 6:
            return "SAT"
    }
}
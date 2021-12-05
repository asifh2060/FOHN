import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    FlatList
} from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window');
import fontFamily from "../../../assets/fonts"
import Calendar from "react-native-calendars/src/calendar";
import moment from 'moment';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'





export default class Calender extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);

        this.state = {
            startDate: undefined,
            endDate: undefined,
            _markedDates: [],
            appThemeMode:'light'

        }

    }
    componentWillMount() {
        this.setState({
            appThemeMode:this.context === 'dark' ? 'dark' :'light'
          },()=>{
            this.forceUpdate()
            console.log('comp->',this.setState.appThemeMode)
          })
        eventEmitter.on('currentModeChanged', newMode => {
            console.log('Switched to', newMode, 'mode')
            this.setState({
              appThemeMode:newMode
            })
        })
    }
    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() {
    }

    addDays = (Cdate) => {
        console.log("GETDate1: ", Cdate)
        var dat = moment(Cdate).format('YYYY-MM-DD')
        console.log("GETDate1: ", dat)
        dat = moment(dat, "YYYY-MM-DD").add(1, 'days');
        console.log("GETDate2: ", JSON.stringify(dat))
        return moment(dat).format('YYYY-MM-DD')
    }

    getDates(startDate, stopDate) {
        console.log("GETDates Start: ", JSON.stringify(startDate) + "  EndDate: " + JSON.stringify(stopDate))
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
            currentDate = this.addDays(currentDate);
        }
        return dateArray;
    };


    DayPress = (day) => {
        if (this.state.startDate === undefined) {
            this.setState({ startDate: day.dateString })
        } else {

            this.setState({ endDate: day.dateString }, () => {
                let allDates = this.getDates(this.state.startDate, this.state.endDate);
                console.log("AllDatesAdded", JSON.stringify(allDates))
                let markedDates = [];


                for (let i = 0; i < allDates.length; i++) {
                    if (i === 0) {
                        markedDates[allDates[i]] = { startingDay: true, color: '#EF4867' };
                    } else if (i === allDates.length - 1) {
                        markedDates[allDates[i]] = { selected: true, endingDay: true, color: '#EF4867' };
                    } else {
                        markedDates[allDates[i]] = { selected: true, color: '#EF4867' };
                    }
                }
                this.setState({ _markedDates: markedDates }, () => {
                    this.forceUpdate();
                    console.log("AllDatesSelected", JSON.stringify(this.state._markedDates))
                })
            })

        }

    }

    saveDates(){
       const { params } = this.props.navigation.state;
        if (params) {
            const { callbackFunction } = params;
            if (callbackFunction && typeof callbackFunction == 'function') {
                callbackFunction(this.state.startDate,this.state.endDate);
            }
        }
        this.props.navigation.goBack()
    }


    render() {
        const {appThemeMode}=this.state
        return (

            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#707071'}
                    centerComponent={"Open House Date"}
                    leftIcon={require("../../../assets/images/back.png")}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }
                />
                <ScrollView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                    <View style={style.calendarHead}>
                        <Text style={{ fontSize: 18, color: "#707071", fontFamily: fontFamily.Bold, margin: 10 }}>{"Open House Date"}</Text>
                        <TouchableOpacity onPress={()=>{
                            this.saveDates();
                            //this.props.navigation.goBack()
                        }} style={{ position: 'absolute', right: 0, width: 80, height: 60 }}>
                            <Text style={{ fontSize: 18, color: "#707071", fontFamily: fontFamily.Bold, margin: 10,}}>{"Save"}</Text>
                        </TouchableOpacity>

                    </View>


                    <Calendar
                        theme={{
                            arrowColor: '#EF4867',
                            textMonthFontSize: 20,
                            'stylesheet.calendar.header': {
                                week: {
                                    marginTop: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }
                            }
                        }}
                        markingType={"period"}
                        markedDates={this.state._markedDates}
                        // markedDates={{
                        //     // '2021-03-10': { startingDay: true, color: '#EF4867' },
                        //     // '2021-03-11': { selected: true, color: '#EF4867' },
                        //     // '2021-03-12': { selected: true, color: '#EF4867' },
                        //     // '2021-03-13': { selected: true, color: '#EF4867' },
                        //     // '2021-03-14': { selected: true, color: '#EF4867' },
                        //     // '2021-03-15': { selected: true, color: '#EF4867' },
                        //     // '2021-03-16': { selected: true, color: '#EF4867' },
                        //     // '2021-03-17': { selected: true, color: '#EF4867' },
                        //     // '2021-03-18': { selected: true, color: '#EF4867' },
                        //     // '2021-03-19': { selected: true, color: '#EF4867' },
                        //     // '2021-03-20': { selected: true, color: '#EF4867' },
                        //     // '2021-03-21': { selected: true, endingDay: true, color: '#EF4867' },
                        //     // '2020-06-23': { marked: true, dotColor: '#EF4867' },
                        //     // '2020-06-24': { startingDay: true, color: '#EF4867', textColor: '#FFFFFF' },
                        //     // '2020-06-25': { color: '#EF4867', textColor: '#FFFFFF' },
                        //     // '2020-06-26': { color: '#EF4867', textColor: '#FFFFFF', marked: true, dotColor: 'red' },
                        //     // '2020-06-27': { color: '#EF4867', textColor: '#FFFFFF' },
                        //     // '2020-06-28': { endingDay: true, color: '#EF4867', textColor: '#FFFFFF' },
                        // }}
                        // onDayPress={(day) => {console.log('selected day', day)}}
                        onDayPress={(day) => { this.DayPress(day) }}
                    />
                    <View style={{ width: "100%", height: 1, backgroundColor: "#707071", marginTop: 50 }} />
                </ScrollView>
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    calendarHead: {
        flex: 1,
        borderBottomColor: "#EF4867",
        borderBottomWidth: 7
    }


});

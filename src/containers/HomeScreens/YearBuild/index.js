import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
import appColor from '../../../component/appColor';
import Calendar from "react-native-calendars/src/calendar";
import Picker from '@gregfrench/react-native-wheel-picker'
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'
var PickerItem = Picker.Item;



export default class YearBuild extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            itemList: [
            ],
            SelectedValue: "Any",
            SelectedValueMax: "",
            showModal: false,
            selectedItem: 2,
            yearBuilt: props.navigation.getParam('yearBuilt'),
            yearList:[],
            appThemeMode: 'light'

        }

    }
    componentDidMount = () => {
        this.setState({
            appThemeMode: this.context === 'dark' ? 'dark' : 'light'
        }, () => {
            this.forceUpdate()
            console.log('comp->', this.setState.appThemeMode)
        })
        eventEmitter.on('currentModeChanged', newMode => {
            console.log('Switched to', newMode, 'mode')
            this.setState({
                appThemeMode: newMode
            })
        })
        let years=this.state.yearList;
        for(let i=1900; i<= 2021; i++){
            years.push(i.toString());
        };
        
        this.setState({yearList:years},()=>{
            console.log("TotalYears", this.state.yearList.length)
        });
        if (this.state.yearBuilt !== '') {
            this.state.yearList.map((item, index) => {
                if (this.state.yearBuilt.includes(item)) {
                    this.setState({ selectedItem: index })
                }
            });
        }
    }
    onPickerSelect(index) {
        console.log('index my value', index)
        this.setState({
            selectedItem: index,
        }, () => {
            this.setState({ yearBuilt: `Year ${this.state.yearList[this.state.selectedItem]}`, })
        });
    }
    componentWillMount() {
    }
    leftAction() {
        this.props.navigation.goBack()
    }
    CheckState(state) {
        if (state) {
            this.setState({ isEnable: false })
        }
        else
            this.setState({ isEnable: true })

    }

    onValueChange() {
        if (this.state.yearBuilt == '' || this.state.yearBuilt == 'Any') {
            alert('Select year');
            return
        }
        const { params } = this.props.navigation.state;
        if (params) {
            const { YearBuiltFunction } = params;
            if (YearBuiltFunction && typeof YearBuiltFunction == 'function') {
                YearBuiltFunction(this.state.yearBuilt);
            }
        }
        this.props.navigation.goBack()
    }
    onValueChangeMax(value: string) {
        this.setState({ SelectedValueMax: value })
    }

    DayPress = (day) => {
        const { params } = this.props.navigation.state;
        if (params) {
            const { YearBuiltFunction } = params;
            if (YearBuiltFunction && typeof YearBuiltFunction == 'function') {
                YearBuiltFunction(day);
            }
        }
        this.props.navigation.goBack()
    }
    render() {
        const { appThemeMode } = this.state

        return (
            <SafeAreaView style={[style.mainContainer,{ backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Year Built"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 0, backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black  }]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.squareTxt]}>Year Built</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.yearBuilt !== '' ? this.state.yearBuilt : 'Any'}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </View>
                    </View>
                    <View style={style.grayCont, { height: this.state.showModal ? 400 : 200 }}>
                        <View style={{ borderColor: appColor.Gray_Chateau, borderWidth: 1, height: 50, justifyContent: 'center', paddingLeft: 30, marginTop: 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ showModal: !this.state.showModal, })}>
                                <Text style={{color:appThemeMode === 'light' ? Colors.black : Colors.white }}>{this.state.yearBuilt !== '' ? this.state.yearBuilt : 'Any'}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.showModal && <Picker style={{ width: 100, height: 180 }}
                            lineColor="#000000" //to set top and bottom line color (Without gradients)
                            // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                            // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                            selectedValue={this.state.selectedItem}
                            itemStyle={{ color: appThemeMode === 'light' ? Colors.black : Colors.white , fontSize: 16 }}
                            onValueChange={(index) => this.onPickerSelect(index)}>
                            {this.state.yearList.map((value, i) => (
                                <PickerItem  label={value} value={i} key={i} />
                            ))}
                        </Picker>}
                        <TouchableOpacity
                            onPress={() => {
                                this.onValueChange()

                            }
                            }
                            style={{ height: 45, margin: 10, marginTop: 40, marginBottom: 10, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontFamily: fontFamily.Regular, color: 'white' }}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Calendar
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
                        markedDates={{
                            '2020-06-23': { marked: true, dotColor: '#EF4867' },
                            '2020-06-24': { startingDay: true, color: '#EF4867', textColor: '#FFFFFF' },
                            '2020-06-25': { color: '#EF4867', textColor: '#FFFFFF' },
                            '2020-06-26': { color: '#EF4867', textColor: '#FFFFFF', marked: true, dotColor: 'red' },
                            '2020-06-27': { color: '#EF4867', textColor: '#FFFFFF' },
                            '2020-06-28': { endingDay: true, color: '#EF4867', textColor: '#FFFFFF' },
                        }}
                        // onDayPress={(day) => {console.log('selected day', day)}}
                        onDayPress={(day) => { this.DayPress(day) }}
                    /> */}

                </ScrollView>
            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    squareTxt: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: fontFamily.Bold,
        color: 'gray',

    },
    noMinTxt: {
        fontSize: 12,
        color: '#0096A4',
        width: 60,
        textAlign: 'center',
        fontFamily: fontFamily.Regular,
    },
    bedTapTxt: {
        fontSize: 12,
        color: 'gray',
        fontFamily: fontFamily.Regular,
    },
    rowNavCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
    },
    minMaxCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 70,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    navImg: {
        width: 15,
        height: 15,
        marginLeft: 4,
        tintColor: 'gray'
    },
    grayCont: {
        height: 200,
        backgroundColor: '#E9E9E9',
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    btnStyle: {
        alignSelf: 'flex-end',
        paddingRight: 50,
    },
    btnLeftStyle: {
        paddingLeft: 50,
    }
});

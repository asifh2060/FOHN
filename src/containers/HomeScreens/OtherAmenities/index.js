import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class OtherAmenities extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            ac: true,
            waterfront: true,
            pool: true,
            appThemeMode:'light'

        }

    }
    componentDidMount(){
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
    componentWillMount() {
    }
    leftAction() {
        this.props.navigation.goBack()
    }
    CheckState(state) {
        if (state) {
            if (state === "ac") {
                if (this.state.ac) {
                    this.setState({ ac: false })
                }
                else {
                    this.setState({ ac: true })
                }
            }
            else if (state === "pool") {
                if (this.state.pool) {
                    this.setState({ pool: false })
                }
                else {
                    this.setState({ pool: true })
                }
            }
            else if (state === "waterfront") {
                if (this.state.waterfront) {
                    this.setState({ waterfront: false })
                }
                else {

                    this.setState({ waterfront: true }, () => {

                    })
                }
            }

        }
    }

    ApplyFilter = () => {
        const { params } = this.props.navigation.state;
        if (params) {
            const { OtherAnemitiesFunction } = params;
            if (OtherAnemitiesFunction && typeof OtherAnemitiesFunction == 'function') {
                OtherAnemitiesFunction(this.state.waterfront, this.state.pool, this.state.ac);
            }
        }
        this.props.navigation.goBack()
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <SafeAreaView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Other Amenities"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }


                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt, { fontFamily: fontFamily.Bold }]}>Other Amenities</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={()=>{
                            this.setState({
                                ac:false,
                                pool:false,
                                waterfront:false,
                            })
                        }}>
                            <Text style={[style.bedTapTxt]}>Any</Text>
                            {/* <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} /> */}
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: appThemeMode==='light' ? "#E9E9E9" :Colors.black, marginTop: 10, borderTopWidth: 1, borderBottomWidth: 1, paddingBottom: 80 }}>
                        <View style={[style.rowNavCont, { marginTop: 10 }]}>
                            <Text style={[style.bedRoomTxt]}>Must Have A/C</Text>
                            <ToggleSwitch
                                isOn={this.state.ac}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                // onToggle={() => this.CheckState("ac")}
                                onToggle={(state) => this.setState({ ac: state })}
                            />
                        </View>
                        <View style={[style.rowNavCont, { marginTop: 10 }]}>
                            <Text style={[style.bedRoomTxt]}>Must Have Pool</Text>
                            <ToggleSwitch
                                isOn={this.state.pool}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                // onToggle={() => this.CheckState("pool")}
                                onToggle={(state) => this.setState({ pool: state })}
                            />
                        </View>
                        <View style={[style.rowNavCont, { marginTop: 10 }]}>
                            <Text style={[style.bedRoomTxt]}>Waterfront</Text>
                            <ToggleSwitch
                                isOn={this.state.waterfront}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                // onToggle={() => this.CheckState("waterfront")}
                                onToggle={(state) => this.setState({ waterfront: state })}

                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            this.ApplyFilter()

                        }
                        }
                        style={{ height: 45, margin: 10, marginTop: 30, marginBottom: 10, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: fontFamily.Regular, color: 'white' }}>Submit</Text>
                    </TouchableOpacity>
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
    searchCont: {
        marginStart: 5,
        marginEnd: 25,
        marginTop: 10,
        borderColor: '#707070',
        borderWidth: 1,
        height: 46,
    },
    searchInput: {
        width: '100%',
        paddingLeft: 10,
        fontSize: 16,
        height: 46,
        color: '#707071',
        fontFamily: fontFamily.Regular
    },
    searchImg: {
        width: 40,
        height: 40,
        tintColor: '#707070',
    },
    saveSearchTxt: {
        fontSize: 14,
        color: '#0996A4',
        fontFamily: fontFamily.Bold,
        alignSelf: 'flex-end'
    },
    bedRoomTxt: {
        marginTop: 5,
        fontSize: 14,
        color: 'gray',
        fontFamily: fontFamily.Regular,
    },
    bedTapTxt: {
        fontSize: 12,
        color: 'gray',
        fontFamily: fontFamily.Regular,
    },
    bedRoomRowCont: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    bedRoomCont: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginStart: 5,
        marginEnd: 4,
        marginTop: 10,
        borderColor: 'gray',
        borderWidth: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bedInput: {
        width: 41,
        height: 38,
        fontSize: 14,
        textAlign: 'center',
        color: '#707071',
        fontFamily: fontFamily.Regular
    },
    rowNavCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
    },
    navImg: {
        width: 15,
        height: 15,
        marginLeft: 4,
        tintColor: 'gray'
    }
});

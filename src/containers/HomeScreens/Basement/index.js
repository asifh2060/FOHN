import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
// import {Picker} from '@react-native-community/picker';
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'
import appColor from '../../../component/appColor';
import Picker from '@gregfrench/react-native-wheel-picker'
var PickerItem = Picker.Item;

export default class Basement extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            basement: props.navigation.getParam('basement'),
            selectedItem: 2,
            itemList: ['Has Basement', 'Finished Basement', 'Unfinished Basement', 'Walkout Basement', 'No Basement'],
            showModal: false,
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
        if (this.state.basement !== '') {
            this.state.itemList.map((item, index) => {
                if (this.state.basement.includes(item)) {
                    this.setState({ selectedItem: index })
                }
            });
        }
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
        const { params } = this.props.navigation.state;
        // console.log('check params====>',value)
        if (params) {
            const { BaseMentFunction } = params;
            if (BaseMentFunction && typeof BaseMentFunction == 'function') {
                BaseMentFunction(this.state.basement);
            }
        }
        this.props.navigation.goBack()
        // this.setState({ basement: value }, () => {

        // });

    }
    onPickerSelect(index) {
        console.log('index my value', index)
        this.setState({
            selectedItem: index,
        }, () => {
            this.setState({ basement: `${this.state.itemList[this.state.selectedItem]}`, })
        });
    }
    render() {
        const { appThemeMode } = this.state

        return (
            <SafeAreaView style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Basement"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 0, backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.squareTxt]}>Basement</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.basement !== '' ? this.state.basement : 'Any'}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </View>
                    </View>
                    <View style={[style.grayCont, {borderTopColor:appThemeMode==='light' ? Colors.black :Colors.white,borderBottomColor:appThemeMode==='light' ? Colors.black :Colors.white, height: this.state.showModal ? 400 : 200 ,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                        <View style={{ borderColor: appColor.Gray_Chateau, borderWidth: 1, height: 50, justifyContent: 'center', paddingLeft: 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ showModal: !this.state.showModal, })}>
                                <Text style={{color:appThemeMode === 'light' ? Colors.black : Colors.white}}>{this.state.basement !== '' ? this.state.basement : 'Any'}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.showModal && <Picker style={{ width: 200, height: 180 }}
                            lineColor="#000000" //to set top and bottom line color (Without gradients)
                            // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                            // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                            selectedValue={this.state.selectedItem}
                            itemStyle={{ color: appThemeMode==='light' ? Colors.black :Colors.white, fontSize: 16 }}
                            onValueChange={(index) => this.onPickerSelect(index)}>
                            {this.state.itemList.map((value, i) => (
                                <PickerItem label={value} value={i} key={i} />
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
        width: 160,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
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
        paddingBottom: 10,
        justifyContent: 'center'
    },
    btnStyle: {
        alignItems: 'center'
    },
    btnLeftStyle: {
        alignItems: 'center'
    }
});

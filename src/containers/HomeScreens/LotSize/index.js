import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
// import {Picker} from '@react-native-community/picker';
import appColor from "../../../component/appColor"
import Picker from '@gregfrench/react-native-wheel-picker'
var PickerItem = Picker.Item;
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'
export default class LotSize extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            plotSize: props.navigation.getParam('plotSize'),
            SelectedValue: "No Min",
            SelectedValueMax: "No Max",
            selectedItem: 2,
            itemList: ['1000 sq ft', '2000 sq ft', '3000 sq ft', '4000 sq ft', '5000 sq ft',],
            itemList2: ['0.5 acres', '1 acres', '2 acres', '5 acres', '10 acres', '15 acres', '20 acres', '25 acres', '50 acres', '100 acres'],
            showModal: false,
            showMaxModal: false,
            selectedMaxItem: 2,
            appThemeMode: 'light'

        }

    }

    componentDidMount = () => {
        this.setState({
            appThemeMode: this.context
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
        if (this.state.plotSize !== '') {
            const value = this.state.plotSize.split('*');
            this.setState({ SelectedValue: value[0], SelectedValueMax: value[1] }, () => {
                this.state.itemList.map((item, index) => {
                    if (this.state.SelectedValue.includes(item)) {
                        this.setState({ selectedItem: index })
                    }
                });
                this.state.itemList2.map((item, index) => {
                    if (this.state.SelectedValueMax.includes(item)) {
                        this.setState({ selectedMaxItem: index })
                    }
                });
            })
            console.log('my value==>', value)
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
    onValueChange(value: string) {
        this.setState({ SelectedValue: value })
    }
    onValueChangeMax(value: string) {
        this.setState({ SelectedValueMax: value })
    }
    addedValue = () => {
        const { params } = this.props.navigation.state;
        // console.log('check params====>',value)
        if (params) {
            const { PlotSizeFunction } = params;
            if (PlotSizeFunction && typeof PlotSizeFunction == 'function') {
                PlotSizeFunction(`${this.state.SelectedValue} * ${this.state.SelectedValueMax}`);
            }
        }
        this.props.navigation.goBack()
    }
    onPickerSelect(index) {
        console.log('index my value', index)
        this.setState({
            selectedItem: index,
        }, () => {
            this.setState({ SelectedValue: `Min ${this.state.itemList[this.state.selectedItem]}`, })
        });
    }
    onPickerSelect2(index) {
        console.log('index my value', index)
        this.setState({
            selectedMaxItem: index,
        }, () => {
            this.setState({ SelectedValueMax: `Max ${this.state.itemList2[this.state.selectedMaxItem]}`, })
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
                    centerComponent={"Lot Size"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 20, backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.squareTxt, { fontSize: 14 }]}>Lot Size</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.SelectedValue !== '' && this.state.SelectedValueMax !== '' ? `${this.state.SelectedValue} * ${this.state.SelectedValueMax}` : 'Any'}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </View>
                    </View>
                    <View style={[style.grayCont, { backgroundColor: appThemeMode === 'light' ? '#E9E9E9' : Colors.black, height: this.state.showModal || this.state.showMaxModal ? 400 : 200 }]}>
                        <View style={[style.minMaxCont, {borderTopColor:appThemeMode === 'light' ? Colors.black : Colors.white,borderBottomColor:appThemeMode === 'light' ? Colors.black : Colors.white, marginTop: 30 }]}>
                            <TouchableOpacity onPress={() => this.setState({ showModal: !this.state.showModal, showMaxModal: false })}>
                                <Text style={{color:appThemeMode === 'light' ? Colors.black : Colors.white}}>{this.state.SelectedValue}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ showMaxModal: !this.state.showMaxModal, showModal: false })}>
                                <Text style={{color:appThemeMode === 'light' ? Colors.black : Colors.white}}>{this.state.SelectedValueMax}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.showModal && <Picker style={{ width: 150, height: 180 }}
                            lineColor="#000000" //to set top and bottom line color (Without gradients)
                            // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                            // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                            selectedValue={this.state.selectedItem}
                            itemStyle={{ color:appThemeMode === 'light' ? Colors.black : Colors.white, fontSize: 20 }}
                            onValueChange={(index) => this.onPickerSelect(index)}>
                            {this.state.itemList.map((value, i) => (
                                <PickerItem label={value} value={i} key={i} />
                            ))}
                        </Picker>}
                        {this.state.showMaxModal && <Picker style={{ width: 150, height: 180, alignSelf: 'flex-end' }}
                            // lineColor="#000000" //to set top and bottom line color (Without gradients)
                            // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                            lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                            selectedValue={this.state.selectedMaxItem}
                            itemStyle={{ color:appThemeMode === 'light' ? Colors.black : Colors.white, fontSize: 20 }}
                            onValueChange={(index) => this.onPickerSelect2(index)}
                        >
                            {this.state.itemList2.map((value, i) => (
                                <PickerItem label={value} value={i} key={i} />
                            ))}
                        </Picker>}
                        <TouchableOpacity
                            onPress={() => {
                                this.addedValue()

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
        fontSize: 12,
        fontFamily: fontFamily.Bold,
        color: 'gray',

    },
    noMinTxt: {
        fontSize: 12,
        color: '#0096A4',
        width: 65,
        textAlign: 'right',
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
        marginTop: 80,
        paddingLeft: 30,
        paddingRight: 30,
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
        height: 210,
        backgroundColor: '#E9E9E9',
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    btnStyle: {
        alignSelf: 'flex-end',
        paddingRight: 57,
    },
    btnLeftStyle: {
        paddingLeft: 45,
    }
});

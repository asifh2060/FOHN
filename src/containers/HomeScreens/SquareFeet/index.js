import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
import appColor from '../../../component/appColor';
import Picker from '@gregfrench/react-native-wheel-picker'
var PickerItem = Picker.Item;


export default class SquareFeet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            SelectedValue: "No Min",
            squareFeet: props.navigation.getParam('squareFeet'),
            SelectedValueMax: "No Max",
            selectedItem: 2,
            itemList: ['0.5','1','2','5','10','15','20','25','100'],
            itemList2: ['1000','2000','3000','4000','5000'],
            showModal: false,
            showMaxModal: false,
            selectedMaxItem: 2,
        }

    }
    componentDidMount = () => {
      if(this.state.squareFeet!== ''){
        const value = this.state.squareFeet.split('*');
        this.setState({SelectedValue: value[0],SelectedValueMax: value[1]},() => {
           this.state.itemList.map((item,index) => {
               if(this.state.SelectedValue.includes(item)){
                   this.setState({selectedItem: index})
               }
           });
           this.state.itemList2.map((item,index) => {
            if(this.state.SelectedValueMax.includes(item)){
                this.setState({selectedMaxItem: index})
            }
        });
        })
        console.log('my value==>',value)
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
        // alert(this.state.SelectedValue)
        if (this.state.SelectedValue == 'No Min' || this.state.SelectedValue == '') {
            alert('Select Minimum value');
            return
        }
        if (this.state.SelectedValueMax == 'No Max' || this.state.SelectedValueMax == '') {
            alert('Select Maximum value');
            return
        }
        const value = `${this.state.SelectedValue} *  ${this.state.SelectedValueMax}`;
        const { params } = this.props.navigation.state;
        console.log('check params====>', value)
        if (params) {
            const { squareFeetFunction } = params;
            if (squareFeetFunction && typeof squareFeetFunction == 'function') {
                squareFeetFunction(value);
            }
        }
        this.props.navigation.goBack()
        // this.setState({SelectedValue:value},() => {
        //     const { params } = this.props.navigation.state;
        //     console.log('check params====>',value)
        //     if (params) {
        //         const { squareFeetFunction } = params;
        //         if (squareFeetFunction && typeof squareFeetFunction == 'function') {
        //             squareFeetFunction(value);
        //         }
        //     }
        //     this.props.navigation.goBack()
        // })
    }
    onValueChangeMax(value: string) {
        this.setState({ SelectedValueMax: value })
    }
    onValueChangeMin(value: string) {
        this.setState({ SelectedValue: value })
    }
    DayPress = (day) => {
        const { params } = this.props.navigation.state;
        if (params) {
            const { callbackFunction } = params;
            if (callbackFunction && typeof callbackFunction == 'function') {
                callbackFunction(day);
            }
        }
        this.props.navigation.goBack()
    }

    onPickerSelect(index) {
        console.log('index my value',index)
        this.setState({
            selectedItem: index,
        },() => {
            this.setState({SelectedValue: `Min ${this.state.itemList[this.state.selectedItem]}`,})
        });
    }
    onPickerSelect2(index) {
        console.log('index my value',index)
        this.setState({
            selectedMaxItem: index,
        },() => {
            this.setState({SelectedValueMax: `Max ${this.state.itemList2[this.state.selectedMaxItem]}`,})
        });
    }

    onAddItem = () => {
        var name = 'New item';

        if (this.state.itemList.indexOf(name) == -1) {
            this.state.itemList.push(name);
        }

        this.setState({
            selectedItem: this.state.itemList.indexOf(name),
        });
    }

    render() {
        return (
            <SafeAreaView style={style.mainContainer}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Square Feet"}
                    bottomBorderColor={"#EF4867"}
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 20 }]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.squareTxt, { fontSize: 18, color: "#707071", fontWeight: "bold" }]}>Square Feet</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[style.bedTapTxt]}>{ this.state.SelectedValue !== '' && this.state.SelectedValueMax !== ''  ? `${this.state.SelectedValue} * ${this.state.SelectedValueMax}` : 'Any'}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                   resizeMode={'contain'}
                                   style={style.navImg} />
                        </View>
                    </View>
                    <View style={[style.grayCont,{height: this.state.showModal || this.state.showMaxModal ? 400 : 200}]}>
                        <View style={[style.minMaxCont, { marginTop: 30 }]}>
                            <TouchableOpacity onPress={() => this.setState({showModal: !this.state.showModal,showMaxModal: false})}>
                                <Text>{this.state.SelectedValue}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({showMaxModal: !this.state.showMaxModal,showModal: false})}>
                                <Text>{this.state.SelectedValueMax}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.showModal && <Picker style={{ width: 150, height: 180 }}
                                lineColor="#000000" //to set top and bottom line color (Without gradients)
                                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                                selectedValue={this.state.selectedItem}
                                itemStyle={{ color: "black", fontSize: 20 }}
                                onValueChange={(index) => this.onPickerSelect(index)}>
                                {this.state.itemList.map((value, i) => (
                                    <PickerItem label={value} value={i} key={i} />
                                ))}
                            </Picker>}
                            {this.state.showMaxModal && <Picker style={{ width: 130, height: 180,alignSelf: 'flex-end' }}
                                lineColor="#000000" //to set top and bottom line color (Without gradients)
                                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                                selectedValue={this.state.selectedMaxItem}
                                itemStyle={{ color: "black", fontSize: 20 }}
                                onValueChange={(index) => this.onPickerSelect2(index)}
                                >
                                {this.state.itemList2.map((value, i) => (
                                    <PickerItem label={value} value={i} key={i} />
                                ))}
                            </Picker>}
                        <TouchableOpacity
                            onPress={() => {
                                this.onValueChange()

                            }
                            }
                            style={{ height: 45, margin: 10, marginTop: 30, marginBottom: 10, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontFamily: fontFamily.Regular, color: 'white' }}>Submit</Text>
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
        marginTop: 10,
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
        height: 500,
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

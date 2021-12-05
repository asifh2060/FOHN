import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const { height, width } = Dimensions.get('window');
import appColor from "../../../component/appColor"
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'


export default class RateThisApp extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            text: "",
            appThemeMode:'light'

        }
    }
    CheckState(state) {
        if (state) {
            this.setState({ isEnable: false })
        }
        else
            this.setState({ isEnable: true })

    }

    componentWillMount() {
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
    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() { }
    render() {
        const {appThemeMode}=this.state

        return (
            <ScrollView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Rate This App"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <View style={{ flex: 1, backgroundColor: appColor.blue, width: width, height: height - 120 }}>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={require('../../../assets/images/FOHN_APPLoginLogo.png')} resizeMode={'contain'} style={{ width: 200, height: 200 }} />
                        </View>
                        <View style={{   borderWidth: 1, borderColor: 'black', height: 100, margin: 10, backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }}>
                            <TextInput placeholderTextColor='#707071'
                                onChangeText={(text) => {
                                    this.setState({ text: text })
                                }} value={this.state.createPassword}
                                placeholder={"Enter your description"} style={{
                                    width: '95%',
                                    //height:100,
                                    textAlign:"justify",
                                    fontSize: 18,
                                    marginStart: 10,
                                    color: appThemeMode==='light' ? Colors.black :Colors.white,
                                    margin: 10
                                }} />
                        </View>



                        <TouchableOpacity
                            onPress={() => {}}
                            style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EF4867', margin: 20 }}>
                            <Text style={{ color: 'white', fontSize: 22, }}>Submit</Text>
                        </TouchableOpacity>


                    </View>
                </View>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60 }}>
                    <Text style={{ color: "#005271" }}>{"Find Open Houses Now ver..."}</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },


});

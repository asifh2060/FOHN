import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Linking } from 'react-native'
import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import appColor from "../../../component/appColor";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

const resetActionToLanding = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LandingScreen' })],
});

export default class settings extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
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
    rightAction() { }
    render() {
        const {appThemeMode}=this.state

        return (
            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"SETTINGS"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView>
                    <View style={{ margin: 10, marginTop: 20, color: '#707071' }}>
                        <Text style={{ fontSize: 16, color: '#707071' }}>Notification are turned off</Text>
                        <Text style={{ color: '#707071' }}>To receive notifications from Find Open Houses Now, you’ll need to enable them in your device Settings.</Text>
                        <Text style={{ marginLeft: 30, marginTop: 10, color: '#707071' }}>1. Open Settings</Text>
                        <Text style={{ marginLeft: 30, marginTop: 10, color: '#707071' }}>2. Tap Notifications</Text>
                        <Text style={{ marginLeft: 30, marginTop: 10, color: '#707071' }}>3. Toggle, "Allow Notification" On</Text>
                        {/* <TouchableOpacity>
                            <Text style={{ color: '#00B7B0', textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Open Setting</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ flex: 1, backgroundColor: appColor.blue, marginTop: 20 }}>
                        <View style={{ margin: 10 }}>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Help & Feedback</Text>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL('https://findopenhousesnow.com/frequently-asked-questions/');
                                // this.props.navigation.navigate("Faqs")
                            }} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>FAQs</Text>
                                <Image resizeMode={'contain'} style={{ width: 12, height: 12 }} source={require('../../../assets/images/forward.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL('https://findopenhousesnow.com/customer-support/');
                                // this.props.navigation.navigate("CustomerSupport")
                            }} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Customer Support</Text>
                                <Image resizeMode={'contain'} style={{ width: 12, height: 12 }} source={require('../../../assets/images/forward.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate("RateThisApp") }} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Rate This App</Text>
                                <Image resizeMode={'contain'} style={{ width: 12, height: 12 }} source={require('../../../assets/images/forward.png')} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>In-App Sound</Text>
                                <ToggleSwitch
                                    isOn={this.state.isEnable}
                                    onColor={'#00B7B0'}
                                    offColor={"gray"}

                                    labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                    size="small"
                                    onToggle={() => this.CheckState(this.state.isEnable)}
                                />
                            </View>
                        </View>
                        <View style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginBottom: 20 }} />
                        <View style={{ marginStart: 10, marginEnd: 10, marginBottom: 20 }}>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Legal Information</Text>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL('https://findopenhousesnow.com/privacy-policy/');
                                // this.props.navigation.navigate("PrivacyPolicy")
                            }} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Privacy Policy</Text>
                                <Image resizeMode={'contain'} style={{ width: 12, height: 12 }} source={require('../../../assets/images/forward.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL('https://findopenhousesnow.com/terms-conditions/');
                                // this.props.navigation.navigate("TermsAndCondition")
                            }} style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Terms & Conditions</Text>
                                <Image resizeMode={'contain'} style={{ width: 12, height: 12 }} source={require('../../../assets/images/forward.png')} />
                            </TouchableOpacity>

                        </View>
                        <View style={{ borderBottomColor: 'white', borderBottomWidth: 1 }} />
                        <View style={{ marginStart: 10, marginEnd: 10, marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => {
                                Preference.clear();
                                Preference.set('userData', null);
                                this.props.navigation.dispatch(resetActionToLanding)

                            }} style={{ justifyContent: 'space-between', marginTop: 20, flexDirection: 'row', alignItems: "center" }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Sign Out</Text>
                                <Image resizeMode={'contain'} style={{ width: 12, height: 12 }} source={require('../../../assets/images/forward.png')} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../assets/images/FOHN_APPLoginLogo.png')} resizeMode={'contain'} style={{ width: 200, height: 200 }} />
                            </View>
                        </View>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black, marginTop: 10 }}>
                            <Text style={{ color: "#005271" }}>{"Find Open Houses Now ver..."}</Text>
                        </TouchableOpacity>
                    </View>
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


});

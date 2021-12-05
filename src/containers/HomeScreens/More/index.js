import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import fontFamily from './../../../assets/fonts'
import Preference from 'react-native-preference';
import SimpleToast from "react-native-simple-toast";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class more extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
            userData: Preference.get("userData", ""),
            socialLogin: Preference.get('socialLogin', 'false'),
            appThemeMode:'light'

        }
    }
    componentDidMount = () => {
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
    CheckUserData = () => {

        if (this.state.userData) {
            this.props.navigation.navigate('StacyMartinProfile',)
        }
        else {
            Alert.alert(
                null,
                "Please Register/Sign In First",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.props.navigation.navigate('LandingScreen') }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please login first to see your profile')
        }
    }

    render() {
        const {appThemeMode}=this.state
        let email;
        if (this.state.userData === null || this.state.userData == undefined) {
            email = "Guest";
        } else {
            email = this.state.userData?.email
        }
        return (
            <ScrollView style={{ flex: 1, backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black ,marginBottom:30}}>
                <View >
                    {/* {this.state.socialLogin !== 'true' && <TouchableOpacity
                        onPress={() => { this.CheckUserData() }}
                        style={{ backgroundColor: '#EF4867', marginTop: 35, marginBottom: 20, height: 75, justifyContent: "center", alignItems: "center" }}>
                        <Text style={style.textFormate}>{'GO TO PROFILE'}</Text>
                    </TouchableOpacity>} */}

                    <TouchableOpacity
                        onPress={() => { this.CheckUserData() }}
                        style={{ backgroundColor: '#EF4867', marginTop: 35, marginBottom: 20, height: 75, justifyContent: "center", alignItems: "center" }}>
                        <Text style={style.textFormate}>{'GO TO PROFILE'}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 35, backgroundColor: '#707070', marginTop: 20, justifyContent: 'center' }}>
                        <Text style={{ marginStart: 10, fontSize: 18, color: 'white', fontFamily: fontFamily.Bold }}>Open House Search</Text>
                    </View>
                    <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../../assets/images/recently_viewed.png')} resizeMode={'contain'} style={{ width: 35, height: 35, marginLeft: 15 }} />
                        <Text style={{ marginStart: 10, fontSize: 20, color: '#707070', fontFamily: fontFamily.Light }}>Recently Viewed</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Realtor', {
                                value: "um_realtor"
                            })
                        }}
                        style={[style.innerView, { marginTop: 15, backgroundColor: '#005271' }]}>
                        <Text style={style.textFormate}>{'FIND A REALTOR'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Builder', {
                                value: "um_builder"
                            })
                        }}
                        style={[style.innerView, { backgroundColor: '#00B7B0', marginTop: 20 }]}>
                        <Text style={style.textFormate}>{'FIND A BUILDER'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Lender', {
                                value: "um_lender"
                            })
                        }}
                        style={[style.innerView, { backgroundColor: '#EF4867', marginTop: 20 }]}>
                        <Text style={style.textFormate}>{'FIND A LENDER'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Agent', {
                                value: "um_insurance-agent"
                            })
                        }}
                        style={[style.innerView, { backgroundColor: '#005271', marginTop: 20 }]}>
                        <Text style={style.textFormate}>{'FIND AN INSURANCE AGENT'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Builder', {
                                value: "um_for-sale-by-owner"
                            })
                        }}
                        style={[style.innerView, { backgroundColor: '#00B7B0', marginTop: 20 }]}>
                        <Text style={style.textFormate}>{'SALE BY OWNER'}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 50, backgroundColor: '#707070', marginTop: 20, justifyContent: 'center' }}>
                        <Text style={{ marginHorizontal: 10, fontSize: 18, color: 'white', fontFamily: fontFamily.Bold }}>{"Account: \t" + email}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.state.userData == undefined ? 
                            Alert.alert(
                                null,
                                "Please Register/Sign In First",
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    { text: "OK", onPress: () => this.props.navigation.navigate('LandingScreen') }
                                ],
                                { cancelable: false }
                            ) :
                            this.props.navigation.navigate('settings') }}
                        style={{ marginTop: 10, justifyContent: 'center', marginBottom: 15 }}>
                        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../../assets/images/settings.png')} resizeMode={'contain'} style={{ width: 35, height: 35, marginLeft: 15 }} />
                        <Text style={{ marginStart: 10, fontSize: 20, color: '#707070', fontFamily: fontFamily.Light }}>Settings</Text>
                    </View>
                    </TouchableOpacity>
                {/* </View>*/}
                </View>
            </ScrollView >
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "green"
    },
    innerView: {
        height: 85,
        backgroundColor: '#00B7B0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textFormate: {
        width: '90%',
        textAlign: 'center',
        fontFamily: fontFamily.Bold,
        fontSize: 27,
        color: 'white'
    }


});

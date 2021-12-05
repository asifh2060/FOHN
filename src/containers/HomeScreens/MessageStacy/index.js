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
    FlatList,
    Platform,
    Linking,
    Alert
} from 'react-native'
import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";

const { height, width } = Dimensions.get('window');
import { AirbnbRating } from "react-native-ratings";
import appColor from "../../../component/appColor"
import { color } from 'react-native-reanimated';
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";
import SimpleToast from "react-native-simple-toast";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class MessageStacy extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            message: "",
            realtorPhone: props.navigation.getParam("phone", ""),
            userId: props.navigation.getParam("userId"),
            LoginUserId: Preference.get('userData'),
            loading: false,
            appThemeMode:'light'

        }
    }

    componentDidMount = () => {
        eventEmitter.on('currentModeChanged', newMode => {
            console.log('Switched to', newMode, 'mode')
            this.setState({
              appThemeMode:newMode
            })
        })
        this.setState({
            appThemeMode:this.context === 'dark' ? 'dark' :'light',
            phone: this.state.LoginUserId.billing_phone,
            name: this.state.LoginUserId.name,
            email: this.state.LoginUserId.email
        },()=>{
            this.forceUpdate()
            console.log('comp->',this.setState.appThemeMode)
          })
        console.log('check LoginUserId===>', this.state.LoginUserId);
        // console.log('check phone===>',this.state.userId);

    }

    componentWillMount() {
    }

    leftAction() {
        this.props.navigation.goBack()
    }

    rightAction() {
    }

    SendMessage = () => {
        if (this.state.name == '') {
            Alert.alert(
                null,
                'Name is required',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Name is required');
            return
        }
        if (this.state.email == '') {
            Alert.alert(
                null,
                'Email is required',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Email is required');
            return
        }
        if (this.state.phone == '') {
            Alert.alert(
                null,
                'Phone is required',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Phone is required');
            return
        }
        if (this.state.message == '') {
            Alert.alert(
                null,
                'Message is required',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Message is required');
            return
        }
        const details = {
            content: this.state.message,
            sender_user_id: this.state.LoginUserId.id,
            receiver_user_id: this.state.userId
        };
        this.setState({
            loading: true
        });
        console.log("Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.SEND_MESSAGES, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestPramas,
        }).then(response => {
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            this.setState({ loading: false, name: '', email: '', phone: '', message: '' });
            console.log('CONTACT_TO_PROPERTY_OWNER Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                Alert.alert(
                    null,
                    response.message,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show(response.message);
                this.props.navigation.navigate("ProfileInbox")
            }
            else if (response.status === "404") {
                Alert.alert(
                    null,
                    response.message,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show(response.message);
            }
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }

    OpenDialer = () => {
        let number = '';
        if (Platform.OS === 'ios') {
            number = `telprompt:${this.state.realtorPhone}`;
        }
        else {
            number = `tel:${this.state.realtorPhone}`;
        }
        Linking.openURL(number);
    }

    render() {
        const {appThemeMode}=this.state

        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={appThemeMode==='light' ? '#00B7B0' :Colors.white }
                    backgroundColorHead={appThemeMode==='light' ? '#00B7B0' :Colors.black }
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"MESSAGE"}
                    bottomBorderColor={"#EF4867"}

                />
                <KeyboardAwareScrollView
                    style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    enableAutomaticScroll={true}>
                    <TouchableOpacity style={{ marginStart: 20 }}
                    onPress={this.leftAction.bind(this)}>
                        <Text style={{ color: "#00B7B0", fontSize: 16, marginTop: 10, fontWeight: "bold" }}>{"Close"}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, borderColor: '#707071', borderWidth: 1, margin: 20 }}>
                        <View style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1 }}>
                            <TextInput placeholderTextColor='#707071'
                                onChangeText={(text) => {
                                    this.setState({ name: text })
                                }} value={this.state.name} placeholder={"Name"}
                                style={{ width: '95%', height: 60, fontSize: 18, marginStart: 10 }} />
                        </View>
                        <View style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1 }}>
                            <TextInput placeholderTextColor='#707071'
                                onChangeText={(text) => {
                                    this.setState({ email: text })
                                }} value={this.state.email} placeholder={"Email"}
                                style={{ width: '95%', height: 60, fontSize: 18, marginStart: 10 }} />
                        </View>
                        <View style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1 }}>
                            <TextInput placeholderTextColor='#707071'
                                keyboardType={'number-pad'}
                                onChangeText={(text) => {
                                    this.setState({ phone: text })
                                }} value={this.state.phone} placeholder={"Phone"}
                                style={{ width: '95%', height: 60, fontSize: 18, marginStart: 10 }} />
                        </View>
                        {/* <View style={{height: 200, margin: 10, borderColor: '#707071', borderWidth: 1}}> */}
                        <TextInput
                            style={{ height: 200, margin: 10, borderColor: '#707071', borderWidth: 1, width: '95%', fontSize: 18, marginStart: 10, textAlignVertical: 'top',paddingLeft: 12,color:appThemeMode==='light' ? Colors.black :Colors.white }}
                            multiline={true}
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ message: text })
                            }}
                            value={this.state.message}
                            placeholder={"Message"}
                            scrollEnabled={true}
                        //    style={{width: '95%', height: 60, fontSize: 18, marginStart: 10}}
                        />
                        {/* </View> */}
                        <View style={{ margin: 10 }}>
                            <Text
                                style={{ color: '#707071' }}>{"By pushing Send, you agree that this professional or a member of their team will call, text, or email you regarding your inquiry."}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            // this.props.navigation.navigate("ProfileInbox")
                            this.SendMessage()
                        }}
                            style={{
                                height: 60,
                                margin: 10,
                                borderColor: '#707071',
                                borderWidth: 1,
                                backgroundColor: '#EF4867',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>SEND</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.OpenDialer()}
                        style={{
                            height: 60,
                            margin: 10,
                            borderColor: '#707071',
                            borderWidth: 1,
                            backgroundColor: '#EF4867',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginStart: 35,
                            marginEnd: 35
                        }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>CALL</Text>
                    </TouchableOpacity>

                    <ProgressBar visible={this.state.loading} />
                </KeyboardAwareScrollView>
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        backgroundColor: "white"
    },

    imgStyle: {
        width: '100%',
        height: 150
    },
});

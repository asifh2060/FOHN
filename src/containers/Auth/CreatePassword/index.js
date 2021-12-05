import React, { Component } from 'react';
import { View, Image, Alert, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import Header from "../../../component/Header";
import ProgressBar from './../../../component/ProgressBar';
import * as constants from './../../../utils/constants';
import Api from '../../../network/Api';
import { API } from '../../../utils/constants'
import SimpleToast from "react-native-simple-toast";
import Preference from 'react-native-preference';
import { NavigationActions, StackActions } from "react-navigation";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'
const resetActionToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainBottomTab' })],
});
export default class CreatePassword extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props)
        this.state = {
            createPassword: "",
            confirmPassword: "",
            password: '',
            name: props.navigation.getParam("name", ""),
            email: props.navigation.getParam("email", ""),
            userRole: props.navigation.getParam("user_role", ""),
            postHouse: props.navigation.getParam('postHouse'),
            showPassword: false,
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


    checkCreateAccountFields() {
        if (this.state.createPassword === "") {
            alert('Create Password required')
            return false;
        } else if (this.state.createPassword < 8) {
            alert('Create Password must be atleast 8 characters')
            return false;
        }
        if (this.state.confirmPassword === "") {
            alert('Confirm Password required')
            return false;
        } else if (this.state.confirmPassword !== this.state.createPassword) {
            alert('Confirm password mismatch with create passowrd')
            return false;
        } else {
            return true
        }
    }

    checkLoginFields() {
        if (this.state.password === "") {
            alert('Password required')
            return false;
        } else if (this.state.password.length < 6) {
            alert('Password must be atleast 6 characters')
            return false;
        } else {
            return true
        }
    }

    
    submitSelScr() {
        console.log('this Slected Index' + this.props.navigation.getParam("user_role", "no role"))
        if (this.props.navigation.getParam("user_role", "no role") === 'BUILDER') {
            this.props.navigation.navigate('BuilderMembership')
        } else if (this.props.navigation.getParam("user_role", "no role") == 'REALTOR') {

            this.props.navigation.navigate('RealtorMembership')
        } else if (this.props.navigation.getParam("user_role", "no role") === "INSURANCE AGENT") {

            this.props.navigation.navigate('InsuranceAgentMembership')
        } else if (this.props.navigation.getParam("user_role", "no role") === 'SALE OWNER MEMBERSHIP') {
            this.props.navigation.navigate('SaleOwnerMembership')
        } else if (this.props.navigation.getParam("user_role", "no role") === 'LENDER MEMBERSHIP') {
            this.props.navigation.navigate('LenderMembership')
        }
    }

   
    normalUserLoginAPi = () => {
        const { email } = this.props.navigation.getParam;
        const body = {
            user_email: email,
            password: this.state.password
        };
        this.setState({
            loading: true
        })
        Api.CheckEmail(body).then(function (response) {
            console.log("normalUserLoginAPi---------->", response)
            if (response.code == 200) {
                this.setState({ loading: false })
                this.props.navigation.navigate('MainBottomTab')
            } else {
                this.setState({ loading: false })
                Alert.alert("Error", response.msg)
            }

        }.bind(this)).catch(function (error) {
            this.setState({
                loading: false
            })
            Alert.alert('error' + error);
        }.bind(this));
    }

    userLoginApi = () => {
        const details = {
            user_login: this.state.email,
            user_password: this.state.password
        };
        this.setState({
            loading: true
        })
        console.log("Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.LOGIN, {
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
            console.log('userLoginApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {

                Preference.set('userData', response.body);
                if (this.state.postHouse) {
                    this.props.navigation.navigate('CreateOpenHouse',{
                        postHouse: true
                    })
                }
                else {
                    this.props.navigation.dispatch(resetActionToHome)
                }
            } else {
                Alert.alert(
                    "Alert",
                    "The password is incorrect!",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('The password is incorrect!')
            }
            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    forgotPassApi = () => {
        const details = {
            // user_email: "test15@test.com",
            user_email: this.state.email,
        };
        this.setState({
            loading: true
        })
        console.log("Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.RESET_PASS, {
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
            console.log('forgotPassApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {


                // this.props.navigation.navigate('MainBottomTab')

            } else {


            }
            this.setState({ loading: false });
            Alert.alert(
                "Alert",
                response.message,
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )

            // SimpleToast.show(response.message);
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    validatePassword() {

        if (this.state.createPassword === "") {
            Alert.alert(
                "Alert",
                "Please Enter Password",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show("Please Enter Password")
        } else if (this.state.createPassword.length < 6) {
            Alert.alert(
                null,
                "Password must be minimum of 6 characters",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show("Password must be minimum of 6 characters")
        }
        else if (this.state.confirmPassword === "") {
            Alert.alert(
                null,
                "Please Re-Enter Password",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show("Please Re-Enter Password")
        }
        // else if (this.state.confirmPassword.length < 6) {
        //     SimpleToast.show("Password must be minimum of 6 characters")
        // } 
        else if (this.state.confirmPassword !== this.state.createPassword) {
            Alert.alert(
                null,
                "Password and Confirm password doesn't match",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show("Password and Confirm password doesn't match")
        } else {
            this.userRegisterApi();

        }
    }

    userRegisterApi = () => {
        const details = {
            user_login: this.state.name,
            user_email: this.state.email,
            user_pass: this.state.confirmPassword,
            role: this.state.userRole,
            // display_name: this.state.password,
            // first_name: this.state.password,
            // last_name: this.state.password
        };
        console.log("Params: ", JSON.stringify(details))

        this.setState({
            loading: true
        })
        // console.log("Params: ", JSON.stringify(body))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.REGISTER, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestPramas,
        }).then(response => {
            console.log(response.status)
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            console.log('userRegisterApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                console.log("\n\n\n\n" + response.body.user_id + "\n\n\n\n")
                Preference.set('userRegisterId', response.body);
                // this.props.navigation.navigate('ProfileForm', {
                if (this.state.postHouse) {
                    this.props.navigation.navigate('CreateOpenHouse',{
                        user_id: response.body.user_id,
                        postHouse: true
                    })
                }
                if (this.state.userRole === 'um_builder') {
                    this.props.navigation.navigate('BuilderMembership')
                }
                else if (this.state.userRole == 'um_realtor') {
                    this.props.navigation.navigate('RealtorMembership')
                }
                else if (this.state.userRole === "um_insurance-agent") {
                    this.props.navigation.navigate('InsuranceAgentMembership')
                }
                else if (this.state.userRole === 'um_for-sale-by-owner') {
                    this.props.navigation.navigate('SaleOwnerMembership')
                }
                else if (this.state.userRole === 'um_lender') {
                    this.props.navigation.navigate('LenderMembership')
                }
                // this.props.navigation.navigate('ProfileForm', {
                //     userId: response.body.user_id,
                //     userRole: this.state.userRole
                // })
            } else {
                Alert.alert(
                    null,
                    response.message,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show(response.message)
            }
            this.setState({ loading: false });
        }).catch(error => {
            this.setState({ loading: false });
            console.log('ApiError:', error);
        });
    }

    continueButtonPressed() {
        /*if (!this.checkLoginFields()) {
            return false;
        } else {
            this.normalUserLoginAPi()
        }*/

        if (!this.checkLoginFields()) {
            return false;
        } else {
            this.userLoginApi()
        }
    }

    componentWillMount() {

    }

    leftAction() {

    }

    rightAction() {

    }

    render() {
        const {appThemeMode}=this.state
        return (
            <ScrollView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ?  Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    centerComponent={"REGISTER/SIGN IN"}
                    bottomBorderColor={"#EF4867"}
                />
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 20 }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                     onPress={() => {
                        if (this.props.navigation.getParam("userExist", "no exsit") == true) {

                            this.continueButtonPressed()
                        } else {

                            this.validatePassword()
                        }
                        // else if (this.props.navigation.getParam("userRole", "no exsit") == "signUp") {
                        //     this.signUpUserRole()
                        // }
                    }}
                        // onPress={() => {
                        //     this.props.navigation.navigate('ProfileForm')
                        // }}
                        >
                        <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Next</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.props.navigation.getParam("userExist", "no exsit") == false || this.props.navigation.getParam("userRole", "no exsit") == "signUp" ?
                        <View>
                            <View style={{
                                height: 60,
                                marginStart: 20,
                                marginEnd: 20,
                                borderColor: '#707071',
                                borderWidth: 1
                            }}>
                                <TextInput secureTextEntry={true} maxLength={22} placeholderTextColor='#707071'
                                    onChangeText={(text) => {
                                        this.setState({ createPassword: text })
                                    }} value={this.state.createPassword}
                                    placeholder={"Create Password"} style={{
                                        width: '95%',
                                        height: 60,
                                        fontSize: 18,
                                        marginStart: 10,
                                        color:appThemeMode==='light' ?  Colors.black :Colors.white
                                    }} />
                            </View>
                            <View style={{
                                height: 60,
                                marginStart: 20,
                                marginEnd: 20,
                                marginTop: 10,
                                borderColor: '#707071',
                                borderWidth: 1
                            }}>
                                <TextInput secureTextEntry={true} placeholderTextColor='#707071'
                                    onChangeText={(text) => {
                                        this.setState({ confirmPassword: text })
                                    }} value={this.state.confirmPassword} placeholder={"Confirm Password"}
                                    style={{
                                        width: '95%',
                                        height: 60,
                                        fontSize: 18,
                                        marginStart: 10,
                                        color: appThemeMode==='light' ?  Colors.black :Colors.white
                                    }} />
                            </View>
                        </View> :
                        <View style={{

                            marginStart: 20,
                            marginEnd: 20,
                            marginTop: 10,
                            alignItems: "center"

                        }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: '100%',
                                height: 60,
                                // marginStart: 10,
                                borderColor: '#707071',
                                borderWidth: 1,
                                }}>
                            <TextInput secureTextEntry={!this.state.showPassword} maxLength={16} placeholderTextColor='#707071' onChangeText={(text) => {
                                this.setState({ password: text })
                            }} value={this.state.password} placeholder={"Enter Password"} style={{
                                width: '60%',
                                fontSize: 18,
                                marginStart: 10,
                                color: appThemeMode==='light' ?  Colors.black :Colors.white
                            }} />
                            <TouchableOpacity onPress={() => this.setState({showPassword: !this.state.showPassword})} style={{width: "30%",justifyContent: "center"}}>
                            <Image style={{width: 20,height: 20,resizeMode: "contain",alignSelf: 'flex-end',marginRight: 10}} source={this.state.showPassword ? require('../../../assets/images/show_password.png') : require('../../../assets/images/hide_password.png') } />
                            </TouchableOpacity>
                            
                            </View>
                           

                            <TouchableOpacity
                                onPress={() => {
                                    this.forgotPassApi();
                                }}>


                                <Text
                                    style={{
                                        margin: 20, color: "#0e5271",
                                        fontSize: 20, fontStyle: 'italic'//fontFamily: "italic",
                                    }}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>


                        </View>
                }

                {/*<TouchableOpacity  onPress={()=>{*/}
                {/*    this.props.navigation.navigate("ForgotPassword")*/}
                {/*}}>*/}
                {/*<Text style={{fontSize:22,color:'#005271',fontWeight:'bold',textAlign:"center",marginTop:10,fontStyle:"italic"}}>Forgot Password?</Text>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    onPress={() => {
                        if (this.props.navigation.getParam("userExist", "no exsit") == true) {

                            this.continueButtonPressed()
                        } else {

                            this.validatePassword()
                        }
                        // else if (this.props.navigation.getParam("userRole", "no exsit") == "signUp") {
                        //     this.signUpUserRole()
                        // }
                    }}
                    style={{
                        height: 50,
                        margin: 20,
                        borderColor: '#D1AE5E',
                        borderWidth: 1,
                        backgroundColor: '#D1AE5E',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Continue</Text>
                </TouchableOpacity>
                <ProgressBar visible={this.state.loading} />
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

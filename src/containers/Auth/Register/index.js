import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { Picker } from "native-base";
import Header from "../../../component/Header";
import { API } from "../../../utils/constants";
import ProgressBar from './../../../component/ProgressBar';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

const type = [];
type.push({ label: "Builder", value: "um_builder", });
type.push({ label: "Realtor", value: "um_realtor", });
// type.push({ label: "Customer",value: "customer", });
type.push({ label: "Lender", value: "um_lender", });
type.push({ label: "Insurance Agent", value: "um_insurance-agent", });
type.push({ label: "Sale by Owner", value: "um_for-sale-by-owner", });


export default class Register extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: props.navigation.getParam("email", ""),
            builder: "",
            realStateAgent: "",
            sellingMyHome: "",
            lender: "",
            insuranceAgent: "",
            isSelectMile: true,
            selectedMiles: "um_builder",
            selectedIndex: 'um_builder',
            loading: false,
            postHouse: props.navigation.getParam('postHouse'),
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
    checkFields() {
        if (this.state.name === "") {
            alert('Username is required')
            return false;
        }
        if (this.state.email === "") {
            alert('Email is required')
            return false;
        }
        if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(this.state.email) == false) {
            alert('Email format is incorrect')
            return false
        }
        else {
            return true
            // this.checkEmailApi()
        }
    }

    checkEmailApi = () => {
        const details = {
            username_or_email: this.state.email
        };
        this.setState({ loading: true })
        // console.log("Params: ", JSON.stringify(body))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        console.log("API URL: " + API.CHECK_EMAIL)
        console.log("API Params: " + JSON.stringify(details))

        requestPramas = requestPramas.join("&");
        fetch(API.CHECK_EMAIL, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestPramas,
        }).then(response => {
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            this.setState({ loading: false });
            console.log('checkEmailApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.props.navigation.navigate('CreatePassword', { userExist: true, email: this.state.email })

            }
            else {

                this.setState({ loading: false });
                console.log('Error: ' + JSON.stringify(response));
                this.props.navigation.navigate('CreatePassword', {
                    email: this.state.email,
                    userRole: "signUp",
                    name: this.state.name,
                    user_role: this.state.selectedIndex 
                })


            }
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    componentWillMount() {

    }

    leftAction() {

    }
    rightAction() {

    }

    // submitSelScr() {
    //     console.log('this Slected Index' + this.state.selectedIndex)
    //     if (this.state.selectedIndex === 'BUILDER') {
    //         console.log(this.state.selectedIndex)
    //         this.props.navigation.navigate('BuilderMembership')
    //     }
    //     else if (this.state.selectedIndex === 'REALTOR') {
    //         console.log(this.state.selectedIndex);
    //         this.props.navigation.navigate('RealtorMembership')
    //     }
    //     else if (this.state.selectedIndex === "INSURANCE AGENT") {
    //         console.log(this.state.selectedIndex);
    //         this.props.navigation.navigate('InsuranceAgentMembership')
    //     }
    //     else if (this.state.selectedIndex === 'SALE OWNER MEMBERSHIP') {
    //         console.log(this.state.selectedIndex);
    //         this.props.navigation.navigate('SaleOwnerMembership')
    //     }
    //     else if (this.state.selectedIndex === 'LENDER MEMBERSHIP') {
    //         console.log(this.state.selectedIndex);
    //         this.props.navigation.navigate('LenderMembership')
    //     }
    // }
    render() {
        const {appThemeMode}=this.state

        return (
            <ScrollView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={() => this.props.navigation.goBack()}
                    rightAction={this.rightAction.bind(this)}
                    leftIcon={require('../../../assets/images/back.png')}
                    HeaderColor={'#00B7B0'}
                    bottomBorderColor={"#EF4867"}
                    centerComponent={"REGISTER/SIGN IN"}
                    
                />
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 20 }}>

                    {/* <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('sign_in')
                        }}>
                        <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('ProfileForm')
                        }}>
                        <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Next</Text>
                    </TouchableOpacity> */}
                </View>
                <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold', textAlign: 'center' }}>{"Fill Out the Form to Continue"}</Text>
                <View style={{ flex: 1, margin: 20, borderColor: '#707071', borderWidth: 1 }}>
                    <View style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1 }}>
                        <TextInput maxLength={20} placeholderTextColor='#707071' onChangeText={(text) => { this.setState({ name: text }) }} value={this.state.name} placeholder={"Username"} style={{ width: '95%', height: 60, fontSize: 18, marginStart: 10,   color:appThemeMode==='light' ? Colors.black :Colors.inputFieldText }} />
                    </View>
                    <View style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1 }}>
                        <TextInput placeholderTextColor='#707071' onChangeText={(text) => { this.setState({ email: text }) }} value={this.state.email} placeholder={"Email"} style={{ width: '95%', height: 60, fontSize: 18, marginStart: 10,   color:appThemeMode==='light' ? Colors.black :Colors.inputFieldText  }} autoCapitalize={"none"} />
                    </View>
                    <View style={{ margin: 10 }}>
                        <Text placeholderTextColor='#707071' style={{ fontSize: 24, fontWeight: 'bold', color: '#005271' }}>I am:</Text>
                    </View>
                    <View style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1 }}>
                        <View style={{ height: 40, width: "100%", backgroundColor: "white" }}>
                            <Picker
                                selectedValue={this.state.selectedMiles}
                                // placeholder={''}
                                // iosHeader={''}
                                style={{ height: 50, width: "100%", backgroundColor: 'white', fontSize: 22, color: "#707071" }}
                                onValueChange={(itemValue, index) => {
                                    this.setState({ selectedMiles: itemValue, isSelectMile: true })
                                    this.setState({ selectedIndex: itemValue }, () => {
                                        this.forceUpdate()
                                    })
                                }
                                }>
                                {
                                    type.map((item, index) => {
                                        return <Picker.Item key={index} label={item.label.toUpperCase()} value={item.value} />
                                    })}
                            </Picker>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            // this.checkFields()
                            if (this.checkFields()) {
                                this.props.navigation.navigate("CreatePassword", {
                                    userRole: "signUp",
                                    name: this.state.name,
                                    email: this.state.email,
                                    user_role: this.state.selectedIndex,
                                    postHouse: this.state.postHouse
                                 })
                                //  this.submitSelScr()
                            }

                        }}
                        style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>
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

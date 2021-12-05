import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Platform } from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const { height, width } = Dimensions.get('window');
import appColor from "../../../component/appColor"
import stripe from 'tipsi-stripe'
import SimpleToast from "react-native-simple-toast";
import { Calendar } from 'react-native-calendars';
import moment from 'moment'

// const {
// 	nonce,
// 	payerId,
// 	email,
// 	firstName,
// 	lastName,
// 	phone
// } = await requestOneTimePayment(
//   token,
//   {
//     amount: '5', // required
//     // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
//     currency: 'GBP',
//     // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
//     localeCode: 'en_GB', 
//     shippingAddressRequired: false,
//     userAction: 'commit', // display 'Pay Now' on the PayPal review page
//     // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
//     intent: 'authorize', 
//   }
// );



export default class PaymentInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            cardNumber: '',
            expiryDate: '',
            CVV: '',
            isCalender: false,
            card: true,
            payPal: false,
            pay: false,
            expiryYear: '',
            expiryMonth: '',
            params: {
                number: '4242424242424242',
                expMonth: 12,
                expYear: 24,
                cvc: '223',
                name: 'Test User',
                currency: 'usd',
                addressLine1: '123 Test Street',
                addressLine2: 'Apt. 5',
                addressCity: 'Test City',
                addressState: 'Test State',
                addressCountry: 'Test Country',
                addressZip: '55555',
            },
            errorParams: {
                number: '4242424242424241',
                expMonth: 12,
                expYear: 24,
                cvc: '223',
                name: 'Test User',
                currency: 'usd',
                addressLine1: '123 Test Street',
                addressLine2: 'Apt. 5',
                addressCity: 'Test City',
                addressState: 'Test State',
                addressCountry: 'Test Country',
                addressZip: '55555',
            },
        }
    }
    componentDidMount(){
        // let stripeOptions = stripe.setOptions({
        //     publishableKey: 'pk_test_51IH2fxCqkj7GBVD94sUnY89tDalfgL2OlEjFW2vgrmcYyaShcdUR9lU0rcnwLxFdmH6AccC5J3XGuVhqg0Yr225200QCoTEMdD',
        //     //merchantId: 'MERCHANT_ID', // Optional
        //     androidPayMode: 'test', // Android only
        // });
    }

    componentWillMount() {
    }

    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() { }
    PaymentType(type) {
        if (type === "card") {
            this.setState({ card: true, payPal: false, pay: false })
        }
        else if (type === "paypal") {
            this.setState({ card: false, payPal: true, pay: false })

        }
        else if (type === "pay") {
            this.setState({ card: false, payPal: false, pay: true })
        }
    }


    CheckPaymentMethod = () => {
        if (Platform.OS == 'android' && this.state.card) {
            this.StripePayment()
        }
        else if (Platform.OS == 'android' && this.state.payPal) {
            this.PayPal()
        }
        else if(Platform.OS == 'ios' && this.state.pay){
            this.Applepay()
        }
    }

    PayPal = () => {

    }

    Applepay = () => {
        this.props.navigation.navigate("ProfileForm",{profile:"form"})
    }

    StripePayment = async () => {
        // if(this.state.fullName == ''){
        //     SimpleToast.show('Full name is required');
        //     return
        // }
        // if(this.state.cardNumber == ''){
        //     SimpleToast.show('Card number is required');
        //     return
        // }
        // if(this.state.expiryDate == ''){
        //     SimpleToast.show('Expiry date is required');
        //     return
        // }
        // if(this.state.CVV == ''){
        //     SimpleToast.show('CVV/CVC is required');
        //     return
        // }
        // const token = await stripe.createTokenWithCard(this.state.params)
        // console.log("MyCardToken",JSON.stringify(token))
        // console.log("MyCardToken",JSON.stringify(token.tokenId))
    }
    calenderRender() {
        return (
            <View style={{ position: "absolute", height: "100%", width: "100%", backgroundColor: "white" }}>
                <View style={{ width: "100%" }}>
                    <Calendar
                        theme={{
                            arrowColor: '#EF4867',
                            textMonthFontSize: 20,
                            'stylesheet.calendar.header': {
                                week: {
                                    marginTop: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }
                            }
                        }}
                        onDayPress={(date) => {
                            console.log('aasdf', date)
                            this.setState({ isCalender: false, expiryDate: moment(date.timestamp).format('MM/YYYY'), expiryYear: date.year, expiryMonth: date.month })
                        }}
                    />
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'white'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"PAYMENT INFO"}
                    backgroundColorHead={"#00B7B0"}
                    bottomBorderColor={"#00B7B0"}
                    rightIcon={require('../../../assets/images/back.png')}
                    rightIcon={require('../../../assets/images/cartwhite.png')}


                />
                <ScrollView style={style.mainContainer}>
                    <View style={{ flex: 1, backgroundColor: "#00B7B06A" }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#005271", marginTop: 10 }}>{"Payment Method:"}</Text>
                        <View style={{ flexDirection: "row", margin: 10, justifyContent: "space-around", marginStart: 70, marginEnd: 70, paddingBottom: 20 }}>
                            {Platform.OS !== 'ios' && <TouchableOpacity onPress={() => { this.PaymentType("card") }} style={{ backgroundColor: this.state.card ? "white" : "#C9F0EE", width: 80, height: 80, alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../../../assets/images/Debit.png")} resizeMode={"contain"} style={{ width: 50, height: 50 }} />
                                <Text style={{ fontSize: 10, fontWeight: "bold", color: appColor.blue }}>{"Credit Card"}</Text>
                            </TouchableOpacity>}
                            {Platform.OS !== 'ios' && <TouchableOpacity onPress={() => { this.PaymentType("paypal") }} style={{ backgroundColor: this.state.payPal ? "white" : "#C9F0EE", width: 80, height: 80, alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../../../assets/images/Paypal.png")} resizeMode={"contain"} style={{ width: 60, height: 60 }} />
                            </TouchableOpacity>}
                            {Platform.OS !== 'android' && <TouchableOpacity onPress={() => { this.PaymentType("pay") }} style={{ backgroundColor: this.state.pay ? "white" : "#C9F0EE", width: 80, height: 80, alignItems: "center", justifyContent: "center" }}>
                                <Image source={require("../../../assets/images/Pay.png")} resizeMode={"contain"} style={{ width: 60, height: 60 }} />
                            </TouchableOpacity>}
                        </View>
                    </View>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#005271", marginTop: 10 }}>{"Credit Details:"}</Text>
                    <View style={style.inputContainer}>
                        <View style={{ margin: 10, borderBottomWidth: 3, borderBottomColor: appColor.blue }}>
                            <Text style={{ fontSize: 16, color: appColor.Gray_Chateau }}>{"Full Name:"}</Text>
                            <TextInput style={{ height: 40 }} 
                            value={this.state.fullName}
                            onChangeText = {(text) => {this.setState({fullName: text})}}
                            />
                        </View>
                        <View style={{ margin: 10, borderBottomWidth: 3, borderBottomColor: appColor.blue }}>
                            <Text style={{ fontSize: 16, color: appColor.Gray_Chateau }}>{"Credit Card Number:"}</Text>
                            <TextInput style={{ height: 40 }} 
                            keyboardType={'decimal-pad'}
                            maxLength={16}
                            value={this.state.cardNumber}
                            onChangeText={(text) => {this.setState({cardNumber: text})}}
                            />
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => this.setState({isCalender: true})} style={{ flex: 1, margin: 10, borderBottomWidth: 3, borderBottomColor: appColor.blue, }}>
                                <Text style={{ fontSize: 16, color: appColor.Gray_Chateau }}>{"Exp Date:"}</Text>
                                <Text style={{height: 40,paddingTop: 10}}>{this.state.expiryDate}</Text>
                                {/* <TextInput style={{ height: 40 }} 
                                value={this.state.expiryDate}
                                onChangeText={(text) => this.setState({expiryDate: text})}
                                /> */}
                            </TouchableOpacity>
                            <View style={{ flex: 1, margin: 10, borderBottomWidth: 3, borderBottomColor: appColor.blue }}>
                                <Text style={{ fontSize: 16, color: appColor.Gray_Chateau }}>{"CVC/CVV:"}</Text>
                                <TextInput style={{ height: 40 }} 
                                value={this.state.CVV}
                                keyboardType={'decimal-pad'}
                                maxLength={3}
                                onChangeText={(text) => this.setState({CVV : text})}
                                />
                            </View>
                        </View>
                    </View>
                    <Text style={{ color: "#707071", margin: 15, fontSize: 16, fontStyle: "italic", fontWeight: "bold", textAlign: "center" }}>{"Your card will be charged monthly or annually depending on your membership. You can cancel or update your subscription at any time at www.findopenhousesnow.com"}</Text>
                    <View style={{ marginTop: 110 }}>
                        <TouchableOpacity onPress={() => { this.CheckPaymentMethod() }}
                            style={{ height: 70, borderColor: '#707071', borderWidth: 1, backgroundColor: "#00B7B0", justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', }}>PAY $15.88</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.state.isCalender && this.calenderRender()}
                {/* this.props.navigation.navigate("ProfileForm",{profile:"form"}) */}
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#D9D9DA'
    },
    inputContainer: {
        flex: 1,
        backgroundColor: "white",
        margin: 10
    }

});

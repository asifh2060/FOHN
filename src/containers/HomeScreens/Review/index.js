import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Dimensions,KeyboardAvoidingView, Alert } from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
import { AirbnbRating } from 'react-native-ratings';
import Preference from 'react-native-preference';
import SimpleToast from "react-native-simple-toast";
import {API} from "../../../utils/constants";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'



const { height, width } = Dimensions.get('window');




export default class Review extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);

        this.state = {
            reviewerId: props.navigation.getParam("reviewerId"),
            userData: Preference.get("userData", ""),
            reviewText: '',
            rating: 0,
            loading: false,
            reviewTitle: '',
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
        // alert(this.state.reviewerId)
    }
    componentWillMount() {
    }
    leftAction() {

    }
    rightAction() {

    }
    SendReview = () => {
        const details = {
            review_for_user_id: this.state.reviewerId,
            reviewer_user_id: this.state.userData.id,
            review_text: this.state.reviewText,
            rating: this.state.rating,
            review_title: this.state.reviewTitle
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
        fetch(API.INSERT_USER_REVIEW, {
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
            this.setState({ loading: false });
            console.log('getUserDetailApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                Alert.alert(
                    null,
                    'review sent',
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show('review sent');
                this.props.navigation.goBack()
            }
            else{
                Alert.alert(
                    null,
                    response.message,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show(response.message);
            }
            // SimpleToast.show(response.message);
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <KeyboardAwareScrollView scrollEnabled={false} style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}>
                <View
                style={{flex: 1}}
              
                // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                >
                    <Header
                        leftAction={this.leftAction.bind(this)}
                        rightAction={this.rightAction.bind(this)}
                        HeaderColor={'#00B7B0'}
                        centerComponent={"REVIEW"}
                        bottomBorderColor={"#EF4867"}
                        LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                    />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#707071' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.SendReview()}>
                            <Text style={{ fontSize: 20, color: '#707071', fontWeight: 'bold' }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        <AirbnbRating
                            count={5}
                            selectedColor={"#D1AE5E"}
                            reviews={false}
                            showRating={false}
                            defaultRating={0}
                            isDisabled={false}
                            ratingColor={"#D1AE5E"}
                            ratingBackgroundColor={'#D1AE5E'}
                            size={40}
                            onFinishRating={(rating) => this.setState({rating: rating})}
                        />
                        <Text style={{ fontSize: 14, color: '#707071' }}>Tap a Star to Rate</Text>
                    </View>
                    
                    <View style={{ width: "100%", height: 3, backgroundColor: '#707071', marginTop: 20 }} />
                    <TextInput
                        style={{ margin: 20, fontSize: 16, color: "black", }}
                        placeholderTextColor={"gray"}
                        placeholder={"Title"}
                        value={this.state.reviewTitle}
                        onChangeText={(text) => this.setState({ reviewTitle: text })}
                    />
                    <TextInput
                        style={{ marginHorizontal: 20, fontSize: 16, color: "black", }}
                        placeholderTextColor={"gray"}
                        placeholder={"Review (Optional)"}
                        multiline={true}
                        value={this.state.reviewText}
                        onChangeText={(text) => this.setState({ reviewText: text })}
                    />
                </View>
                <View style={{  justifyContent: "flex-end",height: 180 }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 60 }}>
                        <Text style={{ color: "#005271" }}>{"Find Open Houses Now ver..."}</Text>
                    </TouchableOpacity>
                </View>
                <ProgressBar visible={this.state.loading}/>
            </KeyboardAwareScrollView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },

});

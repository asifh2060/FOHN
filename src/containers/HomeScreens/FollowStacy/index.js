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
    Alert
} from 'react-native'
import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const { height, width } = Dimensions.get('window');
import { AirbnbRating } from "react-native-ratings";
import appColor from "../../../component/appColor"
import { API } from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import ProgressBar from "../../../component/ProgressBar";
import Modal from 'react-native-modal';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class FollowStacy extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            LoginUserId: Preference.get('userData'),
            userId: props.navigation.getParam("userId"),
            buttonText: "Follow",
            unfollow: false,
            isFollowed: props.navigation.getParam('isFollowed'),
            appThemeMode:'light'

        }
    }

    componentDidMount = () => {
        this.state.isFollowed == '1' && this.setState({buttonText: 'unFollow'});
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

    FollowUser = () => {
        const details = {
            follower_user_id: this.state.LoginUserId.id,
            followee_user_id: this.state.userId,
            action: this.state.unfollow ? 'unfollow' : 'follow'
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
        fetch(API.FOLLOW_UNFOLLOW_USER, {
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
            console.log('getUserDetailApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                if(response.body == 'You followed '){
                    this.setState({ buttonText: 'unFollow' },() => {
                        console.log('button text===>',this.state.buttonText)
                    }) 
                }
                if(response.body == 'You unfollowed '){
                    this.setState({ buttonText: 'Follow' },() => {
                        console.log('button text===>',this.state.buttonText)
                    }) 
                }
                Alert.alert(
                    null,
                    response.body,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show(response.body);
            } else {
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
            this.setState({ loading: false,unfollow: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    CheckButtonText = () => {

        this.state.buttonText == 'unFollow' ? 
        Alert.alert(
            "Alert",
            "Do you want to unfollow this?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () =>  this.setState({unfollow: true},() => {
                    this.FollowUser()
                }) }
            ],
            { cancelable: false }
        )
        :
        this.FollowUser()
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <View style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"FOLLOW"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <TouchableOpacity style={{ marginStart: 20 }}>
                    <Text style={{ color: "#00B7B0", fontSize: 16, marginTop: 10, fontWeight: "bold" }}>{"Close"}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, flexDirection: "row", margin: 20 }}>
                    <Image source={require("../../../assets/images/tickFill.png")} resizeMode={"contain"} style={{ width: 25, height: 25, marginTop: 5 }} />
                    <Text style={{ marginStart: 10, fontSize: 18, marginEnd: 20, color: "#707071" }}>{"By checking here, you will be notified by email when this professional posts open houses."}</Text>
                </View>
                <TouchableOpacity onPress={() =>
                    this.CheckButtonText()
                } style={{ height: 60, margin: 10, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center', marginStart: 20, marginEnd: 20, marginBottom: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{this.state.buttonText}</Text>
                </TouchableOpacity>
                <ProgressBar visible={this.state.loading} />
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1
    },


});

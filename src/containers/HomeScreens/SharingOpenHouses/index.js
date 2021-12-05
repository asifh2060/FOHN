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
    setTimeout,
    Alert
} from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window');
import fontFamily from "../../../assets/fonts";
import Preference from 'react-native-preference';
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";
import SimpleToast from "react-native-simple-toast";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'








export default class sharing_open_house extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);

        this.state = {
            userEmail: '',
            userData: Preference.get("userData", ""),
            loading: false,
            propertyIds: props.navigation.getParam("propertyIds"),
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
    leftAction() {

    }
    rightAction() {

    }

    InviteSend = () => {
        if (this.state.userEmail == '') {
            Alert.alert(
                null,
                'Please enter email',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please enter email');
            return
        }
        if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(this.state.userEmail) == false) {
            alert('Email format is incorrect')
            return false
        }
        const details = {
            user_id: this.state.userData.id,
            ids: this.state.propertyIds,
            emails: this.state.userEmail
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
        fetch(API.SHARE_OPEN_HOUSE_TO_EMAIL, {
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
            console.log('SHARE_OPEN_HOUSE_TO_EMAIL Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                Alert.alert(
                    null,
                   response.body,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show(response.body);
                this.props.navigation.goBack();
            }
            else if (response.status === "404") {
                this.setState({ propertyList: [] })
            }
        

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }




    render() {
        const {appThemeMode}=this.state

        return (

            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#707071'}
                    centerComponent={"Sharing Open Houses"}
                    bottomBorderColor={"#EF4867"}

                />
                <ScrollView>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.InviteSend()}>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Invite</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 50, backgroundColor: "#707071", height: 1 }} />
                    <TextInput
                        value={this.state.userEmail}
                        keyboardType={'email-address'}
                        onChangeText={(text) => this.setState({ userEmail: text })}
                        placeholderTextColor={appThemeMode==='light' ?'#707071' :Colors.white}
                        maxLength={30}
                        placeholder={"Email"} style={{ fontSize: 18, color: appThemeMode==='light' ?'#707071' :Colors.white   , marginStart: 20, marginEnd: 20 }} />
                    <View style={{ justifyContent: "flex-end" }}>
                        <TouchableOpacity onPress={() => this.setState({ userEmail: '' })}>
                            <Text style={{ color: "#00B7B0", fontFamily: fontFamily.Bold, fontSize: 18, marginStart: 20, marginTop: 10, textAlign: "right", marginRight: 20 }}>{"Remove"}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={{color:"#707071",fontFamily:fontFamily.Regular,fontSize:20,marginStart:20,marginTop:10,textAlign:"left",marginRight:20}}>{"Invite Sent"}</Text> */}
                    <View style={{ marginTop: 20, backgroundColor: "#707071", height: 1 }} />
                    <Text style={{ color: "#707071", fontSize: 16, fontFamily: fontFamily.Regular, flex: 1, margin: 10 }}>{"Share saved open houses with each other. You both can see shared homes in the saved open house tab."}</Text>
                </ScrollView>
                <ProgressBar visible={this.state.loading} />

            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    map: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height - 200,
    }

});

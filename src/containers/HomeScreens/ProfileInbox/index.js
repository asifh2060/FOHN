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
import { color } from 'react-native-reanimated';
import Modal from 'react-native-modal';
import { API } from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import ProgressBar from "../../../component/ProgressBar";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'



export default class ProfileInbox extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            socialLogin: Preference.get('socialLogin', 'false'),

            isModal: false,
            MessageList: [],
            LoginUserId: Preference.get('userData'),
            loading: false,
            UserMessage: '',
            ReplyMessage: '',
            MessageSeen: false,
            Profile: "",
            banner_photo: "",
            followers: 0,
            following: 0,
            name: '',
            author:{},
            appThemeMode:'light'
        }
    }


    componentDidMount() {
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
        this.getUserDetailApi()
        this.GetFollowingFollowers()
        this.GetMessages();
        

    }

    getUserDetailApi = () => {
        const details = {
            id: this.state.LoginUserId.id,
        };
        this.setState({
            loading: true
        })
        // console.log("Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_USER_BY_ID, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestPramas,
        }).then(response => {
            console.log('response before json:', response);
            return response.json();
        }).then(response => {
            console.log('getUserDetailApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                let instance = response.body;
                console.log(instance)
                this.setState({
                    banner_photo:(instance?.cover_photo===null || instance?.cover_photo===undefined) ? '' :instance?.cover_photo,
                    profile_photo: instance?.profile_photo,
                    name: instance?.name
                })
            }
             else {
                Alert.alert(
                    null,
                   response?.message,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
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
    GetFollowingFollowers = () => {
        const details = {
            user_id: this.state.LoginUserId.id,
            // user_id: '1'
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
        fetch(API.GET_FOLLOWING_FOLLOWERS, {
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
                if(response.body.followers.length > 0){
                    this.setState({followers: response.body.followers.length})
                }
                if(response.body.following.length > 0){
                    this.setState({following: response.body.following.length})
                }
               
            } else {
                // SimpleToast.show(response.message);
            }
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }
    receiveMessages = () => {
        const details = {
            receiver_user_id: this.state.LoginUserId.id
        }
        this.setState({
            loading: true
        })
        console.log("\n\n\n\n\n\ncreateOpenHouseApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_MESSAGES, {
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
                this.state.MessageList.push(response.body)
                // this.setState({ MessageList: response.body });
            } else {
                Alert.alert(
                    null,
                   response.message,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show(response.message)
            }
            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }
    GetMessages = () => {
        const details = {
            // sender_user_id: this.state.LoginUserId.id
            receiver_user_id: this.state.LoginUserId.id
        }
        this.setState({
            loading: true
        })
        console.log("\n\n\n\n\n\ncreateOpenHouseApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_MESSAGES, {
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

            if (response.status === "200") {
                console.log("body",response.body)
                this.setState({ MessageList: response.body });
                // this.receiveMessages();
            } else {
                Alert.alert(
                    null,
                   response.message,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show(response.message)
            }
            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    SendMessage = () => {
        if (this.state.ReplyMessage == '') {
            Alert.alert(
                null,
                'Message is required',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Message is required');
            return
        }
        // console.log('my item====>', this.state.UserMessage);
        const details = {
            content: this.state.ReplyMessage,
            // sender_user_id: this.state.LoginUserId.id,
            sender_user_id: this.state.UserMessage.recipient.id,
            receiver_user_id: this.state.UserMessage.author.id
        };
        this.setState({
            isModal: false, loading: true, ReplyMessage: ""
        });
        console.log("Params:======== ", JSON.stringify(details))
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
            this.setState({ name: '', email: '', phone: '', message: '' });
            // console.log('CONTACT_TO_PROPERTY_OWNER Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                console.log("yes message was sent")
                this.GetMessages();
                setTimeout(() => {
                    Alert.alert(
                        null,
                       response.message,
                        [
                           
                            { text: "OK",  onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    ) 
                    // SimpleToast.show(response.message);
                }, 200)

            }
            else if (response.status === "404") {
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
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }

    updateStatus = (messageId) => {
        console.log('my item ====>', this.state.UserMessage);
        const details = {
            status: 1,
            message_id: messageId
        };
        console.log("Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.UPDATE_MESSAGE_STATUS, {
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
            console.log('CONTACT_TO_PROPERTY_OWNER Response: ' + JSON.stringify(response));
            if (response.status === "200") {

            }
            else if (response.status === "404") {

            }
        })
            .catch(error => {
                console.log('ApiError:', error);
            });

    }

    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() { }
    renderItem(item) {
        console.log('checking message item===>',item)
        return (
            <TouchableOpacity onPress={() => {
                this.setState({ UserMessage: item, isModal: true,author:item?.author }, () => {
                    this.updateStatus(this.state.UserMessage.message_id)
                })
            }} style={{ marginStart: 20, marginEnd: 20, marginTop: 10, marginBottom: 10, flexDirection: "row", borderBottomColor: appColor.blue, borderBottomWidth: 3 }}>
                                <Text numberOfLines={1} style={{ marginHorizontal: 10, color: appColor.Gray_Chateau, alignSelf: 'center', marginRight: 20 }}>{item.content}</Text>
                <Image source={item.status == 1 ? require("../../../assets/images/messageWhite.png") : require("../../../assets/images/MailGreen.png")} resizeMode={"contain"} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
        )

    }
    render() {
        const {appThemeMode}=this.state

        return (
            <View style={style.mainContainer}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={ this.state.name !== '' ? this.state.name  : "Stacy Martin - Realtor"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <View>
                    <Image source={this.state.banner_photo !== '' ? { uri: this.state.banner_photo } : require("../../../assets/images/banner_image.png")} resizeMode={'cover'} style={style.imgStyle} />
                    <View style={{ flexDirection: 'row', }}>
                    <View style={[style.imgStyleRounded, { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }]}>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }}
                            source={this.state.profile_photo !== '' ? { uri: this.state.profile_photo } : require("../../../assets/images/StacyMartinRounded.png")}
                        />
                        </View>
                        {/* <Image source={this.state.profile_photo !== '' ? { uri: this.state.profile_photo } : require("../../../assets/images/StacyMartinRounded.png")} resizeMode={'contain'} style={style.imgStyleRounded} /> */}
                        {this.state.socialLogin !== 'true' &&    <View>
                            <Text style={{ marginStart: 10, marginTop: 10, color: "#005271", fontSize: 14, fontWeight: "bold" }}>{"FOLLOWERS"}</Text>
                            <Text style={{ marginStart: 10, color: "#005271", textAlign: "center", fontWeight: "bold" }}>{this.state.followers}</Text>
                            </View>}
                            {this.state.socialLogin !== 'true' &&    <View>
                            <Text style={{ marginStart: 10, marginTop: 10, color: "#005271", fontSize: 14, fontWeight: "bold" }}>{"FOLLOWING"}</Text>
                            <Text style={{ marginStart: 10, color: "#005271", textAlign: "center", fontWeight: "bold" }}>{this.state.following}</Text>
                        </View>}
                    </View>
                    <View style={style.listContainer}>
                        {this.state.MessageList.length > 0 ?
                            <FlatList
                                data={this.state.MessageList}
                                renderItem={({ item, index }) => (
                                    this.renderItem(item)
                                )}
                                // style={{ marginBottom: 100 }}
                                extraData={this.state}
                                keyExtractor={item => item.id}
                            />
                            :
                            <Text style={{ textAlign: "center" }}>No Messages received</Text>
                        }
                    </View>
                </View>
                <View>
                    <Modal onBackButtonPress={() => { this.setState({ isModal: false }) }} isVisible={this.state.isModal}>
                        <View style={{ height: 350, width: "100%", backgroundColor: "white" }}>
                            <TouchableOpacity onPress={() => this.setState({isModal: false})} style={{alignItems: "flex-end",padding: 20,paddingBottom: 0}}>
                            <Image style={{resizeMode: "contain",width: 20,height: 20}} source={require('../../../assets/images/close.png')} />
                            </TouchableOpacity>
                            <Text style={{ marginTop: 20, marginStart: 20, marginEnd: 20, textAlign: "center", fontSize: 16, color: appColor.black }}>
                                {this.state.author?.name}</Text>
                                <Text style={{ marginTop: 20, marginStart: 20, marginEnd: 20, textAlign: "center", fontSize: 16, color: appColor.black }}>
                                {this.state.author?.email}</Text>
                                <Text style={{ marginTop: 20, marginStart: 20, marginEnd: 20, textAlign: "center", fontSize: 16, color: appColor.black }}>
                                {this.state.author?.phone}</Text>
                            <Text style={{ marginTop: 20, marginStart: 20, marginEnd: 20, textAlign: "center", fontSize: 16, color: appColor.Gray_Chateau }}>
                                {"Conversation"}</Text>
                            <Text style={{ marginTop: 50, marginStart: 20, marginEnd: 20, color: appColor.Gray_Chateau, }}>{this.state.UserMessage.content}</Text>

                            <View style={{ marginTop: 20, marginStart: 10, marginEnd: 10, flexDirection: "row", }}>
                                <TextInput
                                    value={this.state.ReplyMessage}
                                    onChangeText={(text) => this.setState({ ReplyMessage: text })}
                                    placeholder={"Enter Your Message "}
                                    style={{ borderBottomWidth: 2, flex: 1, borderBottomColor: appColor.blue, color: appColor.Gray_Chateau, fontSize: 16 }}
                                />
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() =>
                                        this.SendMessage()
                                        // this.setState({isModal:false})
                                    } style={{ width: 50, height: 30, marginTop: 20, backgroundColor: appColor.Pink, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ fontSize: 14, color: "white", fontWeight: "bold" }}>{"SEND"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <ProgressBar visible={this.state.loading} />
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1
        , backgroundColor: "white"
    },

    imgStyle: {
        width: '100%',
        height: 150
    },
    imgStyleRounded: {
        height: 120,
        width: 120,
        marginTop: -30,
        marginStart: 10
    },
    listContainer: {
        // flex:1,
        // marginStart:20,
        // marginEnd:20,
        borderColor: appColor.Gray_Chateau,
        borderWidth: 1,
        marginTop: 20,
        height: '60%',
        justifyContent: "center"
    },

});

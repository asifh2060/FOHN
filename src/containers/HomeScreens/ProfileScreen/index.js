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
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const { height, width } = Dimensions.get('window');
import { AirbnbRating } from "react-native-ratings";
import appColor from "../../../component/appColor"
import Preference from "react-native-preference";
import ProgressBar from "../../../component/ProgressBar";
import { API } from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import UserAvatar from 'react-native-user-avatar';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

const resetActionToLanding = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LandingScreen' })],
});

export default class StacyMartinProfile extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {

            userData: Preference.get("userData", ""),
            socialLogin: Preference.get('socialLogin', 'false'),
            Profile: "",
            loading: false,
            userId: Preference.get('userData'),
            banner_photo: "",
            profile_photo: "http://findopenhouse.appcrates.co/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg",
            short_description: "",
            long_description: null,
            email: "",
            name: "",
            phone: "",
            address: "",
            facebook: "",
            twitter: "",
            linkedIn: "",
            instagram: "",
            youtube: "",
            website: "",
            UserName: '',
            followers: 0,
            following: 0,
            UserType: '',
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
        console.log('checking for user data===>in the kjjnk', this.state.userId)
        this.GetFollowingFollowers()
        this.getUserDetailApi()
        const { navigation } = this.props;
        this.focusListner = navigation.addListener('didFocus', () => {
            this.getUserDetailApi()
        })
        // alert(this.state.socialLogin)
    }


    componentWillMount() {
        if (this.focusListener) {
            this.focusListner = null;
        }
    }

    GetFollowingFollowers = () => {
        const details = {
            user_id: this.state.userId.id,
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
                if (response.body.followers.length > 0) {
                    this.setState({ followers: response.body.followers.length })
                }
                if (response.body.following.length > 0) {
                    this.setState({ following: response.body.following.length })
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

    getUserDetailApi = () => {
        const details = {
            // user_email: "test15@test.com",
            id: this.state.userId.id,
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
                this.setState({
                    id: instance.id,
                    banner_photo: instance.cover_photo,
                    profile_photo: instance.profile_photo,
                    short_description: instance.short_description,
                    long_description: instance.long_description,
                    email: instance.email,
                    name: instance.name,
                    phone: instance.phone,
                    address: instance.address,
                    facebook: instance.facebook,
                    twitter: instance.twitter,
                    linkedIn: instance.linkedIn,
                    instagram: instance.instagram,
                    youtube: instance.youtube,
                    website: instance.website,
                    rating: parseFloat(instance.rating),
                    total_number_of_reviews: instance.total_number_of_reviews,
                    reviews: instance.reviews,
                    UserName: instance.name,
                    UserType: instance.type,
                })
                console.log('user type====>',this.state.UserType)
            } else {
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
            this.setState({ loading: false });


        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    componentWillMount() {
    }

    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() { }

    CheckUserType = () => {
        if (this.state.UserType == 'um_lender' || this.state.UserType == 'um_insurance-agent') {
            Alert.alert(
                null,
                'You cannot create open House',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('You cannot create open House');
            return
        }
        this.props.navigation.navigate("CreateOpenHouse", { isCreate: true })
    }
    CheckUserType2 = () => {
        if (this.state.UserType == 'um_lender' || this.state.UserType == 'um_insurance-agent') {
            Alert.alert(
                null,
                'You cannot view/edit open House',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('You cannot view/edit open House');
            return
        }
        this.props.navigation.navigate("ViewEditOpenHouse")
    }

    CheckUserType3 = () => {
        // if (this.state.UserType == 'um_lender' || this.state.UserType == 'um_insurance-agent') {
        //     SimpleToast.show('There are no saved open house');
        //     return
        // }
        this.props.navigation.navigate("saved_open_houses")
    }


    render() {

        const { profile_photo, banner_photo ,appThemeMode} = this.state
        return (
            <View style={[style.mainContainer,{ marginTop: 20, marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black  }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={this.state.UserName ? this.state.UserName : "Stacy Martin - Realtor"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView style={[style.mainContainer,{ marginTop: 20, marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black  }]}>
                    <Image
                        // source={require("../../../assets/images/StacyMartinImg.png")} 
                        source={banner_photo ? { uri: banner_photo } : require("../../../assets/images/banner_image.png")}
                        resizeMode={'cover'} style={style.imgStyle} />
                    <View style={{ flexDirection: 'row', flex: 1, marginBottom: 20 }}>
                        <View style={[style.imgStyleRounded, { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }]}>
                            <Image
                                style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }}
                                source={{ uri: profile_photo }}
                            />
                        </View>
                        {this.state.socialLogin !== 'true' &&  <View>
                            <Text style={{ marginStart: 10, marginTop: 10, color: "#005271", fontSize: 14, fontWeight: "bold" }}>{"FOLLOWERS"}</Text>
                            <Text style={{ marginStart: 10, color: "#005271", textAlign: "center", fontWeight: "bold" }}>{this.state.followers}</Text>
                        </View>}
                        {this.state.socialLogin !== 'true' &&  <View>
                            <Text style={{ marginStart: 10, marginTop: 10, color: "#005271", fontSize: 14, fontWeight: "bold" }}>{"FOLLOWING"}</Text>
                            <Text style={{ marginStart: 10, color: "#005271", textAlign: "center", fontWeight: "bold" }}>{this.state.following}</Text>
                        </View> }
                    </View>
                    {this.state.socialLogin !== 'true' &&  <View>
                    {this.state.UserType == 'um_lender' || this.state.UserType == 'um_insurance-agent' ? null:
                        <TouchableOpacity onPress={() => { this.CheckUserType() }} style={style.listContainer}>
                            <Image source={require("../../../assets/images/house.png")} resizeMode={'contain'} style={[style.iconImage, { tintColor: "white", margin: 5 }]} />
                            <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"CREATE/POST OPEN HOUSE"}</Text>
                        </TouchableOpacity>}
                    </View>
                    }
                 {this.state.socialLogin !== 'true' &&  <View>
                 {this.state.UserType == 'um_lender' || this.state.UserType == 'um_insurance-agent' ? null : 
                        <TouchableOpacity onPress={() => { this.CheckUserType2() }} style={style.listContainer}>
                        <Image source={require("../../../assets/images/house.png")} resizeMode={'contain'} style={[style.iconImage, { tintColor: "white", margin: 5 }]} />
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"VIEW/EDIT OPEN HOUSES"}</Text>
                    </TouchableOpacity>}
                 </View>
                    }

                    {/* <TouchableOpacity onPress={() => { this.CheckUserType2() }} style={style.listContainer}>
                        <Image source={require("../../../assets/images/house.png")} resizeMode={'contain'} style={[style.iconImage, { tintColor: "white", margin: 5 }]} />
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"VIEW/EDIT OPEN HOUSES"}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("EditProfile") }} style={[style.listContainer, { backgroundColor: appColor.blue }]}>
                        <Image source={require("../../../assets/images/userProfile.png")} resizeMode={'contain'} style={[style.iconImage, { tintColor: "white", width: 40, height: 40, margin: 5 }]} />
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"EDIT PROFILE"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("ProfileInbox") }} style={[style.listContainer, { backgroundColor: appColor.green }]}>
                        <Image source={require("../../../assets/images/mailWhite.png")} resizeMode={'contain'} style={[style.iconImage, { tintColor: "white" }]} />
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"MESSAGES"}</Text>
                    </TouchableOpacity>
                   
                    {this.state.socialLogin !== 'true' &&  <TouchableOpacity style={[style.listContainer, { backgroundColor: appColor.yellow }]}>
                        <Image source={require("../../../assets/images/star.png")} resizeMode={'contain'} style={style.iconImage} />
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"REVIEWS"}</Text>
                    </TouchableOpacity>}

                    {this.state.socialLogin !== 'true' && <TouchableOpacity onPress={() => { this.CheckUserType3() }} style={[style.listContainer, { backgroundColor: appColor.blue }]}>
                        <Image source={require("../../../assets/images/Saved_White.png")} resizeMode={'contain'} style={style.iconImage} />
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>{"SAVED OPEN HOUSES"}</Text>
                    </TouchableOpacity>}
                    {/* <TouchableOpacity style={[style.listContainer,{backgroundColor: appColor.green,justifyContent:"center"}]}>
                        <Text style={{marginStart: 10,color:"white",textAlign:"center",fontWeight:"bold",fontSize:16,margin:10}}>{"ACCOUNT"}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => {
                        Preference.set('userData', null);
                        Preference.set('socialLogin', false);
                        this.props.navigation.dispatch(resetActionToLanding)

                    }} style={[style.listContainer, { backgroundColor: appColor.yellow, justifyContent: "center" }]}>
                        <Text style={{ marginStart: 10, color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16, margin: 10 }}>{"LOGOUT"}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1
    },

    imgStyle: {
        width: '100%',
        height: 150
    },
    imgStyleRounded: {
        // height:120,
        // width:120,
        marginTop: -30,
        marginStart: 10,
        // borderRadius: 100
    },
    listContainer: {
        width: "100%",
        backgroundColor: appColor.Pink,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    iconImage: {
        width: 45,
        height: 45,
        marginStart: 50
    }
});

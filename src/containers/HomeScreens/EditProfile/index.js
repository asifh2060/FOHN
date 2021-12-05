import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import Preference from "react-native-preference";
import ProgressBar from "../../../component/ProgressBar";
import { API } from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'
export default class EditProfile extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props)
        this.state = {
            socialLogin: Preference.get('socialLogin', 'false'),
            appThemeMode:'light',
            sourceForAPI: '',
            sourceForAPITwo: '',
            profileImage: '',
            profileImageTwo: '',
            profile: "",
            taglineLine: '',
            isForm: false,
            userId: Preference.get('userData'),
            banner_photo: '',
            profile_photo: '',
            firstName: "",
            lastName: '',
            company: '',
            contactEmail: "",
            PhoneNumber: '',
            FacebookLink: "",
            TwitterLink: '',
            LinkedInLink: "",
            InstagramLink: '',
            YoutubeLink: '',
            WebsiteUrl: '',
            AboutMe: "",
            City: '',
            State: '',
            ZipCode: "",
            loading: false
        }
    }


    componentWillMount() {

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
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            console.log('getUserDetailApi Response:==========x=x=x=x=x=x=x=x=x=xx=xx=xx=x ' + JSON.stringify(response));
            if (response.status === "200") {
                let instance = response.body;
                this.setState({
                    // id: instance.id,
                    profileImage: instance.cover_photo,
                    profileImageTwo: instance.profile_photo,
                    firstName: instance.first_name,
                    lastName: instance.last_name,
                    short_description: instance.short_description,
                    long_description: instance.long_description,
                    contactEmail: instance.email,
                    PhoneNumber: instance.billing_phone,
                    FacebookLink: instance.facebook,
                    TwitterLink: instance.twitter,
                    LinkedInLink: instance.linkedIn,
                    InstagramLink: instance.instagram,
                    YoutubeLink: instance.youtube,
                    WebsiteUrl: instance.website,
                    taglineLine: instance.tagline,
                    company: instance.company,
                    AboutMe: instance.short_description,
                    City: instance.city,
                    State: instance.state,
                    ZipCode: instance.postcode

                })


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
            this.setState({ loading: false });


        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    UpdateProfile = () => {
        
        let requestBody = new FormData()
        requestBody.append('user_id', this.state.userId.id)
        requestBody.append('profile_photo', this.state.sourceForAPITwo)
        requestBody.append('cover_photo', this.state.sourceForAPI)
        requestBody.append('first_name', this.state.firstName)
        requestBody.append('last_name', this.state.lastName)
        requestBody.append('user_url', this.state.WebsiteUrl)
        requestBody.append('about_me', this.state.AboutMe)
        requestBody.append('company', this.state.company)
        requestBody.append('contact_email', this.state.contactEmail)
        requestBody.append('phone_no', this.state.PhoneNumber)
        requestBody.append('facebook', this.state.FacebookLink)
        requestBody.append('twitter', this.state.TwitterLink)
        requestBody.append('instagram', this.state.InstagramLink)
        requestBody.append('youtube', this.state.YoutubeLink)
        requestBody.append('city', this.state.City)
        requestBody.append('postcode', this.state.ZipCode)
        requestBody.append('state_code', this.state.State)
        requestBody.append('linkedin', this.state.LinkedInLink)
        requestBody.append('tagline', this.state.taglineLine)
        requestBody.append('website', this.state.WebsiteUrl)
        this.setState({
            loading: true
        })
        fetch(API.UPDATE_USER_PROFILE, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: requestBody,
        }).then(response => {
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            console.log('userLoginApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                // Preference.set('userData', response.body);
                this.props.navigation.goBack()
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

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }


    leftAction() {
        this.props.navigation.pop()

    }
    rightAction() {

    }
    selectImageButtonPress() {
        let checkConst = '';
        let platformConst = Platform.OS;
        if (platformConst === 'ios') {
            checkConst = PERMISSIONS.IOS.PHOTO_LIBRARY
        } else if (platformConst === 'android') {
            checkConst = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        } else return;
        console.log(checkConst)
        Permissions.check(checkConst)
            .then(result => {
                this.handleResults(result, checkConst)
            }).catch(error => {
                // …
            });
    }

    handleResults = (result, checkConst, count = 1) => {
        if (count == 3) {
            return
        }
        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This feature is not available (on this device / in this context)');
                break;
            case RESULTS.DENIED:
                Permissions.request(checkConst).then(result => {
                    this.handleResults(result, checkConst, count + 1)
                });
                console.log('The permission has not been requested / is denied but requestable');
                break;
            case RESULTS.GRANTED:
                this.handleChoosePhoto();
                break;
            case RESULTS.BLOCKED:
                Permissions.openSettings().catch(() => console.warn('cannot open settings'));
                console.log('The permission is denied and not requestable anymore');
                break;
        }
    }

    handleChoosePhoto() {
        const options = {
            quality: 0.3
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // const source = { uri: response.uri };
                const source = { uri: response.uri, name: 'avatar.jpg', type: 'image/jpeg' };
                // You can also display the image using data:
                // console.log('data: ', response.data)

                if (this.state.imageClick === '1') {
                    const sourceForAPI = { uri: response.data };
                    console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImage: source.uri,
                        // sourceForAPI: sourceForAPI.uri,
                        sourceForAPI: source,
                    });
                }
                else {
                    const sourceForAPITwo = { uri: response.data };
                    this.setState({
                        profileImageTwo: source.uri,
                        // sourceForAPITwo: sourceForAPITwo.uri,
                        sourceForAPITwo: source,
                    });
                }
            }
        });
    }

    isValidURL() {

        if(this.state.FacebookLink !== ''){
            var res = this.state.FacebookLink.toLowerCase().includes('http') || this.state.FacebookLink.toLowerCase().includes('www') || this.state.FacebookLink.toLowerCase().includes('com') ;
            if(res == false){
                Alert.alert(
                    null,
                    'Your facebooklink format is incorrect',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Your facebooklink format is incorrect')
                return
            }
            console.log('check url==>', res);
        }
        if(this.state.TwitterLink !== ''){
            var res = this.state.TwitterLink.toLowerCase().includes('http') || this.state.TwitterLink.toLowerCase().includes('www') || this.state.TwitterLink.toLowerCase().includes('com') ;
            if(res == false){
                Alert.alert(
                    null,
                    'Your twitterlink format is incorrect',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Your twitterlink format is incorrect')
                return
            }
            console.log('check url==>', res);
        }
        if(this.state.LinkedInLink !== ''){
            var res = this.state.LinkedInLink.toLowerCase().includes('http') || this.state.LinkedInLink.toLowerCase().includes('www') || this.state.LinkedInLink.toLowerCase().includes('com') ;
            if(res == false){
                Alert.alert(
                    null,
                    'Your linkedinlink format is incorrect',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Your linkedinlink format is incorrect')
                return
            }
            console.log('check url==>', res);
        }
        if(this.state.InstagramLink !== ''){
            var res = this.state.InstagramLink.toLowerCase().includes('http') || this.state.InstagramLink.toLowerCase().includes('www') || this.state.InstagramLink.toLowerCase().includes('com') ;
            if(res == false){
                Alert.alert(
                    null,
                    'Your instagramlink format is incorrect',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Your instagramlink format is incorrect')
                return
            }
            console.log('check url==>', res);
        }
        if(this.state.YoutubeLink !== ''){
            var res = this.state.YoutubeLink.toLowerCase().includes('http') || this.state.YoutubeLink.toLowerCase().includes('www') || this.state.YoutubeLink.toLowerCase().includes('com') ;
            if(res == false){
                Alert.alert(
                    null,
                    'Your youtubelink format is incorrect',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Your youtubelink format is incorrect')
                return
            }
            console.log('check url==>', res);
        }
        if(this.state.WebsiteUrl !== ''){
            var res = this.state.WebsiteUrl.toLowerCase().includes('http') || this.state.WebsiteUrl.toLowerCase().includes('www') || this.state.WebsiteUrl.toLowerCase().includes('com') ;
            if(res == false){
                Alert.alert(
                    null,
                    'Your websiteurl format is incorrect',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Your websiteurl format is incorrect')
                return
            }
            console.log('check url==>', res);
        }
        this.UpdateProfile()
        // else if (this.state.WebsiteUrl !== '') {
        //     var res = this.state.WebsiteUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        //     console.log('check url==>', res);
        //     SimpleToast.show('Your WebsiteUrl Format is incorrect')
        //     return false
        // }
        // else {
        //     this.UpdateProfile()
        // }

    };

    render() {
        const {appThemeMode}=this.state

        return (
            <View style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}>
                <Header
                    leftIcon={require('../../../assets/images/back.png')}
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    customStyle={{ fontSize: 20 }}
                    HeaderColor={'#00B7B0'}
                    bottomBorderColor={"#EF4867"}
                    centerComponent={"EDIT PROFILE"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1, margin: 10 }}>
                    {this.state.socialLogin !== 'true' ?  <View>
                            <Image
                                source={this.state.profileImage ? { uri: this.state.profileImage } : require("../../../assets/images/banner_image.png")}
                                // source={{ uri: this.state.profileImage }}
                                resizeMode={'cover'}
                                style={style.coverImage}>
                            </Image>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }}
                                onPress={() => {
                                    this.setState({ imageClick: '1', show9: false }, () => { this.forceUpdate() })
                                    this.selectImageButtonPress()
                                }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Image source={require('../../../assets/images/blue_camera.png')}
                                        resizeMode={'contain'}
                                        style={{ width: 25, height: 25 }}
                                    />
                                    <Text style={[style.profileTxt, { marginLeft: 5, }]}>Add Cover Photo</Text>
                                </View>
                            </TouchableOpacity>
                        </View>:<View style={{marginTop:100}}></View>}
                        <View style={style.prfileTagCont}>
                        {this.state.socialLogin !== 'true' &&   <View>
                                <Image source={{ uri: this.state.profileImageTwo }}
                                    resizeMode={'cover'}
                                    style={style.profileImage} />
                                <TouchableOpacity style={{ position: 'absolute', left: 36, top: 36 }}
                                    onPress={() => {
                                        this.setState({ imageClick: '2', }, () => { this.forceUpdate() })
                                        this.selectImageButtonPress()
                                    }}>
                                    <Image source={require('../../../assets/images/profile_camera.png')}
                                        resizeMode={'contain'}
                                        style={{ width: 30, height: 30, tintColor: '' }} />
                                </TouchableOpacity>
                                <Text style={style.profileTxt}>Add Profile Photo</Text>
                            </View>}
                            {this.state.socialLogin !== 'true' &&   <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ taglineLine: text }) }}
                                value={this.state.taglineLine}
                                placeholder={"Tagline or Quote:"}
                                style={[style.inputTxt, { height: 63, width: '63%', alignSelf: 'flex-end' }]}
                            />}
                        </View>
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ firstName: text }) }}
                            value={this.state.firstName}
                            placeholder={"First Name:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ lastName: text }) }}
                            value={this.state.lastName}
                            placeholder={"Last Name:"}
                            style={style.inputTxt}
                        />
                        {this.state.socialLogin !== 'true' &&  <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ company: text }) }}
                            value={this.state.company}
                            placeholder={"Company:"}
                            style={style.inputTxt}
                        />}
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ contactEmail: text }) }}
                            value={this.state.contactEmail}
                            placeholder={"Contact Email:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ PhoneNumber: text }) }}
                            value={this.state.PhoneNumber}
                            placeholder={"Phone Number:"}
                            style={style.inputTxt}
                            keyboardType={'phone-pad'}
                        />
                       {this.state.socialLogin !== 'true' &&   <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ FacebookLink: text }) }}
                            value={this.state.FacebookLink}
                            placeholder={"Facebook Link:"}
                            style={style.inputTxt}
                        />}
                      {this.state.socialLogin !== 'true' &&    <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ TwitterLink: text }) }}
                            value={this.state.TwitterLink}
                            placeholder={"Twitter Link:"}
                            style={style.inputTxt}
                        />}
                     {this.state.socialLogin !== 'true' &&     <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ LinkedInLink: text }) }}
                            value={this.state.LinkedInLink}
                            placeholder={"LinkedIn Link:"}
                            style={style.inputTxt}
                        />}
                      {this.state.socialLogin !== 'true' &&    <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ InstagramLink: text }) }}
                            value={this.state.InstagramLink}
                            placeholder={"Instagram Link:"}
                            style={style.inputTxt}
                        /> }
                       {this.state.socialLogin !== 'true' &&   <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ YoutubeLink: text }) }}
                            value={this.state.YoutubeLink}
                            placeholder={"YouTube Link:"}
                            style={style.inputTxt}
                        /> }
                      {this.state.socialLogin !== 'true' &&    <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ WebsiteUrl: text }) }}
                            value={this.state.WebsiteUrl}
                            placeholder={"Website URL:"}
                            style={style.inputTxt}
                        /> }
                    {this.state.socialLogin !== 'true' &&      <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ AboutMe: text }) }}
                            value={this.state.AboutMe}
                            placeholder={"About Me:"}
                            multiline={true}
                            style={[style.inputTxt, { height: 130, textAlignVertical: 'top' }]}
                        /> }
                       {this.state.socialLogin !== 'true' &&   <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ City: text }) }}
                            value={this.state.City}
                            placeholder={"City:"}
                            style={style.inputTxt}
                        /> }
                       {this.state.socialLogin !== 'true' &&   <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ State: text }) }}
                            value={this.state.State}
                            placeholder={"State:"}
                            style={style.inputTxt}
                        /> }
                       {this.state.socialLogin !== 'true' &&   <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ ZipCode: text }) }}
                            value={this.state.ZipCode}
                            placeholder={"Zip Code:"}
                            style={style.inputTxt}
                            keyboardType={'number-pad'}
                            maxLength={5}
                        /> }

                        <TouchableOpacity
                            // onPress={() => { this.props.navigation.navigate('StacyMartinProfile') }}
                            // onPress={() => { this.UpdateProfile() }}
                            onPress={() => { this.isValidURL()}}
                            style={[style.btnTouch, { marginTop: 15 }]}>
                            <Text style={style.btnTxt}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
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
    coverImage: {
        height: 190,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        borderColor: 'black'
    },
    prfileTagCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: -50
    },
    profileTxt: {
        color: '#005271',
        fontFamily: fontFamily.Bold,
        marginTop: 5,
        fontSize: 13
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 55,
        backgroundColor: '#005271',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputTxt: {
        height: 40,
        fontSize: 14,
        borderColor: '#707071',
        borderWidth: 1,
        marginTop: 10,
        paddingLeft: 10
    },
    btnTouch: {
        height: 45,
        margin: 5,
        borderColor: '#707071',
        borderWidth: 1,
        backgroundColor: '#EF4867',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        marginLeft: 20
    },
    btnTxt: {
        fontSize: 18,
        color: 'white',
        fontFamily: fontFamily.Bold
    },

});

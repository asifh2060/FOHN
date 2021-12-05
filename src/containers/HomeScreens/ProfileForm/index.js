import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView , Alert} from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import { API } from "../../../utils/constants";
import Preference from "react-native-preference";
import SimpleToast from "react-native-simple-toast";
import ProgressBar from "../../../component/ProgressBar";
import { Picker } from 'native-base';

const resetActionToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainBottomTab' })],
});
export default class ProfileForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sourceForAPI: '',
            sourceForAPITwo: '',
            profileImage: '',
            profileImageTwo: '',
            profile: "",
            isForm: false,
            loading: false,
            country: "",
            countryList: [
                // {
                //     name:"abc",
                //     short_code:"1",
                // }
            ],
            stateList: [
                //     {
                //     name:"abc",
                //     short_code:"1",
                // }
            ],

            tagline: '',
            firstName: "",
            lastName: "",
            company: "",
            contactEmail: "",
            phone: "",
            fbLink: "",
            twLink: "",
            lnLink: "",
            instaLink: "",
            ytLink: "",
            websitUrl: "",
            about: "",
            city: "",
            state: "",
            zipCode: "",
            
        }
    }


    componentWillMount() {

    }

    componentDidMount() {
        this.getCountriesApi()
    }

    updateUserProfileApi = () => {
       let userData = Preference.get('userRegisterId');
       console.log('my user data====>',userData)
        if(this.state.firstName == ''){
            Alert.alert(
                null,
                'Please enter your first name',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please enter your first name');
            return
        }
        if(this.state.lastName == ''){
            Alert.alert(
                null,
                'Please enter your last name',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please enter your last name');
            return
        }
        if(this.state.contactEmail == ''){
            Alert.alert(
                null,
                'Please enter your contact email',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please enter your contact email');
            return
        }
        if(this.state.phone == ''){
            Alert.alert(
                null,
                'Please enter your phone no',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please enter your phone no');
            return
        }


        let requestBody = new FormData()
        requestBody.append('user_id', userData.user_id)
        requestBody.append('profile_photo', this.state.sourceForAPITwo)
        requestBody.append('cover_photo', this.state.sourceForAPI)
        requestBody.append('first_name', this.state.firstName)
        requestBody.append('last_name', this.state.lastName)
        requestBody.append('user_url', this.state.websitUrl)
        requestBody.append('about_me', this.state.about)
        requestBody.append('company', this.state.company)
        requestBody.append('contact_email', this.state.contactEmail)
        requestBody.append('phone_no', this.state.phone)
        requestBody.append('facebook', this.state.fbLink)
        requestBody.append('twitter', this.state.twLink) 
        requestBody.append('instagram', this.state.instaLink)
        requestBody.append('youtube', this.state.ytLink)
        requestBody.append('city', this.state.city)
        requestBody.append('postcode', this.state.zipCode)
        requestBody.append('state_code', this.state.state)
        requestBody.append('linkedin', this.state.lnLink)
        requestBody.append('tagline', this.state.tagline)

        this.setState({
            loading: true
        })
        console.log("\n\n\n\n\n\nParams: ", requestBody)
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

                Preference.set('userData', response.body);

                this.props.navigation.dispatch(resetActionToHome)

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

    getCountriesApi = () => {

        const details = {

        };

        this.setState({
            loading: true
        })
        console.log("\n\n\n\n\n\nParams: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_COUNTRIES, {
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
                this.setState({
                    countryList: response.body
                })
            }

            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    getStatesApi = (country) => {

        const details = {

            // tagline:'',

            country_code: country,

        };


        this.setState({
            loading: true
        })
        console.log("\n\n\n\n\n\nParams: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_STATES_BY_COUNTRY, {
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
            console.log('getStatesApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({
                    stateList: response.body
                })
            }

            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    header() {
        return (
            <Header
                leftIcon={require('../../../assets/images/back.png')}
                leftAction={this.leftAction.bind(this)}
                rightAction={this.rightAction.bind(this)}
                customStyle={{ fontSize: 20 }}
                HeaderColor={'#00B7B0'}
                bottomBorderColor={"#EF4867"}
                centerComponent={"Create Profile"}
            />

        )

    }

    leftAction() {
        this.props.navigation.pop()

    }

    rightAction() {

    }

    loadAllCountries() {

        // console.log("serviceList MyDataList::", JSON.stringify(countries))

        return (this.state.countryList.map((item, index) => {

            // console.log("\n\nloadAllCountries Country::", JSON.stringify(item))
            return (<Picker.Item label={item.name} value={item.short_code} />);

        }));


    }
    loadAllStates() {

        // console.log("serviceList MyDataList::", JSON.stringify(countries))

        return (this.state.stateList.map((item, index) => {

            // console.log("\n\nloadAllCountries Country::", JSON.stringify(item))
            return (<Picker.Item label={item.name} value={item.short_code} />);

        }));


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
                    // console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImage: source.uri,
                        sourceForAPI: source,
                        // sourceForAPI: sourceForAPI.uri,
                    });
                } else {
                    const sourceForAPITwo = { uri: response.data };
                    this.setState({
                        profileImageTwo: source.uri,
                        sourceForAPITwo: source,
                        // sourceForAPITwo: sourceForAPITwo.uri,
                    });
                }
            }
        });
    }

    render() {
        return (
            <View style={style.mainContainer}>
                <Header
                    leftIcon={require('../../../assets/images/back.png')}
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    customStyle={{ fontSize: 20 }}
                    HeaderColor={'#00B7B0'}
                    bottomBorderColor={"#EF4867"}
                    centerComponent={"Create Profile"}
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1, margin: 10 }}>
                        <View>
                            <Image source={{ uri: this.state.profileImage }}
                                resizeMode={'cover'}
                                style={style.coverImage}>
                            </Image>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }}
                                onPress={() => {
                                    this.setState({ imageClick: '1', show9: false }, () => {
                                        this.forceUpdate()
                                    })
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
                        </View>
                        <View style={style.prfileTagCont}>
                            <View>
                                <Image source={{ uri: this.state.profileImageTwo }}
                                    resizeMode={'cover'}
                                    style={style.profileImage} />
                                <TouchableOpacity style={{ position: 'absolute', left: 36, top: 36 }}
                                    onPress={() => {
                                        this.setState({ imageClick: '2', }, () => {
                                            this.forceUpdate()
                                        })
                                        this.selectImageButtonPress()
                                    }}>
                                    <Image source={require('../../../assets/images/profile_camera.png')}
                                        resizeMode={'contain'}
                                        style={{ width: 30, height: 30, tintColor: '' }} />
                                </TouchableOpacity>
                                <Text style={style.profileTxt}>Add Profile Photo</Text>
                            </View>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => {
                                    this.setState({ tagline: text })
                                }}
                                value={this.state.tagline}
                                placeholder={"Tagline or Quote:"}
                                style={[style.inputTxt, { height: 63, width: '63%', alignSelf: 'flex-end' }]}
                            />
                        </View>
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ firstName: text })
                            }}
                            value={this.state.firstName}
                            placeholder={"First Name:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ lastName: text })
                            }}
                            value={this.state.lastName}
                            placeholder={"Last Name:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ company: text })
                            }}
                            value={this.state.company}
                            placeholder={"Company:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ contactEmail: text })
                            }}
                            value={this.state.contactEmail}
                            placeholder={"Contact Email:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ phone: text })
                            }}
                            value={this.state.phone}
                            placeholder={"Phone Number:"}
                            style={style.inputTxt}
                            keyboardType={'numeric'}
                            maxLength={17}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ fbLink: text })
                            }}
                            value={this.state.fbLink}
                            placeholder={"Facebook Link:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ twLink: text })
                            }}
                            value={this.state.twLink}
                            placeholder={"Twitter Link:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ lnLink: text })
                            }}
                            value={this.state.lnLink}
                            placeholder={"LinkedIn Link:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ instaLink: text })
                            }}
                            value={this.state.instaLink}
                            placeholder={"Instagram Link:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ ytLink: text })
                            }}
                            value={this.state.ytLink}
                            placeholder={"YouTube Link:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ websitUrl: text })
                            }}
                            value={this.state.websitUrl}
                            placeholder={"Website URL:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ about: text })
                            }}
                            value={this.state.about}
                            placeholder={"About Me:"}
                            multiline={true}
                            style={[style.inputTxt, { height: 130, textAlignVertical: 'top' }]}
                        />

                        <View
                            style={style.inputTxt}>
                            <Picker
                                style={{ marginTop: -5 }}
                                selectedValue={this.state.country}
                                onValueChange={(itemValue, itemIndex) => {

                                    console.log("country name", itemValue)
                                    this.setState({
                                        country: itemValue
                                    })

                                    this.getStatesApi(itemValue)
                                }}
                                mode={'dialog'}>
                                {this.loadAllCountries()}
                            </Picker>

                        </View>

                        <View
                            style={style.inputTxt}>
                            <Picker
                                style={{ marginTop: -5 }}
                                selectedValue={this.state.state}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({
                                        state: itemValue
                                    })
                                    console.log("country name", itemValue)

                                }}
                                mode={'dialog'}>
                                {this.loadAllStates()}
                                {/*    */}
                            </Picker>

                        </View>

                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ city: text })
                            }}
                            value={this.state.city}
                            placeholder={"City:"}
                            style={style.inputTxt}
                        />
                        {/* <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({state: text})
                            }}
                            value={this.state.state}
                            placeholder={"State:"}
                            style={style.inputTxt}
                        />*/}
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => {
                                this.setState({ zipCode: text })
                            }}
                            value={this.state.zipCode}
                            placeholder={"Zip Code:"}
                            style={style.inputTxt}
                            keyboardType={'number-pad'}
                            maxLength={5}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                // this.props.navigation.navigate('RealtorMembership')
                                this.updateUserProfileApi()
                            }}
                            style={[style.btnTouch, { marginTop: 15 }]}>
                            <Text style={style.btnTxt}>SUBMIT / SAVE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // this.props.navigation.navigate('PostOpenHouse')
                                this.props.navigation.navigate("CreateOpenHouse", { isCreate: true })
                            }}
                            style={[style.btnTouch, { backgroundColor: '#00B7B0' }]}>
                            <Text style={style.btnTxt}>POST OPEN HOUSE</Text>
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
        borderWidth: 1,
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

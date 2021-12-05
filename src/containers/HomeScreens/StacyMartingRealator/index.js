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
    Linking,
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
import moment from 'moment';
import fonFamily from '../../../assets/fonts'
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'


export default class StacyMartinRealator extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            userId: props.navigation.getParam("userId"),
            userDetails: null,
            id: "19",
            LoginUserId: Preference.get('userData'),
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
            rating: 0,
            total_number_of_reviews: 1,
            reviews: [],
            type: '',
            city: '',
            Feature_Realtor: [],
            isFollowed: 0,
            socialLogin: Preference.get('socialLogin') === undefined ? 'false' : Preference.get('socialLogin'),
            appThemeMode: 'light'

        }
    }

    componentDidMount() {
        this.setState({
            appThemeMode: this.context === 'dark' ? 'dark' : 'light'
        }, () => {
            this.forceUpdate()
            console.log('comp->', this.setState.appThemeMode)
        })
        eventEmitter.on('currentModeChanged', newMode => {
            console.log('Switched to', newMode, 'mode')
            this.setState({
                appThemeMode: newMode
            })
        })
        // console.log('my new user id===>',this.state.LoginUserId.id)
        this.getUserDetailApi()
        const { navigation } = this.props;
        this.focusListner = navigation.addListener('didFocus', () => {
            this.getUserDetailApi()
        })
    }

    componentWillMount() {
        if (this.focusListener) {
            this.focusListner = null;
        }
    }

    getUserDetailApi = () => {
        const details = {
            // user_email: "test15@test.com",
            id: this.state.userId,
            login_user_id: this.state.LoginUserId ? this.state.LoginUserId.id : ''
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
            console.log('getUserDetailApi realtor detail Response: ' + JSON.stringify(response));
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
                    rating: parseInt(instance.rating),
                    total_number_of_reviews: instance.total_number_of_reviews,
                    reviews: instance.reviews,
                    city: instance.city,
                    Feature_Realtor: instance.properties,
                    isFollowed: instance.is_followed
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

    leftAction() {
        this.props.navigation.goBack()
    }

    rightAction() {
    }

    renderItem(item) {
        return (
            <View style={{ width: "100%", marginTop: 10 }}>
                <Image source={{ uri: item.thumbnail_url }}
                    style={style.maimImg}
                    resizeMode={"cover"} />
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("OpenHouseTitle", {
                        propertyId: item.id,
                    })
                }} style={{
                    backgroundColor: "white",
                    height: 40,
                    width: "50%",
                    position: 'absolute',
                    top: 0,
                    justifyContent: "center",

                    // alignItems: "center"
                }}>
                    <Text style={{ color: "#00B7B0", fontSize: 16, fontWeight: "bold", paddingLeft: 10 }}>{`Open  ${moment(item.post_date).format('MM-DD-YYYY')}`}</Text>
                </TouchableOpacity>
                <Image source={item.isFavorite == '1' ? require('../../../assets/images/heart.png') : require('../../../assets/images/unselected_heart.png')} resizeMode={"contain"} style={[style.imgHeart, { top: 10 }]} />
                <View style={{ marginStart: 20, marginTop: 10, flexDirection: "row" }}>
                    {/* <Text style={{ fontSize: 16, fontWeight: "bold", color: "#707070" }}>{item.post_title}</Text>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#707070",
                        marginLeft: 20,
                        flex: 1
                    }}>{item.post_content}</Text> */}

                    {/* <Text style={{fontSize:16,fontFamily:fontFamily.Bold,color:"#707070"}}>{item.post_title}</Text> */}
                    <Text style={{ fontSize: 18, fontWeight: '900', color: "#707070" }}>{item.Property_Price.includes('$') ? item.Property_Price : '$' + item.Property_Price}{'  '}</Text>
                    {/* <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",marginLeft:20,flex:1}}>{item.post_content}</Text> */}
                    <Text style={{ fontSize: 12, fontFamily: fonFamily.Bold, color: "#707070", alignSelf: "center" }}>{item.no_of_bedrooms ? item.no_of_bedrooms + ' beds' : 0 + " beds"}{'  '}</Text>
                    <Text style={{ fontSize: 12, fontFamily: fonFamily.Bold, color: "#707070", alignSelf: "center" }}>{item.no_of_bathroom ? item.no_of_bathroom + ' bath' : 0 + " bath"} {' '}</Text>
                    <Text style={{ fontSize: 12, fontFamily: fonFamily.Bold, color: "#707070", alignSelf: "center" }}>{item.square_feet + " sq ft"} {' '}</Text>

                </View>
                <Text style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#707070",
                    flex: 1,
                    marginStart: 20
                }}>{item.open_house_street_address}</Text>
                <TouchableOpacity
                    style={{ flexDirection: "row", marginStart: 20, alignItems: "center", marginBottom: 10 }}>
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10 / 2,
                        borderWidth: 1,
                        backgroundColor: "#EB5E3E"
                    }}></View>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#707070",
                        flex: 1,
                        marginStart: 5
                    }}>{item.open_house_type}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, height: 5, backgroundColor: "#EF4867" }}></View>
            </View>
        )
    }
    CheckUserData = () => {
        if (this.state.LoginUserId == undefined) {
            Alert.alert(
                null,
                "Please Register/Sign In First",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.props.navigation.navigate('LandingScreen') }
                ],
                { cancelable: false }
            );
            // SimpleToast.show('Please Login first')
            return
        }
        // if (this.state.socialLogin !== 'false') {
        //     Alert.alert(
        //         null,
        //         'You login with social account cannot message' + this.state.socialLogin,
        //         [

        //             { text: "OK", onPress: () => console.log("OK Pressed") }
        //         ],
        //         { cancelable: false }
        //     )
        //     // SimpleToast.show('You login with social account cannot message')
        //     return
        // }
        this.props.navigation.navigate("MessageStacy", {
            userId: this.state.userId,
            phone: this.state.phone
        })
    }

    CheckUserData2 = () => {
        if (this.state.LoginUserId == undefined) {
            Alert.alert(
                null,
                "Please Register/Sign In First",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.props.navigation.navigate('LandingScreen') }
                ],
                { cancelable: false }
            );
            // SimpleToast.show('Please Login first')
            return
        }
        this.props.navigation.navigate("FollowStacy", {
            userId: this.state.userId,
            isFollowed: this.state.isFollowed
        })
    }

    CheckUserData3 = () => {
        if (this.state.LoginUserId == undefined) {
            Alert.alert(
                null,
                "Please Register/Sign In First",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.props.navigation.navigate('LandingScreen') }
                ],
                { cancelable: false }
            );
            // SimpleToast.show('Please Login first')
            return
        }
        this.props.navigation.navigate("Review",
            { reviewerId: this.state.userId }
        )
    }
    _renderEmpty = () => {
        return (
            <View>
                <Text style={{ marginLeft: 5 }}>No properties</Text>
            </View>
        )
    }

    render() {
        const { appThemeMode } = this.state
        let bannerImageSource = this.state.banner_photo;
        return (
            <View style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={this.state.name ? this.state.name : "Stacy Martin - Realtor"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode === 'light' ? Colors.black : Colors.white}

                />
                <ScrollView style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                    <Image
                        // source={{require('../../../assets/images/banner_image.png')}}
                        source={bannerImageSource ? { uri: bannerImageSource } : require("../../../assets/images/banner_image.png")}
                        resizeMode={'cover'} style={style.imgStyle} />
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={[style.imgStyleRounded, { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50, overflow: 'hidden' }]}>
                            <Image
                                style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }}
                                source={{ uri: this.state.profile_photo?.includes('https') ? this.state.profile_photo : 'https://foh.nninternationals.com/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg' }}
                            />
                        </View>
                        {/* <Image
                            source={{ uri: this.state.profile_photo?.includes('https') ? this.state.profile_photo : 'https://foh.nninternationals.com/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg' }}
                            // source={{uri:this.state.profile_photo}}
                            // source={require("../../../assets/images/StacyMartinRounded.png")}
                            resizeMode={'contain'}
                            style={style.imgStyleRounded} /> */}
                        <Text style={{
                            flex: 1,
                            marginStart: 10,
                            marginTop: 10,
                            color: "#005271"
                        }}>
                            {this.state.short_description}
                            {/*{"Helping buyers and sellers in central Iowa.I am passionate about real estate, making the buying and selling process as seamless and worry fre as possible!"}*/}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }}>
                            <Text style={{
                                marginStart: 10,
                                marginTop: 10,
                                color: "#707071"
                            }}>
                                {this.state.email}
                                {/*{"stacy.martin@realestateconcepts.net"}*/}
                            </Text>
                            <Text style={{
                                marginStart: 10,
                                marginTop: 10,
                                color: "#70701"
                            }}>
                                {this.state.phone + " | " + this.state.city}
                                {/*{"(515) 681-8876 | Ankeny, IA 50023"}*/}
                            </Text>
                            <Text style={{ marginStart: 10, color: "#707071", marginTop: 10 }}>
                                {this.state.name}
                                {/*{"Re\Max Concepts"}*/}
                            </Text>
                            <View style={style.socialImg}>
                                {this.state.facebook !== "" ? <TouchableOpacity onPress={() => Linking.openURL(this.state.facebook)}>
                                    <Image source={require("../../../assets/images/fb.png")} resizeMode={'contain'}
                                        style={style.imgRounded} />

                                </TouchableOpacity> : <View />}

                                {this.state.twitter !== "" ? <TouchableOpacity onPress={() => Linking.openURL(this.state.twitter)}>
                                    <Image source={require("../../../assets/images/tweet.png")} resizeMode={'contain'}
                                        style={style.imgRounded} />
                                </TouchableOpacity> : <View />}

                                {this.state.linkedIn !== "" ? <TouchableOpacity onPress={() => Linking.openURL(this.state.linkedIn)}>
                                    <Image source={require("../../../assets/images/in.png")} resizeMode={'contain'}
                                        style={style.imgRounded} />
                                </TouchableOpacity> : <View />}

                                {this.state.instagram !== "" ? <TouchableOpacity onPress={() => Linking.openURL(`https://www.instagram.com/${this.state.instagram}`)}>
                                    <Image source={require("../../../assets/images/insta.png")} resizeMode={'contain'}
                                        style={style.imgRounded} />
                                </TouchableOpacity> : <View />}

                                {this.state.youtube !== "" ? <TouchableOpacity onPress={() => Linking.openURL(this.state.youtube)}>
                                    <Image source={require("../../../assets/images/youtube.png")} resizeMode={'contain'}
                                        style={style.imgRounded} />
                                </TouchableOpacity> : <View />}
                            </View>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <TouchableOpacity onPress={() => {
                                this.CheckUserData()
                            }} style={[style.socialBtn]}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{"MESSAGE"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.CheckUserData2()
                            }} style={[style.socialBtn, { backgroundColor: "#00B7B0" }]}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{this.state.isFollowed == '1' ? 'UNFOLLOW' : "FOLLOW"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.CheckUserData3()
                            }} style={[style.socialBtn, { backgroundColor: "#D1AE5E" }]}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{"REVIEW"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text
                        style={{ color: '#005271', fontWeight: 'bold', marginStart: 10 }}>
                        {this.state.website}
                        {/*{"stacymartinhomes.com"}*/}
                    </Text>
                    <Text style={{ color: '#00B7B0', fontWeight: 'bold', margin: 10, fontSize: 20 }}>{"ABOUT ME:"}</Text>
                    <Text style={{
                        color: '#707071',
                        marginStart: 10
                    }}>
                        {this.state.long_description}
                        {/*{"As a RE/MAX® agent, I’m dedicated to helping my clients find the home of their dreams. Whether you are buying or selling a home or just curious about the local market, I would love to offer my support and services. I know the local community — both as an agent and a neighbor — and can help guide you through the nuances of our local market. With access to top listings, a worldwide network, exceptional marketing strategies and cutting-edge technology, I work hard to make your real estate experience memorable and enjoyable. I look forward to the opportunity to work with you. Please don’t hesitate to contact me today!"}*/}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                            style={{ color: '#00B7B0', fontWeight: 'bold', margin: 10, fontSize: 20 }}>{"REVIEWS"}</Text>
                        <Text style={{
                            color: appColor.Gray_Chateau,
                            marginStart: 30
                        }}>
                            {this.state.rating !== null && this.state.rating + " out of 5 stars (" + this.state.total_number_of_reviews + " Reviews)"}
                            {/*{"4.9 out of 5 stars (135 Reviews)"}*/}
                        </Text>
                    </View>
                    <View style={{
                        marginLeft: 10,
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20
                    }}>
                        <AirbnbRating
                            count={5}
                            selectedColor={"#D1AE5E"}
                            reviews={false}
                            // showRating={false}
                            defaultRating={this.state.rating}
                            isDisabled={true}
                            ratingColor={"#D1AE5E"}
                            ratingBackgroundColor={'#D1AE5E'}
                            size={25}
                        />
                    </View>
                    <Text style={{ color: '#00B7B0', fontWeight: 'bold', margin: 10, fontSize: 20 }}>{"Recent Reviews"}</Text>
                    <FlatList
                        horizontal
                        pagingEnabled

                        ListEmptyComponent={() => {
                            return <Text style={{
                                color: '#005271',
                                marginStart: 10
                            }}>No Reviews</Text>
                        }}
                        data={this.state.reviews} keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ marginHorizontal: 10, borderRadius: 5, marginTop: 10,width:width,}}>
                                    <Text style={{
                                        color: '#005271',
                                        marginStart: 10
                                    }}>
                                        {'Review Title : ' + item.review_title }
                                    </Text>
                                    <Text style={{
                                        color: '#005271',
                                        marginStart: 10,
                                        paddingRight: 15
                                    }}>
                                        {'Review Description : ' + item.review_text}
                                    </Text>
                                </View>
                            )
                        }} />



                    {/* <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 20 }}>
                        <TouchableOpacity style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "#005271",
                            borderRadius: 10 / 2,
                            borderWidth: 0.5
                        }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "#005271",
                            borderRadius: 10 / 2,
                            borderWidth: 0.5,
                            marginStart: 10
                        }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 10,
                            height: 10,
                            backgroundColor: "#005271",
                            borderRadius: 10 / 2,
                            borderWidth: 0.5,
                            marginStart: 10
                        }}>

                        </TouchableOpacity>
                    </View>
                    */}
                    <Text style={{
                        color: '#00B7B0',
                        fontWeight: 'bold',
                        margin: 10,
                        marginTop: 20,
                        fontSize: 20
                    }}>{"MY OPEN HOUSES"}</Text>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            style={style.flatliststy}
                            ListEmptyComponent={this._renderEmpty()}
                            data={this.state.Feature_Realtor}
                            renderItem={({ item, index }) => (
                                this.renderItem(item)
                            )}
                            extraData={this.state}
                            keyExtractor={item => item.id}
                        />
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
        backgroundColor: "white"
    },
    imgContainer: {
        // flexDirection:'row',
        // width:'100%',
        //   flex:1
    },
    imgStyle: {
        // backgroundColor:'red',
        //  flex: 1,
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
    // imgStyleRounded: {
    //     height: 120,
    //     width: 120,
    //     borderRadius: 100,
    //     // position:'/absolute',
    //     // bottom:0,
    //     marginTop: -30,
    //     marginStart: 10
    // },
    socialBtn: {
        height: 40,
        flex: 0.5,
        backgroundColor: '#005271',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginEnd: 10
    },
    socialImg: {
        flexDirection: 'row',
        marginStart: 10,
        marginTop: 10
    },
    imgRounded: {
        width: 40,
        height: 40,
        marginStart: 5
    },
    maimImg: {
        width: '100%',
        height: 180,

    },
    flatliststy: {
        backgroundColor: "white",
        flex: 1,
        marginBottom: 20
    },
    imgHeart: {
        width: 20,
        height: 20,
        position: "absolute",
        right: 20,
        top: 0,
        // tintColor: "white"
    }


});

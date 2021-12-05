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
    FlatList, SafeAreaView, Alert
} from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const { height, width } = Dimensions.get('window');
import fonFamily from '../../../assets/fonts'
import { AirbnbRating } from "react-native-ratings";
import MapView from "react-native-maps";
import Slideshow from 'react-native-image-slider-show';
import Video from "react-native-video";
import { API } from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import ProgressBar from "../../../component/ProgressBar";
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import Modal from 'react-native-modal';
import appColor from "../../../component/appColor"
import Preference from 'react-native-preference';
import RNSettings from 'react-native-settings';
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'





export default class OpenHouseTitle extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            propertyId: props.navigation.getParam("propertyId"),
            latitude: 41.5668418,
            longitude: -93.7466025,
            isPlaying: true,
            initialRegion: {
                latitude: 41.5668418,
                longitude: -93.7466025,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            position: 1,
            loading: false,
            interval: null,
            dataSource: [
                /*{
                    url: require('../../../assets/images/img-1.png'),
                }, {
                    url: require('../../../assets/images/image2.png'),
                }, {
                    url: require('../../../assets/images/img-2.png'),
                },*/
            ],

            id: 2137,
            publisher_profile_photo: "http://findopenhouse.appcrates.co/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg",
            open_from: "?",
            isFavorite: "",
            publisher_name: "stacy martin",
            publisher_email: "stacy.5martin@gmail.com",
            publisher_phone_number: "",
            publisher_address: "IA Ankeny 50023",
            open_house_type: "",
            open_house_street_address: "",
            open_house_dates: "2019-12-06 20:24:24",
            no_of_bathroom: "2",
            no_of_bedrooms: "3",
            square_ft: "",
            property_price: "$ 225,000.00",
            lot_size: "?",
            basement: "",
            year_built: "",
            fetures: "Gorgeous ranch backing to a pond in quiet neighborhood.",
            keywords: "",
            featured_image: "http://findopenhouse.appcrates.co/wp-content/uploads/2019/12/MG_0106.jpg",
            gallery_images: [
                "http://findopenhouse.appcrates.co/wp-content/uploads/2019/12/MG_0127_8_9.jpg",
                "http://findopenhouse.appcrates.co/wp-content/uploads/2019/12/MG_0118.jpg",
                "http://findopenhouse.appcrates.co/wp-content/uploads/2019/12/MG_0123.jpg"
            ],
            blueprint_of_house: "not available ib web",
            houseTitle: '',
            floorPlan: '',
            other_amenities: '',
            views: '',
            keywords: '',
            ListedBy: '',
            ChooseFolder: false,
            BookmarkExistingFolder: false,
            BookmarkNewFolder: false,
            userData: Preference.get("userData"),
            AddFolderName: false,
            newFolderName: '',
            propertyDescription: '',
            city: '',
            isPrivate: false,
            BookmarkFolderKey: '',
            startTime: '',
            endTime: '',
            closingDate: "",
            propertyPostAuthorId: 0,
            appThemeMode: 'light'

        }
    }

    getPropertyByIdApi = () => {
        const details = {
            // user_email: "test15@test.com",
            id: this.state.propertyId,
            login_user_id: this.state.userData ? this.state.userData.id : ''
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_LOCATION_BY_ID, {
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
            console.log('getPropertyByIdApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                let instance = response.body;
                let imageArray = [];
                if (instance.property_image_1) {
                    let propertyImage1 = {
                        // title: 'Title 1',
                        // caption: 'Caption 1',
                        url: instance.property_image_1,
                    }
                    imageArray.push(propertyImage1)
                }
                if (instance.property_image_2) {
                    let propertyImage2 = {
                        // title: 'Title 2',
                        // caption: 'Caption 2',
                        url: instance.property_image_2,
                    }
                    imageArray.push(propertyImage2)
                }
                if (instance.property_image_3) {
                    let propertyImage3 = {
                        // title: 'Title 3',
                        // caption: 'Caption 3',
                        url: instance.property_image_3,
                    }
                    imageArray.push(propertyImage3)
                }
                if (instance.property_image_4) {
                    let propertyImage4 = {
                        // title: 'Title 4',
                        // caption: 'Caption 4',
                        url: instance.property_image_4,
                    }
                    imageArray.push(propertyImage4)
                }


                // for (var i = 0; i<response.body.gallery_images.length;i++){
                //     let tmp = {
                //         url:response.body.gallery_images[i]
                //     }
                //     imageArray.push(tmp)
                // }
                this.setState({
                    id: instance.id,
                    publisher_profile_photo: instance.publisher_profile_photo,
                    houseTitle: instance.post_title,
                    open_from: instance.open_from,
                    isFavorite: instance.isFavorite,
                    publisher_name: instance.publisher_name,
                    publisher_email: instance.publisher_email,
                    publisher_phone_number: instance.publisher_phone_number,
                    publisher_address: instance.zip,
                    open_house_type: instance.open_house_type,
                    open_house_street_address: instance.open_house_street_address,
                    latitude: instance.location.lat != "" ? parseFloat(instance.lat) : 41.5668418,
                    longitude: instance.location.lng != "" ? parseFloat(instance.lng) : -93.7466025,
                    open_house_dates: instance.date,
                    closingDate: instance.close_date,
                    startTime: instance.start_time,
                    endTime: instance.end_time,
                    no_of_bathroom: instance.no_of_bathroom,
                    no_of_bedrooms: instance.no_of_bedrooms,
                    square_ft: instance.square_feet,
                    property_price: instance.Property_Price,
                    lot_size: instance.plot_size,
                    basement: instance.basement,
                    year_built: instance.year_built,
                    fetures: instance.fetures,
                    keywords: instance.keywords,
                    featured_image: instance.thumbnail_url,
                    gallery_images: instance.gallery_images,
                    dataSource: imageArray,
                    keywords: instance.keywords,
                    views: instance.views,
                    other_amenities: instance.other_amenities,
                    blueprint_of_house: instance.blueprint_of_house,
                    floorPlan: instance.floorplan_image_1 ? instance.floorplan_image_1 : instance.floorplan_image_2 ? instance.floorplan_image_2 : instance.floorplan_image_3 ? instance.floorplan_image_3 : instance.floorplan_image_4,
                    ListedBy: instance.user_role,
                    ExistingFolderList: [],
                    showExistingFolder: false,
                    propertyDescription: instance.post_content,
                    city: instance.city,
                    BookmarkFolderKey: instance.folder_key,
                    propertyPostAuthorId: instance.post_author

                }, () => {
                    this.setState({
                        initialRegion: {
                            ...this.state.initialRegion,
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                        },
                    }, () => {
                        console.log('mu title===>', this.state.initialRegion)
                    })

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

    GetBookmarksFolder = () => {
        const details = {
            user_id: this.state.userData.id,
            // user_id: '1',
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_BOOKMARKS_FOLDERS, {
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
            console.log('getBookmarkfolder Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({ ExistingFolderList: response.body, showExistingFolder: true }, () => {
                    console.log('my state data===:>?', this.state.ExistingFolderList)
                    this.setState({ ChooseFolder: true })
                })
            } else {
                this.setState({ ChooseFolder: true })
                // SimpleToast.show(response.message);
            }
            this.setState({ loading: false });
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }

    RemovedBookmarksFolder = () => {
        const details = {
            user_id: this.state.userData.id,
            // user_id: '1',
            folder_key: this.state.BookmarkFolderKey,
            property_id: this.state.propertyId,
            login_user_id: this.state.userData.id
        };
        this.setState({
            ChooseFolder: false, loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.REMOVE_BOOKMARKS, {
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
            console.log('adduserbookmarktoexisting folder Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.getPropertyByIdApi();
            } else {
                this.setState({ loading: false });
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

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    AddBookmarksExistingFolder = (folderKey) => {
        const details = {
            user_id: this.state.userData.id,
            // user_id: '1',
            folder_key: folderKey,
            property_id: this.state.propertyId,
            login_user_id: this.state.userData.id
        };
        this.setState({
            ChooseFolder: false, loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.ADD_BOOKMARKS_TO_EXISTING_FOLDER, {
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
            console.log('adduserbookmarktoexisting folder Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                Alert.alert(
                    null,
                    'Property saved in your existing folder',
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Property saved in your existing folder');
                this.getPropertyByIdApi();
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

    AddBookmarkToNewFolder = () => {
        if (this.state.newFolderName == '') {
            Alert.alert(
                null,
                'Folder name is required',
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Folder name is required');
            return
        }
        const details = {
            user_id: this.state.userData.id,
            title: this.state.newFolderName,
            property_id: this.state.propertyId,
            type: this.state.isPrivate ? 'private' : 'public',
            login_user_id: this.state.userData.id
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.ADD_BOOKMARKS_TO_NEW_FOLDER, {
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
            this.setState({ newFolderName: '' })
            console.log('adduserbookmarkto new folder Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                console.log('now i mgoing get property by id')
                this.getPropertyByIdApi();
                Alert.alert(
                    null,
                    'Property saved in your New folder',
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('Property saved in your New folder');

            } else {
                this.setState({ loading: false });
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

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }


    componentWillMount() {
        this.setState({
            interval: setInterval(() => {
                this.setState({
                    position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
                });
            }, 500000)
        });
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }
    componentDidMount() {
        // this.getLocation();
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
        this.getPropertyByIdApi();

    }
    getLocation = () => {
        Geolocation.getCurrentPosition(info =>
        // console.log('my location current lat long======>',info)
        {
            this.setState({
                initialRegion: {
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                    latitudeDelta: 7.1922,
                    longitudeDelta: 0.0421,
                },
            })
        },
            (error) => {
                console.log('my error message in location===>', error);

                if (error.code == 2) {
                    RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).then(
                        result => {
                            if (result === RNSettings.ENABLED) {
                                this.getLocation();
                            }

                        },
                    );
                }
                if (error.code == 3) {
                    this.getLocation();
                }
            },
            { enableHighAccuracy: true, timeout: 100000, },
        );
    }

    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() { }

    goToInitialRegion() {
        this.setState({ lat: this.state.lat, long: this.state.long })
        let initialRegion = Object.assign({}, this.state.initialRegion);
        initialRegion["latitudeDelta"] = 0.0922;
        initialRegion["longitudeDelta"] = 0.0421;
        //this.mapView.animateToRegion(initialRegion, 2000);
    }
    CheckUserData = () => {
        // if(this.state.ListedBy == 'um_lender' || this.state.ListedBy == 'um_insurance-agent'){
        //     SimpleToast.show('you cannot bookmark/unbookmark property');
        //     return
        // }
        if (this.state.isFavorite) {
            Alert.alert(
                "Alert",
                "Are you sure to unfavourite this property?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.RemovedBookmarksFolder() }
                ],
                { cancelable: false }
            );
            // SimpleToast.show('You have already bookmark this property');
            return

        }
        if (this.state.userData) {
            this.GetBookmarksFolder()

        }
        else {
            Alert.alert(
                "Alert",
                "Please Register/SignIn First",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.props.navigation.navigate('sign_in') }
                ],
                { cancelable: false }
            );
            // Alert.alert('Please Register/SignIn First')
            // SimpleToast.show('Please Login first to add in bookmark folder')
        }

    }
    CheckFolderName = () => {
        if (this.state.newFolderName == '') {
            Alert.alert(
                null,
                'Folder Name is required',
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Folder Name is required')
            return
        }
        else {
            this.setState({ ChooseFolder: false })
            this.AddBookmarkToNewFolder()
        }
    }

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      

      });

      formatter1 = new Intl.NumberFormat('en-US', {

      });

    render() {
        const { appThemeMode } = this.state

        return (
            <View style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                <View>
                    <Header
                        leftAction={this.leftAction.bind(this)}
                        rightAction={this.rightAction.bind(this)}
                        HeaderColor={'#00B7B0'}
                        leftIcon={require('../../../assets/images/back.png')}
                        centerComponent={this.state.houseTitle}
                        bottomBorderColor={"#EF4867"}
                        LeftIconColor={'#005271'}
                    />
                </View>
                <ScrollView style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                    <View style={{ height: 240, }}>
                        <Image
                            source={{ uri: this.state.featured_image }}
                            // source={require("../../../assets/images/FeaturedImage.png")}CheckUserData
                            resizeMode={'cover'} style={style.imgStyle} />
                        <TouchableOpacity onPress={() => this.CheckUserData()} style={style.imgHeart}>
                            <Image source={this.state.isFavorite == '1' ? require('../../../assets/images/heart.png') : require('../../../assets/images/unselected_heart.png')} resizeMode={"contain"} style={{ width: 25, height: 25, tintColor: this.state.isFavorite == '1' ? 'white' : '#707070' }} />
                        </TouchableOpacity>
                        {this.state.open_house_dates != '' && <TouchableOpacity style={{ backgroundColor: "white", height: 40, width: "50%", position: 'absolute', top: 3, justifyContent: "center", }}>
                            <Text style={{ color: "#00B7B0", fontSize: 16, fontWeight: "bold", paddingLeft: 10 }}>{"OPEN " + this.state.open_house_dates}</Text>
                        </TouchableOpacity>}
                        {this.state.closingDate != '' && <TouchableOpacity style={{ backgroundColor: "white", height: 40, width: "50%", position: 'absolute', top: 60, justifyContent: "center", }}>
                            <Text style={{ color: "#00B7B0", fontSize: 16, fontWeight: "bold", paddingLeft: 10 }}>{"CLOSE " + this.state.closingDate}</Text>
                        </TouchableOpacity>}
                    </View>
                    <View style={{ flexDirection: "row", }}>
                        <View style={[style.imgStyleRounded, { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 50, overflow: 'hidden' }]}>
                            <Image
                                style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }}
                                source={{ uri: this.state.publisher_profile_photo?.includes('https') ? this.state.publisher_profile_photo : 'https://foh.nninternationals.com/wp-content/plugins/ultimate-member/assets/img/default_avatar.jpg' }}
                            />
                        </View>
                        {/* <Image
                            source={{ uri: this.state.publisher_profile_photo }}
                            // source={require("../../../assets/images/StacyMartinRounded.png")}
                            resizeMode={'contain'} style={style.imgStyleRounded} /> */}
                        <View>
                            <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular, marginTop: 10 }}>Listed by: </Text>
                            <Text style={{ fontSize: 20, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, fontWeight: "bold", width: '50%' }}>
                                {/*{"Stacy Martin - Realtor"}*/}
                                {this.state.publisher_name} - <Text>{this.state.ListedBy == 'um_lender' ? 'lender' : this.state.ListedBy == 'um_realtor' ? 'realtor' : this.state.ListedBy == 'um_builder' ? 'builder' : this.state.ListedBy == 'um_for-sale-by-owner' ? 'Sale by owner' : ''}</Text>
                            </Text>
                            <Text style={{ fontSize: 14, color: "#707071", fonFamily: fonFamily.Regular }}>
                                {/*{"stacy.martin@realestateconcepts.net"}*/}
                                {this.state.publisher_email}
                            </Text>
                            <Text style={{ fontSize: 14, color: "#005271", fonFamily: fonFamily.Regular }}>
                                {this.state.publisher_phone_number}
                                {/* {this.state.publisher_address} */}
                                {/*{"(515) 681-8876 | Ankeny, IA 50023"}*/}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"Open House Type"}</Text>
                        <Text style={{ fontSize: 16, marginStart: 20, color: "#005271", marginTop: 10, fontFamily: fonFamily.Light, }}>{this.state.open_house_type}</Text>
                    </View>
                    <Text style={{ fontSize: 18, color: "#005271", fonFamily: fonFamily.Light, marginStart: 20 }}>
                        {/* {this.state.open_house_type+" | "+this.state.open_house_street_address} */}
                        {this.state.open_house_street_address}
                        {/*{"Street Address | City, State, Zip"}*/}
                    </Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold", marginBottom: 10 }}>{"Get Directions:"}</Text>
                    <MapView
                        ref={ref => (this.mapView = ref)}
                        //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={style.map}
                        loadingEnabled={true}
                        loadingIndicatorColor={'#606060'}
                        loadingBackgroundColor={'#ffffff'}
                        zoomEnabled={true}
                        showsUserLocation={true}
                        // onMapReady={this.goToInitialRegion.bind(this)}
                        //followUserLocation={true}
                        initialRegion={this.state.initialRegion}
                        region={this.state.initialRegion}
                    //minZoomLevel={20}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: parseFloat(this.state.latitude),
                                longitude: parseFloat(this.state.longitude)
                            }}
                            title={this.state.address}
                        >
                            <Image source={require('../../../assets/images/pin.png')} style={{ width: 50, height: 50 }} resizeMode={'contain'} />
                        </MapView.Marker>
                    </MapView>
                    <Text style={{ fontSize: 20, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"Open House Dates"}</Text>
                    <View style={{ width: '100%', height: 2, backgroundColor: "#707071", marginTop: 10 }} />
                    {/*<Text style={{fontSize:20,marginStart: 20,color:"#00B7B0",fontFamily:fonFamily.Bold,marginTop:5,fontWeight:"bold"}}>{"Description:"}</Text>
                    <Text style={{fontSize:22,marginStart: 20,color:"#005271",fontFamily:fonFamily.Regular}}>
                        {"Property Description"}
                    </Text>*/}
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"Start Time"}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{this.state.startTime}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"End Time"}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{this.state.endTime}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"Description"}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{this.state.propertyDescription}</Text>
                    <Text style={{ fontSize: 20, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"Details:"}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>
                        {this.state.no_of_bedrooms +
                            " Bedrooms | " + this.state.no_of_bathroom +
                            " Bathrooms "}
                        {/*{"Bedrooms | Bathrooms | Square Ft."}*/}
                    </Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{this.state.property_price.includes('$') ? "Property Price:\t " + this.formatter.format(this.state.property_price) : "Property Price:\t " + `${this.formatter.format(this.state.property_price)}`}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{"Lot Size:\t " +  this.formatter1.format(this.state.lot_size)}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{"Basement:\t" + this.state.basement}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{"Year Built:\t " + this.state.year_built}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#00B7B0", fontFamily: fonFamily.Bold, marginTop: 5, fontWeight: "bold" }}>{"Features:"}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{'Amenities:\t' + this.state.other_amenities}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular }}>{'Views:\t' + this.state.views}</Text>
                    <Text style={{ fontSize: 18, marginStart: 20, color: "#005271", fontFamily: fonFamily.Regular, marginBottom: 20 }}>{'Keywords:\t' + this.state.keywords}</Text>
                    {/*<Text style={{fontSize:22,marginStart: 20,color:"#005271",fontFamily:fonFamily.Regular}}>{"Amenities"}</Text>*/}
                    {/*   <Text style={{fontSize:22,marginStart: 20,color:"#005271",fontFamily:fonFamily.Regular}}>{"Views"}</Text>
                    <Text style={{fontSize:22,marginStart: 20,color:"#005271",fontFamily:fonFamily.Regular}}>{"School District"}</Text>
                    <Text style={{fontSize:22,marginStart: 20,color:"#005271",fontFamily:fonFamily.Regular,marginBottom:10}}>{"Keywords"}</Text>*/}
                    <View style={{}}>
                        <Slideshow
                            dataSource={this.state.dataSource}
                            position={this.state.position}
                            onPositionChanged={position => this.setState({ position })} />
                    </View>
                    {/* <View>
                        <Video style={[style.StudioImages,{width: '100%', height: 200,borderColor:"white",borderWidth:3}]}
                               source={{uri: "."}}
                               ref={(ref) => {
                                   this.musicPlayer = ref
                               }}
                               paused={this.state.isPlaying}
                               playInBackground={false}
                               playWhenInactive={false}
                               progressUpdateInterval={200}
                               repeat={false}
                               resizeMode={"cover"}
                               ignoreSilentSwitch={"ignore"}
                               onBuffer={(data) => {
                                   // console.log("Music onBuffer()", JSON.stringify(data))
                               }}
                               onError={(data) => {
                                   console.log("Music onError()", JSON.stringify(data))
                               }}/>
                    </View> */}
                    <View style={{ height: 60, backgroundColor: "white", justifyContent: "center", alignItems: "center", }}>
                        <Text style={style.txtFormate}>{"Virtual Tour"}</Text>
                    </View>
                    <Image source={this.state.floorPlan ? { uri: this.state.floorPlan } : require("../../../assets/images/sketch.png")} resizeMode={"cover"} style={style.sktchImg} />
                    <View style={{ height: 60, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                        <Text style={style.txtFormate}>{"Floor Plan"}</Text>
                    </View>
                    {this.state.userData == undefined ?
                        <TouchableOpacity onPress={() => {
                            this.state.userData == undefined ?
                                // SimpleToast.show('Login first') 
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
                                )
                                :
                                this.props.navigation.navigate("MessageStacy", {
                                    phone: this.state.phone,
                                    propertyId: this.state.propertyId
                                })
                        }} style={{ height: 60, backgroundColor: "#EF4867", justifyContent: "center", alignItems: "center", flex: 1, margin: 20 }}>
                            {/* {"CONTACT " + this.state.publisher_name} */}
                            <Text style={[style.txtFormate, { color: "white", width: '95%', textAlign: 'center' }]}>{"CONTACT"}</Text>
                        </TouchableOpacity>
                        :
                        this.state.propertyPostAuthorId !== this.state.userData.id && <TouchableOpacity onPress={() => {
                            this.state.userData == undefined ?
                                // SimpleToast.show('Login first') 
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
                                )
                                :
                                this.props.navigation.navigate("MessageStacy", {
                                    phone: this.state.phone,
                                    propertyId: this.state.propertyId
                                })
                        }} style={{ height: 60, backgroundColor: "#EF4867", justifyContent: "center", alignItems: "center", flex: 1, margin: 20 }}>
                            {/* {"CONTACT " + this.state.publisher_name} */}
                            <Text style={[style.txtFormate, { color: "white", width: '95%', textAlign: 'center' }]}>{"CONTACT"}</Text>
                        </TouchableOpacity>
                    }
                    {/* { this.state.propertyPostAuthorId !== this.state.userData.id && <TouchableOpacity onPress={() => {
                        this.state.userData == undefined ?
                            // SimpleToast.show('Login first') 
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
                            )
                            :
                            this.props.navigation.navigate("MessageStacy", {
                                phone: this.state.phone,
                                propertyId: this.state.propertyId
                            })
                    }} style={{ height: 60, backgroundColor: "#EF4867", justifyContent: "center", alignItems: "center", flex: 1, margin: 20 }}>
                        {"CONTACT " + this.state.publisher_name}
                        <Text style={[style.txtFormate, { color: "white", width: '95%', textAlign: 'center' }]}>{"CONTACT"}</Text>
                    </TouchableOpacity>} */}
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
                {this.state.ChooseFolder &&
                    <Modal onBackButtonPress={() => { this.setState({ ChooseFolder: false }) }} isVisible={this.state.ChooseFolder}>
                        <View style={{ height: 350, width: "100%", backgroundColor: "white", padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#005271', fontWeight: 'bold' }}>SELECT FOLDER</Text>
                                <TouchableOpacity onPress={() => this.setState({ ChooseFolder: false })}>
                                    <Image style={{ resizeMode: "contain", width: 20, height: 20, tintColor: '#005271' }} source={require('../../../assets/images/close.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: '45%', justifyContent: "center" }}>
                                {this.state.ExistingFolderList.length > 0 ? <FlatList
                                    data={this.state.ExistingFolderList}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity onPress={() => this.setState({ showExistingFolder: false }, () => {
                                                this.AddBookmarksExistingFolder(item.folder_key)
                                            })}
                                                style={style.searchSection}>
                                                <Image style={[style.searchIcon, { resizeMode: 'contain', marginLeft: 20 }]} source={item.type == 'public' ? require('../../../assets/images/folder.png') : require('../../../assets/images/padlock.png')} />
                                                <Text style={style.input}>{item.title}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                /> :
                                    <Text>There is no any existing folder in your list</Text>
                                }
                            </View>
                            <TouchableOpacity style={[style.searchSection, { marginVertical: 20 }]}>
                                <TextInput
                                    style={style.input2}
                                    placeholder="Folder Name"
                                    placeholderTextColor={'#EDEDED'}
                                    value={this.state.newFolderName}
                                    onChangeText={(searchString) => { this.setState({ newFolderName: searchString }) }}
                                // underlineColorAndroid="transparent"
                                />
                                <Image style={[style.searchIcon2, { resizeMode: 'contain', }]} source={require('../../../assets/images/close.png')} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 2, marginRight: 25 }}>
                                <TouchableOpacity onPress={() => this.setState({ isPrivate: !this.state.isPrivate })} style={{ flexDirection: 'row', justifyContent: 'center', height: 50, alignItems: "center" }}>
                                    <Image style={{ resizeMode: 'contain', width: 20, height: 20, }} source={this.state.isPrivate ? require('../../../assets/images/check_box.png') : require('../../../assets/images/check_box_unselected.png')} />
                                    <Text style={{ fontWeight: 'bold', color: '#005271', marginLeft: 10 }}>Private</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.CheckFolderName()} style={{ backgroundColor: '#DEB887', height: 50, paddingHorizontal: 20, justifyContent: 'center', borderWidth: 1, borderRadius: 5, borderColor: '#005271' }}>
                                    <Text style={{ fontWeight: 'bold', color: '#005271', textAlign: 'center', color: 'white' }}>Create</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                }

            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    imgStyle: {
        width: "100%",
        height: "100%"
    },
    imgStyleRounded: {
        height: 130,
        width: 130,
        // borderRadius:130/2,
        borderRadius: 65,
        marginTop: -30,
        marginStart: 10,
    },
    map: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
        width: '100%'
    },
    txtFormate: {
        fontSize: 20,
        color: "#00B7B0",
        fontFamily: fonFamily.SemiBold
    },
    sktchImg: {
        width: "100%",
        height: 300
    },
    StudioImages: {
        position: 'absolute',
        right: 0,
        height: "100%",
        width: "100%",
    },
    imgHeart: {
        // width:25,
        // height:25,
        position: "absolute",
        right: 20,
        top: 10,
        tintColor: "white",

    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '90%',
        marginVertical: 13,
        height: 50,
        borderWidth: 1,
        borderColor: '#EDEDED'
    },
    searchSection2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '50%',
        marginVertical: 13,
        height: 50,
        borderWidth: 1,
        borderColor: '#EDEDED',
        justifyContent: "space-between"
    },
    searchIcon: {
        padding: 10,
        width: 10,
        height: 10,
        tintColor: '#005271'
    },
    input: {
        // flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        color: '#005271',
        fontWeight: "bold"
    },
    input2: {
        // flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        color: '#005271',
        fontWeight: "bold",
        width: '90%'
    },
    searchIcon2: {
        paddingVertical: 10,
        width: 10,
        height: 10,
        tintColor: 'gray'
    },



});

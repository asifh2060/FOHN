import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Alert } from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window');
import Preference from 'react-native-preference';
import SimpleToast from "react-native-simple-toast";
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";
import Geolocation from '@react-native-community/geolocation';
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'





export default class save_search extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoadingMap: false,
            userData: Preference.get("userData", ""),
            nearByLocations: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.162369,74.183083&radius=1000&type=gas_station&key=AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8",
            markers: [
                {
                    coordinates: {
                        latitude: 41.989688,
                        longitude: -91.688575
                    },
                },
                {

                    coordinates: {
                        latitude: 41.991786,
                        longitude: -91.685215
                    },

                },
                {
                    coordinates: {
                        latitude: 41.09880,
                        longitude: -91.688498
                    },
                },
                {
                    coordinates: {
                        latitude: 41.39330,
                        longitude: -91.688498
                    },
                },
                {
                    coordinates: {
                        latitude: 41.59330,
                        longitude: -91.688498
                    },
                },
                {
                    coordinates: {
                        latitude: 41.59330,
                        longitude: -91.688498
                    },
                }
            ],
            initialRegionNearLocation: {
                latitude: 41.987040,
                longitude: -91.686981,
                latitudeDelta: 1.015,
                longitudeDelta: 0.3121

            },
            lat: '',
            long: '',
            loading: false,
            propertyList: [],
            FolderKey: '',
            propertyIds: [],
            appThemeMode: 'light'

        }
        Geolocation.getCurrentPosition((info) => {
            console.log('my location current lat long======>', info)
            this.setState({ lat: info.coords.latitude, long: info.coords.longitude }, () => {
            });
            this.setState({
                initialRegionNearLocation: {
                    ...this.state.initialRegionNearLocation,
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                },
            })
            //   this.state.markers.push(`coordinates:{latitude: ${info.coords.latitude},longitude: ${info.coords.longitude}}`);
        },
            (error) => {
                // this.setState({ error: error.message })
                console.log('my error message in location===>', error.message)
            },
            { timeout: 500, },
        );
    }
    componentWillMount() {
        if (this.focusListener) {
            this.focusListner = null;
        }
    }

    componentDidMount = async () => {
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
        this.getBookmarksFolders();
        const { navigation } = this.props;
        this.focusListner = navigation.addListener('didFocus', () => {
            this.getBookmarksFolders()
        })

        if (this.state.userData) {
            this.getBookmarksFolders()
        }
        else {
            // SimpleToast.show('Login first to get your saved properties');
        }

    }

    // componentDidMount = () => {
    //     if (this.state.userData) {
    //         this.getBookmarks()
    //     }
    //     else {
    //         SimpleToast.show('Login first to get your saved properties');
    //     }

    // }



    getBookmarks = () => {
        const details = {
            user_id: this.state.userData.id,
            folder_key: this.state.FolderKey
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
        fetch(API.GET_BOOKMARKS_BY_FOLDERS, {
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
                let tempArray = response.body.bookmarks, array = [], tempArray2 = []
                for (let i = 0; i < tempArray.length; i++) {
                    if (tempArray[i].lat == "") {
                    }
                    else {
                        array.push(tempArray[i]);
                        tempArray2.push(tempArray[i].id)
                    }

                }
                console.log(array)
                this.setState({ propertyList: array, propertyIds: tempArray2 })
            } else {
                Alert.alert(
                    null,
                    'get bookmarks',
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show(response.message);
                // SimpleToast.show('get bookmarks');
            }
            this.setState({ loading: false });
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }


    getBookmarksFolders = () => {
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
                this.setState({ FolderKey: response.body[0].folder_key }, () => {
                    console.log('my state data===:>?', this.state.FolderArray)
                    this.getBookmarks()
                })
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
                // SimpleToast.show('get bokmarks folder');
            }

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }



    leftAction() {

    }
    rightAction() {

    }
    CheckUserData = () => {
        if (this.state.propertyIds.length == 0) {
            Alert.alert(
                null,
                'select property to share',
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('select property to share');
            return
        }
        if (this.state.userData) {
            this.props.navigation.navigate('sharing_open_house', {
                propertyIds: this.state.propertyIds
            })
        }
        else {
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
            // SimpleToast.show('Please Login first to share your property')
        }
    }
    render() {
        const { appThemeMode } = this.state

        return (
            <ScrollView style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                <View>
                    <Header
                        leftAction={this.leftAction.bind(this)}
                        rightAction={this.rightAction.bind(this)}
                        HeaderColor={'#00B7B0'}
                        centerComponent={"SAVED OPEN HOUSES"}
                        bottomBorderColor={"#EF4867"}

                    />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('saved_open_houses') }}>
                            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.CheckUserData() }}>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Sharing</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        <MapView
                            ref={ref => (this.mapView = ref)}
                            //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={style.map}
                            loadingEnabled={true}
                            loadingIndicatorColor={'#606060'}
                            loadingBackgroundColor={'#ffffff'}
                            maxZoomLevel={20}
                            zoomEnabled={true}
                            // showsUserLocation={true}
                            // onMapReady={this.goToInitialRegion.bind(this)}
                            // followUserLocation={true}
                            initialRegion={this.state.initialRegionNearLocation}
                        // region={this.state.initialRegionNearLocation}
                        >

                            {
                                // this.state.propertyList.length > 0 &&
                                this.state.propertyList.map(marker => (
                                    <MapView.Marker
                                        coordinate={{ latitude: parseFloat(marker?.location.lat), longitude: parseFloat(marker?.location.lng) }}
                                        title={marker.post_title}
                                        // onPress={() => { this.props.navigation.navigate("OpenHouseTitle", {
                                        //     propertyId:marker.id,
                                        // })}}
                                        onCalloutPress={() => {
                                            this.props.navigation.navigate("OpenHouseTitle", {
                                                propertyId: marker.id,
                                            })
                                        }}

                                    >
                                        <Image source={require('../../../assets/images/pin.png')} style={{ width: 30, height: 30 }} resizeMode={'contain'} />
                                    </MapView.Marker>
                                ))

                                //    this.state.markers.map(marker => (
                                //        <MapView.Marker
                                //            coordinate={marker.coordinates}
                                //            // coordinate={marker.geometry.location}
                                //            title={marker.title}
                                //            onPress={()=>{this.props.navigation.navigate("saved_open_houses")}}>
                                //            {
                                //                console.log('markers:',marker)
                                //            }
                                //            <Image source={require('../../../assets/images/red_heart.png')} style={{width:20,height:20}} resizeMode={'contain'} />
                                //        </MapView.Marker>
                                //    ))
                            }
                        </MapView>
                    }
                </View>
                <ProgressBar visible={this.state.loading} />
            </ScrollView>
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

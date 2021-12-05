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
    SafeAreaView,
    Platform,
    FlatList,
    Alert
} from 'react-native'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window');
import fontFamily from './../../../assets/fonts'
import RangeSlider from 'rn-range-slider';
import CheckBox from '@react-native-community/checkbox';
import RoundCheckbox from 'rn-round-checkbox';
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SimpleToast from "react-native-simple-toast";
import Permissions, { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Preference from "react-native-preference";
import moment from 'moment';
import RNSettings from 'react-native-settings';
import axios from 'axios';
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'

export default class search extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isLoadingMap: false,
            isPrice: false,
            isHome: false,
            toggleCheckBox: 'false',
            setToggleCheckBox: 'false',
            propertyList: [],
            value1: true,
            value2: true,
            value3: true,
            // nearByLocations: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.162369,74.183083&radius=1000&type=gas_station&key=AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8",
            markers: [],
            // initialRegionNearLocation: {
            //     latitude: '',
            //     longitude: '',
            //     // latitude: null,
            //     // longitude: null,
            //     latitudeDelta: '',
            //     longitudeDelta: ''
            // },
            initialRegionNearLocation: {
                latitude: 47.2082023,
                longitude: -121.0767284,
                // latitude: null,
                // longitude: null,
                latitudeDelta: 1.015,
                longitudeDelta: 0.3121
            },
            lat: '',
            long: '',
            maxKm: 20,
            showList: false,
            showMap: true,
            BackUpArray: [],
            rangeLow: 50,
            rangeHigh: 2000,
            isFromFilter: false,
            StreetAddress: '',
            propertyIdsList: [],
            sliderValue: 'Any',
            isFromDraw: false,
            appThemeMode: 'light',
            polylines:[]

        }
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
        let checkConst;
        let platformConst = Platform.OS;
        if (platformConst === 'ios') {
            checkConst = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        } else {
            checkConst = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        }

        Permissions.request(checkConst).then(result => {
            console.log('cehck result in the permission===>', result);
            if (result == 'granted') {
                this.getLocation();
            }

        });
        this.getLocation();
        //this.getPropertyByLocationApi();
        const { navigation } = this.props;
        // this.focusListner = navigation.addListener('didFocus', () => {
        //     this.getPropertyByLocationApi()
        // })

        // alert("sdfdsgsd")
    }

    getLocation = () => {
        Geolocation.getCurrentPosition((info) => {
            console.log('my location current lat long======>', info)
            // alert('my location current lat long======>', JSON.stringify(info) )

            this.setState({ lat: info.coords.latitude, long: info.coords.longitude }, () => {
                this.getPropertyByLocationApi()
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
                    // alert(`${error.message} Please try again`)
                    this.getLocation();
                }
                // this.setState({ error: error.message })

                // if (error.code == '2') {
                //     alert(`${error.message} Please turn on your location`)
                // }
                // if (error.code == '3') {
                //     alert(`${error.message} Please try again`)
                // }
            },
            // { enableHighAccuracy: true, timeout: 100000,maximumAge: 10000},
            { enableHighAccuracy: true, timeout: 100000, },
        );
    }



    updateIsFromFilter = () => {
        this.setState({ isFromFilter: true });
    }
    updateIsFromDraw = (polylines) => {
 
        this.setState({ isFromDraw: true,polylines:[...polylines] },()=>{
            this.getPropertyByLocationApi()
        });
  
    }

    applyFilter = (data) => {
        let myNewObject = { ...data, 'ids': this.state.propertyIdsList };
        console.log('checking data from filters====>', myNewObject);
        const details = myNewObject;
        this.setState({ loading: true });

        var requestPramas = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        console.log("RequestSent: ", JSON.stringify(requestPramas))
        console.log("API.FILTER_OPEN_HOUSE",API.FILTER_OPEN_HOUSE)
        fetch(API.FILTER_OPEN_HOUSE, {
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
            console.log('getfilterApi Response:=====> ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({ propertyList: response.body, BackUpArray: response.body, isFromFilter: false })
            }
            else if (response.status === "404") {
                this.setState({ propertyList: [], isFromFilter: false })
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

        }).catch(error => {
            this.setState({ loading: false, isFromFilter: false });
            console.log('ApiError:', error);
        });

    }

    getPropertyByLocationApi = () => {
        console.log("calling")
  
        if (this.state.isFromFilter) {
            return
        }

        console.log('my gtrrrtfhy jkhkhkkj', this.state.isFromDraw)
        let locations = [];
        const userData = Preference.get('userData');
        if (this.state.lat == '' && this.state.long == '') {
            // SimpleToast.show('Select location to search')
            return
        }


  
        
        let locationSet = {
            "latitude": this.state.lat,
            "longitude": this.state.long,
            //"latitude": 31.4889023,
            //"longitude": 74.3161039,
            "max_km": 100
        }

       

        try {
            if(this.state.polylines.length){
                this.state.polylines[0].coordinates.forEach((e)=>{
                    if(e){
                        locations.push({ 
                        "latitude": e.latitude,
                        "longitude": e.longitude,
                         "max_km": 10
                       })
                    }
                })
            }else{
                locations.push(locationSet);
            }
        } catch (error) {
            console.log(error)
        }
   

           
        
        
      
        // const details = {
        //     lat: this.state.lat,
        //     lng: this.state.long,
        //     max_km: this.state.maxKm,
        //     login_user_id: userData ? userData.id : ''

        // };
        this.setState({
            loading: true
        })
        //console.log("Params: ", JSON.stringify(details))
        // var requestPramas = []

        // for (var property in details) {
        //     var encodedKey = encodeURIComponent(property);
        //     var encodedValue = encodeURIComponent(details[property]);
        //     requestPramas.push(encodedKey + "=" + encodedValue);
        // }
        // requestPramas = requestPramas.join("&");
        let data = {
            locations: locations
        }
        console.log("here>>>>>>>>>>",this.state)

        console.log("\n\n\nParamsSEt: ", JSON.stringify(data))
        // alert("ParamsSEt: ", JSON.stringify(data))

        fetch(API.GET_PROPERTY_BY_LOCATION, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(data),
        }).then(response => {
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            console.log(response);
            this.setState({ isFromFilter: false, isFromDraw: false })
            // console.log('getPropertyByLocationApiResponse: ' + JSON.stringify(response));
            if (response.status === "200") {
                // alert(JSON.stringify(response.body))
                let tempArray = response.body, array = []
                for (let i = 0; i < tempArray.length; i++) {

                    if (tempArray[i].location.lat == "") {

                    }
                    else {
                        array.push(tempArray[i])
                    }

                }
                // console.log("SavedProperties", array)
                this.setState({ propertyList: array, BackUpArray: array,loading:false })
               return this.state.BackUpArray.map((item) => {
                    this.state.propertyIdsList.push(item.id);
                })
                //alert(JSON.stringify(this.state.propertyList))
                // this.setState({ propertyList: response.body });

            }
            else if (response.status === "404") {
                this.setState({ propertyList: [],loading:false });
                // SimpleToast.show(response.message)
              return Alert.alert(
                    null,
                    'No results found, try zooming out or changing your filters',
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('No property found')

            }

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            }).finally(()=>{
                this.setState({ loading: false,isFromDraw:false });
            });
    }
    renderItem(item) {
        const { appThemeMode } = this.state
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate("OpenHouseTitle", {
                    propertyId: item.id,
                })
            }} style={{ width: "100%", marginTop: 10, backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }}>
                <Image source={{ uri: item.thumbnail_url }} style={style.maimImg} resizeMode={"cover"} />
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate("OpenHouseTitle", {
                        propertyId: item.id,
                    })

                }} style={{ backgroundColor: "white", height: 40, width: "50%", position: 'absolute', top: 0, justifyContent: "center", }}>
                    {/* <Text style={{color:"#00B7B0",fontSize:16,fontWeight:"bold"}}>{"Open "+item.openFrom}</Text> */}
                    <Text style={{ color: "#00B7B0", fontSize: 16, fontWeight: "bold", paddingLeft: 10 }}>{"Open " + moment(item.post_date).format("MM-DD-YYYY")}</Text>
                </TouchableOpacity>
                <Image source={item.isFavorite == '1' ? require('../../../assets/images/heart.png') : require('../../../assets/images/unselected_heart.png')} resizeMode={"contain"} style={[style.imgHeart, { tintColor: item.isFavorite == '1' && 'white' }]} />

                <View style={{ marginStart: 20, marginTop: 10, flexDirection: "row" }}>
                    {/* <Text style={{fontSize:16,fontFamily:fontFamily.Bold,color:"#707070"}}>{item.post_title}</Text> */}
                    <Text style={{ fontSize: 18, fontWeight: '900', color: "#707070" }}>{item.Property_Price.includes('$') ? item.Property_Price : '$' + item.Property_Price}{'  '}</Text>
                    {/* <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",marginLeft:20,flex:1}}>{item.post_content}</Text> */}
                    <Text style={{ fontSize: 12, fontFamily: fontFamily.Bold, color: "#707070", alignSelf: "center" }}>{item.no_of_bedrooms ? item.no_of_bedrooms + ' beds' : 0 + " beds"}{'  '}</Text>
                    <Text style={{ fontSize: 12, fontFamily: fontFamily.Bold, color: "#707070", alignSelf: "center" }}>{item.no_of_bathroom ? item.no_of_bathroom + ' bath' : 0 + " bath"} {' '}</Text>
                    <Text style={{ fontSize: 12, fontFamily: fontFamily.Bold, color: "#707070", alignSelf: "center" }}>{item.square_feet + " sq ft"} {' '}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "100", color: "#707070", flex: 1, marginStart: 20 }}>{item.open_house_street_address}</Text>
                <TouchableOpacity style={{ flexDirection: "row", marginStart: 20, alignItems: "center", marginBottom: 10 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 1, backgroundColor: "#EB5E3E" }}></View>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "#707070", flex: 1, marginStart: 5 }}>House for sale</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, height: 7, backgroundColor: "#EF4867" }}></View>
            </TouchableOpacity>
        )
    }


    HomeTypePress = (value1, value2, value3, value4, value5, value6) => {
        this.setState({ isHome: false, loading: true });
        let FilterArray = [];
        this.state.BackUpArray.map((item, index) => {
            if (value1 == true && item.open_house_type === 'House') {
                FilterArray.push(item);
            }
            if (value2 == true && item.open_house_type == 'Condo') {
                FilterArray.push(item);
            }
            if (value3 == true && item.open_house_type == 'Townhome') {
                FilterArray.push(item);
            }
            if (value4 == true && item.open_house_type == 'Acreage') {
                FilterArray.push(item);
            }
            if (value5 == true && item.open_house_type === 'Lots/Land') {
                FilterArray.push(item);
            }
            if (value6 == true && item.open_house_type === 'Apartment') {
                FilterArray.push(item);
            }

        });
        this.setState({ propertyList: FilterArray }, () => {
            if (this.state.propertyList.length == 0) {
                Alert.alert(
                    null,
                    'No results found, try zooming out or changing your filters',
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('No property found')
            }
            this.setState({ loading: false });
        }


            // console.log('my filter properties==>',this.state.propertyList);
        )
    }

    PricePress = (low, high) => {
        console.log('PriceRange ', JSON.stringify(low + '--' + high));
        low = low * 1000;
        high = high * 10000
        console.log('PriceRange ', JSON.stringify(low + '--' + high));
        this.setState({ isPrice: false, loading: true }, () => {
            let FilterArray = [];
            this.state.BackUpArray.map((item, index) => {
                if (item.Property_Price >= low && item.Property_Price <= high) {
                    FilterArray.push(item);
                }
            });
            this.setState({ propertyList: FilterArray }, () => {
                if (this.state.propertyList.length == 0) {
                    Alert.alert(
                        null,
                        'No results found, try zooming out or changing your filters',
                        [

                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    )
                    // SimpleToast.show('No property found')
                }
                this.setState({ loading: false });
            }

            );
            // console.log('my filter properties==>',this.state.propertyList);
        });

    }

    getPropertyByPolygonSearch = (latitude, longitude) => {

        const details = {
            latitudes: latitude,
            longitudes: longitude

        };
        this.setState({
            loading: true
        })

        axios.post(API.GET_POLYGON_SEARCH, details, {
            headers: {
                'content-type': 'application/json',
            },
        }).then(response => {
            console.log('my response ====>', response.data);
            this.setState({ isFromDraw: false })
            if (response.data.status === "200") {
                // console.log(array)
                this.setState({ propertyList: response.data.body, BackUpArray: response.data.body })
                this.state.BackUpArray.map((item) => {
                    this.state.propertyIdsList.push(item.id);
                })

            }
            else if (response.data.status === "404") {
                this.setState({ propertyList: [] });
                // SimpleToast.show(response.message)
                Alert.alert(
                    null,
                    'No results found, try zooming out or changing your filters',
                    [

                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show('No property found')

            }
            this.setState({ loading: false });
        })

        // .catch(error => {
        //     this.setState({ loading: false });
        //     console.log('ApiError:', error);
        // });

    }


    valueFormatter = (value) => {
        if (value < 1000) {
            value = value * 1000;
            value /= 1000;
            return value.toFixed(0) + ' K'
        }
        else if (value <= 1000) return '1.0 M'
        else if (value <= 1025) return '1.5 M'
        else if (value <= 1050) return '2.0 M'
        else if (value <= 1075) return '2.5 M'
        else if (value <= 1100) return '3.0 M'
        else if (value <= 1125) return '3.5 M'
        else if (value <= 1150) return '4.0 M'
        else if (value <= 1175) return '4.5 M'
        else if (value <= 1200) return '5.0 M'
        else if (value <= 1225) return '5.5 M'
        else if (value <= 1250) return '6.0 M'
        else if (value <= 1275) return '6.5 M'
        else if (value <= 1300) return '7.0 M'
        else if (value <= 1325) return '7.5 M'
        else if (value <= 1350) return '8.0 M'
        else if (value <= 1375) return '8.5 M'
        else if (value <= 1400) return '9.0 M'
        else if (value <= 1425) return '9.5 M'
        else if (value <= 1450) return '10.0 M'
        else if (value <= 1475) return '10.5 M'
        else if (value <= 1500) return '11.0 M'
        else if (value <= 1525) return '11.5 M'
        else if (value <= 1550) return '12.0 M'
        else if (value <= 1575) return '12.5 M'
        else if (value <= 1600) return '13.0 M'
        else if (value <= 1625) return '13.5 M'
        else if (value <= 1650) return '14.0 M'
        else if (value <= 1675) return '14.5 M'
        else if (value <= 1700) return '15.0 M'
        else if (value <= 1725) return '15.5 M'
        else if (value <= 1750) return '16.0 M'
        else if (value <= 1775) return '16.5 M'
        else if (value <= 1800) return '17.0 M'
        else if (value <= 1825) return '17.5 M'
        else if (value <= 1850) return '18.0 M'
        else if (value <= 1875) return '18.5 M'
        else if (value <= 1950) return '19.0 M'
        else if (value <= 1975) return '19.5 M'
        else if (value <= 2000) return '20.0 M'
    }

    renderPrice = () => {
        const { rangeLow, rangeHigh, appThemeMode } = this.state
        return (
            <View style={{ backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black, }}>
                <View style={style.priceCont}>
                    <Text style={[style.priceTxt, { color: appThemeMode === 'light' ? Colors.black : Colors.white }]}>Price Range </Text>
                    <Text style={style.resultTxt}>(Results)</Text>
                </View>
                <View style={style.priceGetTxtCont}>
                    <Text style={[style.priceTxt, { color: appThemeMode === 'light' ? Colors.black : Colors.white }]}>Price: </Text>
                    <Text style={[style.priceTxt, { color: 'gray' }]}>{`${this.valueFormatter(rangeLow)} - ${this.valueFormatter(rangeHigh)}`}</Text>
                </View>
                <View style={style.arrowBackWhite} />
                <View style={style.arrowCont} >
                    <View style={style.arrowLeftLine} />
                    <View style={style.arrowRightLine} />
                </View>
                <RangeSlider
                    ref={ref => this.rangeSliderRef = ref}
                    style={{ width: '95%', alignSelf: 'center', height: 70, marginTop: -20, }}
                    gravity={'center'}
                    min={50}
                    max={2000}
                    // step={20}
                    labelBackgroundColor={"#ffffff"}
                    labelBorderColor={"#000000"}
                    labelTextColor={"#000000"}
                    selectionColor={"#00B7B0"}
                    blankColor={"#828894"}
                    onValueChanged={(low, high, fromUser) => {
                        console.log('value', low, high)
                        this.setState({ rangeLow: low, rangeHigh: high })
                    }}
                    labelStyle="none"
                />
                <View style={style.priceBottomCont}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.rangeSliderRef) this.rangeSliderRef.setLowValue(50000)
                            if (this.rangeSliderRef) this.rangeSliderRef.setHighValue(20000000)
                            // this.setState({ rangeLow: 0, rangeHigh: 0 })
                        }} >
                        <Text style={style.priceRestTxt}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.PricePress(this.state.rangeLow, this.state.rangeHigh) }} style={style.priceDoneBtn}>
                        <Text style={style.priceDoneTxt}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderHome() {
        const { appThemeMode } = this.state
        return (
            <View style={{ backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }}>
                <View style={[style.priceCont, { marginBottom: 5 }]}>
                    <Text style={[style.priceTxt, { color: appThemeMode === 'light' ? Colors.black : Colors.white }]}>Home Type </Text>
                    <Text style={style.resultTxt}>(Results)</Text>
                </View>
                <View style={style.checkBoxRow}>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value1}
                            onValueChange={(newValue) => { this.setState({ value1: newValue }) }}
                        />
                        <Text style={style.checkTxt}>House</Text>
                    </View>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value2}
                            onValueChange={(newValue) => { this.setState({ value2: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Condo</Text>
                    </View>
                </View>
                <View style={style.checkBoxRow}>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value3}
                            onValueChange={(newValue) => { this.setState({ value3: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Townhome</Text>
                    </View>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value4}
                            onValueChange={(newValue) => { this.setState({ value4: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Acreage</Text>
                    </View>
                </View>
                <View style={style.checkBoxRow}>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value5}
                            onValueChange={(newValue) => { this.setState({ value5: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Lots/Land</Text>
                    </View>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value6}
                            onValueChange={(newValue) => { this.setState({ value6: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Apartment</Text>
                    </View>
                </View>
                <View style={[style.priceBottomCont, { marginTop: 10 }]}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            propertyList: this.state.BackUpArray,
                        }, () => {
                            this.setState({ isHome: false })
                        })
                    }}>
                        <Text style={style.priceRestTxt}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        // this.setState({ isHome: false })
                        this.HomeTypePress(this.state.value1, this.state.value2, this.state.value3, this.state.value4, this.state.value5, this.state.value6)
                    }} style={style.priceDoneBtn}>
                        <Text style={style.priceDoneTxt}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    radiusValue = (coordinates) => {
        console.log('my radius in the location=====>', coordinates);
        this.setState({
            // lat: lat, long: long,
            initialRegionNearLocation: {
                ...this.state.initialRegionNearLocation,
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
            },
            // maxKm: radius
        }, () => {
            let latitude = [];
            let longitude = [];
            coordinates.map((item) => {
                latitude.push(item.latitude);
                longitude.push(item.longitude);
            })
            console.log('my latitud===<', latitude);
            console.log('my latitud===<', longitude);
            this.getPropertyByPolygonSearch(latitude, longitude)
            // this.getPropertyByLocationApi()
        })
    }

    CheckSearchLocation = () => {
        const userData = Preference.get('userData');
        console.log('userdata====>', userData)
        if (userData == '' || userData == undefined) {
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
            // SimpleToast.show('please login first');
            return
        }
        if (this.state.StreetAddress == '') {
            Alert.alert(
                null,
                'search location first',
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('please search location first');
            return
        }
        if (this.state.propertyList == '') {
            Alert.alert(
                null,
                'There are no property to save',
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('there are no property to save');
            return
        }
        this.props.navigation.navigate("notification", {
            propertyList: this.state.propertyList,
            search: true,
            streetAddress: this.state.StreetAddress
        })
    }
    render() {
        const { appThemeMode } = this.state
        return (
            <View>
                <View style={[style.searchOuterCont, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ showList: !this.state.showList, showMap: !this.state.showMap })
                        }}>
                        <Text style={[style.listTxt, { color: appThemeMode === 'light' ? Colors.black : Colors.white }]}>{this.state.showMap ? 'List' : 'Map'}</Text>
                    </TouchableOpacity>
                    <View style={[style.searchCont,]}>
                        <TouchableOpacity>
                            <Image source={require('../../../assets/images/search_teal.png')}
                                resizeMode={'contain'}
                                style={style.searchImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.getPropertyByLocationApi()}>
                            <Image source={require('../../../assets/images/location_blue.png')}
                                resizeMode={'contain'}
                                style={style.searchLoc} />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={[style.filterBar, { backgroundColor: appThemeMode === 'light' ? '#00B7B0' : Colors.black }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                isPrice: true,
                                isHome: false
                            })
                        }}>
                        <Text style={style.fliterTxt}>PRICE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isPrice: false,
                            isHome: true
                        })
                    }}>
                        <Text style={style.fliterTxt}>HOME TYPE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isPrice: false,
                            isHome: false
                        })
                        this.props.navigation.navigate('MoreFilter',
                            {
                                applyFilter: this.applyFilter,
                                updateIsFromFilter: this.updateIsFromFilter,
                                location: this.state.initialRegionNearLocation
                            }
                        )
                    }}>
                        <Text style={style.fliterTxt}>MORE</Text>
                    </TouchableOpacity>
                </View>
                {this.state.isPrice === true ? this.renderPrice() : null}
                {this.state.isHome === true ? this.renderHome() : null}
                {this.state.showMap && this.state.initialRegionNearLocation.latitude !== null ?
                    <View>
                        <MapView
                            ref={ref => (this.mapView = ref)}
                            style={style.map}
                            //loadingEnabled={true}
                            //loadingIndicatorColor={'#606060'}
                            //loadingBackgroundColor={'#ffffff'}
                            // maxZoomLevel={12}
                            //minZoomLevel={6}
                            //zoomEnabled={true}
                            onRegionChangeComplete={(region) => {
                                console.log("LocationUpdated", JSON.stringify(region))
                                this.setState({
                                    initialRegionNearLocation: {
                                        ...this.state.initialRegionNearLocation,
                                        latitude: region.latitude,
                                        longitude: region.longitude,
                                        longitudeDelta: region.longitudeDelta,
                                        latitudeDelta: region.latitudeDelta

                                    },
                                })
                            }}
                            region={this.state.initialRegionNearLocation}
                            initialRegion={this.state.initialRegionNearLocation}
                        >
                            {
                                //  this.state.markers.length > 0 && this.state.markers.map(marker => (
                                this.state.propertyList.length > 0 && this.state.propertyList.map(marker => (
                                    <MapView.Marker
                                        coordinate={{ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.lng) }}
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
                                        {
                                            // console.log('markers:=========??????', this.state.propertyList)
                                        }
                                        <Image source={require('../../../assets/images/pin.png')} style={{ width: 30, height: 30 }} resizeMode={'contain'} />
                                    </MapView.Marker>
                                ))

                            }

                        </MapView>
                        <View style={{ position: 'absolute', right: 15, top: 20 }}>
                            <TouchableOpacity onPress={() => { this.CheckSearchLocation() }} style={style.circle}>
                                <Image
                                    source={require('../../../assets/images/save.png')}
                                    style={{ width: 50, height: 50 }}
                                    resizeMode={'contain'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate("DrawingMap", {
                                    handleGetProperties: this.handleGetProperties,
                                    updateIsFromDraw :(polylines)=> this.updateIsFromDraw(polylines),
                                    initialRegion: this.state.initialRegionNearLocation
                                })
                            }} style={style.circle}>
                                <Image
                                    source={require('../../../assets/images/draw.png')}
                                    style={{ width: 50, height: 50 }}
                                    resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    :

                    <FlatList
                        style={style.flatliststy}
                        data={this.state.propertyList}
                        renderItem={({ item, index }) => (
                            this.renderItem(item)
                        )}
                        extraData={this.state}
                        keyExtractor={item => item.id}
                    />

                }
                <View style={{ position: "absolute", top: 15, right: '12%', width: '65%' }}>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={2}
                        autoFocus={true}
                        returnKeyType={'search'}
                        fetchDetails={true}
                        listViewDisplayed={false}
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log('my data in the list===>', details.geometry.location);
                            // alert('my data in the list===>', details.geometry.location.lat);

                            let regionTemp = {
                                ...this.state.initialRegionNearLocation,
                                longitude: details.geometry.location.lng,
                                latitude: details.geometry.location.lat
                            };
                            this.setState({
                                initialRegionNearLocation: regionTemp,
                                lat: details.geometry.location.lat,
                                long: details.geometry.location.lng,
                                StreetAddress: details.formatted_address
                            }, () => {
                                this.getPropertyByLocationApi();
                            })

                        }}
                        query={{
                            key: 'AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8',
                            language: 'en',
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={200}
                        textInputProps={{
                            placeholderTextColor: appThemeMode === 'light' ? Colors.black : Colors.white
                        }}
                        styles={{
                            container: {
                                flex: 1,
                            },
                            textInputContainer: {
                                flexDirection: 'row',
                            },
                            textInput: {
                                backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black,
                                height: 38,
                                borderRadius: 5,
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                fontSize: 15,
                                flex: 1,
                                color: appThemeMode === 'light' ? Colors.black : Colors.white,
                            },
                            poweredContainer: {
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                borderBottomRightRadius: 5,
                                borderBottomLeftRadius: 5,
                                borderColor: '#c8c7cc',
                                borderTopWidth: 0.5,
                            },
                            powered: {},
                            listView: {},
                            row: {
                                backgroundColor: '#FFFFFF',
                                padding: 13,
                                height: 44,
                                flexDirection: 'row',

                            },
                            separator: {
                                height: 0,
                                backgroundColor: '#c8c7cc',
                            },
                            description: {},
                            loader: {
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                height: 20,
                            },
                        }}
                    />
                </View>
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
        height: height,
    },
    searchCont: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginStart: 10,
        marginEnd: 25,
        marginTop: 3,
        borderColor: '#707070',
        borderWidth: 1,
        height: 50,
        alignItems: 'center',
        width: '89%',
    },
    searchInput: {
        fontSize: 14,
        textAlign: 'center',
        height: 46,
        color: '#707071',
        width: '75%',
        fontFamily: fontFamily.Regular
    },
    searchImg: {
        width: 27,
        height: 36,
        marginEnd: 5,
        marginStart: 5,
    },
    searchLoc: {
        width: 23,
        height: 34,
        marginEnd: 5,
        marginStart: 5,
    },
    listTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Regular
    },
    fliterTxt: {
        fontSize: 20,
        color: 'white',
        fontFamily: fontFamily.Regular
    },
    filterBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#00B7B0'
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginBottom: 10,
    },
    circleTxt: {
        fontSize: 11,
        fontFamily: fontFamily.Regular,
        color: 'blue'
    },
    priceCont: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    priceTxt: {
        fontSize: 16,
        fontFamily: fontFamily.SemiBold
    },
    resultTxt: {
        color: 'gray',
        fontFamily: fontFamily.Regular
    },
    priceGetTxtCont: {
        height: 40,
        width: '70%',
        borderWidth: 1,
        borderColor: 'gray',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    triangle: {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        alignSelf: 'center',
        borderBottomColor: 'red',
        transform: [
            { rotate: '180deg' }
        ]
    },
    arrowBackWhite: {
        backgroundColor: 'white',
        width: 27,
        height: 2,
        marginTop: -1,
        alignSelf: 'center'
    },
    arrowCont: {
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: 'white'
    },
    arrowLeftLine: {
        width: 18,
        height: .8,
        backgroundColor: 'gray',
        marginTop: -6,
        marginRight: -1.9,
        transform: [{ rotate: '40deg' }]
    },
    arrowRightLine: {
        width: 18,
        height: .8,
        backgroundColor: 'gray',
        marginLeft: -1.9,
        marginTop: -6,
        transform: [{ rotate: '-40deg' }]
    },
    priceBottomCont: {
        flexDirection: 'row',
        width: '100%',
        height: 42,
        backgroundColor: '#005271',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    priceRestTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Bold,
        color: 'white'
    },
    priceDoneBtn: {
        width: 90,
        height: 34,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    priceDoneTxt: {
        color: '#005271',
        fontFamily: fontFamily.Bold,
        fontSize: 16,
    },
    checkTxt: {
        color: 'gray',
        fontFamily: fontFamily.Regular,
        fontSize: 14,
        marginLeft: 8
    },
    checkBoxRow: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 20,
    },
    checkBoxCont: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginTop: 5
    },



    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    map: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
    },
    searchOuterCont: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white'
    },
    searchCont: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginStart: 10,
        marginEnd: 25,
        marginTop: 3,
        borderColor: '#707070',
        borderWidth: 1,
        height: 46,
        alignItems: 'center',
        width: '89%',
    },
    searchInput: {
        fontSize: 14,
        textAlign: 'center',
        height: 46,
        color: '#707071',
        width: '75%',
        fontFamily: fontFamily.Regular
    },
    searchImg: {
        width: 27,
        height: 36,
        marginEnd: 5,
        marginStart: 5,
    },
    searchLoc: {
        width: 23,
        height: 34,
        marginEnd: 5,
        marginStart: 5,
    },
    listTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Regular
    },
    fliterTxt: {
        fontSize: 20,
        color: 'white',
        fontFamily: fontFamily.Regular
    },
    filterBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#00B7B0'
    },

    filterBar2: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        // padding: 8,
        backgroundColor: 'white'
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginBottom: 10,
    },
    circleTxt: {
        fontSize: 11,
        fontFamily: fontFamily.Regular,
        color: 'blue'
    },
    priceCont: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    priceTxt: {
        fontSize: 16,
        fontFamily: fontFamily.SemiBold
    },
    resultTxt: {
        color: 'gray',
        fontFamily: fontFamily.Regular
    },
    triangle: {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        alignSelf: 'center',
        borderBottomColor: 'red',
        transform: [
            { rotate: '180deg' }
        ]
    },
    arrowBackWhite: {
        backgroundColor: 'white',
        width: 27,
        height: 2,
        marginTop: -1,
        alignSelf: 'center'
    },
    arrowCont: {
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: 'white'
    },
    arrowLeftLine: {
        width: 18,
        height: .8,
        backgroundColor: 'gray',
        marginTop: -6,
        marginRight: -1.9,
        transform: [{ rotate: '40deg' }]
    },
    arrowRightLine: {
        width: 18,
        height: .8,
        backgroundColor: 'gray',
        marginLeft: -1.9,
        marginTop: -6,
        transform: [{ rotate: '-40deg' }]
    },
    priceBottomCont: {
        flexDirection: 'row',
        width: '100%',
        height: 42,
        backgroundColor: '#005271',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    priceRestTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Bold,
        color: 'white'
    },
    priceDoneBtn: {
        width: 90,
        height: 34,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    priceDoneTxt: {
        color: '#005271',
        fontFamily: fontFamily.Bold,
        fontSize: 16,
    },
    checkTxt: {
        color: 'gray',
        fontFamily: fontFamily.Regular,
        fontSize: 14,
        marginLeft: 8
    },
    checkBoxRow: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 20,
    },
    checkBoxCont: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginTop: 5
    },
    maimImg: {
        width: '100%',
        height: 180
    },
    imgHeart: {
        width: 25,
        height: 25,
        position: "absolute",
        right: 20,
        top: 10,

    },
    flatliststy: {
        marginBottom: 130
    }
});

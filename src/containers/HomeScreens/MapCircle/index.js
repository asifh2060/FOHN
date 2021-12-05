import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Dimensions,Alert,Platform } from 'react-native'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window')
import Geolocation from '@react-native-community/geolocation';
import fontFamily from './../../../assets/fonts'
var markers = [
    {
        latitude: 45.65,
        longitude: -78.90,
        title: 'Foo Place',
        subtitle: '1234 Foo Drive'
    }
];
export default class MapCircle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadingMap: false,

            isPrice: false,
            isHome: false,
            toggleCheckBox: 'false',
            setToggleCheckBox: 'false',
            value1: true,
            value2: true,
            value3: true,
            nearByLocations: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.162369,74.183083&radius=1000&type=gas_station&key=AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8",
            markers: [
                {
                    title: 'Gujranwala',
                    coordinates: {
                        latitude: 32.162369,
                        longitude: 74.183083
                    },
                },
                {
                    title: 'Lahore',
                    coordinates: {
                        latitude: 31.520370,
                        longitude: 74.358749
                    },

                },
                {
                    title: 'Sialkot',
                    coordinates: {
                        latitude: 32.520020,
                        longitude: 74.560043
                    },
                },
                {
                    title: 'Multan',
                    coordinates: {
                        latitude: 30.201920,
                        longitude: 71.453056
                    },
                },
                {
                    title: 'Faislabad',
                    coordinates: {
                        latitude: 31.411930,
                        longitude: 73.108050
                    },
                },
                {
                    title: 'Rawalpindi',
                    coordinates: {
                        latitude: 33.601921,
                        longitude: 73.038078
                    },
                }
            ],
            initialRegionNearLocation: {
                latitude: 41.5668418,
                longitude: -93.7466025,
                latitudeDelta: 0.21215,
                longitudeDelta: 0.34333
            },
            latlong: {
                latitude: 30.201920,
                longitude: 71.453056
            },
            lat: 41.5668418,
            long: -93.7466025,
            radius: 2,
            // polylines: [],
            polylines: []
        }
    }

    componentDidMount = () => {
        const currentlocation = this.props.navigation.getParam('initialRegion');
        this.setState({
            initialRegionNearLocation: {
                ...this.state.initialRegionNearLocation,
                latitude: currentlocation.latitude,
                longitude: currentlocation.longitude,
            },
            lat: currentlocation.latitude,
            long: currentlocation.longitude
        }, () => {
            console.log('new location ====', this.state.initialRegionNearLocation)
        })
    }

    componentWillMount() {
    }
    leftAction() {

    }
    rightAction() {

    }

    ApplyRadius = () => {
        if(this.state.polylines.length == 0){
            Alert.alert(
                null,
                'Please select area',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            return
        }
        const { params } = this.props.navigation.state;
        if (params) {
            const { radius,updateIsFromDraw } = params;
            if (radius && typeof radius == 'function') {
                // radius(this.state.radius, this.state.lat, this.state.long);
                radius(this.state.polylines);
            }
            if (updateIsFromDraw && typeof updateIsFromDraw == 'function') {
                // radius(this.state.radius, this.state.lat, this.state.long);
                updateIsFromDraw();
            }

            this.props.navigation.goBack()
        }
    }
    render() {

        return (
            <View>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#707071'}
                    centerComponent={"Draw Search"}
                    bottomBorderColor={"#EF4867"}

                />
                <ScrollView>
                    <View style={style.mainContainer} >
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', backgroundColor: "white", marginStart: 10, marginEnd: 10,marginTop:  Platform.OS == 'ios' ? 20 : 0 }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                                <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold', }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.ApplyRadius() }}>
                                <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                        <MapView
                            onPress={(e) => {
                                let coordinated = [... this.state.polylines]
                                // coordinated = this.state.polylines;
                                coordinated.push({
                                    // name: 'new1',
                                    latitude: e.nativeEvent.coordinate.latitude,
                                    longitude: e.nativeEvent.coordinate.longitude
                                });
                                console.log('my new value===>',coordinated)
                                this.setState({polylines: coordinated},() =>{
                                    console.log('jkhnhu',this.state.polylines)
                                })
                                this.setState({
                                    initialRegionNearLocation: {
                                        ...this.state.initialRegionNearLocation,
                                        latitude: e.nativeEvent.coordinate.latitude,
                                        longitude: e.nativeEvent.coordinate.longitude,
                                    },
                                    lat: e.nativeEvent.coordinate.latitude,
                                    long: e.nativeEvent.coordinate.longitude,
                                })
                            }}
                            style={style.map}
                            annotations={markers}
                            region={this.state.initialRegionNearLocation}
                            initialRegion={this.state.initialRegionNearLocation}
                        >

                            {this.state.polylines.length > 0 && this.state.polylines.map(polyline => (
                                <MapView.Polygon
                                    coordinates={
                                        this.state.polylines
                                    }
                                    strokeColor="#000"
                                    // fillColor="rgba(255,0,0,0.5)"
                                    fillColor="#00000020"
                                    strokeWidth={1} />
                            ))}

                            {/* <MapView.Circle
                                center={{
                                    latitude: this.state.lat,
                                    longitude: this.state.long,
                                }}
                                radius={this.state.radius * 1000}
                                strokeWidth={5}
                                strokeColor={"#EF4867"}
                            /> */}
                        </MapView>
                        {/* <View style={{ position: 'absolute', right: 15, top: 80 }}>
                            <TouchableOpacity onPress={() => { this.setState({ radius: this.state.radius + 2 }) }} style={style.circle}>
                                <Image
                                    source={require('../../../assets/images/zoom_in.png')}
                                    style={{ width: 50, height: 50 }}
                                    resizeMode={'contain'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ radius: this.state.radius - 2 }) }} style={style.circle}>
                                <Image
                                    source={require('../../../assets/images/zoom_out.png')}
                                    style={{ width: 50, height: 50 }}
                                    resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View> */}
                        <TouchableOpacity onPress={() => this.setState({ polylines: [] })} style={{ height: 60, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 14, color: '#00B7B0', fontFamily: fontFamily.SemiBold }}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        marginTop: 20,
        backgroundColor: "white"
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginBottom: 10,
    },

});

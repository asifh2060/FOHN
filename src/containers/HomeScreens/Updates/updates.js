import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, Alert } from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import SimpleToast from "react-native-simple-toast";
import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import Preference from "react-native-preference";
import moment from 'moment';
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'

export default class update extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            updateList: [],
            loading: false,
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
        this.getNotifiedProperites()
    }

    getNotifiedProperites = () => {
        const userData = Preference.get('userData');
        const details = {
            user_id: userData.id,
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
        fetch(API.GET_NOTIFIED_PROPERTIES, {
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
            console.log('getPropertyByLocationApi Response:mmn m,mlkmlkmlkmlkmklmklmlkmlkm ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({ updateList: response.body })
            }
            else if (response.status === "404") {
                Alert.alert(
                    null,
                    'No results found, try zooming out or changing your filters',
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show('No property found')

            }
            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }
    componentWillMount() { }
    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() { }
    renderItem(item) {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpenHouseTitle', {
                    propertyId: item.id,
                })} style={[style.shadowOffset, { flex: 1, marginStart: 5, marginEnd: 5, flexDirection: 'row', margin: 5, borderTopColor: 'black', borderTopWidth: 1 }]}>
                    <View style={{ flex: 1, margin: 5 }}>
                        <Image source={{ uri: item.thumbnail_url }} resizeMode={'contain'} style={{ width: 150, height: 150 }} />
                    </View>
                    <View style={style.mainContainer}>
                        <Text style={{ color: '#707071', fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>{item.post_title}</Text>
                        <Text style={{ color: '#707071', fontSize: 16, marginTop: 30 }}>{`${item.no_of_bedrooms} Beds, ${item.no_of_bathroom} Bath, ${item.square_feet} sq ft`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        const {appThemeMode}=this.state
        return (
            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    centerComponent={"UPDATES"}
                    bottomBorderColor={"#EF4867"}

                />
                <ScrollView style={style.mainContainer}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 20 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Back</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>EDIT</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ flex: 1, marginStart: 20, marginEnd: 10, marginTop: 20 }}>
                        <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>SAVED SEARCHES</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList contentContainerStyle={{ marginStart: 10, marginEnd: 10 }}
                            data={this.state.updateList}
                            renderItem={({ item, index }) => (
                                this.renderItem(item)
                            )}
                            extraData={this.state}
                            keyExtractor={item => item.id}
                        />
                        {/* <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#C9C9C9',fontSize:18,margin:10}}>{"Mark All As Read"}</Text>
                    </TouchableOpacity> */}
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
    },


});

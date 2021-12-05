import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground,Alert } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import { API } from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import ProgressBar from "../../../component/ProgressBar";
import Preference from 'react-native-preference';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'



export default class Feature_Near_You extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {

            loading: false,
            Feature_Realtor: [],
            userData: Preference.get("userData", ""),
            searchText: '',
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
        this.getLenderApi()
    }

    getLenderApi = () => {
        const details = {
            // user_email: "test15@test.com",
            user_role: "um_lender",
            login_user_id: this.state.userData ? this.state.userData.id : ''
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
        fetch(API.GET_USER_BY_ROLE, {
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
            console.log('getLenderApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({
                    Feature_Realtor: response.body.users,
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

    componentWillMount() {
    }

    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() {

    }
    FilterData = (text) => {
        if (text == '') {
            alert('Please write name to search');
            return
        }
        const details = {
            user_role: "um_lender",
            login_user_id: this.state.userData ? this.state.userData.id : '',
            keyword: text
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
        fetch(API.SEARCH_USER_BY_KEYWORD, {
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
            console.log('getRealtorApi realtor data Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({
                    Feature_Realtor: response.body.users,
                })

            } else {
                this.setState({ Feature_Realtor: [] })
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

            // SimpleToast.show(response.message);
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }
    renderItem(item) {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate("StacyMartinRealator", {
                    userId: item.id
                })
            }} style={[style.shadowOffset, { height: 270 }]}>
                <ImageBackground source={{ uri: item.profile_photo ? item.profile_photo : item.publisher_profile_photo }} style={style.listImageCont}>
                    {/* <TouchableOpacity style={style.listImgBtn}>
                        <Text style={style.btnText}>{'MY OPEN HOUSES'}</Text>
                    </TouchableOpacity> */}
                </ImageBackground>
                <View style={{ marginStart: 15, marginTop: 15, width: '41%' }}>
                    <Text style={style.listHeading}>{item.name}</Text>
                    <Text style={style.listDetail}>{item.short_description}</Text>
                    <View style={[style.listInnerItemCont, { marginTop: 20 }]}>
                        {item.billing_phone !== '' && <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/phone.png')}
                        />}
                        {item.phone !== '' && <Text style={style.listNormalText}>{item.billing_phone}</Text>}
                    </View>
                    {/* <View style={style.listInnerItemCont}>
                        {item.billing_phone !== '' && <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/smartphone.png')}
                        />}
                        {item.billing_phone !== '' && <Text style={style.listNormalText}>{item.billing_phone}</Text>}
                    </View> */}
                    <View style={style.listInnerItemCont}>
                        <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/mail.png')}
                        />
                        <Text style={style.listNormalText}>{item.email}</Text>
                    </View>
                    <View style={style.listInnerItemCont}>
                        {item.skype !== '' && <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/skype.png')}
                        />}
                        {item.skype !== '' && <Text style={style.listNormalText}>{item.skype}</Text>}
                    </View>
                    <View style={style.listSocialCont}>
                        {item.facebook !== '' && <Image resizeMode={'contain'} style={style.listSocialImg}
                            source={require('../../../assets/images/facebook.png')}
                        />}
                        {item.linkedIn !== '' && <Image resizeMode={'contain'} style={style.listSocialImg}
                            source={require('../../../assets/images/linked_in.png')}
                        />}
                        {item.twitter !== '' && <Image resizeMode={'contain'} style={style.listSocialImg}
                            source={require('../../../assets/images/twitter.png')}
                        />}
                        {/* { item.linkedIn !== '' && <Image resizeMode={'contain'} style={style.listSocialImg}
                            source={require('../../../assets/images/pinterest.png')}
                        />} */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <SafeAreaView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Featured Lenders Near You"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}>
                    <View style={style.searchCont}>
                        <TextInput placeholder={'Search'} style={style.searchInput}
                            value={this.state.searchText}
                            onChangeText={(text) => this.setState({ searchText: text })}
                        />
                        <TouchableOpacity onPress={() => this.FilterData(this.state.searchText)}>
                            <Image source={require('../../../assets/images/searchIcon.png')}
                                resizeMode={'contain'}
                                style={style.searchImg} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <FlatList contentContainerStyle={{ marginStart: 10, marginEnd: 10 }}
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

            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchCont: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginStart: 25,
        marginEnd: 25,
        marginTop: 10,
        borderColor: '#707070',
        borderWidth: 1,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchInput: {
        width: '85%',
        fontSize: 20,
        textAlign: 'center',
        height: 46,
        color: '#707071',
        fontFamily: fontFamily.Bold
    },
    searchImg: {
        width: 40,
        height: 40,
        tintColor: '#707070',
    },
    shadowOffset: {
        borderWidth: 0,
        elevation: 1.5,
        marginStart: 5,
        marginEnd: 5,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
        paddingTop: 3,
        padding: 2
    },
    listImageCont: {
        width: 170,
        resizeMode: 'contain'
    },
    listImgBtn: {
        width: '90%',
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4867',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10
    },
    btnText: {
        fontSize: 15,
        color: 'white',
        padding: 5,
        fontFamily: fontFamily.SemiBold
    },
    listHeading: {
        color: '#005271',
        fontSize: 14,
        fontFamily: fontFamily.Bold
    },
    listDetail: {
        color: '#D1AE5E',
        fontSize: 11,
        fontFamily: fontFamily.SemiBold
    },
    listInnerItemCont: {
        width: '97%',
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    listNormalText: {
        color: '#707071',
        fontSize: 12,
        fontFamily: fontFamily.SemiBold,
        marginLeft: 10
    },
    listIcon: {
        width: 12,
        height: 12,
        tintColor: 'black'
    },
    listSocialCont: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
        width: '98%',
        flexWrap: 'wrap'
    },
    listSocialImg: {
        width: 32,
        height: 32
    },
});

import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import { Calendar } from 'react-native-calendars';
import { Picker } from 'native-base';
export default class PostOpenHouse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageClick: '',
            sourceForAPI: '',
            sourceForAPITwo: '',
            sourceForAPIThree: '',
            sourceForAPIFour: '',
            sourceForAPIFive: '',
            sourceForAPISix: '',
            profileImage: '',
            profileImageTwo: '',
            profileImageThree: '',
            profileImageFour: '',
            profileImageFive: '',
            profileImageSix: '',
            isCalender: false,
            date: ""
        }
    }

    // componentWillMount() {
    //     this.getOpenHouseType()
    //     this.getCity()
    //     this.getBedroom()
    //     this.getBathroom()
    // }

    // getOpenHouseType = () => {
    //     fetch('http://findopenhouse.appcrates.co/wp-json/hma/v-1/get-taxonomies?txonomy=open_house_type', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json'
    //         },
    //     }).then((response) => {
    //         console.log('response.status', response.status)
    //         return response.json()
    //     }).then((response) => {
    //         console.log('response')
    //         if (response.body) {
    //             this.setState({ openhousetype: response.body })
    //         }
    //     }).catch((error) => {
    //         console.log('error', 'error')
    //     })
    // }
    // getCity = () => {
    //     fetch('http://findopenhouse.appcrates.co/wp-json/hma/v-1/get-taxonomies?txonomy=open_house_type', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json'
    //         },
    //     }).then((response) => {
    //         console.log('response.status', response.status)
    //         return response.json()
    //     }).then((response) => {
    //         console.log('response')
    //         if (response.body) {
    //             this.setState({ city: response.body })
    //         }
    //     }).catch((error) => {
    //         console.log('error', 'error')
    //     })
    // }
    // getBedroom = () => {
    //     fetch('http://findopenhouse.appcrates.co/wp-json/hma/v-1/get-taxonomies?txonomy=bedroom', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json'
    //         },
    //     }).then((response) => {
    //         console.log('response.status', response.status)
    //         return response.json()
    //     }).then((response) => {
    //         console.log('response')
    //         if (response.body) {
    //             this.setState({ bedroom: response.body })
    //         }
    //     }).catch((error) => {
    //         console.log('error', 'error')
    //     })
    // }
    // getBathroom = () => {
    //     fetch('http://findopenhouse.appcrates.co/wp-json/hma/v-1/get-taxonomies?txonomy=bathroom', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json'
    //         },
    //     }).then((response) => {
    //         console.log('response.status', response.status)
    //         return response.json()
    //     }).then((response) => {
    //         console.log('response')
    //         if (response.body) {
    //             this.setState({ bathroom: response.body })
    //         }
    //     }).catch((error) => {
    //         console.log('error', 'error')
    //     })
    // }

    leftAction() {
        this.props.navigation.goBack()
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
                const source = { uri: response.uri, name: 'avatar.jpg', type: 'image/jpeg' };
                if (this.state.imageClick === '1') {
                    const sourceForAPI = { uri: response.data };
                    console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImage: source.uri,
                        sourceForAPI: sourceForAPI.uri,
                    });
                }
                else if (this.state.imageClick === '2') {
                    const sourceForAPI = { uri: response.data };
                    console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImageTwo: source.uri,
                        sourceForAPITwo: sourceForAPI.uri,
                    });
                }
                else if (this.state.imageClick === '3') {
                    const sourceForAPI = { uri: response.data };
                    console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImageThree: source.uri,
                        sourceForAPIThree: sourceForAPI.uri,
                    });
                }
                else if (this.state.imageClick === '4') {
                    const sourceForAPI = { uri: response.data };
                    console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImageFour: source.uri,
                        sourceForAPIFour: sourceForAPI.uri,
                    });
                }
                else if (this.state.imageClick === '5') {
                    const sourceForAPI = { uri: response.data };
                    console.log("ImagePicked: " + sourceForAPI.uri);
                    this.setState({
                        profileImageFive: source.uri,
                        sourceForAPIFive: sourceForAPI.uri,
                    });
                }
                else {
                    const sourceForAPITwo = { uri: response.data };
                    this.setState({
                        profileImageSix: source.uri,
                        sourceForAPISix: sourceForAPITwo.uri,
                    });
                }
            }
        });
    }
    calenderRender() {
        return (
            <View style={{ position: "absolute", height: "100%", width: "100%", backgroundColor: "white" }}>
                <View style={{ width: "100%" }}>
                    <Calendar
                        theme={{
                            arrowColor: '#EF4867',
                            textMonthFontSize: 20,
                            'stylesheet.calendar.header': {
                                week: {
                                    marginTop: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }
                            }
                        }}
                        onDayPress={(date) => { this.setState({ isCalender: false, date: JSON.stringify(date.day + "-" + date.month + "-" + date.year) }) }}
                    />
                </View>
            </View>
        )
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
                    centerComponent={"POST/EDIT OPEN HOUSE"}
                    bottomBorderColor={"#EF4867"}

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1, margin: 10, }}>
                        <View>
                            <Image source={{ uri: this.state.profileImage }}
                                resizeMode={'cover'}
                                style={style.coverImage}>
                            </Image>
                            <View style={[style.imageInnerTxtCont, { top: 8 }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ imageClick: '1' }, () => { this.forceUpdate() })
                                        this.selectImageButtonPress()
                                    }}
                                    style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../../assets/images/blue_camera.png')}
                                        resizeMode={'contain'}
                                        style={{ width: 25, height: 25 }}
                                    />
                                    <Text style={[style.profileTxt, { marginLeft: 5, }]}>Featured Image of Open House</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={style.imgRow}>
                            <View style={{ width: '49%' }}>
                                <Image source={{ uri: this.state.profileImageTwo }}
                                    resizeMode={'cover'}
                                    style={style.coverImage}>
                                </Image>
                                <View style={style.imageInnerTxtCont}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ imageClick: '2', }, () => { this.forceUpdate() })
                                            this.selectImageButtonPress()
                                        }}
                                        style={{ flexDirection: 'row', }}>
                                        <Image source={require('../../../assets/images/blue_camera.png')}
                                            resizeMode={'contain'}
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <Text style={[style.profileTxt, { marginLeft: 5, }]}>Image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: '49%' }}>
                                <Image source={{ uri: this.state.profileImageThree }}
                                    resizeMode={'cover'}
                                    style={style.coverImage}>
                                </Image>
                                <View style={style.imageInnerTxtCont}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ imageClick: '3' }, () => { this.forceUpdate() })
                                            this.selectImageButtonPress()
                                        }}
                                        style={{ flexDirection: 'row', }}>
                                        <Image source={require('../../../assets/images/blue_camera.png')}
                                            resizeMode={'contain'}
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <Text style={[style.profileTxt, { marginLeft: 5, }]}>Image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={style.imgRow}>
                            <View style={{ width: '49%' }}>
                                <Image source={{ uri: this.state.profileImageFour }}
                                    resizeMode={'cover'}
                                    style={style.coverImage}>
                                </Image>
                                <View style={style.imageInnerTxtCont}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ imageClick: '4', }, () => { this.forceUpdate() })
                                            this.selectImageButtonPress()
                                        }}
                                        style={{ flexDirection: 'row', }}>
                                        <Image source={require('../../../assets/images/blue_camera.png')}
                                            resizeMode={'contain'}
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <Text style={[style.profileTxt, { marginLeft: 5, }]}>Image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ width: '49%' }}>
                                <Image source={{ uri: this.state.profileImageFive }}
                                    resizeMode={'cover'}
                                    style={style.coverImage}>
                                </Image>
                                <View style={style.imageInnerTxtCont}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ imageClick: '5', }, () => { this.forceUpdate() })
                                            this.selectImageButtonPress()
                                        }}
                                        style={{ flexDirection: 'row', }}>
                                        <Image source={require('../../../assets/images/blue_camera.png')}
                                            resizeMode={'contain'}
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <Text style={[style.profileTxt, { marginLeft: 5, }]}>Image</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ firstName: text }) }}
                            value={this.state.email}
                            placeholder={"Open House Title:"}
                            style={style.inputTxt}
                        />
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ firstName: text }) }}
                            value={this.state.email}
                            placeholder={"Street Address:"}
                            style={style.inputTxt}
                        />
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"City:"}
                                style={[style.inputTxt, { width: '38%' }]}
                            />
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"State:"}
                                style={[style.inputTxt, { width: '28%' }]}
                            />
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Zip:"}
                                style={[style.inputTxt, { width: '30%' }]}
                            />
                        </View>
                        <TouchableOpacity onPress={() => { this.setState({ isCalender: true }) }} style={style.dropInputCont}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, marginTop: 5, color: "#707071", marginStart: 10 }}>{this.state.date.slice(1, -1)}</Text>

                            </View>
                            {/*<TextInput*/}
                            {/*    placeholderTextColor='#707071'*/}
                            {/*    onChangeText={(text) => { this.setState({ firstName: text }) }}*/}
                            {/*    value={this.state.email}*/}
                            {/*    placeholder={"Open House Date(s)"}*/}
                            {/*    style={style.dropInputTxt}*/}
                            {/*/>*/}
                            <Image source={require('./../../../assets/images/date.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>

                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </TouchableOpacity>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Open House Type:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ about: text }) }}
                            value={this.state.email}
                            placeholder={"Property Description:"}
                            multiline={true}
                            style={[style.inputTxt, { height: 66, textAlignVertical: 'top' }]}
                        />
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Bedrooms:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Bathrooms:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <TextInput
                            placeholderTextColor='#707071'
                            onChangeText={(text) => { this.setState({ firstName: text }) }}
                            value={this.state.email}
                            placeholder={"Property Price:"}
                            style={style.inputTxt}
                        />
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Square Feet:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Lot Size:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Basement:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Year Built:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Other Amenities:"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        <View style={style.dropInputCont}>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={"Views"}
                                style={style.dropInputTxt}
                            />
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View>
                        {/* <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Text style={style.schoolTxt}>School District</Text>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={""}
                                style={[style.inputTxt, { width: '65%' }]}
                            />
                        </View> */}
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Text style={style.schoolTxt}>Keywords</Text>
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ firstName: text }) }}
                                value={this.state.email}
                                placeholder={""}
                                style={[style.inputTxt, { width: '65%' }]}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Image source={{ uri: this.state.profileImageSix }}
                                resizeMode={'cover'}
                                style={style.coverImage}>
                            </Image>
                            <View style={[style.imageInnerTxtCont, { top: 8 }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ imageClick: '6', show9: false }, () => { this.forceUpdate() })
                                        this.selectImageButtonPress()
                                    }}
                                    style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../../assets/images/blue_camera.png')}
                                        resizeMode={'contain'}
                                        style={{ width: 25, height: 25 }}
                                    />
                                    <Text style={[style.profileTxt, { marginLeft: 5, }]}>Upload Floor Plan</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ width: '100%', height: 70, borderColor: 'gray', borderWidth: 1, marginTop: 10, alignItems: 'center' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Image source={require('../../../assets/images/plus.png')}
                                    resizeMode={'contain'}
                                    style={{ width: 25, height: 25, tintColor: '#005271' }}
                                />
                                <Text style={[style.profileTxt, { marginLeft: 5, }]}>Add Virtual Tour</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate("PostCofirmation") }}
                            style={[style.btnTouch, { marginTop: 15 }]}>
                            <Text style={style.btnTxt}>POST / SAVE</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.isCalender && this.calenderRender()}
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
    coverImage: {
        height: 70,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#707071'
    },
    imageInnerTxtCont: {
        position: 'absolute',
        width: '100%',
        top: 23,
        alignItems: 'center'
    },
    imgRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 5,
        justifyContent: 'space-between'
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
        paddingLeft: 10,

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
    schoolTxt: {
        fontSize: 14,
        color: 'gray'
    },
    btnTxt: {
        fontSize: 18,
        color: 'white',
        fontFamily: fontFamily.Bold
    },
    dropInputCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        borderColor: '#707071',
        borderWidth: 1,
        marginTop: 10,
    },
    dropInputTxt: {
        width: '82%',
        height: 40,
        fontSize: 14,
        paddingLeft: 10,
    },
    dropImg: {
        width: 20,
        height: 20,
        marginRight: 5
    },
});

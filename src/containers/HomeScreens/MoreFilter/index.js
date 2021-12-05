import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground, Platform } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
import { color } from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Preference from "react-native-preference";
import moment from 'moment';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'


export default class MoreFilter extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            bedNumber1: false,
            bedNumber2: false,
            bedNumber3: false,
            bedNumber4: false,
            bedNumber5: false,
            bedNumberAny: false,
            bathNumber1: false,
            bathNumber2: false,
            bathNumber3: false,
            bathNumber4: false,
            bathNumber5: false,
            bathNumberAny: false,
            garagehNumber1: false,
            garageNumber2: false,
            garagehNumber3: false,
            garagehNumber4: false,
            garageNumber5: false,
            garageNumberAny: false,
            bedRoomsCount: 0,
            bathRoomsCount: 0,
            Calendar: '',
            Calendar2: '',
            squareFeet: '',
            plotSize: '',
            basement: '',
            yearBuilt: '',
            otherAnemities: '',
            schoolDistrict: '',
            keyWords: '',
            waterFont: '',
            pool: '',
            ac: '',
            cityView: '',
            mountainView: '',
            parkView: '',
            waterView: '',
            views: '',
            location: props.navigation.getParam('location'),
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
            alert(JSON.stringify(newMode), 'mode')

            this.setState({
              appThemeMode:newMode
            })
        })
        console.log('check location ===>', this.state.location)
    }
    componentWillMount() {
    }
    leftAction() {
        this.props.navigation.goBack()
    }
    CheckState(state) {
        if (state) {
            this.setState({ isEnable: false })
        }
        else
            this.setState({ isEnable: true })

    }

    ApplyFilter = () => {
        const { params } = this.props.navigation.state;
        const { applyFilter, updateIsFromFilter } = params;
        let BedRoomsCount =
            this.state.bedNumber1 ? 77 :
                this.state.bedNumber2 ? 78 :
                    this.state.bedNumber3 ? 79 :
                        this.state.bedNumber4 ? 80 :
                            this.state.bedNumber5 ? 81 : 0;
        let bathRoomsCount =
            this.state.bathNumber1 ? 82 :
                this.state.bathNumber2 ? 83 :
                    this.state.bathNumber3 ? 84 :
                        this.state.bathNumber4 ? 85 :
                            this.state.bathNumber5 ? 86 : 0;
        if (updateIsFromFilter && typeof updateIsFromFilter == 'function') {
            updateIsFromFilter()
        }
        if (applyFilter && typeof applyFilter == 'function') {
            const userData = Preference.get('userData');
            let data = {};
            console.log("USerData", JSON.stringify(userData))
            if (userData === null || userData === undefined) {
                if (bathRoomsCount !== 0) {
                    data['taxonomies[bathroom][]'] = bathRoomsCount;
                }
                if (BedRoomsCount !== 0) {
                    data['taxonomies[bedroom][]'] = BedRoomsCount;
                }
                if (this.state.Calendar !== '') {
                    data['start_date'] = this.state.Calendar;
                }
                if (this.state.plotSize !== '') {
                    data['meta[plot_size]'] = this.state.plotSize;
                }
                if (this.state.squareFeet !== '') {
                    data['meta[square_feet]'] = this.state.squareFeet;
                }
                if (this.state.basement !== '') {
                    data['meta[basement]'] = this.state.basement;
                }
                if (this.state.yearBuilt !== '') {
                    data['meta[year_built]'] = this.state.yearBuilt;
                }
                if (this.state.schoolDistrict !== '') {
                    data['meta[school_district]'] = this.state.schoolDistrict;
                }
                if (this.state.keyWords !== '') {
                    data['keyword'] = this.state.keyWords;
                }
                if (this.state.ac !== '') {
                    data['meta[amenities_ac]'] = this.state.ac;
                }
                if (this.state.pool !== '') {
                    data['meta[amenities_pool]'] = this.state.pool;
                }
                if (this.state.waterFont !== '') {
                    data['meta[amenities_waterfront]'] = this.state.waterFont;
                }
                if (this.state.cityView !== '') {
                    data['meta[view_city]'] = this.state.cityView;
                }
                if (this.state.mountainView !== '') {
                    data['meta[view_mountain]'] = this.state.mountainView;
                }
                if (this.state.parkView !== '') {
                    data['meta[view_park]'] = this.state.parkView;
                }
                if (this.state.waterView !== '') {
                    data['meta[view_water]'] = this.state.waterView;
                }
                if (this.state.Calendar2 !== '') {
                    data['end_date'] = this.state.Calendar2;
                }
                console.log('ioioioio===>', data)

                // data = {
                //     'taxonomies[bathroom][]': bathRoomsCount,
                //     'taxonomies[bedroom][]': BedRoomsCount,
                //     'start_date': this.state.Calendar,
                //     'meta[plot_size]': this.state.plotSize,
                //     'meta[square_feet]': this.state.squareFeet,
                //     'meta[basement]': this.state.basement,
                //     'meta[year_built]': this.state.yearBuilt,
                //     'meta[school_district]': this.state.schoolDistrict,
                //     'keyword': this.state.keyWords,
                //     'meta[amenities_ac]': this.state.ac,
                //     'meta[amenities_pool]': this.state.pool,
                //     'meta[amenities_waterfront]': this.state.waterFont,
                //     'meta[view_city]': this.state.cityView,
                //     'meta[view_mountain]': this.state.mountainView,
                //     'meta[view_park]': this.state.parkView,
                //     'meta[view_water]': this.state.waterView,
                //     'end_date': this.state.Calendar2,

                // }
            } else {
                if (bathRoomsCount !== 0) {
                    data['taxonomies[bathroom][]'] = bathRoomsCount;
                }
                if (BedRoomsCount !== 0) {
                    data['taxonomies[bedroom][]'] = BedRoomsCount;
                }
                if (this.state.Calendar !== '') {
                    data['start_date'] = this.state.Calendar;
                }
                if (this.state.plotSize !== '') {
                    data['meta[plot_size]'] = this.state.plotSize;
                }
                if (this.state.squareFeet !== '') {
                    data['meta[square_feet]'] = this.state.squareFeet;
                }
                if (this.state.basement !== '') {
                    data['meta[basement]'] = this.state.basement;
                }
                if (this.state.yearBuilt !== '') {
                    data['meta[year_built]'] = this.state.yearBuilt;
                }
                if (this.state.schoolDistrict !== '') {
                    data['meta[school_district]'] = this.state.schoolDistrict;
                }
                if (this.state.keyWords !== '') {
                    data['keyword'] = this.state.keyWords;
                }
                if (this.state.ac !== '') {
                    data['meta[amenities_ac]'] = this.state.ac;
                }
                if (this.state.pool !== '') {
                    data['meta[amenities_pool]'] = this.state.pool;
                }
                if (this.state.waterFont !== '') {
                    data['meta[amenities_waterfront]'] = this.state.waterFont;
                }
                if (this.state.cityView !== '') {
                    data['meta[view_city]'] = this.state.cityView;
                }
                if (this.state.mountainView !== '') {
                    data['meta[view_mountain]'] = this.state.mountainView;
                }
                if (this.state.parkView !== '') {
                    data['meta[view_park]'] = this.state.parkView;
                }
                if (this.state.waterView !== '') {
                    data['meta[view_water]'] = this.state.waterView;
                }
                if (this.state.Calendar2 !== '') {
                    data['end_date'] = this.state.Calendar2;
                }
                data['login_user_id'] = userData.id;
                data['user_id'] = userData.id;
                // data = {
                //     'taxonomies[bathroom][]': bathRoomsCount,
                //     'taxonomies[bedroom][]': BedRoomsCount,
                //     'start_date': this.state.Calendar,
                //     'meta[plot_size]': this.state.plotSize,
                //     'meta[square_feet]': this.state.squareFeet,
                //     'meta[basement]': this.state.basement,
                //     'meta[year_built]': this.state.yearBuilt,
                //     'meta[school_district]': this.state.schoolDistrict,
                //     'keyword': this.state.keyWords,
                //     'meta[amenities_ac]': this.state.ac,
                //     'meta[amenities_pool]': this.state.pool,
                //     'meta[amenities_waterfront]': this.state.waterFont,
                //     'meta[view_city]': this.state.cityView,
                //     'meta[view_mountain]': this.state.mountainView,
                //     'meta[view_park]': this.state.parkView,
                //     'meta[view_water]': this.state.waterView,
                //     'end_date': this.state.Calendar2,
                //     'login_user_id': userData.id,
                //     'user_id': userData.id,

                // }
            }
            setTimeout(() => {
                applyFilter(data)
                this.props.navigation.goBack()
            }, 200);
        }
    }
    callback = (day1, day2) => {
        let date1 = moment(day1).format('DD-MM-YYYY')
        let date2 = moment(day2).format('DD-MM-YYYY')
        console.log('my date===>', date1)
        console.log('my date===>', date2)

        this.setState({ Calendar: date1, Calendar2: date2 })
    }

    SquareFeet = (squareFeet) => {
        // console.log('my date===>', squareFeet)
        this.setState({ squareFeet: squareFeet })
    }
    PlotSize = (plotSize) => {
        console.log('my date===>', plotSize)
        this.setState({ plotSize: plotSize })
    }

    BaseMent = (basement) => {
        console.log('my date===>', basement)
        this.setState({ basement: basement })
    }
    YearBuilt = (yearBuilt) => {
        console.log('my date===>', yearBuilt)
        this.setState({ yearBuilt: yearBuilt })
    }
    OtherAnemities = (waterFont, pool, ac) => {
        let temp = ''
        if (waterFont) {
            temp = temp + 'waterFront,'
        }
        if (pool) {
            temp = temp + 'pool,'
        }
        if (ac) {
            temp = temp + 'ac,'
        }
        console.log('my waterFont===>', waterFont);
        console.log('my pool===>', pool);
        console.log('my ac===>', ac);
        this.setState({ otherAnemities: temp ? temp : 'No', waterFont: waterFont, ac: ac, pool: pool })
    }
    SchoolDistrict = (schoolDistrict) => {
        console.log('my date===>', schoolDistrict)
        this.setState({ schoolDistrict: schoolDistrict })
    }
    CheckViews = (water, mountain, park, city) => {
        let temp = ''
        if (water) {
            temp = temp + 'Water,'
        }
        if (mountain) {
            temp = temp + 'Mountain,'
        }
        if (park) {
            temp = temp + 'Park,'
        }
        if (city) {
            temp = temp + 'City,'
        }
        this.setState({ views: temp ? temp : 'No', cityView: city, mountainView: mountain, parkView: park, waterView: water })
    }
    render() {
        const {appThemeMode}=this.state
        return (
            <SafeAreaView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Filters"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <KeyboardAwareScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 20, paddingRight: 20, paddingLeft: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}
                >
                    {/* <Text style={style.saveSearchTxt}>Save Search</Text> */}
                    <Text style={style.bedRoomTxt}>Bedrooms <Text style={[style.bedTapTxt]}>(Tap multiple number to select range)</Text></Text>
                    <View style={style.bedRoomRowCont}>
                        {/* <View style={style.bedRoomCont}>
                            <TextInput
                                placeholder={'Any'} style={style.bedInput}
                                value={this.state.bedRoomsCount}
                                onChangeText={(text) => this.setState({ bedRoomsCount: text })}
                                keyboardType={'number-pad'}
                            />
                        </View> */}
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bedNumber1: !this.state.bedNumber1,
                                bedNumber2: false,
                                bedNumber3: false,
                                bedNumber4: false,
                                bedNumber5: false,

                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bedNumber1 ? 2 : 1, }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center' }]}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bedNumber2: !this.state.bedNumber2,
                                bedNumber1: false,
                                bedNumber3: false,
                                bedNumber4: false,
                                bedNumber5: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bedNumber2 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bedNumber3: !this.state.bedNumber3,
                                bedNumber1: false,
                                bedNumber2: false,
                                bedNumber4: false,
                                bedNumber5: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bedNumber3 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bedNumber4: !this.state.bedNumber4,
                                bedNumber1: false,
                                bedNumber2: false,
                                bedNumber3: false,
                                bedNumber5: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bedNumber4 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bedNumber5: !this.state.bedNumber5,
                                bedNumber1: false,
                                bedNumber2: false,
                                bedNumber3: false,
                                bedNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bedNumber5 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>5+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[style.bedRoomTxt, { marginTop: 15 }]}>Bathrooms</Text>
                    <View style={style.bedRoomRowCont}>
                        {/* <View style={style.bedRoomCont}>
                            <TextInput
                                placeholder={'Any'} style={style.bedInput}
                                value={this.state.bathRoomsCount}
                                onChangeText={(text) => this.setState({ bathRoomsCount: text })}
                                keyboardType={'number-pad'}
                            />
                        </View> */}
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bathNumber1: !this.state.bathNumber1,
                                bathNumber5: false,
                                bathNumber2: false,
                                bathNumber3: false,
                                bathNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bathNumber1 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bathNumber2: !this.state.bathNumber2,
                                bathNumber5: false,
                                bathNumber1: false,
                                bathNumber3: false,
                                bathNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bathNumber2 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bathNumber3: !this.state.bathNumber3,
                                bathNumber5: false,
                                bathNumber2: false,
                                bathNumber1: false,
                                bathNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bathNumber3 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bathNumber4: !this.state.bathNumber4,
                                bathNumber5: false,
                                bathNumber2: false,
                                bathNumber3: false,
                                bathNumber1: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bathNumber4 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                bathNumber5: !this.state.bathNumber5,
                                bathNumber1: false,
                                bathNumber2: false,
                                bathNumber3: false,
                                bathNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.bathNumber5 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>5+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Text style={[style.bedRoomTxt, { marginTop: 15 }]}>Garage</Text> */}
                    {/* <View style={style.bedRoomRowCont}>
                        <View style={style.bedRoomCont}>
                            <TextInput
                                placeholder={'Any'} style={style.bedInput}
                                value={this.state.bathRoomsCount}
                                onChangeText={(text) => this.setState({ bathRoomsCount: text })}
                                keyboardType={'number-pad'}
                            />
                        </View>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                garageNumber1: !this.state.garageNumber1,
                                garageNumber5: false,
                                garageNumber2: false,
                                garageNumber3: false,
                                garageNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.garageNumber1 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                garageNumber2: !this.state.garageNumber2,
                                garageNumber5: false,
                                garageNumber1: false,
                                garageNumber3: false,
                                garageNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.garageNumber2 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                garageNumber3: !this.state.garageNumber3,
                                garageNumber5: false,
                                garageNumber2: false,
                                garageNumber1: false,
                                garageNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.garageNumber3 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                garageNumber4: !this.state.garageNumber4,
                                garageNumber5: false,
                                garageNumber2: false,
                                garageNumber3: false,
                                garageNumber1: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.garageNumber4 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            this.setState({
                                garageNumber5: !this.state.garageNumber5,
                                garageNumber1: false,
                                garageNumber2: false,
                                garageNumber3: false,
                                garageNumber4: false,
                            })
                        } style={[style.bedRoomCont, { borderWidth: this.state.garageNumber5 ? 2 : 1 }]}>
                            <Text style={[style.bedInput, { alignSelf: 'center', }]}>5+</Text>
                        </TouchableOpacity>
                    </View> */}
                    
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('Calender', {
                                callbackFunction: this.callback
                            })
                        }}
                        style={[style.rowNavCont, { marginTop: 15 }]}>
                        <Text style={[style.bedRoomTxt]}>Open House Dates</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {this.state.Calendar != "" && <Text style={[style.bedTapTxt]}>{moment(this.state.Calendar, 'DD-MM-YYYY').format('MM-DD-YYYY')}</Text>}
                            {this.state.Calendar2 != "" && <Text style={[style.bedTapTxt]}>{" To " + moment(this.state.Calendar2, 'DD-MM-YYYY').format('MM-DD-YYYY')}</Text>}
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </View>
                    </TouchableOpacity>
                    {/* <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt]}>Square Feet</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('SquareFeet', {
                                squareFeetFunction: this.SquareFeet,
                                squareFeet: this.state.squareFeet
                            })
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.squareFeet}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </TouchableOpacity>
                    </View> */}
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt]}>Lot Size</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('LotSize', {
                                PlotSizeFunction: this.PlotSize,
                                plotSize: this.state.plotSize
                            })
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.plotSize}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt]}>Basement</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('Basement', {
                                BaseMentFunction: this.BaseMent,
                                basement: this.state.basement
                            })
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.basement}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt]}>Year Built</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('YearBuild', {
                                YearBuiltFunction: this.YearBuilt,
                                yearBuilt: this.state.yearBuilt
                            })
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.yearBuilt}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt]}>Other Amenities</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('OtherAmenities', {
                                OtherAnemitiesFunction: this.OtherAnemities
                            })
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.otherAnemities}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </TouchableOpacity>
                    </View>
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt]}>Views</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('Views', {
                                viewsOptions: this.CheckViews
                            })
                        }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>{this.state.views}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </TouchableOpacity>
                    </View>
                    {/* <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt, { width: '40%' }]}>School District</Text>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('SchoolDistrict', {
                                SchoolDistrictFunction: this.SchoolDistrict,
                                location: this.state.location
                            })
                        }} style={{ flexDirection: 'row', width: "60%", justifyContent: "flex-end" }}>
                            <Text numberOfLines={1} style={[style.bedTapTxt, {}]}>{this.state.schoolDistrict}</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={[style.navImg, {}]} />
                        </TouchableOpacity>
                    </View> */}
                    <Text style={[style.bedRoomTxt, { marginTop: 10 }]}>Keywords</Text>
                    <View style={style.searchCont}>
                        <TextInput
                            placeholder={'Fireplace, deck'}
                            style={style.searchInput}
                            value={this.state.keyWords}
                            onChangeText={(text) => this.setState({ keyWords: text })}
                        />
                    </View>
                    <View style={[style.rowNavCont, { marginTop: 10 }]}>
                        <Text style={[style.bedRoomTxt]}>Satellite View on Map</Text>
                        <ToggleSwitch
                            isOn={this.state.isEnable}
                            onColor={'#00B7B0'}
                            offColor={"gray"}

                            labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                            size="medium"
                            onToggle={() => this.CheckState(this.state.isEnable)}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.ApplyFilter()

                        }
                        }
                        style={{ height: 45, margin: 10, marginTop: 15, marginBottom: 30, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: fontFamily.Regular, color: 'white' }}>Apply (Results)</Text>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchCont: {
        marginStart: 5,
        marginEnd: 25,
        marginTop: 10,
        borderColor: '#707070',
        borderWidth: 1,
        height: 46,
    },
    searchInput: {
        width: '100%',
        paddingLeft: 10,
        fontSize: 16,
        height: 46,
        color: '#707071',
        fontFamily: fontFamily.Regular
    },
    searchImg: {
        width: 40,
        height: 40,
        tintColor: '#707070',
    },
    saveSearchTxt: {
        fontSize: 14,
        color: '#0996A4',
        fontFamily: fontFamily.Bold,
        alignSelf: 'flex-end'
    },
    bedRoomTxt: {
        marginTop: 5,
        fontSize: 14,
        color: 'gray',
        fontFamily: fontFamily.Bold,
    },
    bedTapTxt: {
        fontSize: 12,
        color: 'gray',
        fontFamily: fontFamily.Regular,
    },
    bedRoomRowCont: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center'
    },
    bedRoomCont: {
        // justifyContent: 'space-between',
        flexDirection: 'row',
        marginStart: 5,
        marginEnd: 4,
        marginTop: 10,
        borderColor: 'gray',
        borderWidth: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bedInput: {
        width: 41,
        fontSize: 14,
        textAlign: 'center',
        color: '#707071',
        fontFamily: fontFamily.Regular
    },
    rowNavCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center'
    },
    navImg: {
        width: 15,
        height: 15,
        marginLeft: 4,
        tintColor: 'gray'
    }
});

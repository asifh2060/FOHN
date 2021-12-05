import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
import SimpleToast from "react-native-simple-toast";
import ProgressBar from "../../../component/ProgressBar";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class SchoolDistrict extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            isEnable: true,
            loading: false,
            location: props.navigation.getParam('location'),
            schoolList: [],
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
        console.log('check location ===>', this.state.location)
        this.getSchoolList()
    }

    getSchoolList = () => {
        const details = {
            input: 'school',
            location: `${this.state.location.latitude},${this.state.location.longitude}`,
            radius: 500,
            key: 'AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8'

        };
        this.setState({
            loading: true
        })
        fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='
            + details.input
            + "&location=" + details.location
            + "&radius=" + details.radius
            + "&key=" + details.key
            , {
                method: 'GET',
            }).then(response => {
                // console.log('response before json:', response);
                return response.json();
            }).then(response => {
                this.setState({ isFromFilter: false })
                console.log('getPropertyByLocationApi Response: ' + JSON.stringify(response));
                this.setState({schoolList: response.predictions});
                // if (response.status === "200") {
                   
                // }
                // else if (response.status === "404") {
                //     SimpleToast.show('No School found')
                // }
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
    CheckState(state) {
        if (state) {
            this.setState({ isEnable: false })
        }
        else
            this.setState({ isEnable: true })

    }

    SchoolDistrict = (value) => {
        const { params } = this.props.navigation.state;
        if (params) {
            const { SchoolDistrictFunction } = params;
            if (SchoolDistrictFunction && typeof SchoolDistrictFunction == 'function') {
                SchoolDistrictFunction(value);
            }
        }
        this.props.navigation.goBack()
    }

    renderItem(item) { 
        console.log('item==>',item)
        return(
            <TouchableOpacity onPress={() => this.SchoolDistrict(item.structured_formatting.main_text)} style={[style.btnStyle, { marginTop: 10 }]}>
            <Text style={[style.noMinTxt]}>{item.structured_formatting.main_text}</Text>
        </TouchableOpacity>
        )

    }
    render() {
        const {appThemeMode}=this.state

        return (
            <SafeAreaView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"School District"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 0,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.squareTxt]}>School District</Text>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.bedTapTxt]}>Any</Text>
                            <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} />
                        </View> */}
                    </View>
                    <View style={[style.grayCont,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                        <FlatList
                            // style={style.flatliststy}
                            data={this.state.schoolList}
                            renderItem={({ item, index }) => (
                                this.renderItem(item)
                            )}
                            // extraData={this.state}
                            // keyExtractor={item => item.id}
                        />
                        {/* <TouchableOpacity onPress={() => this.SchoolDistrict('Ankeny Community Schools')} style={[style.btnStyle, { marginTop: 10 }]}>
                            <Text style={[style.noMinTxt]}>Ankeny Community Schools</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.SchoolDistrict('Elkhart Community Schools')} style={style.btnStyle}>
                            <Text style={[style.noMinTxt]}>Elkhart Community Schools</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.SchoolDistrict('North Polk Community Schools')} style={style.btnStyle}>
                            <Text style={[style.noMinTxt]}>North Polk Community Schools</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.SchoolDistrict('Bondurant - Farrar Community Schools')} style={style.btnStyle}>
                            <Text style={[style.noMinTxt]}>Bondurant - Farrar Community Schools</Text>
                        </TouchableOpacity> */}
                    </View>
                    <TouchableOpacity style={[style.btnLeftStyle]}>
                        <Text style={[style.noMinTxt]}>These are the school districts in your location</Text>
                    </TouchableOpacity>
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    squareTxt: {
        marginTop: 5,
        fontSize: 14,
        fontFamily: fontFamily.Bold,
        color: 'gray',

    },
    noMinTxt: {
        fontSize: 16,
        color: '#707071',
        textAlign: 'center',
        fontFamily: fontFamily.Regular,
    },
    bedTapTxt: {
        fontSize: 12,
        color: 'gray',
        fontFamily: fontFamily.Regular,
    },
    rowNavCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
    },
    minMaxCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    navImg: {
        width: 15,
        height: 15,
        marginLeft: 4,
        tintColor: 'gray'
    },
    grayCont: {
        height: 200,
        backgroundColor: '#E9E9E9',
        marginTop: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    btnStyle: {
        alignSelf: 'flex-end',
        paddingRight: 10,
    },
    btnLeftStyle: {
        marginTop: 10,
        paddingLeft: 8,
        paddingRight: 8,
    }
});

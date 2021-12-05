import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native'
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'


export default class Views extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            city: true,
            mountain: true,
            park: true,
            water: true,
            countryside: true,
            none: true,

            appThemeMode:'light'

        }

    }
    componentDidMount(){
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
    }
    componentWillMount() {
    }
    leftAction() {
        this.props.navigation.goBack()
    }
    CheckState(state) {
     if (state){
         if (state==="city"){
          if (this.state.city){
              this.setState({city:false})
          }
             else
                 {
                 this.setState({city:true})
             }
         }
         else if (state==="park"){
             if (this.state.park){
                 this.setState({park:false})
             }
             else
             {
                 this.setState({park:true})
             }
         }
         else if (state==="mountain"){
             if (this.state.mountain){
                 this.setState({mountain:false})
             }
             else
             {
                 this.setState({mountain:true})
             }
         }
         else if (state==="mountain"){
             if (this.state.mountain){
                 this.setState({mountain:false})
             }
             else
             {
                 this.setState({mountain:true})
             }
         }
         else if (state==="water"){
             if (this.state.water){
                 this.setState({water:false})
             }
             else
             {
                 this.setState({water:true})
             }
         }
         else if (state==="countryside"){
            if (this.state.countryside){
                this.setState({countryside:false})
            }
            else
            {
                this.setState({countryside:true})
            }
        }
        else if (state==="none"){
            if (this.state.none){
                this.setState({none:false})
            }
            else
            {
                this.setState({none:true})
            }
        }
     }
    }
    ApplyFilter = () => {
        const { params } = this.props.navigation.state;
        if (params) {
            const { viewsOptions } = params;
            if (viewsOptions && typeof viewsOptions == 'function') {
                viewsOptions(this.state.water, this.state.mountain, this.state.park,this.state.city);
            }
        }
        this.props.navigation.goBack()
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <SafeAreaView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    HeaderColor={'#707070'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Views"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer,{marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}
                >
                    <View style={style.rowNavCont}>
                        <Text style={[style.bedRoomTxt,{ fontFamily: fontFamily.Bold}]}>Views</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                         onPress={()=>{
                            this.setState({
                                city:false,
                                mountain:false,
                                park:false,
                                water:false,
                                countryside:false,
                                none:false


                            })
                        }}>
                            <Text style={[style.bedTapTxt]}>Any</Text>
                            {/* <Image source={require('../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.navImg} /> */}
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor:appThemeMode==='light' ? '#E9E9E9' :Colors.black,marginTop:10,borderTopWidth:1,borderBottomWidth:1,paddingBottom:80}}>
                    <View style={[style.rowNavCont,{marginTop:10}]}>
                        <Text style={[style.bedRoomTxt]}>City</Text>
                            <ToggleSwitch
                                isOn={this.state.city}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                onToggle={() => this.CheckState("city")}
                            />
                    </View>
                    <View style={[style.rowNavCont,{marginTop:10}]}>
                        <Text style={[style.bedRoomTxt]}>Mountain</Text>
                            <ToggleSwitch
                                isOn={this.state.mountain}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                onToggle={() => this.CheckState('mountain')}
                            />
                    </View>
                    <View style={[style.rowNavCont,{marginTop:10}]}>
                        <Text style={[style.bedRoomTxt]}>Park</Text>
                            <ToggleSwitch
                                isOn={this.state.park}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                onToggle={() => this.CheckState("park")}
                            />
                    </View>
                    <View style={[style.rowNavCont,{marginTop:10}]}>
                        <Text style={[style.bedRoomTxt]}>Water</Text>
                            <ToggleSwitch
                                isOn={this.state.water}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                onToggle={() => this.CheckState("water")}
                            />
                    </View>
                    {/* <View style={[style.rowNavCont,{marginTop:10}]}>
                        <Text style={[style.bedRoomTxt]}>Countryside</Text>
                            <ToggleSwitch
                                isOn={this.state.countryside}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                onToggle={() => this.CheckState("countryside")}
                            />
                    </View> */}
                    {/* <View style={[style.rowNavCont,{marginTop:10}]}>
                        <Text style={[style.bedRoomTxt]}>None</Text>
                            <ToggleSwitch
                                isOn={this.state.none}
                                onColor={'#00B7B0'}
                                offColor={"gray"}
                                labelStyle={{ color: '#00B7B0', fontWeight: "100" }}
                                size="small"
                                onToggle={() => this.CheckState("none")}
                            />
                    </View> */}
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.ApplyFilter()

                        }
                        }
                        style={{ height: 45, margin: 10, marginTop: 30, marginBottom: 10, borderColor: '#707071', borderWidth: 1, backgroundColor: '#EF4867', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontFamily: fontFamily.Regular, color: 'white' }}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
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
        fontFamily: fontFamily.Regular,
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
        justifyContent: 'space-between',
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
        height: 38,
        fontSize: 14,
        textAlign: 'center',
        color: '#707071',
        fontFamily: fontFamily.Regular
    },
    rowNavCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 20,
    },
    navImg: {
        width: 15,
        height: 15,
        marginLeft:4,
        tintColor: 'gray'
    }
});

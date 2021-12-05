import React, { Component } from 'react';
import {View,Image,StyleSheet,Text,TouchableOpacity,TextInput,ScrollView} from  'react-native'
import { Container, Content, Picker, Form } from "native-base";

// import Preference from 'react-native-preference'
import {NavigationActions, StackActions} from "react-navigation";
import Header from "../../../component/Header";
import SaleOwnerMembership from "../../HomeScreens/SaleOwnerMembership";
import LenderMembership from "../../HomeScreens/LenderMembership";
import appColor from '../../../component/appColor';
import Preference from 'react-native-preference';

import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class PostCofirmation extends Component{
    static contextType = DarkModeContext;

    constructor(props){
        super(props)
    this.state={
        appThemeMode:'light',
        userData: Preference.get("userData"),


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

    leftAction(){
         this.props.navigation.goBack()
    }
    rightAction(){
    }

    render(){
        const {appThemeMode}=this.state

        return(
            <ScrollView style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    centerComponent={"POST CONFIRMATION"}
                    bottomBorderColor={"#EF4867"}
                    leftIcon={require("../../../assets/images/back.png")}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }

                />
               <Text style={{fontSize:22,color:"#005271",fontWeight:"bold",textAlign:"center",marginTop:20}}>{"Nice!"}</Text>
                <Text style={{fontSize:22,color:"#005271",fontWeight:"bold",textAlign:"center"}}>{"Your Open House has been posted!"}</Text>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("ViewEditOpenHouse",{userID:"this.state.userData.id"})}}  style={[style.listContainer,,{backgroundColor: appColor.Pink}]}>
                    <Text style={{marginStart: 10,color:"white",textAlign:"center",fontWeight:"bold",fontSize:22,margin:20}}>{"VIEW/EDIT OPEN HOUSE"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("PostOpenHouse")}}  style={[style.listContainer,,{backgroundColor: appColor.green}]}>
                    <Text style={{marginStart: 10,color:"white",textAlign:"center",fontWeight:"bold",fontSize:22,margin:20}}>{"POST ANOTHER OPEN HOUSE"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("StacyMartinProfile")}}  style={[style.listContainer,,{backgroundColor: appColor.blue}]}>
                    <Text style={{marginStart: 10,color:"white",textAlign:"center",fontWeight:"bold",fontSize:22,margin:20}}>{"GO TO PROFILE"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("search")}}  style={[style.listContainer,,{backgroundColor: appColor.Scorpion}]}>
                    <Text style={{marginStart: 10,color:"white",textAlign:"center",fontWeight:"bold",fontSize:22,margin:20}}>{"NONE"}</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}
const style=StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'white'
    },

    listContainer:{
        width:"100%",
        backgroundColor:appColor.Pink,
        flexDirection:"row",
        alignItems:"center",
        marginTop: 10,
        justifyContent:"center"
    },
});

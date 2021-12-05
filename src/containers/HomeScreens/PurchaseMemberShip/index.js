import React, { Component } from 'react';
import {View,Image,StyleSheet,Text,TouchableOpacity,TextInput,ScrollView,Dimensions} from  'react-native'
// import Preference from 'react-native-preference'
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'
import {NavigationActions, StackActions} from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
import {AirbnbRating} from 'react-native-ratings';
const {height, width} = Dimensions.get('window');
import appColor from "../../../component/appColor"



export default class purchaseMemberShip extends Component{
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);

        this.state = {
            appThemeMode:'light',
            itemPrice: props.navigation.getParam("itemPrice"),
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
            },()=>{
              this.forceUpdate()
            })
        })
    }
    componentWillMount() {
    }
    leftAction()
    {
     this.props.navigation.goBack()
    }
    rightAction(){

    }
    render()
    {
        const {appThemeMode}=this.state

        return(
            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ?  Colors.white :Colors.black }]}>
                    <Header
                        leftAction={this.leftAction.bind(this)}
                        rightAction={this.rightAction.bind(this)}
                        HeaderColor={'#00B7B0'}
                        centerComponent={"PURCHASE MEMBERSHIP"}
                        leftIcon={require("../../../assets/images/back.png")}
                        bottomBorderColor={"#EF4867"}
                        LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }
                    />
               <View style={{margin:20}}>
                  <View style={{flexDirection:"row"}}>
                     <Image source={require("../../../assets/images/bullseye.png")} resizeMode={"contain"} style={{width:40,height:40}} />
                     <Text style={{marginStart:10,fontSize:18,color:appColor.blue,fontWeight:"bold",width:"60%"}}>{"Builder Professional Monthly Membership"}</Text>
                      <Text style={{marginStart:10,fontSize:18,color:appColor.blue,fontWeight:"bold",width:"20%",marginTop:10}}>{this.state.itemPrice}</Text>
                  </View>
                   <Text style={{marginStart:50, fontSize:16,color:appColor.Gray_Chateau,marginTop:10,fontWeight:"bold"}}>{"Remove"}</Text>
               </View>
                <View style={{width:"100%",height:3,backgroundColor: appColor.yellow}} />
                <TextInput placeholder={"Enter your promotional code here:"} style={{marginStart:20,height:80}} />
                <View style={{width:"100%",height:3,backgroundColor: appColor.yellow}} />

                <View style={{justifyContent:"space-between",flexDirection:"row"}}>
                 <Text style={{marginStart:70, fontSize:16,color:appColor.Gray_Chateau,marginTop:10,fontWeight:"bold"}}>{"Subtotal:"}</Text>
                 <Text style={{ fontSize:16,color:appColor.blue,marginTop:10,fontWeight:"bold",marginEnd:50}}>{this.state.itemPrice}</Text>
                </View>
                <View style={{flex: 1,justifyContent:"flex-end"}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate("CheckOut")}}
                        style={{height:70,borderColor:'#707071',borderWidth:1, backgroundColor: "#00B7B0",justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>CHECKOUT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const style=StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'white'
    },

});

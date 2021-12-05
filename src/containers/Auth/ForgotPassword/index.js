import React, { Component } from 'react';
import {View,Image,StyleSheet,Text,TouchableOpacity,TextInput,ScrollView} from  'react-native'
import { Container, Content, Picker, Form } from "native-base";

// import Preference from 'react-native-preference'
import {NavigationActions, StackActions} from "react-navigation";
import Header from "../../../component/Header";
import SaleOwnerMembership from "../../HomeScreens/SaleOwnerMembership";
import LenderMembership from "../../HomeScreens/LenderMembership";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class ForgotPassword extends Component{
    static contextType = DarkModeContext;

    constructor(props){
        super(props)
    this.state={
            name:"",
            email:"",
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

    leftAction(){

    }
    rightAction(){

    }

    render(){
        const {appThemeMode}=this.state
        return(
            <ScrollView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ?  Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    centerComponent={"REGISTER/SIGN IN"}
                    bottomBorderColor={"#EF4867"}
                />
                <View style={{justifyContent:'space-between',flexDirection:'row',margin:20}}>
                        <TouchableOpacity
                        onPress={()=>{
                            // this.props.navigation.navigate('sign_in')
                            }}>
                        <Text style={{fontSize:22,color:'#00B7B0',fontWeight:'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                         onPress={()=>{
                             this.props.navigation.navigate('ProfileForm')
                         }}>
                        <Text style={{fontSize:22,color:'#707071',fontWeight:'bold'}}>Next</Text>
                        </TouchableOpacity>
                </View>
                <View style={{height:60,marginStart:20,marginEnd:20,borderColor:'#707071',borderWidth:1}}>
                    <TextInput secureTextEntry={true} placeholderTextColor='#707071' onChangeText={(text)=>{this.setState({name:text})}} value={this.state.name} placeholder={"Create Password"} style={{width:'95%',height:60,fontSize:18,marginStart:10,color:appThemeMode==='light' ?  Colors.black :Colors.white}}/>
                </View>
                <TouchableOpacity  onPress={()=>{
                    this.props.navigation.navigate("ForgotPassword")
                }}>
                <Text style={{fontSize:22,color:'#005271',fontWeight:'bold',textAlign:"center",marginTop:10,fontStyle:"italic"}}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                        this.props.navigation.navigate("MainBottomTab")
                    }}
                    style={{height:50,margin:20,borderColor:'#D1AE5E',borderWidth:1,backgroundColor: '#D1AE5E',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>Continue</Text>
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


});

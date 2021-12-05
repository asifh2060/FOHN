import React, { Component } from 'react';
import {View,Image,StyleSheet,Text,TouchableOpacity,TextInput,ScrollView,Dimensions} from  'react-native'
// import Preference from 'react-native-preference'
import {NavigationActions, StackActions} from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const {height, width} = Dimensions.get('window');
import appColor from "../../../component/appColor"


export default class CheckOut extends Component{

    constructor(props){
        super(props);
        this.state={
        }
    }

    componentWillMount() {
    }

    leftAction(){
        this.props.navigation.goBack()
    }
    rightAction(){}
    render()
    {
        return(
            <View  style={{flex: 1,backgroundColor:"red"}}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'white'}
                    leftIcon={require('../../../assets/images/back.png')}
                    rightIcon={require('../../../assets/images/cartwhite.png')}

                    centerComponent={"CHECKOUT"}
                    backgroundColorHead={"#00B7B0"}
                    bottomBorderColor={"#D9D9DA"}
                />
                <ScrollView style={style.mainContainer}>
                  <Text style={{textAlign:"center",fontWeight:"bold",fontSize:16,color:"#005271",marginTop:10}}>{"Personal Information:"}</Text>
                    <View style={style.inputContainer}>
                        <View style={{margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                            <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"Full Name:"}</Text>
                            <TextInput style={{height:40}} />
                        </View>
                        <View style={{margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                            <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"Email:"}</Text>
                            <TextInput style={{height:40}} />
                        </View>
                        <View style={{margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                            <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"Phone:"}</Text>
                            <TextInput style={{height:40}} />
                        </View>
                        <View style={{margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                            <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"Street Address:"}</Text>
                            <TextInput style={{height:40}} />
                        </View>
                        <View style={{margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                            <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"City:"}</Text>
                            <TextInput style={{height:40}} />
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <View style={{flex:1, margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                                <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"State:"}</Text>
                                <TextInput style={{height:40}} />
                            </View>
                            <View style={{flex:1,margin: 10,borderBottomWidth:3,borderBottomColor:appColor.blue}}>
                                <Text style={{fontSize:16,color:appColor.Gray_Chateau}}>{"Zip:"}</Text>
                                <TextInput style={{height:40}} />
                            </View>
                        </View>
                    </View>


                    <View style={{marginTop:121}}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("PaymentInfo")}}
                            style={{height:70,borderColor:'#707071',borderWidth:1, backgroundColor: "#00B7B0",justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:'white'}}>PAYMENT INFO</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const style=StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#D9D9DA'
    },
    inputContainer:{
        flex: 1,
        backgroundColor: "white",
        margin:10
    }

});

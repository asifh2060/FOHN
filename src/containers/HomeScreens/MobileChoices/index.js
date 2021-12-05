import React, { Component } from 'react';
import {View,Image,StyleSheet,Text,TouchableOpacity,TextInput,ScrollView,Dimensions} from  'react-native'
// import Preference from 'react-native-preference'
import {NavigationActions, StackActions} from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
const {height, width} = Dimensions.get('window');



export default class MobileChoices extends Component{

    constructor(props){
        super(props);
        this.state={
            isEnable:true
        }
    }
    CheckState(state){
        if (state){
            this.setState({isEnable:false})
        }
        else
            this.setState({isEnable:true})

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
            <ScrollView style={style.mainContainer}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"Mobile Choices"}
                />
                <View style={{flex: 1,backgroundColor: '#D1AE5E',width:width,height:height-120}}>
                    <View style={{marginBottom:10}}>
                        <View style={{justifyContent:'center',alignItems:'center',}}>
                            <Image source={require('../../../assets/images/FOHN_APPLoginLogo.png')} resizeMode={'contain'} style={{width:200,height:200}} />
                        </View>
                        <View style={{justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'white',height:220,marginTop:50}}>
                        </View>

                    </View>
                </View>
                <TouchableOpacity style={{justifyContent:'center',alignItems:'center',height:60}}>
                    <Text style={{color:"#005271"}}>{"Find Open Houses Now ver..."}</Text>
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

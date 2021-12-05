import React, { Component } from 'react';
import { Image, StyleSheet, ImageBackground, Text, TouchableOpacity, ScrollView } from 'react-native';
import Preference from "react-native-preference";
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

export default class Landing extends Component {

    constructor(props){
        super(props);
        this.state={
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
    CheckData = () => {
        const userData = Preference.get('userData');
        console.log('check user data==>',userData)
        if(userData){
            this.props.navigation.navigate('CreateOpenHouse');
        }
        else{
            this.props.navigation.navigate('sign_in',{
                postHouse: true
            }) 
        }
    }
    render() {
        const {appThemeMode}=this.state
        return (
            <ImageBackground style={{ width: '100%', height: '100%' }} resizeMode={'cover'} source={require('../../../assets/images/component3.png')}>
                <ScrollView style={{ flex: 1, backgroundColor: 'rgba(0,0,0, 0.6)' }}>
                    <Image style={{ width: 300, height: 350, alignSelf: 'center', marginTop: 50 }} resizeMode={'contain'} source={require('../../../assets/images/FOHN_APPLoginLogo.png')} />
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('MainBottomTab') }} style={[style.innerView, { marginTop: 100 }]}>
                        <Text style={style.textFormate}>{'FIND OPEN HOUSE'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => {this.CheckData()}}
                    // onPress={() => { this.props.navigation.navigate('Register') }} 
                    // onPress={() => { this.props.navigation.navigate('ProfileForm') }} 
                    style={[style.innerView, { backgroundColor: '#00B7B0', marginTop: 30 }]}>
                        <Text style={style.textFormate}>{'POST OPEN HOUSE'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('sign_in') }} style={[style.innerView, { backgroundColor: '#005271', marginTop: 30, marginBottom: 40 }]}>
                        <Text style={style.textFormate}>{'REGISTER/SIGN IN'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "green"
    },
    innerView: {
        height: 70,
        backgroundColor: '#EF4867',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textFormate: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    }


});

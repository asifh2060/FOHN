import React, { Component } from 'react';
import {View,Image,StyleSheet,Text,TouchableOpacity,TextInput,ScrollView,Alert} from  'react-native'
import Preference from 'react-native-preference'
import {NavigationActions, StackActions} from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from 'toggle-switch-react-native';
import SimpleToast from "react-native-simple-toast";
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";




export default class notification extends Component{

    constructor(props){
        super(props);
        this.state={
            isEnable:true,
            isFromSearch: props.navigation.getParam('search'),
            propertyList: props.navigation.getParam('propertyList'),
            streetAddress: props.navigation.getParam('streetAddress'),
            loading: false,
            LoginUserId: Preference.get('userData'),
            propertyIdsList: []

        }
    }

    componentDidMount = () => {
        // console.log('checking properties===>',this.state.propertyList);
        this.state.propertyList.map((item) => {
            this.state.propertyIdsList.push(item.id);
        });
        console.log('checking property ids===>',this.state.propertyIdsList)
    }

    componentWillMount() {

    }
    CheckState(state){
        if (state){
            this.setState({isEnable:false})
        }
        else
            this.setState({isEnable:true})

    }

    savedUserSearchProperties = () => {
        const details = {
            title: this.state.streetAddress,
            user_id: this.state.LoginUserId.id,
            ids: this.state.propertyIdsList

        };
        this.setState({
            loading: true
        })
        console.log("Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.SAVE_USER_SEARCH, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestPramas,
        }).then(response => {
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            if (response.status === "200") {
                this.props.navigation.navigate("saved_open_houses");
            }
            else if (response.status === "404") {
                Alert.alert(
                    null,
                    response.message,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show(response.message)
            }
            this.setState({ loading: false });

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    SavedProperties = () => {
        if(this.state.isFromSearch){
            if(this.state.streetAddress == ''){
                Alert.alert(
                    null,
                    'Name is required',
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                ) 
                // SimpleToast.show('Name is required');
                return
            }
            this.savedUserSearchProperties()
        }
    }

    leftAction(){

    }
    rightAction(){

    }
    render(){
        return(
            <ScrollView style={style.mainContainer}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    bottomBorderColor={"#EF4867"}
                    centerComponent={"SAVED SEARCH"}
                />
                <View style={{justifyContent:'space-between',flexDirection:'row',margin:20}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                        <Text style={{fontSize:22,color:'#00B7B0',fontWeight:'bold'}}>CANCEL</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate("saved_open_houses")}}> */}
                    <TouchableOpacity onPress={()=>{this.SavedProperties()}}>
                        <Text style={{fontSize:22,color:'#00B7B0',fontWeight:'bold'}}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity  style={{height:60,borderTopColor:'#707070',borderTopWidth:1,borderBottomColor:'#707070',borderBottomWidth:1,justifyContent:'space-between',marginTop:30,justifyContent:'center'}}>
                    <View style={{marginStart:20,marginEnd:10,flexDirection:'row',alignItems:"center",}}>
                        <Text style={{fontSize:18,color:"#707070",}}>{"NAME"}</Text>
                        <TextInput 
                        value={this.state.streetAddress}
                        onChangeText={(text) => this.setState({streetAddress: text})}
                        placeholderTextColor={"#707070"} 
                        style={{fontSize:18,color:"#707070",marginStart:20,flex: 1,textAlign: 'center',}} 
                        placeholder={"Acreages near me"} />

                        {/*<Text style={{fontSize:22,color:'#707070'}}>NAME</Text>*/}
                    {/*    <Text style={{fontSize:22,color:'#707070'}}>Acreages near me</Text>*/}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{height:60,borderTopColor:'#707070',borderBottomColor:'#707070',borderBottomWidth:1,justifyContent:'space-between',justifyContent:'center'}}>

                    <View style={{marginStart:20,marginEnd:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <Text style={{fontSize:22,color:'#707070'}}>Email Notification</Text>
                        <View style={{marginEnd:15,margin:10}}>
                            <ToggleSwitch
                                isOn={this.state.isEnable}
                                onColor={'#00B7B0'}
                                offColor={"black"}

                                labelStyle={{ color: '#00B7B0', fontWeight: "100"}}
                                size="medium"
                                onToggle={()=>this.CheckState(this.state.isEnable)}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <ProgressBar visible={this.state.loading} />
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

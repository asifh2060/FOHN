import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
    FlatList,
    Alert
} from 'react-native'
// import Preference from 'react-native-preference'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window');
import fontFamily from "../../../assets/fonts"
import SimpleToast from 'react-native-simple-toast';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'




export default class SortOrder extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);

        this.state = {
            OpenHouseDate: false,
            RecentlyChanged: false,
            Newest: false,
            LToH: false,
            HToL: false,
            Bedrooms: false,
            Bathrooms: false,
            SquareFeet: false,
            LotSize: false,
            YearBuilt: false,
            SelectedIndex: 1,
            appThemeMode:'light'

        }

    }
    componentWillMount() {
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
    leftAction() {

    }
    rightAction() {

    }

    DonePress = () => {
        const { params } = this.props.navigation.state;
        const { SortItems } = params;
        if(this.state.SelectedIndex == 0){
            Alert.alert(
                null,
                'Select one item',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            ) 
            // SimpleToast.show('Please select one item');
            return
        }
        if (SortItems && typeof SortItems == 'function') {
            console.log('checking index of state====>',this.state.SelectedIndex)
            if(this.state.SelectedIndex == 1){
                SortItems('Open House Date');
                this.props.navigation.goBack();
            }
           else if(this.state.SelectedIndex == 2){
                SortItems('Recently Changed');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 3){
                SortItems('Newest');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 4){
                SortItems('Price: low to high');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 5){
                SortItems('Price: high to low');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 6){
                SortItems('Bedrooms');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 7){
                SortItems('Bathrooms');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 8){
                SortItems('Square feet');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 9){
                SortItems('Lot size');
                this.props.navigation.goBack();
            }
            if(this.state.SelectedIndex == 10){
                SortItems('Year Built');
                this.props.navigation.goBack();
            }
        }
    }



    render() {
        const {appThemeMode}=this.state
        return (

            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#707071'}
                    centerComponent={"Sort Order"}
                    bottomBorderColor={"#EF4867"}

                />
                <ScrollView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.DonePress()}>
                            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 1 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Open House Date</Text>
                        </View>
                        {this.state.SelectedIndex == 1 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 2 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Recently Changed</Text>
                        </View>
                        {this.state.SelectedIndex == 2 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 3 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Newest</Text>
                        </View>
                        {this.state.SelectedIndex == 3 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 4 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Price:Low to high</Text>
                        </View>
                        {this.state.SelectedIndex == 4 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 5 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Price:High to Low</Text>
                        </View>
                        {this.state.SelectedIndex == 5 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 6 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Bedrooms</Text>
                        </View>
                        {this.state.SelectedIndex == 6 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 7 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Bathrooms</Text>
                        </View>
                        {this.state.SelectedIndex == 7 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 8 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Square Feet</Text>
                        </View>
                        {this.state.SelectedIndex == 8 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 9 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Lot Size</Text>
                        </View>
                        {this.state.SelectedIndex == 9 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ SelectedIndex: 10 }) }} style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Year Built</Text>
                        </View>
                        {this.state.SelectedIndex == 10 &&
                            <Image source={require("../../../assets/images/check.png")} style={{ tintColor: "#707071", width: 30, height: 30 }} resizeMode={"contain"} />
                        }
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    }
});

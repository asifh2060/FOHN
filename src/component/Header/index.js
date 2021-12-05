import React, { Component } from "react";
import {
    View,
    Dimensions,
    Appearance,
    Image,
    ImageBackground,
    StyleSheet, Text,
    TouchableOpacity
} from "react-native";
import AppColor from "../appColor/index";
const { height, width } = Dimensions.get("window");
import fontFamily from './../../assets/fonts'


export default class Header extends Component {
    render() {
        const colorScheme = Appearance.getColorScheme();
        this.props.bgIcon
        return (
            <View style={[styles.mainContainer,{backgroundColor: this.props.backgroundColorHead,borderBottomColor: this.props.bottomBorderColor}]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.leftAction();
                    }}
                    style={styles.imageButton} >
                    <Image
                        source={this.props.leftIcon}
                        style={[styles.image, { marginLeft: 10, marginTop: 8 ,position:'absolute',tintColor: colorScheme === 'dark'?'white':this.props.LeftIconColor}]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <View style={{ backgroundColor: "transparent",width:'80%', }}>
                    <Text style={[{ width:'100%',textAlign:'center',color: this.props.HeaderColor, fontSize: 22,fontFamily:fontFamily.Bold,fontWeight:"bold" },[this.props.customStyle]]}>{this.props.centerComponent}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.props.rightAction();
                    }}
                    style={styles.imageButton} >
                    <Image
                        source={this.props.rightIcon}
                        style={[styles.image, { right:20 ,position:'absolute',width:50,height:50}]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection:'row',
        alignItems:"center",
        height: 70,
        width: "100%",
        backgroundColor: '#fff',
        borderBottomColor: "#EF4867",
        borderBottomWidth: 8,
    },
    image: {
        marginTop: 0,
        height: 24,
        width: 24,
    },
    imageButton: {
        height: 40,
        width: 40
    }
});

import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native'
import { NavigationActions, StackActions } from "react-navigation";
import Preference from 'react-native-preference';

const resetActionToLanding = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LandingScreen' })],
});

const resetActionToHome = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'MainBottomTab' })],
});

export default class SplashScreen extends Component {
    UNSAFE_componentWillMount() {
        // Preference.clear()
        setTimeout(() => {
            if (Preference.get("userData", null) != null) {
                this.props.navigation.dispatch(resetActionToHome)

            } else {
                this.props.navigation.dispatch(resetActionToLanding)

            }
        }, 2000)
    }
    render() {
        return (
            <View style={style.mainContainer}>
                <Image style={{ width: '100%', height: '100%' }} resizeMode={'cover'} source={require('../../../assets/images/component.png')} />
            </View>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
});

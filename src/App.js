import React, { Component } from 'react';
import Routing from './Routing';
import { SafeAreaView } from 'react-native';
import AppColor from './component/appColor/index'
console.disableYellowBox = true;
import { StatusBar } from 'react-native';
import { ColorSchemeProvider } from 'react-native-dynamic'
import { DarkModeContext, eventEmitter,DarkModeProvider } from 'react-native-dark-mode';
import { Colors } from './utils/Colors'
import Preference from 'react-native-preference'
StatusBar.setHidden(false);
// StatusBar.setBarStyle('light-content');
StatusBar.setBackgroundColor("#EDF0F1");

class App extends Component {
static contextType = DarkModeContext;
    constructor(props) {
        super(props);
        this.state={
            appThemeMode: 'light'

        }
    }
    componentDidMount(){
        Preference.set('mode',this.context)
        this.setState({
            appThemeMode: this.context
        }, () => {
            this.forceUpdate()
            console.log('comp->', this.setState.appThemeMode)
        })
        eventEmitter.on('currentModeChanged', newMode => {
            console.log('Switched to', newMode, 'mode')
            appThemeMode = newMode
            Preference.set('mode',newMode)
        })
    }
    render() {
        return (<SafeAreaView style={{ flex: 1, backgroundColor: "#EDF0F1" }}>
            <DarkModeProvider>
            <Routing mode={this.state.appThemeMode} />
            </DarkModeProvider>
        </SafeAreaView>);
    }
}

export default App;

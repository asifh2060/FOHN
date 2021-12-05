import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    ViewPropTypes as RNViewPropTypes,
    Alert,
    Platform,
    Appearance
} from 'react-native';
import fontFamily from './assets/fonts'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from "./containers/Auth/SplashScreen/SplashScreen";
import LandingScreen from "./containers/Auth/LandingScreen/LandingScreen";
import Register from "./containers/Auth/Register";
import notification from "./containers/HomeScreens/Notification";
import sign_in from "./containers/Auth/SignIn";
import settings from "./containers/HomeScreens/Settings";
import Realtor from "./containers/HomeScreens/Realtor";
import Builder from "./containers/HomeScreens/Builders";
import Lender from "./containers/HomeScreens/Lenders";
import Agent from "./containers/HomeScreens/Agents";
import more from "./containers/HomeScreens/More";
import updates from "./containers/HomeScreens/Updates/updates";
import save_search from "./containers/HomeScreens/SavedSearches";
import search from "./containers/HomeScreens/Search";
import saved_open_houses from "./containers/HomeScreens/SavedOpenHouse";
import MoreFilter from "./containers/HomeScreens/MoreFilter";
import SaleOwnerMembership from "./containers/HomeScreens/SaleOwnerMembership"
import InsuranceAgentMembership from "./containers/HomeScreens/InsuranceAgentMembership"
import RealtorMembership from "./containers/HomeScreens/RealtorMembership"
import BuilderMembership from "./containers/HomeScreens/BuilderMembership"
import LenderMembership from "./containers/HomeScreens/LenderMembership"
import SquareFeet from "./containers/HomeScreens/SquareFeet";
import LotSize from "./containers/HomeScreens/LotSize"
import OtherAmenities from "./containers/HomeScreens/OtherAmenities"
import Views from "./containers/HomeScreens/Views"
import SchoolDistrict from "./containers/HomeScreens/SchoolDistrict"
import Basement from "./containers/HomeScreens/Basement"
import YearBuild from "./containers/HomeScreens/YearBuild"
import ProfileForm from "./containers/HomeScreens/ProfileForm"
import PostOpenHouse from "./containers/HomeScreens/PostOpenHouse"
import sharing_open_house from "./containers/HomeScreens/SharingOpenHouses";
import Faqs from "./containers/HomeScreens/Faqs";
import CustomerSupport from "./containers/HomeScreens/CustomerSupport";
import RateThisApp from "./containers/HomeScreens/RateThisApp";
import PrivacyPolicy from "./containers/HomeScreens/PrivacyPolicy";
import TermsAndCondition from "./containers/HomeScreens/TermsAndCondition";
import MobileChoices from "./containers/HomeScreens/MobileChoices";
import ThirdParty from "./containers/HomeScreens/ThirdParty";
import StacyMartinRealator from "./containers/HomeScreens/StacyMartingRealator";
import OpenHouseTitle from "./containers/HomeScreens/OpenHouseTitle";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MapCircle from "./containers/HomeScreens/MapCircle";
import Calender from "./containers/HomeScreens/Calender";
import SortOrder from "./containers/HomeScreens/SortOrder";
import SearchingHouse from "./containers/HomeScreens/SearchingHouses";
import StacyMartinProfile from './containers/HomeScreens/ProfileScreen';
import MessageStacy from './containers/HomeScreens/MessageStacy';
import FollowStacy from './containers/HomeScreens/FollowStacy';
import Review from './containers/HomeScreens/Review';
import purchaseMemberShip from './containers/HomeScreens/PurchaseMemberShip';
import CheckOut from './containers/HomeScreens/CheckOut';
import PaymentInfo from './containers/HomeScreens/PaymentInfo';
import PostCofirmation from './containers/HomeScreens/PostConfirmation';
import ProfileInbox from './containers/HomeScreens/ProfileInbox';
import CreatePassword from './containers/Auth/CreatePassword';
import ForgotPassword from './containers/Auth/ForgotPassword';
import ViewEditOpenHouse from './containers/HomeScreens/ViewEditOpenHouse';
import EditProfile from './containers/HomeScreens/EditProfile';
import DrawingMap from './containers/HomeScreens/DrawingMap';
import CreateOpenHouse from './containers/HomeScreens/CreateOpenHouse';
import Preference from 'react-native-preference';
import SimpleToast from "react-native-simple-toast";
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './utils/Colors'
console.log('Routing Mode', Preference.get('mode'))

const TabButton = (props) => {
    const contextType = DarkModeContext;

    const { focused, icon, label } = props
    const [mode, setMode] = useState(Appearance.getColorScheme())
    const [ appThemeMode, setAppThemeMode] = useState('light')
    useEffect(() => {
        // const unsubscribe = Appearance.addChangeListener((e) => {
        //     alert("MODE : "+JSON.stringify(Appearance.getColorScheme()))
        //     let scheme=Appearance.getColorScheme();
        //     setMode(scheme.colorScheme)
        // })
        // return unsubscribe

        var a=this.context === 'dark' ? 'dark' :'light'
        setAppThemeMode( a )

        eventEmitter.on('currentModeChanged', newMode => {
            console.log('Switched to', newMode, 'mode')
            // alert(JSON.stringify(newMode))

           setAppThemeMode(newMode)
        })
    }, [])
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: appThemeMode == 'dark' ? focused ? '#00b7b0' : 'black' :focused ? 'white' :'#00b7b0', width: "100%", height: 90, justifyContent: 'center',marginBottom:20,paddingBottom:25,paddingTop:20 }} >
            <View style={{ width: "100%", height: 50, justifyContent: 'center', alignItems: "center" }}>
                <Image source={icon} style={{ resizeMode: "contain", height: 50, width: 50, tintColor: appThemeMode == 'dark' ? focused ? 'white' : '#00b7b0' :focused ? '#00b7b0' :'white' }} />
                <Text style={{ color: appThemeMode == 'dark' ? focused ? 'white' : '#00b7b0' :focused ? '#00b7b0' :'white', fontWeight: "bold", fontSize: 14, textAlign: "center" }}>{label}</Text>
            </View>
        </View>
        // <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: mode == 'dark' ? focused ? '#00b7b0' : 'black' :focused ? 'white' :'#00b7b0', width: "100%", height: 90, justifyContent: 'center',marginBottom:20,paddingBottom:25,paddingTop:20 }} >
        //     <View style={{ width: "100%", height: 50, justifyContent: 'center', alignItems: "center" }}>
        //         <Image source={icon} style={{ resizeMode: "contain", height: 50, width: 50, tintColor: mode == 'dark' ? focused ? 'white' : '#00b7b0' :focused ? '#00b7b0' :'white' }} />
        //         <Text style={{ color: mode == 'dark' ? focused ? 'white' : '#00b7b0' :focused ? '#00b7b0' :'white', fontWeight: "bold", fontSize: 14, textAlign: "center" }}>{label}</Text>
        //     </View>
        // </View>
    )
}

const MainBottomTab = createBottomTabNavigator({

    search: {
        screen: search,
        navigationOptions: ({ navigation }) => ({
            title: 'Search',
        }),
    },
    updates: {
        screen: updates,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ navigation }) => {
                if (Preference.get("userData", "") == null) {
                    Alert.alert(
                        null,
                        "Please Register/Sign In First",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => navigation.navigate('LandingScreen') }
                        ],
                        { cancelable: false }
                    );

                    // SimpleToast.show('Please login first');
                }
                else {
                    // title: 'Updates',
                    navigation.navigate('updates')
                    // SimpleToast.show('Under Progress');
                }

            },

        }),
    },
    save_search: {
        screen: save_search,
        navigationOptions: ({ navigation }) => ({

            tabBarOnPress: ({ navigation }) => {
                if (Preference.get("userData", "") == null) {
                    Alert.alert(
                        null,
                        "Please Register/Sign In First",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => navigation.navigate('LandingScreen') }
                        ],
                        { cancelable: false }
                    );
                    // SimpleToast.show('Please login first');
                }
                else {
                    // title: 'Updates',
                    navigation.navigate('save_search')
                }

            },

            // title: 'Saved',
        }),
    },
    more: {
        screen: more,
        navigationOptions: ({ navigation }) => ({
            title: 'More',
        }),
    },
},
    {
        tabBarOptions: {
            showLabel: false,
            labelStyle: {
                fontSize: 18,
                fontFamily: fontFamily.Bold,
            },
            activeTintColor: 'white',
            inactiveTintColor: 'white',
            keyboardHidesTabBar: true,
            pressColor: 'gray',
            style: {
                padding: 5,
                height: 50,
                backgroundColor: '#EDF0F1',
                borderTopWidth: 0,
                width: "100%"
            },
        },
        initialRouteName: 'search',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                if (routeName === 'search') {
                    return (
                        <TabButton
                            icon={require('../src/assets/images/Search_White.png')}
                            label={'Search'}
                            focused={focused}
                        />
                    )
                }
                else if (routeName === 'updates') {
                    return (
                        <TabButton
                        icon={require('../src/assets/images/updates_teal.png')}
                        label={'Updates'}
                        focused={focused}
                    />
                    )

                }
                else if (routeName === 'save_search') {
                    return (
                        <TabButton
                        icon={require('../src/assets/images/Saved_White.png')}
                        label={'Saved'}
                        focused={focused}
                    />
                    )
                }
                else if (routeName === 'more') {
                    return (
                        <TabButton
                        icon={require('../src/assets/images/More_White.png')}
                        label={'More'}
                        focused={focused}
                    />
                    )
                }
            },

        })
    }
);

const AppNavigator = createStackNavigator({
    SplashScreen: SplashScreen,
    MainBottomTab: MainBottomTab,
    LandingScreen: LandingScreen,
    Register: Register,
    notification: notification,
    sign_in: sign_in,
    settings: settings,
    Realtor: Realtor,
    Lender: Lender,
    Agent: Agent,
    Builder: Builder,
    saved_open_houses: saved_open_houses,

    Faqs: Faqs,
    RateThisApp: RateThisApp,
    CustomerSupport: CustomerSupport,
    PrivacyPolicy: PrivacyPolicy,
    TermsAndCondition: TermsAndCondition,
    MobileChoices: MobileChoices,
    ThirdParty: ThirdParty,
    StacyMartinRealator: StacyMartinRealator,
    OpenHouseTitle: OpenHouseTitle,
    sharing_open_house: sharing_open_house,
    MapCircle: MapCircle,
    Calender: Calender,
    MoreFilter: MoreFilter,
    LenderMembership: LenderMembership,
    RealtorMembership: RealtorMembership,
    BuilderMembership: BuilderMembership,
    SaleOwnerMembership: SaleOwnerMembership,
    InsuranceAgentMembership: InsuranceAgentMembership,
    SquareFeet: SquareFeet,
    LotSize: LotSize,
    OtherAmenities: OtherAmenities,
    Views: Views,
    Basement: Basement,
    YearBuild: YearBuild,
    SchoolDistrict: SchoolDistrict,
    ProfileForm: ProfileForm,
    PostOpenHouse: PostOpenHouse,
    SortOrder: SortOrder,
    SearchingHouse: SearchingHouse,
    StacyMartinProfile: StacyMartinProfile,
    MessageStacy: MessageStacy,
    FollowStacy: FollowStacy,
    Review: Review,
    DrawingMap :DrawingMap,
    purchaseMemberShip: purchaseMemberShip,
    CheckOut: CheckOut,
    PaymentInfo: PaymentInfo,
    CreatePassword: CreatePassword,
    PostCofirmation: PostCofirmation,
    ProfileInbox: ProfileInbox,
    ForgotPassword: ForgotPassword,
    ViewEditOpenHouse: ViewEditOpenHouse,
    EditProfile: EditProfile,
    CreateOpenHouse: CreateOpenHouse
},
    {
        initialRouteName: "SplashScreen",
        headerMode: "none"
    }
);
export default createAppContainer(AppNavigator)

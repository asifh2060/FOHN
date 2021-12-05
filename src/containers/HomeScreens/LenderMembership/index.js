import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, SafeAreaView, ImageBackground,Alert } from 'react-native'
import fontFamily from './../../../assets/fonts'
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import { API } from "../../../utils/constants";
import ProgressBar from './../../../component/ProgressBar';
import moment from 'moment'
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'
import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';

export default class LenderMembership extends Component {
    static contextType = DarkModeContext;
    purchaseUpdateSubscription = null
    purchaseErrorSubscription = null
    constructor(props) {
        super(props);
        this.state = {
            appThemeMode:'light',
            subPrice:0,
            Feature_Realtor: [
                {
                    detail: "Lender Monthly Membership",
                    price: "$29.99",
                    point1: "Professional, Searchable Profile",
                    point2: "User Notifications & Updates",
                    point3: 'Advertising in platform when users are searching for an open house your area',
                    point4: 'Upgraded Social Media Exposure, Email Marketing',
                    point5: '',
                    isMonthly: true,
                    subScriptionId: 'com.subscription.lender_ins_agent.monthly'
                },
                {
                    detail: "Lender Yearly Membership",
                    price: "$329.00",
                    point1: "Professional, Searchable Profile",
                    point2: "User Notifications & Updates",
                    point3: 'Advertising in platform when users are searching for an open house your area',
                    point4: 'Upgraded Social Media Exposure, Email Marketing',
                    point5: '',
                    isMonthly: false,
                    subScriptionId: 'com.subscription.lender_ins_agent.yearly'
                },

            ],
            loading: false
        }

    }

    componentDidMount() {
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
            },()=>{
              this.forceUpdate()
            })
        })
        RNIap.initConnection().then(() => {
            RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
            }).then(() => {
                this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase) => {
                    console.log('purchaseUpdatedListener', purchase);
                    const receipt = purchase.transactionReceipt;
                    if (receipt) {
                        yourAPI.deliverOrDownloadFancyInAppPurchase(purchase.transactionReceipt)
                            .then(async (deliveryResult) => {
                                if (isSuccess(deliveryResult)) {
                                    if (Platform.OS === 'ios') {
                                        await RNIap.finishTransactionIOS(purchase.transactionId);
                                        Alert.alert(
                                            'Success',
                                            'Membership purchase sucessfully',
                                            [
                                                {
                                                    text: 'OK', onPress: () => {
                                                        // this.props.navigation.navigate("purchaseMemberShip", {
                                                        //     itemPrice: this.state.subPrice
                                                        // })
                                                        this.props.navigation.navigate('sign_in')
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    } else if (Platform.OS === 'android') {
                                        await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                                        await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                                        Alert.alert(
                                            'Success',
                                            'Membership purchase sucessfully',
                                            [
                                                {
                                                    text: 'OK', onPress: () => {
                                                        // this.props.navigation.navigate("purchaseMemberShip", {
                                                        //     itemPrice: this.state.subPrice
                                                        // })
                                                        this.props.navigation.navigate('sign_in')
                                                    }
                                                }
                                            ],
                                            { cancelable: false }
                                        );
                                    }
                                    await RNIap.finishTransaction(purchase, true);
                                    await RNIap.finishTransaction(purchase, false);
                                } else {
                                    // Retry / conclude the purchase is fraudulent, etc...
                                }
                            });
                    }
                });
                this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
                    console.warn('purchaseErrorListener', error);
                });
            })
        })
    }

    componentWillUnmount() {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
    }

    requestPurchase = async (sku: string) => {
        try {
            await RNIap.requestPurchase(sku, false);
        } catch (err) {
            console.warn(err.code, err.message);
        }
    }

    getPackages = () => {
        this.setState({ loading: true })

        let URLWithAuth = API.GET_PACKAGES + '?oauth_consumer_key=ck_80dc4e37e4e6873036746c7e6a1aa171fd2a564b&oauth_nonce=mVsSLMNT7mi&oauth_signature=VXjuHFC2zl5qqaQqofnFz1FTpE0=&oauth_signature_method=HMAC-SHA1&oauth_timestamp=' + moment().format('X') + '&oauth_version=1.0'
        
        fetch(URLWithAuth, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => {
            // console.log('response before json:', response);
            return response.json();
        }).then(response => {
            this.setState({ loading: false });
            console.log('checkEmailApi Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                let instance = response;
                let lenderMembershipPlans = [];
                instance.map((item) => {
                    if (item.name == 'Lender Monthly Membership') {
                        lenderMembershipPlans.push(item);

                    }
                })
                this.setState({ Feature_Realtor: lenderMembershipPlans })
            }
            else {




            }
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    componentWillMount() {
    }

    leftAction() {
        this.props.navigation.goBack()
    }
    rightAction() {

    }
    renderItem(item) {
        return (
            <View style={[style.shadowOffset]}>
                <View style={{ marginStart: 5, width: '98%' }}>
                    <View style={[style.listItemHeadCont]}>
                        <Image
                            resizeMode={'contain'}
                            style={style.listArrow}
                            source={require('../../../assets/images/bullseye.png')}
                        />
                        <View style={{ width: '80%' }}>
                            <Text style={style.listHeadingText}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', }}>
                                <Text style={style.listPriceText}>{item.price}  </Text>
                                <View style={{ height: 2, width: '83%', backgroundColor: '#D1AE5E' }} />
                                {/* {item.isMonthly === true ?
                                    <View style={{ height: 2, width: '83%', backgroundColor: '#D1AE5E' }} />
                                    :
                                    <Text style={{ color: '#C5BD07', fontStyle: 'italic',fontWeight:'bold' }}>      1 Month Free</Text>
                                } */}
                            </View>
                        </View>
                    </View>

                    <View style={[style.listInnerItemCont, { marginTop: 10 }]}>
                        <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/tick.png')}
                        />
                        <Text style={style.listNormalText}>{item.description}</Text>
                    </View>
                    <View style={style.listInnerItemCont}>
                        <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/tick.png')}
                        />
                        <Text style={style.listNormalText}>{item.point2}</Text>
                    </View>
                    <View style={style.listInnerItemCont}>
                        <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/tick.png')}
                        />
                        <Text style={style.listNormalText}>{item.point3}</Text>
                    </View>
                    <View style={style.listInnerItemCont}>
                        <Image
                            resizeMode={'contain'}
                            style={style.listIcon}
                            source={require('../../../assets/images/tick.png')}
                        />
                        <Text style={style.listNormalText}>{item.point4}</Text>
                    </View>
                    {item.point5 === '' ? null :
                        <View style={style.listInnerItemCont}>
                            <Image
                                resizeMode={'contain'}
                                style={style.listIcon}
                                source={require('../../../assets/images/tick.png')}
                            />
                            <Text style={style.listNormalText}>{item.point5}</Text>
                        </View>
                    }
                </View>
                <TouchableOpacity onPress={() => {
                     this.setState({
                        subPrice:item.price
                    },()=>{
                        this.requestPurchase(item.subScriptionId)
                    })
                }}

                    style={style.listBtnTouch}>
                    <Text style={style.btnTxt}>SUBSCRIBE NOW</Text>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <SafeAreaView style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ?  Colors.white :Colors.black }]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#0996A4'}
                    customStyle={{ fontSize: 20 }}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"LENDER MEMBERSHIPS"}
                    bottomBorderColor={"#EF4867"}
                    LeftIconColor={appThemeMode==='light' ? Colors.black :Colors.white }
                    backgroundColorHead={appThemeMode==='light' ? Colors.white :Colors.black }

                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[style.mainContainer, { marginTop: 20,backgroundColor:appThemeMode==='light' ?  Colors.white :Colors.black  }]}>
                    <View style={{ alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={style.baseText}>Reach your target market
                           <Text style={style.innerText}> where home buyers are already looking for their new home, lending, and home insurance all in one place.</Text>
                        </Text>
                        <View style={style.goldenBar} />
                        <Text style={style.baseText}>Take control of your advertising
                           <Text style={style.innerText}> and take advantage of a one-stop shop app and web experience. By expanding your network digitally through our platform, buyers will find you through customized search and marketing. Expand your reach, expand your network!</Text>
                        </Text>
                    </View>
                    <FlatList contentContainerStyle={{ marginStart: 10, marginEnd: 10, marginBottom: 20 }}
                        data={this.state.Feature_Realtor}
                        renderItem={({ item, index }) => (
                            this.renderItem(item)
                        )}
                        extraData={this.state}
                        keyExtractor={item => item.id}
                    />
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    baseText: {
        fontWeight: 'bold',
        color: '#385C8E',
        fontSize: 16,
        fontStyle: 'italic'
    },
    innerText: {
        color: 'gray',
        fontFamily: fontFamily.Regular,
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
    shadowOffset: {
        borderWidth: 1,
        borderColor: 'gray',
        marginStart: 5,
        marginEnd: 5,
        marginTop: 10,
        marginBottom: 5,
        paddingTop: 5,
        padding: 2
    },
    listInnerItemCont: {
        width: '97%',
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        marginLeft: 15
    },
    listItemHeadCont: {
        width: '97%',
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    listNormalText: {
        width: '86%',
        color: '#707071',
        fontSize: 12,
        fontFamily: fontFamily.SemiBold,
        marginLeft: 10,
        lineHeight: 18
    },
    listHeadingText: {
        width: '100%',
        color: '#105D7A',
        fontSize: 15,
        fontFamily: fontFamily.Bold,
        marginLeft: 10,
    },
    listPriceText: {
        color: '#105D7A',
        fontSize: 15,
        fontFamily: fontFamily.Bold,
    },
    listIcon: {
        width: 20,
        height: 20,
    },
    listArrow: {
        width: 45,
        height: 45
    },
    listSocialImg: {
        width: 32,
        height: 32
    },
    listBtnTouch: {
        width: '95%',
        height: 45,
        marginTop: 15,
        marginBottom: 5,
        borderColor: '#707071',
        borderWidth: 1,
        backgroundColor: '#EF4867',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    btnTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Bold,
        color: 'white'
    },
    goldenBar: {
        height: 2,
        width: '95%',
        backgroundColor: '#D1AE5E',
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 7
    },
});

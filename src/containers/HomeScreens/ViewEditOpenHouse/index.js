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
import { NavigationActions, StackActions } from "react-navigation";
import Header from "../../../component/Header";
import ToggleSwitch from "toggle-switch-react-native";
import MapView from "react-native-maps";
const { height, width } = Dimensions.get('window');
import fontFamily from './../../../assets/fonts'
import RangeSlider from 'rn-range-slider';
import CheckBox from '@react-native-community/checkbox';
import RoundCheckbox from 'rn-round-checkbox';
import appColor from '../../../component/appColor';
// import {Picker} from '@react-native-community/picker';
import { Picker } from "native-base";
import Preference from 'react-native-preference';
import {API} from "../../../utils/constants";
import SimpleToast from "react-native-simple-toast";
import moment from 'moment';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'


export default class ViewEditOpenHouse extends Component {
    static contextType = DarkModeContext;

    constructor(props) {
        super(props);
        this.state = {
            Feature_Realtor:[],
            isLoadingMap: false,
            isPrice: false,
            isHome: false,
            toggleCheckBox: 'false',
            setToggleCheckBox: 'false',
            value1:true,
            value2:true,
            value3:true,
            SelectedValue:"",
            SelectedValueMax:"",
            userData: Preference.get("userData"),
            loading: false,
            appThemeMode:'light'

        }

    }

    componentDidMount = () => {
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
        const { navigation } = this.props;
        this.focusListner = navigation.addListener('didFocus', () => {
            this.GetPropertiesById(this.state.userData.id)
        })
        this.GetPropertiesById(this.state.userData.id)
    }
    componentWillMount() {
        if (this.focusListener) {
            this.focusListner = null;
        }
    }

    GetPropertiesById = (UserId) => {
        const details = {
            user_id: UserId,
            login_user_id: this.state.userData.id
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
        fetch(API.GET_PROPERTIES_BY_USER_ID, {
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
            console.log('getUserDetailApi Response:======? data of user id ' + JSON.stringify(response));
            if (response.status === "200") {
                let instance = response.body;
                console.log('checking length of data==>',instance.length)
                this.setState({Feature_Realtor: instance})

            } else {
                Alert.alert(
                    null,
                    response.message,
                    [
                       
                        { text: "OK",  onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                )
                // SimpleToast.show(response.message);

            }
            this.setState({loading: false});
        })
            .catch(error => {
                this.setState({loading: false});
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

    renderItem(item){
        // let Image_Http_URL ={uri: item.gallery_images[0]};
        return(
            <View style={{width:"100%",marginTop:10}}>
               <Image source={item.thumbnail_url ?  {uri: item.thumbnail_url} : require('../../../assets/images/img-1.png')} style={style.maimImg} resizeMode={"cover"}/>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("OpenHouseTitle",{
                    propertyId:item.id,
                })}} style={{backgroundColor: "white",height:40,width:"50%",position:'absolute',top:0,justifyContent: "center",}}>
                    <Text style={{color:"#00B7B0",fontSize:16,fontWeight:"bold",paddingLeft: 10}}>{'Open ' + moment(item.post_date).format('MM-DD-YYYY')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.props.navigation.navigate("CreateOpenHouse",{isEdit: true,item: item}) } style={{backgroundColor: "#00B7B0",height:40,width:"30%",position:'absolute',top: 130,right:0,bottom:0,justifyContent: "center",alignItems: "center",}}>
                    <Text style={{color:"white",fontSize:16,fontWeight:"bold"}}>{"Edit"}</Text>
                </TouchableOpacity>


                <Image source={require('../../../assets/images/heart.png')} resizeMode={"contain"} style={style.imgHeart}/>
                <View style={{marginStart:20,marginTop:10,flexDirection: "row"}}>
                    {/* <Text style={{fontSize:16,fontFamily:fontFamily.Bold,color:"#707070"}}>{item.post_title}</Text> */}
                    <Text style={{fontSize:18,fontWeight:'900',color:"#707070"}}>{'$' +item.Property_Price}{'  '}</Text>
                    {/* <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",marginLeft:20,flex:1}}>{item.post_content}</Text> */}
                    <Text style={{fontSize:12,fontFamily:fontFamily.Bold,color:"#707070",alignSelf: "center"}}>{item.no_of_bedrooms ? item.no_of_bedrooms + ' beds' : 0 + " beds"}{'  '}</Text>
                    <Text style={{fontSize:12,fontFamily:fontFamily.Bold,color:"#707070",alignSelf: "center"}}>{item.no_of_bathroom ? item.no_of_bathroom + ' bath' : 0 + " ba"} {' '}</Text>
                    <Text style={{fontSize:12,fontFamily:fontFamily.Bold,color:"#707070",alignSelf: "center"}}>{item.square_feet } {' '}</Text>
                </View>
                {/* <View style={{marginStart:20,}}>
                    <Text style={{fontSize:18,fontFamily:fontFamily.Bold,color:"#707070",fontWeight:"bold"}}>{item.post_title}</Text>
                    <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",flex:1}}>{item.post_content}</Text>
                </View> */}
                <Text style={{fontSize:16,fontWeight:"100",color:"#707070",flex:1,marginStart:20}}>{item.open_house_street_address}</Text>
                <TouchableOpacity  style={{flexDirection: "row",marginStart:20,alignItems: "center",marginBottom: 10}}>
                    <View style={{width:10,height:10,borderRadius:10/2,borderWidth:1,backgroundColor:"#EB5E3E"}}></View>
                    <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",flex:1,marginStart:5}}>{'House for Sale'}</Text>
                </TouchableOpacity>
                <View style={{flex:1,height:7,backgroundColor:"#EF4867"}}></View>
            </View>
        )
    }
    onValueChange(value: string) {
        this.setState({SelectedValue:value})
    }
    onValueChangeMax(value: string){
        this.setState({SelectedValueMax:value})
    }
    render() {
        const {appThemeMode}=this.state

        return (
            <View style={{flex: 1, marginTop: 20,backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black }}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    leftIcon={require('../../../assets/images/back.png')}
                    centerComponent={"VIEW/EDIT OPEN HOUSE"}
                    bottomBorderColor={"#EF4867"}
                />
                <View style={{flex: 1}}>
                    <FlatList
                        style={style.flatliststy}
                        data={this.state.Feature_Realtor}
                        renderItem={({item,index})=>(
                            this.renderItem(item)
                        )}
                        extraData={this.state}
                        keyExtractor={item=>item.id}
                    />
                </View>
                <ProgressBar visible={this.state.loading}/>
            </View>
        )
    }
}

const style = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    map: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
    },
    searchOuterCont: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white'
    },
    searchCont: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginStart: 10,
        marginEnd: 25,
        marginTop: 3,
        borderColor: '#707070',
        borderWidth: 1,
        height: 46,
        alignItems: 'center',
        width: '89%',
    },
    searchInput: {
        fontSize: 14,
        textAlign: 'center',
        height: 46,
        color: '#707071',
        width: '75%',
        fontFamily: fontFamily.Regular
    },
    searchImg: {
        width: 27,
        height: 36,
        marginEnd: 5,
        marginStart: 5,
    },
    searchLoc: {
        width: 23,
        height: 34,
        marginEnd: 5,
        marginStart: 5,
    },
    listTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Regular
    },
    fliterTxt: {
        fontSize: 20,
        color: 'white',
        fontFamily: fontFamily.Regular
    },
    filterBar: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#00B7B0'
    },

    filterBar2: {
    justifyContent: 'space-between',
        flexDirection: 'row',
        // padding: 8,
        backgroundColor: 'white'
},
    circle: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginBottom: 10,
    },
    circleTxt: {
        fontSize: 11,
        fontFamily: fontFamily.Regular,
        color: 'blue'
    },
    priceCont: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    priceTxt: {
        fontSize: 16,
        fontFamily: fontFamily.SemiBold
    },
    resultTxt: {
        color: 'gray',
        fontFamily: fontFamily.Regular
    },
    priceGetTxtCont: {
        height: 40,
        width: 150,
        borderWidth: 1,
        borderColor: 'gray',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    triangle: {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        alignSelf: 'center',
        borderBottomColor: 'red',
        transform: [
            { rotate: '180deg' }
        ]
    },
    arrowBackWhite: {
        backgroundColor: 'white',
        width: 27,
        height: 2,
        marginTop: -1,
        alignSelf: 'center'
    },
    arrowCont: {
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: 'white'
    },
    arrowLeftLine: {
        width: 18,
        height: .8,
        backgroundColor: 'gray',
        marginTop: -6,
        marginRight: -1.9,
        transform: [{ rotate: '40deg' }]
    },
    arrowRightLine: {
        width: 18,
        height: .8,
        backgroundColor: 'gray',
        marginLeft: -1.9,
        marginTop: -6,
        transform: [{ rotate: '-40deg' }]
    },
    priceBottomCont: {
        flexDirection: 'row',
        width: '100%',
        height: 42,
        backgroundColor: '#005271',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    priceRestTxt: {
        fontSize: 16,
        fontFamily: fontFamily.Bold,
        color: 'white'
    },
    priceDoneBtn: {
        width: 90,
        height: 34,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    priceDoneTxt: {
        color: '#005271',
        fontFamily: fontFamily.Bold,
        fontSize: 16,
    },
    checkTxt: {
        color: 'gray',
        fontFamily: fontFamily.Regular,
        fontSize: 14,
        marginLeft: 8
    },
    checkBoxRow: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 20,
    },
    checkBoxCont: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
        marginTop:5
    },
    maimImg:{
        width:'100%',
        height:180
    },
    imgHeart:{
        width:20,
        height:20,
        position:"absolute",
        right:20,
        top:5,
        tintColor:"white"
    },


});

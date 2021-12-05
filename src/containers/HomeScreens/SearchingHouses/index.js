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
    FlatList
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
import { Picker } from "native-base";
// import {Picker} from '@react-native-community/picker';
import moment from 'moment';

export default class SearchingHouse extends Component {

    constructor(props) {
        super(props);
        this.state = {

            Feature_Realtor: props.navigation.getParam("propertyList"),
/*
            Feature_Realtor:[
                {
                    name:"$500,000",
                    addressHouse:"3158 NW 84th Ave, Ankeny, IA",
                    detailHouse:"4bds  2 ba  1851 sqft",
                    image: require('../../../assets/images/img-1.png'),
                    imageHeart: require('../../../assets/images/heart.png'),
                    type:"House for sale"
                },
                {
                    name:"$500,000",
                    addressHouse:"3158 NW 84th Ave, Ankeny, IA",
                    detailHouse:"4bds  2 ba  1851 sqft",
                    image: require('../../../assets/images/img-2.png'),
                    imageHeart: require('../../../assets/images/heart.png'),
                    type:"House for sale"
                },
                {
                    name:"$500,000",
                    addressHouse:"3158 NW 84th Ave, Ankeny, IA",
                    detailHouse:"4bds  2 ba  1851 sqft",
                    image: require('../../../assets/images/img-3.png'),
                    imageHeart: require('../../../assets/images/heart.png'),
                    type:"House for sale"
                },
                {
                    name:"$500,000",
                    addressHouse:"3158 NW 84th Ave, Ankeny, IA",
                    detailHouse:"4bds  2 ba  1851 sqft",
                    image: require('../../../assets/images/img-4.png'),
                    imageHeart: require('../../../assets/images/heart.png'),
                    type:"House for sale"
                },
            ],
*/
            isLoadingMap: false,
            isPrice: false,
            isHome: false,
            toggleCheckBox: 'false',
            setToggleCheckBox: 'false',
            value1:true,
            value2:true,
            value3:true,
        }

    }

    componentDidMount = () => {
        console.log('checkimng length of property===>',this.state.Feature_Realtor)
        

    }

    componentWillMount() {
    }
    leftAction() {

    }
    rightAction() {

    }
    renderPrice() {
        return (
            <View style={{ backgroundColor: 'white', }}>
                <View style={style.priceCont}>
                    <Text style={style.priceTxt}>Price Range </Text>
                    <Text style={style.resultTxt}>(Results)</Text>
                </View>
                <View style={style.priceGetTxtCont}>
                    <Text style={style.priceTxt}>Price: </Text>
                    <Text style={[style.priceTxt, { color: 'gray' }]}>Any</Text>
                </View>
                <View style={style.arrowBackWhite} />
                <View style={style.arrowCont} >
                    <View style={style.arrowLeftLine} />
                    <View style={style.arrowRightLine} />
                </View>
                <RangeSlider
                    style={{ width: '95%', alignSelf: 'center', height: 70, marginTop: -50, marginBottom: 10, }}
                    gravity={'center'}
                    min={200}
                    max={1000}
                    step={20}
                    selectionColor="#00B7B0"
                    blankColor="#828894"
                    onValueChanged={(low, high, fromUser) => {
                        this.setState({ rangeLow: low, rangeHigh: high })
                    }} />
                <View style={style.priceBottomCont}>
                    <Text style={style.priceRestTxt}>Reset</Text>
                    <TouchableOpacity onPress={() => { this.setState({ isPrice: false }) }} style={style.priceDoneBtn}>
                        <Text style={style.priceDoneTxt}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderHome() {
        return (
            <View style={{ backgroundColor: 'white', }}>
                <View style={[style.priceCont, { marginBottom: 5 }]}>
                    <Text style={style.priceTxt}>Home Type </Text>
                    <Text style={style.resultTxt}>(Results)</Text>
                </View>
                <View style={style.checkBoxRow}>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value1}
                            onValueChange={(newValue) => { this.setState({ value1: newValue }) }}
                        />
                        <Text style={style.checkTxt}>House</Text>
                    </View>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value2}
                            onValueChange={(newValue) => { this.setState({ value2: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Condo</Text>
                    </View>
                </View>
                <View style={style.checkBoxRow}>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value3}
                            onValueChange={(newValue) => { this.setState({ value3: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Townhome</Text>
                    </View>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value4}
                            onValueChange={(newValue) => { this.setState({ value4: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Acreage</Text>
                    </View>
                </View>
                <View style={style.checkBoxRow}>
                    <View style={style.checkBoxCont}>
                        <RoundCheckbox
                            size={22}
                            backgroundColor={'#0996A4'}
                            checked={this.state.value5}
                            onValueChange={(newValue) => { this.setState({ value5: newValue }) }}
                        />
                        <Text style={style.checkTxt}>Lots/Land</Text>
                    </View>
                </View>
                <View style={[style.priceBottomCont, { marginTop: 10 }]}>
                    <Text style={style.priceRestTxt}>Reset</Text>
                    <TouchableOpacity onPress={() => { this.setState({ isHome: false }) }} style={style.priceDoneBtn}>
                        <Text style={style.priceDoneTxt}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderItem(item){
        return(
            <View style={{width:"100%",marginTop:10}}>
                <Image source={{uri:item.thumbnail_url}} style={style.maimImg} resizeMode={"cover"}/>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate("OpenHouseTitle", {
                    propertyId:item.id,
                })}} style={{backgroundColor: "white",height:40,width:"30%",position:'absolute',top:0,justifyContent: "center",alignItems: "center"}}>
                    {/* <Text style={{color:"#00B7B0",fontSize:16,fontWeight:"bold"}}>{"Open "+item.openFrom}</Text> */}
                    <Text style={{color:"#00B7B0",fontSize:16,fontWeight:"bold"}}>{"Open "+ moment(item.post_date).format("MMM-DD") }</Text>
                </TouchableOpacity>
                <Image source={ item.isFavorite == '1' ?  require('../../../assets/images/heart.png') : require('../../../assets/images/unselected_heart.png') } resizeMode={"contain"} style={[style.imgHeart,{tintColor: item.isFavorite == '1' && 'white'}]}/>
               
                <View style={{marginStart:20,marginTop:10,flexDirection: "row"}}>
                    {/* <Text style={{fontSize:16,fontFamily:fontFamily.Bold,color:"#707070"}}>{item.post_title}</Text> */}
                    <Text style={{fontSize:18,fontWeight:'900',color:"#707070"}}>{'$' +item.Property_Price}{'  '}</Text>
                    {/* <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",marginLeft:20,flex:1}}>{item.post_content}</Text> */}
                    <Text style={{fontSize:12,fontFamily:fontFamily.Bold,color:"#707070",alignSelf: "center"}}>{item.no_of_bedrooms ? item.no_of_bedrooms + ' beds' : 0 + " beds"}{'  '}</Text>
                    <Text style={{fontSize:12,fontFamily:fontFamily.Bold,color:"#707070",alignSelf: "center"}}>{item.no_of_bathroom ? item.no_of_bathroom + ' bath' : 0 + " bath"} {' '}</Text>
                    <Text style={{fontSize:12,fontFamily:fontFamily.Bold,color:"#707070",alignSelf: "center"}}>{item.square_feet  + " sqrt"} {' '}</Text>
                </View>
                <Text style={{fontSize:16,fontWeight:"100",color:"#707070",flex:1,marginStart:20}}>{item.open_house_street_address}</Text>
                <TouchableOpacity style={{flexDirection: "row",marginStart:20,alignItems: "center",marginBottom: 10}}>
                    <View style={{width:10,height:10,borderRadius:10/2,borderWidth:1,backgroundColor:"#EB5E3E"}}></View>
                    <Text style={{fontSize:14,fontWeight:"bold",color:"#707070",flex:1,marginStart:5}}>House for sale</Text>
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
        return (
            <View style={{flex: 1}}>
                <View style={style.searchOuterCont}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                        <Text style={style.listTxt}>Map</Text>
                    </TouchableOpacity>
                    <View style={style.searchCont}>
                        <TouchableOpacity>
                            <Image source={require('../../../assets/images/search_teal.png')}
                                   resizeMode={'contain'}
                                   style={style.searchImg} />
                        </TouchableOpacity>
                        <TextInput placeholder={'Address, City, ZIP, Neighbourhood'} style={style.searchInput} />
                        <TouchableOpacity>
                            <Image source={require('../../../assets/images/location_blue.png')}
                                   resizeMode={'contain'}
                                   style={style.searchLoc} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.filterBar}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                isPrice: true,
                                isHome: false
                            })
                        }}>
                        <Text style={style.fliterTxt}>PRICE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isPrice: false,
                            isHome: true
                        })
                    }}>
                        <Text style={style.fliterTxt}>HOME TYPE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isPrice: false,
                            isHome: false
                        })
                        this.props.navigation.navigate('MoreFilter')
                    }}>
                        <Text style={style.fliterTxt}>MORE</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.filterBar2}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                      <Image source={require("../../../assets/images/backImg.png")} resizeMode={"contain"} style={{marginTop:5,width:50,height:50}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate("SortOrder")}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <View>
                        <Text style={{textAlign: 'center',fontSize:16,fontFamily:fontFamily.SemiBold,color:"#707071"}} >Search</Text>
                        <Text style={{color:"#707071"}}>Price: Low to High</Text>
                        </View>
                        <Image source={require("../../../assets/images/down.png")} resizeMode={"contain"} style={{width:70,height:70}}/>
                    </View>
                    </TouchableOpacity>

                </View>
                {this.state.isPrice === true ? this.renderPrice() : null}
                {this.state.isHome === true ? this.renderHome() : null}
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
        width:25,
        height:25,
        position:"absolute",
        right:20,
        top:10,
    
    },


});

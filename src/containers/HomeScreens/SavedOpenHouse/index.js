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
import moment from 'moment';
import Preference from 'react-native-preference';
import SimpleToast from "react-native-simple-toast";
import { API } from "../../../utils/constants";
import ProgressBar from "../../../component/ProgressBar";
import { Picker } from 'native-base';
import {DarkModeContext,eventEmitter} from 'react-native-dark-mode';
import {Colors} from './../../../utils/Colors'

const { height, width } = Dimensions.get('window');




export default class saved_open_houses extends Component {
    static contextType = DarkModeContext;
    constructor(props) {
        super(props);

        this.state = {
            Feature_Realtor: [
            ],
            userData: Preference.get("userData", ""),
            loading: false,
            ExistingFolderList: [],
            FolderArray: [],
            FolderKey: '',
            propertyList: [],
            UserSearches: [],
            showSavedSearchPicker: false,
            SavedSearchValue: 1,
            propertyIds: [],
            appThemeMode:'light'

        }

    }


    componentDidMount = () => {
        this.getBookmarksFolders();
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

    getBookmarksByFolders = () => {
        const details = {
            user_id: this.state.userData.id,
            folder_key: this.state.FolderKey
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_BOOKMARKS_BY_FOLDERS, {
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
            console.log('getBookmarkfolder Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                let tempArray=[]
                response.body.bookmarks.map((item) => {
                   tempArray.push(item.id)
                })
                this.setState({propertyIds:tempArray})
                // console.log('my state data===:>65565645646?', this.state.propertyIds)
                this.setState({ Feature_Realtor: response.body.bookmarks, }, () => {
                })
              
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
            this.setState({ loading: false });
        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }


    getBookmarksFolders = () => {
        const details = {
            user_id: this.state.userData.id,
            // user_id: '1',
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_BOOKMARKS_FOLDERS, {
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
            console.log('getBookmarkfolder Response: ' + JSON.stringify(response));
            if (response.status === "200") {
                this.setState({ FolderArray: response.body, FolderKey: response.body[0].folder_key }, () => {
                    console.log('my state data===:>?', this.state.FolderArray)
                    this.getBookmarksByFolders()
                })
            } else {
                this.setState({ loading: false });
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

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });

    }

    GetUserSearch = () => {
        const details = {
            user_id: this.state.userData.id,
            // user_id: '1',
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.GET_USER_SEARCH, {
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
            console.log('getBookmarkfolder Response: ' + JSON.stringify(response));
            this.setState({ loading: false });
            if (response.status === "200") {
                let tempArray=[]
                response.body[0].properties.map((item) => {
                   tempArray.push(item.id)
                })
                this.setState({propertyIds:tempArray})
                this.setState({ UserSearches: response.body, showSavedSearchPicker: !this.state.showSavedSearchPicker,SavedSearchValue: response.body[0].title, Feature_Realtor: response.body[0].properties },() => {
                    // this.state.Feature_Realtor.map((item) => {
                    //     this.state.propertyIds.push(item.id);
                    // })
                })
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

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    componentWillMount() {
    }
    leftAction() {

    }
    rightAction() {

    }
    renderItem(item) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("OpenHouseTitle", {
                propertyId: item.id,
            })}>
                <View style={[style.shadowOffset, { flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 5, borderBottomColor: '#707071', borderBottomWidth: 0.5 }]}>
                    <View>
                        <Image source={item.thumbnail_url ? { uri: item.thumbnail_url } : require('../../../assets/images/img-3.png')} resizeMode={'cover'} style={{ width: 150, height: 150, }} />
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, }}>
                            <Image source={require('../../../assets/images/heart.png')} resizeMode={'contain'} style={{ width: 25, height: 25, right: 10, top: 10, tintColor: 'white' }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("OpenHouseTitle", {
                            propertyId: item.id,
                        })} style={{ flex: 1, height: 30, backgroundColor: 'white', position: 'absolute', bottom: 10, width: '93%',justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, textAlign: 'center', color: '#00B7B0', fontWeight: 'bold' }}>{'Open ' + moment(item.post_date).format('MM-DD-YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginStart: 10, marginTop: 10, flex: 1 }}>

                        <Text style={{ color: '#707071', fontSize: 18, fontWeight: 'bold' }}>{item.Property_Price.includes('$') ?  item.Property_Price :   `$${item.Property_Price}`}</Text>
                        <Text style={{ color: '#707071' }}>{item.open_house_street_address}</Text>
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <Text style={{ color: '#707071', marginStart: 5, fontWeight: 'bold' }}>{item.no_of_bedrooms ? item.no_of_bedrooms + ' beds|' : 0 + ' bds|'}</Text>
                            <Text style={{ color: '#707071', marginStart: 5, fontWeight: 'bold' }}>{item.no_of_bathroom ? item.no_of_bathroom + ' ba|' : 0 + ' ba|'}</Text>
                            <Text style={{ color: '#707071', marginStart: 5, fontWeight: 'bold' }}>{item.square_feet ? item.square_feet + ' sqrt|' : 0 + ' sqrt|'}</Text>
                        </View>

                        {/* <Text style={{color:'#707071',marginTop:10,fontWeight:'bold'}}>{item.post_content}</Text> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../../assets/images/heart.png')} resizeMode={'contain'} style={{ width: 15, height: 15 }} />
                            <Text style={{ color: '#707071', marginStart: 5, fontWeight: 'bold', }}>{item.open_house_type ? item.open_house_type : 'House for sale'}</Text>
                        </View>
                    </View>
                </View>
                {/* <TouchableOpacity style={{height:40,justifyContent: 'center',marginStart:10,}}>
                    <Text style={{color:'#707071'}}>+ Add tags</Text>
                </TouchableOpacity> */}
                <View style={{ backgroundColor: '#EAEFF0', height: 10 }} />
            </TouchableOpacity>
        )
    }



    SortArray = (data) => {
        console.log('check data inn the screen===>', data);
        const details = {
            login_user_id: this.state.userData.id,
            order_by:  data == 'Open House Date' ? 'date' : data == 'Recently Changed' ? 'modified' : data == 'Newest' ? 'newest' : data == 'Price: low to high' ? 'price_asc' : data == 'Price: high to low' ? 'price_desc' : data == 'Bedrooms' ? 'bedroom' : data == 'Bathrooms' ? 'bathroom' : data == 'Square feet' ? 'square_feet' : 'year_built',
            ids: this.state.propertyIds
            // user_id: '1',
        };
        this.setState({
            loading: true
        })
        console.log("getPropertyByIdApi Params: ", JSON.stringify(details))
        var requestPramas = []

        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            requestPramas.push(encodedKey + "=" + encodedValue);
        }
        requestPramas = requestPramas.join("&");
        fetch(API.SORT_OPEN_HOUSE, {
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
            console.log('getsort property response Response: ' + JSON.stringify(response));
            this.setState({ loading: false });
            if (response.status === "200") {
                this.setState({ Feature_Realtor: response.body })
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

        })
            .catch(error => {
                this.setState({ loading: false });
                console.log('ApiError:', error);
            });
    }

    CheckUserData = () => {
        if(this.state.propertyIds.length == 0){
            Alert.alert(
                null,
                'select property to share',
                [
                   
                    { text: "OK",  onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('select property to share');
            return
        }
        if(this.state.userData == '' || this.state.userData == undefined){
            Alert.alert(
                "Alert",
                "Please Register/Sign In First",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => this.props.navigation.navigate('LandingScreen') }
                ],
                { cancelable: false }
            )
            // SimpleToast.show('Login first')
            return
        }
        this.props.navigation.navigate('sharing_open_house',{
            propertyIds: this.state.propertyIds
        })

    }


    render() {
        const {appThemeMode}=this.state

        return (
            <View style={[style.mainContainer,{backgroundColor:appThemeMode==='light' ? Colors.white :Colors.black}]}>
                <Header
                    leftAction={this.leftAction.bind(this)}
                    rightAction={this.rightAction.bind(this)}
                    HeaderColor={'#00B7B0'}
                    centerComponent={"SAVED OPEN HOUSES"}
                    bottomBorderColor={"#EF4867"}

                />
                <ScrollView>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('save_search') }}>
                            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.CheckUserData() }}>
                            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>Sharing</Text>
                        </TouchableOpacity>
                    </View>
                   {!this.state.showSavedSearchPicker && <View
                        style={style.inputTxt}>
                        <Picker
                            style={{ backgroundColor: '#B8860B', color: 'white',height: '100%',width: '100%' }}
                            radioColor={'blue'}
                            tabTextColor={'white'}
                            selectedValue={this.state.FolderKey}
                            onValueChange={(itemValue, itemIndex) => {

                                console.log("country name==========", itemValue)
                                this.setState({
                                    FolderKey: itemValue
                                }, () => {
                                    this.getBookmarksByFolders()
                                })
                            }}
                            mode={'dialog'}>
                            {this.state.FolderArray.map((item, index) => {
                                return (<Picker.Item label={item.title} value={item.folder_key} />);
                            })}
                        </Picker>

                    </View>}
                    {this.state.showSavedSearchPicker &&
                        <View
                            style={[style.inputTxt,]}>
                            <Picker
                                style={{ backgroundColor: '#B8860B', color: 'white' }}
                                radioColor={'blue'}
                                tabTextColor={'white'}
                                selectedValue={this.state.SavedSearchValue}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log("country name==========9898989898", itemValue);
                                    this.state.UserSearches.map((item) => {
                                        if(item.id == itemValue){
                                            let tempArray=[]
                                            item.properties.map((item) => {
                                               tempArray.push(item.id)
                                            })
                                            this.setState({propertyIds:tempArray})
                                            this.setState({Feature_Realtor: item.properties},() => {
                                            })
                                        }
                                    })
                                    this.setState({
                                        SavedSearchValue: itemValue,
                                        // Feature_Realtor: itemValue
                                    }, () => {
                                        // this.getBookmarksByFolders()
                                    })
                                }}
                                mode={'dialog'}>
                                {this.state.UserSearches.map((item, index) => {
                                    return (<Picker.Item label={item.title} value={item.id} />);
                                })}
                            </Picker>

                        </View>
                    }
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', margin: 10 }}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('SortOrder', {
                                SortItems: this.SortArray
                            })
                        }}>
                            <Text>
                                <Text style={{ fontSize: 18, color: '#707071' }}>Sort:</Text>
                                <Text style={{ fontSize: 18, color: '#707071', fontWeight: 'bold' }}>Open House Date</Text>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.GetUserSearch() }}>
                            {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate('notification')}}> */}
                            <Text style={{ fontSize: 18, color: '#707071', fontWeight: 'bold' }}>{this.state.showSavedSearchPicker ? 'Show Folders' : 'Show Saved Only'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={this.state.Feature_Realtor}
                                renderItem={({ item, index }) => (
                                    this.renderItem(item)
                                )}
                                extraData={this.state}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>
                </ScrollView>
                <ProgressBar visible={this.state.loading} />
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
        height: height - 200,
    },
    inputTxt: {
        height: 60,
        fontSize: 14,
        borderColor: '#707071',
        borderWidth: 1,
        marginTop: 10,

    },

});

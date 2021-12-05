import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
  Alert,
} from 'react-native';


import fontFamily from './../../../assets/fonts';
import { NavigationActions, StackActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../../../component/Header';
import Permissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import { Calendar } from 'react-native-calendars';
import { API } from '../../../utils/constants';
import Preference from 'react-native-preference';
import SimpleToast from 'react-native-simple-toast';
// import { Picker } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import moment from 'moment';
import axios from 'axios';
import Picker from '@gregfrench/react-native-wheel-picker';
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors';
import CurrencyInput from 'react-native-currency-input';
import { color } from 'react-native-reanimated';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
var PickerItem = Picker.Item;

export default class CreateOpenHouse extends Component {
  static contextType = DarkModeContext;

  constructor(props) {
    super(props);

    this.state = {
      openHouseStartTime:'Open House Start Time (HH:Min)',
      openHouseEndTime:'Open House End Time (HH:Min)',
      dateString: moment(new Date()).format('YYYY-MM-DD'),
      timePickerDate: new Date(),
      showTimePicker: false,
      appThemeMode: 'light',
      loading: false,
      loadingOnUpload: false,
      percentCompleted: 0,
      imageClick: '',
      sourceForAPI: '',
      sourceForAPITwo: '',
      sourceForAPIThree: '',
      sourceForAPIFour: '',
      sourceForAPIFive: '',
      sourceForAPIFloorPlan: '',
      sourceForAPIVirtualTour: '',
      profileImage: '',
      profileImageTwo: '',
      profileImageThree: '',
      profileImageFour: '',
      profileImageFive: '',
      floorPlan: '',
      virtualTour: '',
      isCalender: false,
      date: '',
      dateForAPI: new Date(),
      yesOrNo: [
        { id: 0, name: 'Yes' },
        { id: 1, name: 'No' },
      ],
      BasementValues: [
        { id: 0, name: 'Any' },
        { id: 1, name: 'Has Basement' },
        { id: 2, name: 'Finished Basement' },
        { id: 2, name: 'Unfinished Basement' },
        { id: 2, name: 'Walkout Basement' },
        { id: 3, name: 'No Basement' },
      ],
      otherAmenitiesArray: [
        { id: 0, name: 'Other Anemities' },
        { id: 1, name: 'Must Have Ac' },
        { id: 2, name: 'Must have pool' },
        { id: 2, name: 'Waterfront' },
      ],
      otherViewsArray: [
        { id: 0, name: 'Views' },
        { id: 1, name: 'City' },
        { id: 2, name: 'Mountain' },
        { id: 2, name: 'Park' },
        { id: 2, name: 'water' },
      ],
      openHouseTitle: '',
      city: '',
      cityList: [],
      openHouseTypeList: [],
      repeatTypeList: [
        {
          id: 1,
          name: 'Never',
        },
        {
          id: 2,
          name: 'Every Day',
        },
        {
          id: 3,
          name: 'Every Week',
        },
        {
          id: 4,
          name: 'Every 2 Weeks',
        },
        {
          id: 5,
          name: 'Every Month',
        },
        {
          id: 6,
          name: 'Every Year',
        },
      ],
      bedroomList: [],
      bathroomList: [],
      zip: '',
      openHouseType: '',
      bedrooms: '',
      bathrooms: '',
      schoolDistrict: '',
      keywords: '',
      lat: '',
      long: '',
      userId: '',
      RepeatType: 'Repeat',
      showRepeatType: false,
      streetAddress: '',
      state: '',
      zip: '',
      propertyDescription: '',
      propertyPrice: '',
      squareFeet: '',
      plotSize: '',
      basement: 'Basement',
      yearBuilt: '',
      otherAmenities: '',
      propertyViews: '',
      // schoolDistrict: "",
      // keywords: "",
      isEdit: props.navigation.getParam('isEdit'),
      isCreate: props.navigation.getParam('isCreate'),
      userIdFromPostHouseRegister: props.navigation.getParam('user_id'),
      cityId: '',
      postId: '',
      isCalender2: false,
      isPostHouse: props.navigation.getParam('postHouse'),
      maxPlotSize: '',
      selectedItem: 2,
      itemList: [
        'Has Basement',
        'Finished Basement',
        'Unfinished Basement',
        'Walkout Basement',
        'No Basement',
      ],
      // itemList: [{ name: 'Has Basement' }, { name: 'Finished Basement' }, { name: 'Unfinished Basement' }, { name: 'Walkout Basement' }, { name: 'No Basement' }],
      showModal: false,
      showCityList: false,
      selectedCityItem: 1,
      cityName: '',
      showOpenHouseType: false,
      selectedHouseType: 2,
      HouseTypeName: 'House Type',
      showBedRoomList: false,
      selectedBedRoom: 2,
      bedRoomName: 'Bedrooms',
      showBathRoomList: false,
      selectedBathRoom: 2,
      bathRoomName: 'Bathrooms',
      squareFeetList: [
        '50 sq ft',
        '100 sq ft',
        '1000 sq ft',
        '2000 sq ft',
        '3000 sq ft',
        '4000 sq ft',
        '5000 sq ft',
      ],
      showSquareFeet: false,
      squareFeetSize: 'Square Feet',
      selectedSquareFeet: 2,
      showMinPlotSize: false,
      minimumPlotSize: 'No Min',
      minimumPlotSizeList: [
        '0.25 sq ft',
        '0.5 sq ft',
        '1 sq ft',
        '2 sq ft',
        '5 sq ft',
        '10 sq ft',
        '50 sq ft',
        '100 sq ft',
      ],
      selectedMinimumPlotSize: 2,

      showMaxPlotSize: false,
      maximumPlotSize: 'No Max',
      maximumPlotSizeList: [
        '1000 sq ft',
        '2000 sq ft',
        '3000 sq ft',
        '4000 sq ft',
        '5000 sq ft',
      ],
      selectedMaximumPlotSize: 2,
      showYearPicker: false,
      year: 'Year Built',
      selectedYear: 2,
      yearList: [],
      showAmenities: false,
      otherAmenitiesText: 'Other Amenities',
      otherAmenitiesList: ['Must Have AC', 'Must have pool', 'Waterfront'],
      selectedAmenities: 1,
      otherViews: false,
      otherViewsText: 'Other Views',
      selectedViews: 1,
      otherViewsList: ['City', 'Mountain', 'Park', 'Water'],
      closingDate: '',
      startTime: '',
      endTime: '',
    };
  }

  componentDidMount() {
    this.setState()
    const options = undefined;
    this.setState(
      {
        appThemeMode: this.context === 'dark' ? 'dark' : 'light',
      },
      () => {
        this.forceUpdate();
        console.log('comp->', this.setState.appThemeMode);
      },
    );
    eventEmitter.on('currentModeChanged', (newMode) => {
      console.log('Switched to', newMode, 'mode');
      this.setState({
        appThemeMode: newMode,
      });
    });
    for (let i = 1900; i <= 2021; i++) {
      this.state.yearList.push(i.toString());
    }
    console.log('my array==>', this.state.yearList);
    this.getOpenHouseType();
    console.log(this.state.isEdit);
    if (this.state.isEdit) {
      const item = this.props.navigation.getParam('item');
      console.log(item);
      let plotSizeSplit = item.plot_size.split('*');
      console.log('my item=====?', item);
      this.setState({
        propertyPrice: item.Property_Price,
        basement: item.basement,
        keywords: item.keywords,
        bathrooms: item.no_of_bathroom,
        bedrooms: item.no_of_bedrooms,
        streetAddress: item.open_house_street_address,
        openHouseType: item.open_house_type,
        otherAmenities: item.other_amenities,
        // plotSize: plotSizeSplit[0],
        // plotSize: item.plot_size,
        maxPlotSize: plotSizeSplit[1],
        openHouseTitle: item.post_title,
        squareFeet: item.plot_size,
        propertyViews: item.views,
        yearBuilt: item.year_built,
        profileImage: item.thumbnail_url,
        floorPlan: item.floorplan_image_1
          ? item.floorplan_image_1
          : item.floorplan_image_2
            ? item.floorplan_image_2
            : item.floorplan_image_3
              ? item.floorplan_image_3
              : item.floorplan_image_4,
        // sourceForAPIFloorPlan: item.floorplan_image_1 ? item.floorplan_image_1 : item.floorplan_image_2 ? item.floorplan_image_2 : item.floorplan_image_3 ? item.floorplan_image_3 : item.floorplan_image_4,
        sourceForAPIFloorPlan: '',
        virtualTour: item.virtual_tour,
        sourceForAPIVirtualTour: '',
        // date: moment(item.date).format('MM-DD-YYYY'),
        date: item.date,
        // closingDate: moment(item.close_date).format('MM-DD-YYYY'),
        closingDate: item.close_date,
        propertyDescription: item.post_content,
        profileImageTwo: item.property_image_1,
        sourceForAPITwo: '',
        profileImageThree: item.property_image_2,
        sourceForAPIThree: '',
        profileImageFour: item.property_image_3,
        sourceForAPIFour: '',
        profileImageFive: item.property_image_4,
        sourceForAPIFive: '',
        state: item.state,
        zip: item.zip,
        schoolDistrict: item.school_district,
        sourceForAPI: '',
        postId: item.id,
        //city: item.city,
        cityName: item.city,
        startTime: item.start_time,
        endTime: item.end_time,
      });
      if (
        this.googlePlacesAutocompleteRef &&
        this.googlePlacesAutocompleteRef.setAddressText &&
        typeof this.googlePlacesAutocompleteRef.setAddressText === 'function'
      ) {
        setTimeout(() => {
          this.googlePlacesAutocompleteRef.setAddressText(
            this.state.streetAddress,
          );
        }, 500);
      }
    }
  }



  onPickerSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedItem: index,
      },
      () => {
        this.setState({
          basement: `${this.state.itemList[this.state.selectedItem]}`,
        });
      },
    );
  }
  onPickerSquareFeetSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedSquareFeet: index,
      },
      () => {
        this.setState({
          squareFeetSize: `${this.state.squareFeetList[this.state.selectedSquareFeet]
            }`,
          squareFeet: this.state.squareFeetList[this.state.selectedSquareFeet],
        });
      },
    );
  }
  onPickerMinimumPlotSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedMinimumPlotSize: index,
      },
      () => {
        this.setState({
          minimumPlotSize: `${this.state.minimumPlotSizeList[this.state.selectedMinimumPlotSize]
            }`,
          plotSize:
            this.state.minimumPlotSizeList[this.state.selectedMinimumPlotSize],
        });
      },
    );
  }
  onPickerYearSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedYear: index,
      },
      () => {
        this.setState({
          year: `${this.state.yearList[this.state.selectedYear]}`,
          yearBuilt: `${this.state.yearList[this.state.selectedYear]}`,
        });
      },
    );
  }
  onPickerAmenitiesSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedAmenities: index,
      },
      () => {
        this.setState({
          otherAmenitiesText: `${this.state.otherAmenitiesList[this.state.selectedAmenities]
            }`,
          otherAmenities: `${this.state.otherAmenitiesList[this.state.selectedAmenities]
            }`,
        });
      },
    );
  }
  onPickerViewsSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedViews: index,
      },
      () => {
        this.setState({
          otherViewsText: `${this.state.otherViewsList[this.state.selectedViews]
            }`,
          propertyViews: `${this.state.otherViewsList[this.state.selectedViews]
            }`,
        });
      },
    );
  }
  onPickerMaximumPlotSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedMaximumPlotSize: index,
      },
      () => {
        this.setState({
          maximumPlotSize: `${this.state.maximumPlotSizeList[this.state.selectedMaximumPlotSize]
            }`,
          maxPlotSize:
            this.state.maximumPlotSizeList[this.state.selectedMaximumPlotSize],
        });
      },
    );
  }
  onPickerCitySelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedCityItem: index,
      },
      () => {
        this.setState({
          cityName: this.state.cityList[this.state.selectedCityItem].name,
          cityId: `${this.state.cityList[this.state.selectedCityItem].id}`,
        });
      },
    );
  }
  onPickerHouseTypeSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedHouseType: index,
      },
      () => {
        this.setState({
          HouseTypeName:
            this.state.openHouseTypeList[this.state.selectedHouseType].name,
          openHouseType: `${this.state.openHouseTypeList[this.state.selectedHouseType].id
            }`,
        });
      },
    );
  }

  onPickerRepeatTypeSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedRepeatType: index,
      },
      () => {
        this.setState({
          RepeatType:
            this.state.repeatTypeList[this.state.selectedRepeatType].name,
          repeatType: `${this.state.repeatTypeList[this.state.selectedHouseType].id
            }`,
        });
      },
    );
  }
  onPickerBedroomSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedBedRoom: index,
      },
      () => {
        this.setState({
          bedRoomName: this.state.bedroomList[this.state.selectedBedRoom].name,
          bedrooms: `${this.state.bedroomList[this.state.selectedBedRoom].id}`,
        });
      },
    );
  }
  onPickerBathroomSelect(index) {
    // console.log('index my value', item)
    this.setState(
      {
        selectedBathRoom: index,
      },
      () => {
        this.setState({
          bathRoomName:
            this.state.bathroomList[this.state.selectedBathRoom].name,
          bathrooms: `${this.state.bathroomList[this.state.selectedBathRoom].id
            }`,
        });
      },
    );
  }

  getOpenHouseType = () => {
    const userData = Preference.get('userData');
    if (userData) {
      this.setState({ userId: userData.id }, () => {
        console.log(
          'check for user data in the create house===.',
          this.state.userId,
        );
      });
    } else {
      this.setState({ userId: this.state.userIdFromPostHouseRegister }, () => {
        console.log(
          'check for user data in the create house===.',
          this.state.userId,
        );
      });
    }

    this.setState({ loading: true });
    fetch(API.GET_TAXONOMIES, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        console.log('response.status', response.status);
        return response.json();
      })
      .then((response) => {
        this.setState({ loading: false });
        if (response.body) {
          let temp = response.body.open_house_type,
            index;
          let city = response.body.city,
            cityindex;
          let Bedroom = response.body.bedroom;
          let bathroom = response.body.bathroom;
          console.log('sdfgjhdflkjhlifsd-', response.body);
          if (this.state.isEdit) {
            for (let i = 0; i < Bedroom.length; i++) {
              if (Bedroom[i].name == this.state.bedrooms) {
                this.setState({
                  selectedBedRoom: i,
                  bedRoomName: response.body.bedroom[i].name,
                  bedrooms: response.body.bedroom[i].id,
                });
              }
            }
            for (let i = 0; i < bathroom.length; i++) {
              if (bathroom[i].name == this.state.bathrooms) {
                console.log('hhgjhjhkj', i);
                this.setState({
                  selectedBathRoom: i,
                  bathRoomName: response.body.bathroom[i].name,
                  bathrooms: response.body.bathroom[i].id,
                });
              }
            }
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].name == this.state.openHouseType) {
                this.setState({
                  selectedHouseType: i,
                  HouseTypeName: temp[i].name,
                  openHouseType: temp[i].id,
                });
              }
            }
            for (let i = 0; i < city.length; i++) {
              if (city[i].name == this.state.city) {
                this.setState({
                  selectedCityItem: i,
                  cityName: city[i].name,
                  cityId: city[i].id,
                });
                // cityindex = i
              }
            }
            // for (let i = 0; i < this.state.squareFeetList.length; i++) {
            //     if (this.state.squareFeetList[i].includes(this.state.squareFeet)) {
            //         this.setState({ selectedSquareFeet: i, squareFeetSize: this.state.squareFeetList[i], squareFeet: this.state.squareFeetList[i] })
            //     }
            // }
            for (let i = 0; i < this.state.minimumPlotSizeList.length; i++) {
              if (
                this.state.minimumPlotSizeList[i].includes(this.state.plotSize)
              ) {
                this.setState({
                  selectedMinimumPlotSize: i,
                  minimumPlotSize: this.state.minimumPlotSizeList[i],
                  plotSize: this.state.minimumPlotSizeList[i],
                });
              }
            }
            for (let i = 0; i < this.state.maximumPlotSizeList.length; i++) {
              if (
                this.state.maximumPlotSizeList[i].includes(
                  this.state.maxPlotSize,
                )
              ) {
                this.setState({
                  selectedMaximumPlotSize: i,
                  maximumPlotSize: this.state.maximumPlotSizeList[i],
                  maxPlotSize: this.state.maximumPlotSizeList[i],
                });
              }
            }
            for (let i = 0; i < this.state.itemList.length; i++) {
              if (this.state.itemList[i] == this.state.basement) {
                this.setState({
                  selectedItem: i,
                  basement: this.state.itemList[i],
                });
              }
            }
            // for (let i = 0; i < this.state.yearList.length; i++) {
            //     if (this.state.yearList[i] == this.state.yearBuilt) {
            //         this.setState({ selectedYear: i, year: this.state.yearList[i], yearBuilt: this.state.yearList[i] })
            //     }
            // }
            for (let i = 0; i < this.state.otherAmenitiesList.length; i++) {
              if (
                this.state.otherAmenitiesList[i] == this.state.otherAmenities
              ) {
                this.setState({
                  selectedAmenities: i,
                  otherAmenitiesText: this.state.otherAmenitiesList[i],
                  otherAmenities: this.state.otherAmenitiesList[i],
                });
              }
            }
            for (let i = 0; i < this.state.otherViewsList.length; i++) {
              if (this.state.otherViewsList[i] == this.state.propertyViews) {
                this.setState({
                  selectedViews: i,
                  otherViewsText: this.state.otherViewsList[i],
                  propertyViews: this.state.otherViewsList[i],
                });
              }
            }
          }
          this.setState(
            {
              cityList: response.body?.city,
              openHouseTypeList: response.body?.open_house_type,
              bedroomList: response.body.bedroom,
              bathroomList: response.body.bathroom,
            },
            () => {
              // alert(this.state.bathrooms)
            },
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('error', 'error');
      });
  };

  checkFields = () => {
    const {
      profileImage,
      profileImageTwo,
      profileImageThree,
      profileImageFour,
      profileImageFive,
      openHouseTitle,
      streetAddress,
      city,
      state,
      zip,
      date,
      dateForAPI,
      openHouseType,
      propertyDescription,
      bedrooms,
      bathrooms,
      propertyPrice,
      squareFeet,
      plotSize,
      basement,
      yearBuilt,
      otherAmenities,
      propertyViews,
      schoolDistrict,
      keywords,
      floorPlan,
      maxPlotSize,
      cityName,
      closingDate,
      startTime,
      endTime,
    } = this.state;
    let splitStartTime;
    let splitEndTime;

    let sDate = date;
    let eDate = closingDate;
    var date1 = moment(sDate, 'MM-DD-YYYY').format('YYYY-DD-MM');
    var date2 = moment(eDate, 'MM-DD-YYYY').format('YYYY-DD-MM');
    console.log('date1=====>', date1);
    console.log('date2=====>', date2);

    splitStartTime = startTime.split(':');
    splitEndTime = endTime.split(':');

    if (profileImage == '') {
      Alert.alert(null, 'Feature image is required');
      return false;
    } else if (openHouseTitle == '') {
      Alert.alert(null, 'Open house title is required');
      return false;
    } else if (streetAddress == '') {
      Alert.alert(null, 'Street address is required');
      return false;
    }
    // else if (cityName == '' || cityName == 'City') {
    //     Alert.alert(null, 'City is required')
    //     return false
    // }
    // else if (state == '') {
    //     Alert.alert(null, 'State is required')
    //     return false
    // }
    // else if (zip == '') {
    //     Alert.alert(null, 'Zip is required')
    //     return false
    // }
    else if (date == '' || date == 'select date') {
      Alert.alert(null, 'Open house date is required');
      return false;
    } else if (closingDate == '' || closingDate == 'select date') {
      Alert.alert(null, 'Closing house date is required');
      return false;
    } else if (date1 > date2) {
      Alert.alert(
        null,
        'Open house start date should not be greater than open house end date',
      );
      return false;
    }
    if (startTime == '') {
      Alert.alert(null, 'House start time  is required');
      return false;
    } else if (splitStartTime[0] < 0 || splitStartTime[0] > 24) {
      Alert.alert(null, 'House start time hours must be in between 1-24');
      return false;
    } else if (splitStartTime[1] < 0 || splitStartTime[1] > 60) {
      Alert.alert(null, 'House start time mins must be in between 1-60');
      return false;
    } else if (endTime == '') {
      Alert.alert(null, 'House end time  is required');
      return false;
    } else if (splitEndTime[0] < 0 || splitEndTime[0] > 24) {
      Alert.alert(null, 'House end time hours must be in between 1-24');
      return false;
    } else if (splitEndTime[1] < 0 || splitEndTime[1] > 60) {
      Alert.alert(null, 'House end time mins must be in between 1-60');
      return false;
    } else if (openHouseType == '') {
      Alert.alert(null, 'Open house type is required');
      return false;
    } else if (propertyDescription == '') {
      Alert.alert(null, 'Property description is required');
      return false;
    } else if (bedrooms == '' || bedrooms == 'Select Bedroom') {
      Alert.alert(null, 'Bedrooms are required');
      return false;
    } else if (bathrooms == '' || bathrooms == 'Select Bathroom') {
      Alert.alert(null, 'Bathrooms are required');
      return false;
    } else if (propertyPrice == '') {
      Alert.alert(null, 'Property price is required');
      return false;
    }
    // else if (propertyPrice < 50000 || propertyPrice > 20000000) {
    //     Alert.alert(null, 'Property price range must be 50000 - 20000000')
    //     return false
    // }
    else if (squareFeet == '' || squareFeet == 'Square Feet') {
      Alert.alert(null, 'Square feet is required');
      return false;
    }
    // else if (plotSize == '' || plotSize == 'Lot Size' || maxPlotSize == '' || maxPlotSize == 'No Max') {
    //     Alert.alert(null, 'Lot size is required')
    //     return false
    // }
    else if (basement == '') {
      Alert.alert(null, 'Select Basement?');
      return false;
    } else if (yearBuilt == '' || yearBuilt == 'Year Built') {
      Alert.alert(null, 'Built year is required');
      return false;
    } else if (otherAmenities == '') {
      Alert.alert(null, 'Select other amenities?');
      return false;
    } else if (propertyViews == '') {
      Alert.alert(null, 'Select views?');
      return false;
    }
    // else if (schoolDistrict == '') {
    //     Alert.alert(null, 'School district is required')
    //     return false
    // }
    else if (keywords == '') {
      Alert.alert(null, 'Keywords are required');
      return false;
    }
    // else if (floorPlan == '') {
    //     Alert.alert(null, 'Floor plan is required')
    //     return false
    // }

    return true;
  };

  postHouse = () => {
    //this.createOpenHouseApi()
    if (this.checkFields()) {
      this.createOpenHouseApi();
    }
  };

  createOpenHouseApi = () => {
    var currentDate = moment().format('MM-DD-YYYY');
    var startDate = moment(this.state.date).format('MM-DD-YYYY');
    var closeDate = moment(this.state.closingDate).format('MM-DD-YYYY');
    //var GivenDate = moment(checkDate, "MM-DD-YYYY").diff(moment(this.state.closingDate, "MM-DD-YYYY"));
    //console.log('myb value===>,', GivenDate)

    if (this.state.date == currentDate) {
      console.log('my new date===>', true);
    } else {
      if (startDate > closeDate) {
        alert('Closing date is not greater than the Opening date.');
        return;
      }
    }

    const {
      sourceForAPI,
      sourceForAPITwo,
      sourceForAPIThree,
      sourceForAPIFour,
      sourceForAPIFive,
      sourceForAPIFloorPlan,
      sourceForAPIVirtualTour,
      openHouseTitle,
      streetAddress,
      city,
      state,
      zip,
      date,
      dateForAPI,
      openHouseType,
      propertyDescription,
      bedrooms,
      bathrooms,
      propertyPrice,
      squareFeet,
      plotSize,
      basement,
      yearBuilt,
      otherAmenities,
      propertyViews,
      schoolDistrict,
      keywords,
      lat,
      long,
      userId,
      cityId,
      postId,
      maxPlotSize,
      closingDate,
      RepeatType,
      startTime,
      endTime,
    } = this.state;
    let requestBody = new FormData();
    {
      this.state.isEdit && requestBody.append('post[ID]', postId);
    }
    requestBody.append('post[post_author]', userId);
    requestBody.append('post[post_content]', propertyDescription);
    requestBody.append('post[post_title]', openHouseTitle);
    requestBody.append('taxonomy[bedroom]', bedrooms);
    requestBody.append('taxonomy[bathroom]', bathrooms);
    requestBody.append('meta[start_time]', startTime);
    requestBody.append('meta[end_time]', endTime);
    requestBody.append('taxonomy[open_house_type]', openHouseType);
    requestBody.append('meta[property_address]', streetAddress);
    requestBody.append('meta[city]', this.state.cityName);
    // requestBody.append('taxonomy[city]', cityName)
    requestBody.append('meta[Property-Price]', propertyPrice);
    requestBody.append('meta[state]', state);
    requestBody.append('meta[zip]', zip);
    requestBody.append('meta[date]', date);
    requestBody.append('meta[availability]', RepeatType);
    requestBody.append('meta[close_date]', closingDate);
    // requestBody.append('meta[square_feet]', squareFeet)
    requestBody.append('meta[plot_size]', squareFeet);
    requestBody.append('meta[basement]', basement);
    requestBody.append('meta[year_built]', yearBuilt);
    requestBody.append('meta[other_amenities]', otherAmenities);
    requestBody.append('meta[views]', propertyViews);
    requestBody.append('meta[school_district]', schoolDistrict);
    requestBody.append('meta[keywords]', keywords);
    requestBody.append('meta[lat]', lat);
    requestBody.append('meta[lng]', long);
    {
      sourceForAPI !== '' && requestBody.append('featured_image', sourceForAPI);
    }
    if (sourceForAPITwo)
      requestBody.append('property_image_1', sourceForAPITwo);
    if (sourceForAPIThree)
      requestBody.append('property_image_2', sourceForAPIThree);
    if (sourceForAPIFour)
      requestBody.append('property_image_3', sourceForAPIFour);
    if (sourceForAPIFive)
      requestBody.append('property_image_4', sourceForAPIFive);
    requestBody.append('floorplan_image_1', sourceForAPIFloorPlan);
    requestBody.append('virtual_tour', sourceForAPIVirtualTour);

    console.log('request body======>', requestBody);

    this.setState({ loading: true, loadingOnUpload: true, percentCompleted: 0 });

    axios
      .post(API.INSERT_UPDATE_OPEN_HOUSE, requestBody, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: this.onUploadProgress,
      })
      .then((response) => {
        this.setState({
          loading: false,
          loadingOnUpload: false,
          percentCompleted: 0,
        });
        if (response.data.status === '200') {
          if (this.state.isPostHouse) {
            Alert.alert(
              null,
              'Your House created successfully',
              [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
              { cancelable: false },
            );
            // SimpleToast.show('Your House created successfully');
            this.props.navigation.navigate('LandingScreen');
            return;
          }
          this.props.navigation.replace('PostCofirmation');
        } else {
          Alert.alert(
            null,
            response.message,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
          );
          // SimpleToast.show(response.message)
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
          loadingOnUpload: false,
          percentCompleted: 0,
        });
        console.log('API', 'requestPost-error', error);
      });
  };

  onUploadProgress = (progressEvent) => {
    var _percentCompleted =
      Math.round((progressEvent.loaded * 100) / progressEvent.total) - 1;
    this.setState({ percentCompleted: _percentCompleted });
  };

  leftAction() {
    this.props.navigation.goBack();
  }

  rightAction() { }
  selectImageButtonPress() {
    let checkConst = '';
    let platformConst = Platform.OS;
    if (platformConst === 'ios') {
      checkConst = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (platformConst === 'android') {
      checkConst = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    } else return;
    console.log(checkConst);
    Permissions.check(checkConst)
      .then((result) => {
        this.handleResults(result, checkConst);
      })
      .catch((error) => {
        // …
      });
  }
  onChangeTimePicker(date) {
    //alert(date);
    if(this.state.settingstartTime)
    {
      console.log('Time start SEt:', JSON.stringify(moment(date).format('hh:mm a')))
      this.setState({openHouseStartTime:moment(date).format('hh:mm a'),showTimePicker:false,startTime:moment(date).format('hh:mm a')})
   
    }else{
      console.log('Time end SEt:', JSON.stringify(moment(date).format('hh:mm a')))
      this.setState({openHouseEndTime:moment(date).format('hh:mm a'),showTimePicker:false,endTime:moment(date).format('hh:mm a')})
    }
     }

  handleResults = (result, checkConst, count = 1) => {
    if (count == 3) {
      return;
    }
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        Permissions.request(checkConst).then((result) => {
          this.handleResults(result, checkConst, count + 1);
        });
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        break;
      case RESULTS.GRANTED:
        this.handleChoosePhoto();
        break;
      case RESULTS.BLOCKED:
        Permissions.openSettings().catch(() =>
          console.warn('cannot open settings'),
        );
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  };

  handleChoosePhoto() {
    if (this.state.imageClick === '7') {
      options = {
        quality: 0.3,
        mediaType: 'video',
      };
    } else {
      options = {
        quality: 0.3,
      };
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response.uri,
          name: moment().format('x') + '.jpeg',
          type: 'image/jpeg',
        };
        if (this.state.imageClick === '1') {
          const sourceForAPI = { uri: response.data };
          // console.log("ImagePicked: " + sourceForAPI.uri);
          this.setState({
            profileImage: source.uri,
            sourceForAPI: source,
          });
        } else if (this.state.imageClick === '2') {
          const sourceForAPI = { uri: response.data };
          // console.log("ImagePicked: " + sourceForAPI.uri);
          this.setState({
            profileImageTwo: source.uri,
            sourceForAPITwo: source,
          });
        } else if (this.state.imageClick === '3') {
          const sourceForAPI = { uri: response.data };
          // console.log("ImagePicked: " + sourceForAPI.uri);
          this.setState({
            profileImageThree: source.uri,
            sourceForAPIThree: source,
          });
        } else if (this.state.imageClick === '4') {
          const sourceForAPI = { uri: response.data };
          // console.log("ImagePicked: " + sourceForAPI.uri);
          this.setState({
            profileImageFour: source.uri,
            sourceForAPIFour: source,
          });
        } else if (this.state.imageClick === '5') {
          const sourceForAPI = { uri: response.data };
          // console.log("ImagePicked: " + sourceForAPI.uri);
          this.setState({
            profileImageFive: source.uri,
            sourceForAPIFive: source,
          });
        } else if (this.state.imageClick === '6') {
          const sourceForAPITwo = { uri: response.data };
          this.setState({
            floorPlan: source.uri,
            sourceForAPIFloorPlan: source,
          });
        } else if (this.state.imageClick === '7') {
          const sourceForAPITwo = { uri: response.data };
          this.setState({
            virtualTour: source.uri,
            sourceForAPIVirtualTour: source,
          });
        }
      }
    });
  }
  calenderRender() {
    return (
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
        }}>
        <View style={{ width: '100%' }}>
          <Calendar
            theme={{
              arrowColor: '#EF4867',
              textMonthFontSize: 20,
              'stylesheet.calendar.header': {
                week: {
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              },
            }}
            onDayPress={(date) => {
              console.log('aasdf', date);
              this.setState({
                isCalender: false,
                date: moment(date.timestamp).format('MM-DD-YYYY'),
                dateForAPI: date.timestamp,
              });
            }}
          />
        </View>
      </View>
    );
  }
  calenderRender2() {
    return (
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
        }}>
        <View style={{ width: '100%' }}>
          <Calendar
            theme={{
              arrowColor: '#EF4867',
              textMonthFontSize: 20,
              'stylesheet.calendar.header': {
                week: {
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              },
            }}
            onDayPress={(date) => {
              console.log('aasdf', date);
              this.setState({ isCalender2: false, yearBuilt: date.year });
            }}
          />
        </View>
      </View>
    );
  }

  setDate = (text) => {
    const { date } = this.state;
    if (/^[0-9-]*$/.test(text)) {
      if (date.length == 2 && text.length == 3) {
        if (text.substr(2, 1) != '-') {
          text = date + '-' + text.substr(2, text.length - 1);
        }
        this.setState({ date: text });
      }
      if (date.length == 5 && text.length == 6) {
        if (text.substr(5, 1) != '-') {
          text = date + '-' + text.substr(5, text.length - 1);
        }
        this.setState({ date: text });
      }
      if (date.length < text.length && (text.length == 2 || text.length == 5)) {
        text += '-';
        this.setState({ date: text });
      } else {
        this.setState({ date: text });
      }
    }
  };
  ClosingSetDate = (text) => {
    const { closingDate } = this.state;
    if (/^[0-9-]*$/.test(text)) {
      if (closingDate.length == 2 && text.length == 3) {
        if (text.substr(2, 1) != '-') {
          text = closingDate + '-' + text.substr(2, text.length - 1);
        }
        this.setState({ closingDate: text });
      }
      if (closingDate.length == 5 && text.length == 6) {
        if (text.substr(5, 1) != '-') {
          text = closingDate + '-' + text.substr(5, text.length - 1);
        }
        this.setState({ closingDate: text });
      }
      if (
        closingDate.length < text.length &&
        (text.length == 2 || text.length == 5)
      ) {
        text += '-';
        this.setState({ closingDate: text });
      } else {
        this.setState({ closingDate: text });
      }
    }
  };
  startTimeSet = (text) => {
    const { startTime } = this.state;
    if (/^[0-9:]*$/.test(text)) {
      if (startTime.length == 2 && text.length == 3) {
        if (text.substr(2, 1) != ':') {
          text = startTime + ':' + text.substr(2, text.length - 1);
        }
        this.setState({ startTime: text });
      }
      // if (startTime.length == 5 && text.length == 6) {
      //     if (text.substr(5, 1) != '-') {
      //         text = startTime + '-' + text.substr(5, text.length - 1)
      //     }
      //     this.setState({ startTime: text })
      // }
      if (startTime.length < text.length && text.length == 2) {
        text += ':';
        this.setState({ startTime: text });
      } else {
        this.setState({ startTime: text });
      }
    }
  };
  endTimeSet = (text) => {
    const { endTime } = this.state;
    if (/^[0-9:]*$/.test(text)) {
      if (endTime.length == 2 && text.length == 3) {
        if (text.substr(2, 1) != ':') {
          text = endTime + ':' + text.substr(2, text.length - 1);
        }
        this.setState({ endTime: text });
      }
      // if (startTime.length == 5 && text.length == 6) {
      //     if (text.substr(5, 1) != '-') {
      //         text = startTime + '-' + text.substr(5, text.length - 1)
      //     }
      //     this.setState({ startTime: text })
      // }
      if (endTime.length < text.length && text.length == 2) {
        text += ':';
        this.setState({ endTime: text });
      } else {
        this.setState({ endTime: text });
      }
    }
  };

  // formatter = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  // });

  render() {
    console.log('my value===>', this.state.openHouseType);
    const {
      loadingOnUpload,
      percentCompleted,
      appThemeMode,
      profileImage,
      profileImageTwo,
      profileImageThree,
      profileImageFour,
      profileImageFive,
      city,
      cityList,
      openHouseTypeList,
      openHouseType,
      bedroomList,
      bedrooms,
      bathroomList,
      bathrooms,
      yesOrNo,
      basement,
      otherAmenities,
      propertyViews,
      floorPlan,
      virtualTour,
      BasementValues,
      otherAmenitiesArray,
      otherViewsArray,
      cityId,
      showCityList,
      selectedCityItem,
      showOpenHouseType,
      selectedHouseType,
      HouseTypeName,
      selectedRepeatType,
      repeatTypeList,
    } = this.state;
    let FeaturedImageSource = { uri: this.state.sourceForAPI };
    return (
      <View
        style={[
          style.mainContainer,
          {
            marginTop: 20,
            backgroundColor:
              appThemeMode === 'light' ? Colors.white : Colors.black,
          },
        ]}>
        <Header
          leftIcon={require('../../../assets/images/back.png')}
          leftAction={this.leftAction.bind(this)}
          rightAction={this.rightAction.bind(this)}
          customStyle={{ fontSize: 20 }}
          HeaderColor={'#00B7B0'}
          centerComponent={'CREATE/EDIT OPEN HOUSE'}
          bottomBorderColor={'#EF4867'}
          LeftIconColor={appThemeMode === 'light' ? Colors.black : Colors.white}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          innerRef={(ref) => {
            this.scrollContainer = ref;
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          extraHeight={150}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
        // bounces={false}
        >
          <View style={{ flex: 1, margin: 10 }}>
            <ImageBackground
              source={profileImage ? { uri: profileImage } : null}
              resizeMode={'cover'}
              style={style.coverImage}>
              <View style={[style.imageInnerTxtCont, { top: 'auto' }]}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ imageClick: '1' }, () => {
                      this.forceUpdate();
                    });
                    this.selectImageButtonPress();
                  }}
                  style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('../../../assets/images/blue_camera.png')}
                    resizeMode={'contain'}
                    style={{ width: 25, height: 25 }}
                  />
                  <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                    Featured Image of Open House
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <View style={style.imgRow}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Image
                  source={profileImageTwo ? { uri: profileImageTwo } : null}
                  resizeMode={'cover'}
                  style={style.coverImage}
                />
                <View style={style.imageInnerTxtCont}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ imageClick: '2' }, () => {
                        this.forceUpdate();
                      });
                      this.selectImageButtonPress();
                    }}
                    style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../../assets/images/blue_camera.png')}
                      resizeMode={'contain'}
                      style={{ width: 25, height: 25 }}
                    />
                    <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                      Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Image
                  source={profileImageThree ? { uri: profileImageThree } : null}
                  resizeMode={'cover'}
                  style={style.coverImage}></Image>
                <View style={style.imageInnerTxtCont}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ imageClick: '3' }, () => {
                        this.forceUpdate();
                      });
                      this.selectImageButtonPress();
                    }}
                    style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../../assets/images/blue_camera.png')}
                      resizeMode={'contain'}
                      style={{ width: 25, height: 25 }}
                    />
                    <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                      Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={style.imgRow}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Image
                  source={profileImageFour ? { uri: profileImageFour } : null}
                  resizeMode={'cover'}
                  style={style.coverImage}></Image>
                <View style={style.imageInnerTxtCont}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ imageClick: '4' }, () => {
                        this.forceUpdate();
                      });
                      this.selectImageButtonPress();
                    }}
                    style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../../assets/images/blue_camera.png')}
                      resizeMode={'contain'}
                      style={{ width: 25, height: 25 }}
                    />
                    <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                      Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Image
                  source={profileImageFive ? { uri: profileImageFive } : null}
                  resizeMode={'cover'}
                  style={style.coverImage}></Image>
                <View style={style.imageInnerTxtCont}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ imageClick: '5' }, () => {
                        this.forceUpdate();
                      });
                      this.selectImageButtonPress();
                    }}
                    style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../../assets/images/blue_camera.png')}
                      resizeMode={'contain'}
                      style={{ width: 25, height: 25 }}
                    />
                    <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                      Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TextInput
              placeholderTextColor="#707071"
              onChangeText={(text) => {
                this.setState({ openHouseTitle: text });
              }}
              value={this.state.openHouseTitle}
              placeholder={'Open House Title:'}
              style={style.inputTxt}
            />
            <View style={{ height: 'auto', marginTop: 10 }}>
              <GooglePlacesAutocomplete
                ref={(ref) => (this.googlePlacesAutocompleteRef = ref)}
                placeholder="Search Address"
                minLength={2}
                // textInputProps={{
                //     InputComp: this.state.streetAddress,
                //   }}
                autoFocus={true}
                // text={'kkjkjkjk'}
                returnKeyType={'search'}
                fetchDetails={true}
                listViewDisplayed={false}
                // ref={(instance) => { this.locationRef = instance }}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(
                    'my data in the list===>',
                    details.geometry.location,
                  );
                  this.setState({
                    lat: details.geometry.location.lat,
                    long: details.geometry.location.lng,
                    streetAddress: data.description,
                  });
                }}
                query={{
                  key: 'AIzaSyDD4wosTgxAGxjTKfG1kN_QJTqStTudWG8',
                  language: 'en',
                }}
                // getDefaultValue={() => this.state.streetAddress}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={200}
                styles={{
                  container: {
                    flex: 1,
                    borderWidth: 0.9,
                    borderColor:
                      appThemeMode === 'light' ? Colors.black : '#707071',
                  },
                  textInputContainer: {
                    flexDirection: 'row',
                  },
                  textInput: {
                    backgroundColor:
                      appThemeMode === 'light' ? Colors.white : Colors.black,
                    height: 44,
                    borderRadius: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    flex: 1,
                  },
                  poweredContainer: {
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderBottomRightRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderColor: '#c8c7cc',
                    borderTopWidth: 0.5,
                  },
                  powered: {},
                  listView: {},
                  row: {
                    backgroundColor: '#FFFFFF',
                    padding: 13,
                    height: 44,
                    flexDirection: 'row',
                  },
                  separator: {
                    height: 0,
                    backgroundColor: '#c8c7cc',
                  },
                  description: {},
                  loader: {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    height: 20,
                  },
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              {/* <TouchableOpacity onPress={() => this.setState({ showCityList: !this.state.showCityList })} style={[style.inputTxt, { flex: 1, marginRight: 5, justifyContent: 'center' }]}>
                                <Text style={{}}>{this.state.cityName}</Text>
                            </TouchableOpacity> */}
              {/* <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ cityName: text }) }}
                                value={this.state.cityName}
                                placeholder={"City"}
                                style={[style.inputTxt, { flex: 1, marginRight: 5 }]}
                            />
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ state: text }) }}
                                value={this.state.state}
                                placeholder={"State:"}
                                style={[style.inputTxt, { flex: 1, marginLeft: 5, marginRight: 5 }]}
                            />
                            <TextInput
                                placeholderTextColor='#707071'
                                onChangeText={(text) => { this.setState({ zip: text }) }}
                                value={this.state.zip}
                                placeholder={"Zip:"}
                                returnKeyType='done'
                                keyboardType={'number-pad'}
                                style={[style.inputTxt, { flex: 1, marginLeft: 5 }]}
                                maxLength={5}
                            /> */}
            </View>
            {/* {showCityList && <Picker style={{ width: 200, height: 180, alignSelf: "center" }}
                            lineColor="#000000" //to set top and bottom line color (Without gradients)
                            // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                            // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                            selectedValue={this.state.selectedCityItem}
                            itemStyle={{ color: "black", fontSize: 16 }}
                            onValueChange={(index) => this.onPickerCitySelect(index)}>
                            {cityList.map((item, i) => (
                                <PickerItem label={item.name} value={i} key={i} />
                            ))}
                        </Picker>} */}
            <View>
              <TextInput
                placeholderTextColor="#707071"
                // onChangeText={(text) => { this.setState({ date: text }) }}
                onChangeText={(text) => {
                  this.setDate(text);
                }}
                value={this.state.date}
                returnKeyType="done"
                placeholder={'Open House Start Date (MM-DD-YYYY)'}
                keyboardType={'phone-pad'}
                style={[style.inputTxt, { flex: 1 }]}
                maxLength={10}
              />

              {/* <View style={{ flex: 1, width: "100%", height: 30 }}>
                                <Text style={{ fontSize: 14, marginTop: 5, color: "#707071", marginStart: 10 }}>{this.state.date}</Text>
                            </View>
                            <Image source={require('./../../../assets/images/date.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>

                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image> */}
            </View>
            <View>
              <TextInput
                placeholderTextColor="#707071"
                // onChangeText={(text) => { this.setState({ date: text }) }}
                onChangeText={(text) => {
                  this.ClosingSetDate(text);
                }}
                value={this.state.closingDate}
                returnKeyType="done"
                placeholder={'Open House End Date (MM-DD-YYYY)'}
                keyboardType={'phone-pad'}
                style={[style.inputTxt, { flex: 1 }]}
                maxLength={10}
              />
            </View>
            <View>
              <TouchableOpacity style={[style.inputTxt, { flex: 1 }]}
                onPress={() => {
                  //alert('hello');
                  this.setState({ showTimePicker: true ,settingstartTime:true})
                }}>
                <Text style={{ color: '#707071',marginTop:10 }}>{this.state.openHouseStartTime}</Text>
                {/* <TextInput
                  placeholderTextColor="#707071"
                  // onChangeText={(text) => { this.setState({ date: text }) }}
                  onChangeText={(text) => {
                    this.startTimeSet(text);
                  }}
                  value={this.state.startTime}
                  returnKeyType="done"
                  placeholder={'Open House Start Time (HH:Min)'}
                  keyboardType={'phone-pad'}
                  style={[style.inputTxt, {flex: 1}]}
                  maxLength={5}
                /> */}
              </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity style={[style.inputTxt, { flex: 1 }]}
                onPress={() => {
                  //alert('hello');
                  this.setState({ showTimePicker: true ,settingstartTime:false})
                }}>
                <Text style={{ color: '#707071',marginTop:10 }}>{this.state.openHouseEndTime}</Text>
                {/* <TextInput
                  placeholderTextColor="#707071"
                  // onChangeText={(text) => { this.setState({ date: text }) }}
                  onChangeText={(text) => {
                    this.startTimeSet(text);
                  }}
                  value={this.state.startTime}
                  returnKeyType="done"
                  placeholder={'Open House Start Time (HH:Min)'}
                  keyboardType={'phone-pad'}
                  style={[style.inputTxt, {flex: 1}]}
                  maxLength={5}
                /> */}
              </TouchableOpacity>
              {/* <TextInput
                placeholderTextColor="#707071"
                // onChangeText={(text) => { this.setState({ date: text }) }}
                onChangeText={(text) => {
                  this.endTimeSet(text);
                }}
                value={this.state.endTime}
                returnKeyType="done"
                placeholder={'Open House End Time (HH:Min)'}
                keyboardType={'phone-pad'}
                style={[style.inputTxt, { flex: 1 }]}
                maxLength={5}
              /> */}
            </View>

            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ showRepeatType: !this.state.showRepeatType })
                }
                style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.RepeatType}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.showRepeatType && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={selectedRepeatType}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerRepeatTypeSelect(index);
                }}>
                {repeatTypeList.map((item, i) => (
                  <PickerItem label={item.name} value={i} key={i} />
                ))}
              </Picker>
            )}

            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showOpenHouseType: !this.state.showOpenHouseType,
                  })
                }
                style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.HouseTypeName}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.showOpenHouseType && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={selectedHouseType}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerHouseTypeSelect(index);
                }}>
                {openHouseTypeList.map((item, i) => (
                  <PickerItem label={item.name} value={i} key={i} />
                ))}
              </Picker>
            )}
            <TextInput
              placeholderTextColor="#707071"
              onChangeText={(text) => {
                this.setState({ propertyDescription: text });
              }}
              value={this.state.propertyDescription}
              placeholder={'Property Description:'}
              returnKeyType="done"
              //multiline={true}
              style={[style.inputTxt, { height: 66, textAlignVertical: 'top' }]}
            />
            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ showBedRoomList: !this.state.showBedRoomList })
                }
                style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.bedRoomName}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.showBedRoomList && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedBedRoom}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerBedroomSelect(index);
                }}>
                {bedroomList.map((item, i) => (
                  <PickerItem label={item.name} value={i} key={i} />
                ))}
              </Picker>
            )}
            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    showBathRoomList: !this.state.showBathRoomList,
                  })
                }
                style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.bathRoomName}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.showBathRoomList && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedBathRoom}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerBathroomSelect(index);
                }}>
                {bathroomList.map((item, i) => (
                  <PickerItem label={item.name} value={i} key={i} />
                ))}
              </Picker>
            )}
            {/* <TextInput
              value={this.state.propertyPrice}
              placeholder={'Property Price'}
              returnKeyType="done"
              keyboardType={'numeric'}
              style={style.inputTxt}
            /> */}
            <CurrencyInput
              placeholder={'Property Price'}
              style={style.inputTxt}
              returnKeyType="done"
              placeholderTextColor="#707071"
              value={this.state.propertyPrice}
              onChangeValue={(text) => {
                this.setState({ propertyPrice: text });
              }}
              prefix="$"
              delimiter=","
              separator="."
              precision={0}
            />
            <TextInput
              placeholderTextColor="#707071"
              onChangeText={(text) => {
                let value = text;

                this.setState({ squareFeet: text });
              }}
              value={this.state.squareFeet}
              placeholder={'Lot Size'}
              returnKeyType="done"
              keyboardType={'number-pad'}
              maxLength={10}
              style={style.inputTxt}
            />
            {/* <View style={style.dropInputCont}>
                           
                            <TouchableOpacity onPress={() => this.setState({ showSquareFeet: !this.state.showSquareFeet })} style={{ flex: 1 }}>
                                <Text style={{ paddingLeft: 10 }}>{this.state.squareFeetSize}</Text>
                            </TouchableOpacity>
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View> */}
            {this.state.showSquareFeet && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedSquareFeet}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerSquareFeetSelect(index);
                }}>
                {this.state.squareFeetList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            {/* <View style={style.dropInputCont}>
                            <TouchableOpacity onPress={() => this.setState({ showMinPlotSize: !this.state.showMinPlotSize, showMaxPlotSize: false })} style={{ flex: 1 }}>
                                <Text style={{ paddingLeft: 10 }}>{this.state.minimumPlotSize}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.setState({ showMaxPlotSize: !this.state.showMaxPlotSize, showMinPlotSize: false }) }} style={{ flex: 1 }}>
                                <Text style={{ paddingLeft: 10 }}>{this.state.maximumPlotSize}</Text>
                            </TouchableOpacity>
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View> */}
            {this.state.showMinPlotSize && (
              <Picker
                style={{ width: 200, height: 180 }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedMinimumPlotSize}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerMinimumPlotSelect(index);
                }}>
                {this.state.minimumPlotSizeList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            {this.state.showMaxPlotSize && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'flex-end' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedMaximumPlotSize}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerMaximumPlotSelect(index);
                }}>
                {this.state.maximumPlotSizeList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ showModal: !this.state.showModal })
                }
                style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.basement}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.showModal && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedItem}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerSelect(index);
                }}>
                {this.state.itemList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            <TextInput
              placeholderTextColor="#707071"
              onChangeText={(text) => {
                this.setState({ yearBuilt: text });
              }}
              value={this.state.yearBuilt}
              placeholder={'Year Built'}
              keyboardType={'number-pad'}
              returnKeyType="done"
              maxLength={4}
              style={style.inputTxt}
            />
            {/* <View style={style.dropInputCont}>
                            <TouchableOpacity onPress={() => this.setState({ showYearPicker: !this.state.showYearPicker })} style={{ flex: 1 }}>
                                <Text style={{ paddingLeft: 10 }}>{this.state.year}</Text>
                            </TouchableOpacity>
                            <Image source={require('./../../../assets/images/drop_down.png')}
                                resizeMode={'contain'}
                                style={style.dropImg}>
                            </Image>
                        </View> */}

            {this.state.showYearPicker && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedYear}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerYearSelect(index);
                }}>
                {this.state.yearList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ showAmenities: !this.state.showAmenities })
                }
                style={{ flex: 1, justifyContent: 'center' }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.otherAmenitiesText}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.showAmenities && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedAmenities}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerAmenitiesSelect(index);
                }}>
                {this.state.otherAmenitiesList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            <View style={style.dropInputCont}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ otherViews: !this.state.otherViews })
                }
                style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    color:
                      appThemeMode === 'light' ? Colors.black : Colors.white,
                  }}>
                  {this.state.otherViewsText}
                </Text>
              </TouchableOpacity>
              <Image
                source={require('./../../../assets/images/drop_down.png')}
                resizeMode={'contain'}
                style={style.dropImg}></Image>
            </View>
            {this.state.otherViews && (
              <Picker
                style={{ width: 200, height: 180, alignSelf: 'center' }}
                lineColor="#000000" //to set top and bottom line color (Without gradients)
                // lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
                // lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
                selectedValue={this.state.selectedViews}
                itemStyle={{
                  color: appThemeMode === 'light' ? Colors.black : Colors.white,
                  fontSize: 16,
                }}
                onValueChange={(index) => {
                  this.onPickerViewsSelect(index);
                }}>
                {this.state.otherViewsList.map((value, i) => (
                  <PickerItem label={value} value={i} key={i} />
                ))}
              </Picker>
            )}
            {/* <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <Text style={style.schoolTxt}>School District</Text>
              <TextInput
                placeholderTextColor="#707071"
                onChangeText={(text) => {
                  this.setState({schoolDistrict: text});
                }}
                value={this.state.schoolDistrict}
                placeholder={''}
                style={[style.inputTxt, {width: '65%'}]}
              />
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <Text style={style.schoolTxt}>Keywords</Text>
              <TextInput
                placeholderTextColor="#707071"
                onChangeText={(text) => {
                  this.setState({ keywords: text });
                }}
                value={this.state.keywords}
                placeholder={''}
                style={[style.inputTxt, { width: '65%' }]}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <ImageBackground
                source={floorPlan ? { uri: floorPlan } : null}
                resizeMode={'cover'}
                style={style.coverImage}>
                <View style={[style.imageInnerTxtCont, { top: 'auto' }]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ imageClick: '6', show9: false }, () => {
                        this.forceUpdate();
                      });
                      this.selectImageButtonPress();
                    }}
                    style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../../assets/images/blue_camera.png')}
                      resizeMode={'contain'}
                      style={{ width: 25, height: 25 }}
                    />
                    <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                      Upload Floor Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
            <View style={{ marginTop: 10 }}>
              <ImageBackground
                source={virtualTour ? { uri: virtualTour } : null}
                resizeMode={'cover'}
                style={style.coverImage}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ imageClick: '7', show9: false }, () => {
                      this.forceUpdate();
                    });
                    this.selectImageButtonPress();
                  }}
                  style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('../../../assets/images/plus.png')}
                    resizeMode={'contain'}
                    style={{ width: 25, height: 25, tintColor: '#005271' }}
                  />
                  <Text style={[style.profileTxt, { marginLeft: 5 }]}>
                    Add Virtual Tour
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.postHouse();
              }}
              style={[style.btnTouch, { marginTop: 15 }]}>
              <Text style={style.btnTxt}>POST / SAVE</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <DateTimePickerModal
          isVisible={this.state.showTimePicker}
          mode="time"
          onConfirm={(time) => {this.onChangeTimePicker(time)}}
          onCancel={()=>{this.setState({ showTimePicker: false })}}
        />

        {this.state.isCalender && this.calenderRender()}
        {this.state.isCalender2 && this.calenderRender2()}
        <ProgressBar visible={this.state.loading} />
        {loadingOnUpload && (
          <SafeAreaView
            style={{
              width: '100%',
              height: 5,
              bottom: 0,
              position: 'absolute',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: percentCompleted + '%',
                height: 5,
                backgroundColor: '#005271',
              }}></View>
          </SafeAreaView>
        )}
      </View>
    );
  }
}
const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  coverImage: {
    height: 70,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#707071',
  },
  imageInnerTxtCont: {
    position: 'absolute',
    width: '100%',
    top: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  profileTxt: {
    color: '#005271',
    fontFamily: fontFamily.Bold,
    marginTop: 5,
    fontSize: 13,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 55,
    backgroundColor: '#005271',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTxt: {
    height: 40,
    fontSize: 14,
    borderColor: '#707071',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 10,
  },
  btnTouch: {
    height: 45,
    margin: 5,
    borderColor: '#707071',
    borderWidth: 1,
    backgroundColor: '#EF4867',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginLeft: 20,
  },
  schoolTxt: {
    fontSize: 14,
    color: 'gray',
  },
  btnTxt: {
    fontSize: 18,
    color: 'white',
    fontFamily: fontFamily.Bold,
  },
  dropInputCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderColor: '#707071',
    borderWidth: 1,
    marginTop: 10,
  },
  dropInputTxt: {
    width: '82%',
    height: 40,
    fontSize: 14,
    paddingLeft: 10,
  },
  dropImg: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

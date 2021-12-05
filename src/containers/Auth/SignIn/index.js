import React, { Component, useState, useEffect } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Linking,
  AppRegistry,
} from 'react-native';
import jwt_decode from "jwt-decode";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager, 
} from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { NavigationActions, StackActions } from 'react-navigation';
import Preference from 'react-native-preference';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import Header from '../../../component/Header';
import ProgressBar from './../../../component/ProgressBar';
import { DarkModeContext, eventEmitter } from 'react-native-dark-mode';
import { Colors } from './../../../utils/Colors'
import { API } from '../../../utils/constants';
import SimpleToast from 'react-native-simple-toast';

const resetActionToHome = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'MainBottomTab' })],
});

export default class login extends Component {
  static contextType = DarkModeContext;
  constructor(props) {
    super(props);
    // this.authCredentialListener = null;
    this.user = null;
    this.state = {
      email: '',
      // email: "test5@test.com",
      loading: false,
      dataFacebook: '',
      accessToken: '',
      gettingLoginStatus: true,
      show: false,
      message: '',
      userInfo: '',
      acceptPrivacy: false,
      postHouse: props.navigation.getParam('postHouse'),
      dataGoogle: '',
      credentialStateForUser: -1,
      appThemeMode: 'light'
    };
  }

  componentDidMount() {
    this.setState({
      appThemeMode: this.context === 'dark' ? 'dark' : 'light'
    }, () => {
      this.forceUpdate()
      console.log('comp->', this.setState.appThemeMode)
    })
    eventEmitter.on('currentModeChanged', newMode => {
      console.log('Switched to', newMode, 'mode')
      this.setState({
        appThemeMode: newMode
      }, () => {
        this.forceUpdate()
      })
    })
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      // webClientId: '839908854915-tj8etf8rbksk057fatlou0jjriqd8t79.apps.googleusercontent.com'
      webClientId:
        '404084199778-nsep4maljjb07ldh85sc8jb9f3s33d6t.apps.googleusercontent.com',
    });
  }
  componentWillUnmount() {
    if (this.authCredentialListener) {
      this.authCredentialListener = null;
    }
    // this.authCredentialListener();
  }

  appleSignIn = async () => {
    console.warn('appleSignIn-Beginning Apple Authentication');
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      console.log('appleSignIn-appleAuthRequestResponse', appleAuthRequestResponse);

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
        const firstName = appleAuthRequestResponse?.fullName?.givenName ? appleAuthRequestResponse?.fullName?.givenName : ' '
        const lastName = appleAuthRequestResponse?.fullName?.familyName ? appleAuthRequestResponse?.fullName?.familyName : ' '
        const email = appleAuthRequestResponse.email ? appleAuthRequestResponse.email : decoded?.email
        this.appleLogin({
          user: appleAuthRequestResponse.user,
          email: email,
          firstName: firstName,
          lastName: lastName
        })
      }

    } catch (error) {
      console.log('appleSignIn-error', error);
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    }
  };

  _googleSignIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    // if (isSignedIn) {
      const currentUser = await GoogleSignin.getCurrentUser();
      console.log('my current user=====>', currentUser);
      if (currentUser !== null) {
        // Preference.set({ userData: currentUser.user, socialLogin: 'true' });
        if (currentUser !== '' || currentUser !== undefined) {
          this.setState({ dataGoogle: currentUser }, () => {
            this.SocialLoginGoogle();
          });
        } else {
          Alert.alert(
            null,
            'Google sign in error',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
          );
          // SimpleToast.show('Google sign in error')
        }

      }
      // this.props.navigation.dispatch(resetActionToHome);
      // const isSignedOut = await GoogleSignin.signOut();
      // SimpleToast.show('You already sign in with this email')
      // return;
    // }
    console.log('check user sign in===>', isSignedIn);
    console.log('Sign In call');
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('google: ' + JSON.stringify(userInfo));
      let googleToken = userInfo.idToken;
      if (userInfo !== '' || userInfo !== undefined) {
        this.setState({ dataGoogle: userInfo }, () => {
          this.SocialLoginGoogle();
        });
      } else {
        Alert.alert(
          null,
          'Google sign in error',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false },
        );
        // SimpleToast.show('Google sign in error')
      }
      // this.GSignIn(googleToken)
      //call api function and pass this userInfo object
    } catch (error) {
      // alert("google SignIn Error: " + error.message);
      console.log('google SignIn Error: ' + JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  facebokLogin = async () => {
    this.setState({ loading: true });
    let result;
    try {
      if (Platform.OS === 'ios') {
        result = await LoginManager.logInWithPermissions([
          'email',
          'public_profile',
        ]);
      } else {
        result = await LoginManager.logInWithPermissions([
          'email',
          'public_profile',
        ]);
      }

      if (result.isCancelled) {
        this.setState({ loading: false });
        console.log('i m here and user cancel the grant');
        this.setState({ show: true, message: 'Login was cancelled' });
      } else {
        //alert("Login is succesfull with permission " + result.grantedPermissions.toString())
        this.FBGraphRequest(
          'id,email,name,first_name,last_name,picture',
          this.FBLoginCallback,
        );
      }
    } catch (e) {
      alert('Login error: ' + e);
    }
  };

  async FBGraphRequest(fields, callback) {
    const accessData = await AccessToken.getCurrentAccessToken();
    // Create a graph request asking for user information
    this.setState({ accessToken: accessData.accessToken });
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: accessData.accessToken,
        parameters: {
          fields: {
            string: fields,
          },
        },
      },
      callback.bind(this),
    );
    // Execute the graph request created above
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  async FBLoginCallback(error, result) {
    this.setState({ loading: false });
    if (error) {
      alert(JSON.stringify(error));
    } else {
      this.setState({ dataFacebook: result }, () => {
        console.log(
          'facebookVariable=================?',
          JSON.stringify(result),
        );
        this.SocialLogin();
        // console.log("facebookVariable", this.state.dataFacebook.picture)
        // console.log("facebookVariable", this.state.dataFacebook.picture.data)
        // console.log("facebookVariable", this.state.dataFacebook.picture.data.url)
        // this.socialLogin(result);
        // this.props.navigation.navigate('NavigationName.mainStack')
      });
    }
  }

  SocialLoginGoogle = () => {
    // alert("fdsfsdfsdfsd")
    const details = {
      picture_url: this.state.dataGoogle.user.photo,
      id: this.state.dataGoogle.user.id,
      // last_name:this.state.dataGoogle.last_name,
      first_name: this.state.dataGoogle.user.name,
      email: this.state.dataGoogle.user.email,
    };
    this.setState({ loading: true });
    // console.log("Params: ", JSON.stringify(body))
    var requestPramas = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      requestPramas.push(encodedKey + '=' + encodedValue);
    }
    console.log('API URL: ' + API.CHECK_EMAIL);
    console.log('API Params: ' + JSON.stringify(details));

    requestPramas = requestPramas.join('&');
    fetch(API.SOCIAL_MEDIA_LOGIN, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestPramas,
    })
      .then((response) => {
        // console.log('response before json:', response);
        return response.json();
      })
      .then((response) => {
        this.setState({ loading: false });
        console.log('checkEmailApi Response: ' + JSON.stringify(response));
        if (response.status === '200') {
          this.setState({ email: this.state.dataGoogle.user.email }, () => {
            // Preference.set('userData', response.body);
            Preference.set({ userData: response.body, socialLogin: 'true' });
            this.props.navigation.dispatch(resetActionToHome);
            // this.checkEmailApi();
          });
        } 
        else {
          Alert.alert(
            null,
            // 'You already signin with this email',
            JSON.stringify(response),
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
          );
          // SimpleToast.show('Password is incorrect')
          this.setState({ loading: false });
          console.log('Error: ' + JSON.stringify(response));
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('ApiError:', error);
      });
  };

  SocialLogin = () => {
    const details = {
      picture_url: this.state.dataFacebook.picture.data.url,
      id: this.state.dataFacebook.id,
      last_name: this.state.dataFacebook.last_name,
      first_name: this.state.dataFacebook.first_name,
      email: this.state.dataFacebook.email,
    };
    this.setState({ loading: true });
    // console.log("Params: ", JSON.stringify(body))
    var requestPramas = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      requestPramas.push(encodedKey + '=' + encodedValue);
    }
    console.log('API URL: ' + API.CHECK_EMAIL);
    console.log('API Params: ' + JSON.stringify(details));

    requestPramas = requestPramas.join('&');
    fetch(API.SOCIAL_MEDIA_LOGIN, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestPramas,
    })
      .then((response) => {
        // console.log('response before json:', response);
        return response.json();
      })
      .then((response) => {
        this.setState({ loading: false });
        console.log('checkEmailApi Response: ' + JSON.stringify(response));
        if (response.status === '200') {
          this.setState({ email: this.state.dataFacebook.email }, () => {
            Preference.set({ userData: response.body, socialLogin: 'true' });
            this.props.navigation.dispatch(resetActionToHome);
            // this.checkEmailApi();
          });
        } else if (response.status == '404') {
          Alert.alert(
            null,
            'The password you entered for the email address is incorrect',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
          );
          // SimpleToast.show('The password you entered for the email address is incorrect')
        } else {
          this.setState({ loading: false });
          console.log('Error: ' + JSON.stringify(response));
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('ApiError:', error);
      });
  };


  appleLogin = (appleData) => {
    let details = {
      id: appleData.user,
      first_name: appleData.firstName,
      last_name: appleData.lastName,
      email: appleData.email,
    };

    this.setState({ loading: true });
    // console.log("Params: ", JSON.stringify(body))
    var requestPramas = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      requestPramas.push(encodedKey + '=' + encodedValue);
    }
    console.log('API URL: ' + API.CHECK_EMAIL);
    console.log('API Params: ' + JSON.stringify(details));

    requestPramas = requestPramas.join('&');
    fetch(API.SOCIAL_MEDIA_LOGIN, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestPramas,
    })
      .then((response) => {
        // console.log('response before json:', response);
        return response.json();
      })
      .then((response) => {
        this.setState({ loading: false });
        console.log('checkEmailApi Response: ' + JSON.stringify(response));
        if (response.status === '200') {
          this.setState({ email: this.state.dataFacebook.email }, () => {
            Preference.set({ userData: response.body, socialLogin: 'true' });
            this.props.navigation.dispatch(resetActionToHome);
            // this.checkEmailApi();
          });
        } else if (response.status == '404') {
          Alert.alert(
            null,
            'The password you entered for the email address is incorrect',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false },
          );
          // SimpleToast.show('The password you entered for the email address is incorrect')
        } else {
          this.setState({ loading: false });
          console.log('Error: ' + JSON.stringify(response));
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('ApiError:', error);
      });
  };

  checkEmailApi = () => {
    const details = {
      username_or_email: this.state.email,
    };
    this.setState({ loading: true });
    // console.log("Params: ", JSON.stringify(body))
    var requestPramas = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      requestPramas.push(encodedKey + '=' + encodedValue);
    }
    console.log('API URL: ' + API.CHECK_EMAIL);
    console.log('API Params: ' + JSON.stringify(details));

    requestPramas = requestPramas.join('&');
    fetch(API.CHECK_EMAIL, {
      method: 'POST',
      headers: {
        // 'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestPramas,
    })
      .then((response) => {
        // console.log('response before json:', response);
        return response.json();
      })
      .then((response) => {
        this.setState({ loading: false });
        console.log('checkEmailApi Response: ' + JSON.stringify(response));
        if (response.status === '200') {
          this.props.navigation.navigate('CreatePassword', {
            userExist: true,
            email: this.state.email,
            postHouse: this.state.postHouse,
          });
        } else {
          this.setState({ loading: false });
          console.log('Error: ' + JSON.stringify(response));
          this.props.navigation.navigate('Register', {
            email: this.state.email,
            postHouse: this.state.postHouse,
          });
        }
        this.setState({email :'', acceptPrivacy: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log('ApiError:', error);
      });
  };

  continueButtonPressed() {
    if (!this.checkFields()) {
      return false;
    } else {
      this.checkEmailApi();
    }
  }

  checkFields() {
    if (this.state.email === '') {
      alert('Email is required');
      return false;
    } else if (
      /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(this.state.email) ==
      false
    ) {
      alert('Email format is incorrect');
      return false;
    } else if (!this.state.acceptPrivacy) {
      alert('Please accept Terms and Conditions');
      return false;
    } else {
      /*if ((/^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/).test(this.state.email) == false) {
              alert('Email format incorrect')
              return false
          }*/
      return true;
    }
  }
  leftAction() { }
  rightAction() { }
  render() {
    const { appThemeMode } = this.state
    return (
      <ScrollView style={[style.mainContainer, { backgroundColor: appThemeMode === 'light' ? Colors.white : Colors.black }]}>
        <Header
          leftAction={this.leftAction.bind(this)}
          rightAction={this.rightAction.bind(this)}
          HeaderColor={'#00B7B0'}
          bottomBorderColor={'#EF4867'}
          centerComponent={'REGISTER/SIGN IN'}
        />
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            margin: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Text style={{ fontSize: 22, color: '#00B7B0', fontWeight: 'bold' }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // this.props.navigation.navigate('Register')
              this.continueButtonPressed();
            }}>
            <Text style={{ fontSize: 22, color: '#707071', fontWeight: 'bold' }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 22,
            color: '#707071',
            fontWeight: 'bold',
            marginLeft: 20,
          }}>
          {'Enter Your Email to Continue'}
        </Text>
        <View style={{ flex: 1, margin: 20 }}>
          <View
            style={{
              height: 50,
              borderColor: '#707071',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              placeholderTextColor="#707071"
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
              value={this.state.email}
              placeholder={'Email'}
              style={{
                width: '95%',
                height: 60,
                fontSize: 18,
                marginStart: 10,
                color: appThemeMode === 'light' ? Colors.black : Colors.inputFieldText
              }}
              autoCapitalize={'none'}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              this.setState({ acceptPrivacy: !this.state.acceptPrivacy })
            }
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              textAlign: 'center',
              marginVertical: 20,
              marginHorizontal: 10,
            }}>
            <Image
              style={{
                resizeMode: 'contain',
                width: 20,
                height: 20,
                marginTop: 7,
              }}
              source={
                this.state.acceptPrivacy
                  ? require('../../../assets/images/checkbox.png')
                  : require('../../../assets/images/empty_checkbox.png')
              }
            />
            <View>
              <Text style={{ margin: 5, paddingLeft: 10, color: appThemeMode === 'light' ? Colors.black : Colors.white }}>
                By tapping Continue, I accept Find Open Houses Now’s{' '}
                <Text
                  onPress={() =>
                    Linking.openURL(
                      'https://findopenhousesnow.com/terms-conditions/',
                    )
                  }
                  style={{ color: '#00B7B0' }}>
                  Terms & Conditions
                </Text>{' '}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.continueButtonPressed();
            }}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#D1AE5E',
            }}>
            <Text style={{ color: 'white', fontSize: 22 }}>Continue</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: '49%',
              height: 2,
              backgroundColor: '#EF4867',
            }}></View>
          <Text style={{ fontSize: 16, marginStart: 5, marginEnd: 5 }}>Or</Text>
          <View
            style={{
              width: '50%',
              height: 2,
              backgroundColor: '#EF4867',
            }}></View>
        </View>
        <View style={{ flex: 1, margin: 20 }}>
          {
            Platform.OS == 'ios' && (
              <AppleButton
                style={style.appleButton}
                cornerRadius={0}
                buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                buttonType={AppleButton.Type.SIGN_IN}
                onPress={this.appleSignIn}
              />
            )
            // <TouchableOpacity style={{ height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#707071' }}>
            //     <Text style={{ color: 'white', fontSize: 22 }}>Continue With Apple</Text>
            // </TouchableOpacity>
          }
          <TouchableOpacity
            onPress={() => {
              this.facebokLogin()
            }}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#005271',
              marginTop: 20,
            }}>
            <Text style={{ color: 'white', fontSize: 22 }}>
              Continue With Facebook
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this._googleSignIn()}
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#707071',
              borderWidth: 1,
              marginTop: 20,
            }}>
            <Text style={{ color: '#707071', fontSize: 22 }}>
              Continue With Google
            </Text>
          </TouchableOpacity>
        </View>
        <ProgressBar visible={this.state.loading} />
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  appleButton: {
    width: '100%',
    height: 50,
    // margin: 10,
  },
});

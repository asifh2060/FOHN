import ApiUtils from '../network/ApiUtils';
import {constants} from '../utils/constants';
import Prefernce from 'react-native-preference';

const SIGN_UP_API = 'signup.php';
// const CHECK_EMAIL_API = 'check_email.php'
const CHECK_EMAIL_API = 'http://findopenhouse.appcrates.co/wp-json/hma/v-1/check-email'
const LOGIN_NORMAL_USER_API = 'login_normal_user.php';

function createRequestData(method, body) {
  return {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}
function createRequestDataWithBearer(method, body) {
  if (method === 'GET') {
    return {
      method: method,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Prefernce.get('authToken'),
        'Content-Type': 'application/json',
      },
    };
  } else {
    return {
      method: method,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Prefernce.get('authToken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }
}

const Api = {
  signUp: function (body) {
    const requestData = createRequestData('POST', body);
    return fetch(constants.baseUrl + SIGN_UP_API, requestData)
      .then(ApiUtils.checkStatus)
      .then(ApiUtils.readResponse);
  },
  /*CheckEmail: function (body) {
    const requestData = createRequestData('POST', body);
    return fetch(constants.baseUrl + CHECK_EMAIL_API, requestData)
      .then(ApiUtils.checkStatus)
      .then(ApiUtils.readResponse);
  },*/
    CheckEmail: function (body) {
    const requestData = createRequestData('POST', body);
    return fetch( CHECK_EMAIL_API, requestData)
      .then(ApiUtils.checkStatus)
      .then(ApiUtils.readResponse);
  },
  NormalUserLogin: function (body) {
    const requestData = createRequestData('POST', body);
    return fetch(constants.baseUrl + LOGIN_NORMAL_USER_API, requestData)
      .then(ApiUtils.checkStatus)
      .then(ApiUtils.readResponse);
  },
};

export default Api;

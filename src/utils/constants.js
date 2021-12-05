

// export const BASE_URL_LIVE = 'https://findopenhousesnow.com/'
// export const BASE_URL_LIVE = 'https://findopenhouse.appcrates.co/'
//export const BASE_URL = 'http://findopenhousenow.wordpress.appcrates.co/'//staging
export const BASE_URL = 'https://findopenhousesnow.com/'//live 
export const MIDDLE_PATH = 'wp-json/hma/'
export const VERSION = 'v-1'
export const API_URL = BASE_URL + MIDDLE_PATH + VERSION

export const API = {
    LOGIN: API_URL + '/login-user',
    REGISTER: API_URL + '/register-user',
    CHECK_EMAIL: API_URL + '/check-email',
    RESET_PASS: API_URL + '/reset-password-by-mail',
    GET_USER_BY_ROLE: API_URL + '/get-users-by-role',
    GET_USER_BY_ID: API_URL + '/get-user-by-id',
    GET_LOCATION_BY_ID: API_URL + '/get-property-by-id',
    CREATE_USER_PROFILE: API_URL + '/create-user-profile',
    GET_PROPERTY_BY_LOCATION: API_URL + '/get-properties-by-location',
    UPDATE_USER_PROFILE: API_URL + '/update-user-profile',
    GET_COUNTRIES: API_URL + '/get-countries',
    GET_STATES_BY_COUNTRY: API_URL + '/get-states-by-country',
    GET_TAXONOMIES: API_URL + '/get-taxonomies',
    INSERT_UPDATE_OPEN_HOUSE: API_URL + '/insert-update-open-house',
    FILTER_OPEN_HOUSE: API_URL + '/filter-open-house',
    GET_PROPERTIES_BY_USER_ID: API_URL + '/get-properties-by-user-id',
    SHARE_OPEN_HOUSE_TO_EMAIL: API_URL + '/share-open-house-to-emails',
    CONTACT_TO_PROPERTY_OWNER: API_URL + '/contact-to-property-owner',
    INSERT_USER_REVIEW: API_URL + '/insert-user-review',
    SOCIAL_MEDIA_LOGIN: API_URL + '/socialmedia-login',
    GET_BOOKMARKS_FOLDERS: API_URL + '/get-bookmarks-folders',
   ADD_BOOKMARKS_TO_EXISTING_FOLDER:  API_URL + '/add-bookmark-to-existing-folder',
   ADD_BOOKMARKS_TO_NEW_FOLDER: API_URL + '/add-bookmark-to-new-folder',
   GET_BOOKMARKS: API_URL + '/get-bookmarks',
   GET_NOTIFIED_PROPERTIES: API_URL + '/get-notified-properties',
   GET_BOOKMARKS_BY_FOLDERS: API_URL + '/get-bookmarks-by-folder',
   REMOVE_BOOKMARKS: API_URL + '/remove-bookmark',
   FOLLOW_UNFOLLOW_USER: API_URL + '/follow-unfollow-users',
   SEND_MESSAGES: API_URL + '/send-messages',
   GET_MESSAGES: API_URL + '/get-messages',
   UPDATE_MESSAGE_STATUS: API_URL + '/update-message-status',
   GET_FOLLOWING_FOLLOWERS: API_URL + '/get-following-followers',
   SAVE_USER_SEARCH: API_URL + '/save-user-search',
   GET_USER_SEARCH: API_URL + '/get-user-search',
   SORT_OPEN_HOUSE: API_URL + '/sort-open-house',
   SEARCH_USER_BY_KEYWORD: API_URL + '/search-user-by-keyword',
   GET_PACKAGES: 'https://foh.nninternationals.com/wp-json/wc/v3/products',
   GET_POLYGON_SEARCH: API_URL + '/get-properties-by-polygon', 
}

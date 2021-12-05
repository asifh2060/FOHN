
import { Platform } from "react-native";

const DEFAULT = {
    Regular:'HelveticaNeue-Medium',
    SemiBold:'HelveticaNeue-Medium',
    Bold:'HelveticaNeue-Bold',
    Light:'HelveticaNeue-Light',
}

const FONT_ANDROID = {

    Regular:'HelveticaNeue-Roman',
    SemiBold:'HelveticaNeue-Medium',
    Bold:'HelveticaNeue-Bold',
    Light:'HelveticaNeue-Light',
}

const fontFamily = Platform.select({
    ios: DEFAULT,
    android:  FONT_ANDROID
})

export default fontFamily
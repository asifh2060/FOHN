
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @gregfrench/react-native-wheel-picker
import com.zyu.ReactNativeWheelPickerPackage;
// @invertase/react-native-apple-authentication
import com.RNAppleAuthentication.AppleAuthenticationAndroidPackage;
// @react-native-community/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/checkbox
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/google-signin
import co.apptailor.googlesignin.RNGoogleSigninPackage;
// @react-native-community/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @react-native-community/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// react-native-apple-authentication
import com.reactlibrary.AppleAuthenticationPackage;
// react-native-dark-mode
import com.codemotionapps.reactnativedarkmode.DarkModePackage;
// react-native-fbsdk
import com.facebook.reactnative.androidsdk.FBSDKPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-iap
import com.dooboolab.RNIap.RNIapPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-maps
import com.airbnb.android.react.maps.MapsPackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-preference
import im.shimo.react.preference.PreferencePackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-settings
import io.rumors.reactnativesettings.RNSettingsPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// rn-range-slider
import com.ashideas.rnrangeslider.RangeSliderPackage;
// tipsi-stripe
import com.gettipsi.stripe.StripeReactPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new ReactNativeWheelPickerPackage(),
      new AppleAuthenticationAndroidPackage(),
      new AsyncStoragePackage(),
      new ReactCheckBoxPackage(),
      new RNDateTimePickerPackage(),
      new GeolocationPackage(),
      new RNGoogleSigninPackage(),
      new RNCMaskedViewPackage(),
      new RNCPickerPackage(),
      new AppleAuthenticationPackage(),
      new DarkModePackage(),
      new FBSDKPackage(),
      new RNGestureHandlerPackage(),
      new RNIapPackage(),
      new ImagePickerPackage(),
      new MapsPackage(),
      new RNPermissionsPackage(),
      new PreferencePackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSettingsPackage(),
      new VectorIconsPackage(),
      new ReactVideoPackage(),
      new RangeSliderPackage(),
      new StripeReactPackage()
    ));
  }
}

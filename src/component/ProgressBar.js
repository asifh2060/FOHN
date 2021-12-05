// import React, { Component } from 'react';
// import {
//     View,
//     Image,
//     StyleSheet
// } from 'react-native';
// import Spinner from 'react-native-loading-spinner-overlay';

// export default ProgressBar = props => {
//     if (props.visible) {
//         return (
//             <View style={styles.container}>
//                 <Spinner
//                 color={'#0e5271'}
//                     visible={props.visible}
//                     // textContent={'Loading...'}
//                     textStyle={styles.spinnerTextStyle}
//                 />
//             </View>
//             // <View style={[{
//             //     position: 'absolute',
//             //     top: 0, bottom: 0, left: 0, right: 0,
//             //     alignItems: 'center', justifyContent: 'center',
//             //     backgroundColor: '#ffffffAA'
//             // }, props.style]}>
//             //     <Image
//             //         source={require('./../assets/images/loading.gif')}
//             //         style={{width: 80, height: 50}}
//             //         resizeMode='cover'
//             //     />
//             // </View>
//         )
//     } else {
//         return null
//     }
// }

// const styles = StyleSheet.create({
//     spinnerTextStyle: {
//       color: '#FFF'
//     },
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#F5FCFF'
//     },
//   });


import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

// import colors from "../utils/colors";

export default ProgressBar = (props) => {
    const { loading, style, containerStyle, color, size, visible } = props

    if (visible)
        return (
            <View style={[styles.container, containerStyle]}>
                {visible &&
                    <ActivityIndicator
                        animating={visible}
                        size={size ? size : 'large'}
                        color={color ? color : '#0e5271'}
                        style={[{ marginLeft: 5 }, style ? style : {}]}
                    />
                }
            </View>
        )
    else return null
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: ('#ffffff30'),
        alignItems: 'center',
        justifyContent: 'center',
    }
})

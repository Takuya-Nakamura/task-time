import React, { Component } from 'react';
import { StyleSheet, Animated } from 'react-native';
import Svg, { Path, } from 'react-native-svg';


// const path3 = "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
const path3 = "M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"
//anim config
const duration = 150
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default class CheckMark extends Component {


  constructor(props) {
    super(props);
    this.state = {
      //svg
      svgScale: new Animated.Value(0),

    };
  }


  _onPressMark = () => {
    this._svgScaleAnimation()

  }


  _svgScaleAnimation = () => {
    // const { checked, svgScale } = this.state
    const { svgScale } = this.state

    Animated.timing(svgScale, {
      toValue: !this.props.on ? 0 : 100, //interpolate 値
      duration: duration,
      useNativeDriver: false,
    }).start();
  }



  /************************************
  * Render
  *************************************/
  render() {
    const {svgScale, } = this.state


    // 色の変遷

    const _interPolateSvgScale = svgScale.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
    });


    const dStyle = {
      transform: [
        { scale: _interPolateSvgScale },
      ],
    };

    this._onPressMark()

    return (
      <>
        {this.props.on == true &&
          <AnimatedSvg height={this.props.size} width={this.props.size} viewBox='0 0 28 28' style={[dStyle, styles.svg]} >
            <AnimatedPath
              d={path3}
              // fill={"#49A839"}
              strokeWidth={5}
              fill={this.props.fill}
              
            />
          </AnimatedSvg>
        }
      </>
    );


  }
}

const styles = StyleSheet.create({
  svg:{
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red'
  }
});


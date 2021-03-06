import React, { Component } from 'react';
import {
  StyleSheet,
  Animated

} from 'react-native';
import Svg, {
  Path,
} from 'react-native-svg';


const path3= "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"

//anim config
const duration = 150
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default class PathButtonAnim extends Component {


  constructor(props) {
    super(props);
    console.log("########### constructor")
    console.log("props.on", props.on)
    this.state = {
      // checked: props.on,
      
      //svg
      svgScale: new Animated.Value(0),
      
    };
  }


  _onPressHert = () => {
    console.log("####################  _onPressHert")
    console.log("this.state", this.state.checked)
    console.log("this.props", this.props.on)
    
    this._svgScaleAnimation()
    // this._heartColorAnimation()

  }


  _svgScaleAnimation = () => {
    // const { checked, svgScale } = this.state
    const { svgScale } = this.state
    
    Animated.timing(svgScale, {
      toValue:!this.props.on ? 0 : 100, //interpolate 値
      duration: duration,
      useNativeDriver: false,
    }).start();
  }


  
  /************************************
  * Render
  *************************************/
  render() {
    const { svgSize, svgScale, heartColor, heartY, heartTransformY, heartTransformX } = this.state
    

    // 色の変遷

    const _interPolateSvgScale = svgScale.interpolate({
      inputRange: [0, 100],
      outputRange: [0.5, 1],
    });


    const dStyle = {
      transform: [
        { scale: _interPolateSvgScale },
      ],
    };

    this._onPressHert()

    return (
      <>
      {this.props.on && 
      <AnimatedSvg height={this.props.size} width={this.props.size}  viewBox='0 0 600 600'  style={dStyle} >
        
        <AnimatedPath

          d={path3}
          fill={"#49A839"}
          // stroke="gray"
          strokeWidth={5}
          // onPress={this._onPressHert}
        />

      </AnimatedSvg>
      }
      </>
  
    );
  }
}

const styles = StyleSheet.create({
});


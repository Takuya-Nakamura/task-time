import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Svg, {
  Path,
} from 'react-native-svg';


const path = "M501.453,183.246c-0.164-0.559-0.309-1.129-0.477-1.688c-0.89-2.938-1.87-5.832-2.867-8.726c-0.382-1.121-0.734-2.25-1.133-3.363c-0.89-2.488-1.867-4.93-2.832-7.382c-0.578-1.462-1.121-2.938-1.726-4.391c-0.93-2.234-1.934-4.43-2.926-6.633c-0.719-1.594-1.406-3.203-2.156-4.781c-1.063-2.234-2.199-4.422-3.321-6.622c-0.754-1.469-1.469-2.953-2.25-4.406c-1.363-2.543-2.809-5.035-4.254-7.528c-0.602-1.035-1.171-2.09-1.789-3.117c-1.977-3.301-4.035-6.543-6.156-9.742c-0.114-0.172-0.215-0.347-0.328-0.515c-21-31.551-48.805-58.168-81.336-77.766c-0.672-0.406-1.363-0.778-2.039-1.18c-2.859-1.687-5.734-3.347-8.668-4.926c-0.938-0.508-1.898-0.969-2.848-1.465c-2.73-1.426-5.469-2.84-8.258-4.168c-0.902-0.434-1.824-0.821-2.73-1.242c-2.906-1.344-5.824-2.668-8.785-3.906c-0.59-0.246-1.192-0.461-1.782-0.703c-3.34-1.363-6.699-2.683-10.11-3.91c-0.042-0.016-0.09-0.027-0.133-0.043c-26.926-9.676-55.926-15-86.179-15.043C114.989-0.206,0.207,114.242,0,255.625C-0.203,397.008,114.242,511.793,255.629,512C397.011,512.203,511.793,397.754,512,256.371C512.035,230.957,508.316,206.43,501.453,183.246z M220.926,369.066l0.086-59.535c0.011-8.222-6.489-14.894-14.524-14.906l-64-0.094c-8.031-0.008-14.534-6.683-14.523-14.906l0.062-41.672c0.012-8.222,6.531-14.874,14.566-14.859l64,0.09c8.031,0.011,14.555-6.641,14.566-14.864l0.094-65.488c0.012-8.218,6.535-14.875,14.57-14.863l40.726,0.058c8.031,0.012,14.535,6.688,14.524,14.906l-0.094,65.488c-0.012,8.223,6.488,14.895,14.523,14.906l64,0.094c8.031,0.012,14.535,6.68,14.523,14.902l-0.062,41.672c-0.012,8.222-6.531,14.879-14.566,14.867l-64-0.094c-8.031-0.012-14.554,6.641-14.566,14.863l-0.086,59.535c-0.012,8.218-6.535,14.871-14.566,14.859l-40.727-0.058C227.418,383.957,220.914,377.285,220.926,369.066z"


//anim config
const duration = 150
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default class PlusMark extends Component {


  constructor(props) {
    super(props);
    this.state = {
      fill: this.props.fill || "#49A839",
      svgScale: new Animated.Value(0)
    };
  }


  _onPress = () => {
    const {onPress} = this.props
    if (onPress) onPress()
    
  }

a
  _svgScaleAnimation = () => {
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

    const { label } = this.props
    const { fill } = this.state
    // 色の変遷

    return (
      <TouchableWithoutFeedback style={[styles.wrapper, this.props.style]} onPress={this._onPress}>
        <AnimatedSvg height={this.props.size} width={this.props.size} viewBox='0 0 518 518' >
          <AnimatedPath
            d={path}
            fill={fill}

          />
        </AnimatedSvg>
        {label && <Text>{label}</Text>}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});


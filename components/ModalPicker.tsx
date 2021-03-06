import React from 'react'
import { StyleSheet, Image, TouchableWithoutFeedback, View, Text, Modal, Platform, Dimensions, Animated, TouchableOpacity } from 'react-native'
// import { WheelPicker } from 'react-native-wheel-picker-android'
// import { Color, Font, Size } from '../../global_styles'
import { Picker } from '@react-native-picker/picker';

interface Props {
  placeholder?: string
  data: any[]
  currentValue: string
  onValueChange: (value: string, index: number) => void
  style?: {}
  textStyle?: {}
  placeholderStyle?: {}
  hideIcon: boolean
  modalVisible: boolean
  onClose: () => {}
  selectedValue: string
}

interface State {
  modalVisible: boolean
  modalMarginTop: any
  activeValue: string
  selectedIndex: number
}

const { height, width } = Dimensions.get('window')
const modalHeight = 300
const marginTop = height - modalHeight


export class ModalPicker extends React.Component<Props, State> {

  static defaultProps = {
    placeholder: '',
    currentValue: '',
    hideIcon: false
  }

  constructor(props: Props) {
    super(props)


    this.state = {
      modalMarginTop: new Animated.Value(height),
      modalVisible: this.props.modalVisible,
      activeValue: '',
      selectedIndex: 0,
    }
  }


  // ----------------------------------------
  // Data
  // ----------------------------------------



  _udpateValue = (index: number) => {
    const { data } = this.props
    // this.setState({
    //   activeValue: data[index],
    //   selectedIndex: index
    // })
  }

  _resetValue = () => {
    const { data, currentValue } = this.props
    // const activeValue = currentValue == '' ? data[0] : currentValue
    // this.setState({
    // activeValue: activeValue,
    // selectedIndex: data.findIndex((item: any) => item == activeValue)
    // })
  }

  // ----------------------------------------
  // Action
  // ----------------------------------------

  _showPicker = () => {
    this._resetValue()
    // this.setState({ modalVisible: true })
    Animated.timing(this.state.modalMarginTop, {
      toValue: marginTop,
      duration: 200,
      useNativeDriver: false
    }).start()
  }

  _closePicker = () => {
    Animated.timing(this.state.modalMarginTop, {
      toValue: height,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      // this.setState({ modalVisible: false })

      this.props.onClose()
    })
  }

  // _onComplete = () => {
  //   const { activeValue, selectedIndex } = this.state
  //   // UI競合を避けるため, animation完了後にonChangeを実行
  //   setTimeout(() => {
  //     // this.props.onValueChange(activeValue, selectedIndex)
  //   }, 400)
  //   this._closePicker()
  // }



  // ----------------------------------------
  // Render
  // ----------------------------------------

  _renderModalHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.button__right} onPress={this._closePicker}>
          <Text style={styles.button__text}>✗</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderPicker = () => {
    const { data, selectedValue } = this.props
    return (
      <View style={styles.picker__container}>


        <Picker
          style={{ width: width, backgroundColor: '#e1e1e1' }}
          onValueChange={this.props.onValueChange}

          selectedValue={selectedValue}
          mode="dropdown"
        >
          {data.map((item) => <Picker.Item label={item} value={item} />)}
        </Picker>

        {/* <WheelPicker
          style={styles.picker}
          data={data}
          selectedItem={this.state.selectedIndex}
          onItemSelected={(index: number) => {
            this._udpateValue(index)
          }}
        /> */}
      </View>
    )
  }

  render() {
    const { currentValue, placeholder, style, textStyle, placeholderStyle, hideIcon } = this.props
    const { modalMarginTop } = this.state
    let isEmpty = currentValue.length == 0

    console.log("picker start", this.props.modalVisible)
    if (this.props.modalVisible) {
      this._showPicker()
    }
    return (
      <React.Fragment>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.props.modalVisible}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={this._closePicker}>
              <View style={styles.modal__cancel} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.modal__animated, { marginTop: modalMarginTop }]}>
              {this._renderModalHeader()}
              {this._renderPicker()}
            </Animated.View>
          </View>
        </Modal>

      </React.Fragment>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },

  modal__cancel: {
    position: 'absolute',
    height: marginTop,
    top: 0,
    right: 0,
    left: 0
  },
  modal__animated: {
    height: modalHeight,
    backgroundColor: '#fff'
  },


  form: {
    backgroundColor: '#f2f2f2',
    height: 46,
    paddingHorizontal: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  form__text: {
    flex: 2,
    fontSize: 15,
    color: '#000'
  },
  form__placeholder: {
    flex: 2,
    fontSize: 15,
    color: '#9a9a9a'
  },
  form__arrow: {
    marginRight: 8
  },


  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    justifyContent: 'center',
  },
  button__right: {
    alignSelf: 'flex-end',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  button__text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },


  picker__container: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: modalHeight - 50
  },
  picker: {
    flex: 1,
    height: Platform.select({
      android: 150
    })
  }

})

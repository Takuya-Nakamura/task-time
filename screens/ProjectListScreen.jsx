import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput
} from 'react-native';
import Modal from 'react-native-modal';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function ProjectListScreen(props) {

  const [projects, setProjects] = useState(projectsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectFocused, setProjectFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  useEffect(() => {
    console.log("useEffect")
  }, [])
  const timeInputRef = useRef();
  
  /****
   * navigate
   */
  const _navigateToEdit = () => {
    props.navigation.navigate('ProjectEdit')
  }
  const _toggleModal = () => {
    console.log("_toggleModal")
    setModalVisible(!modalVisible)
  }
  const navigateToEdit = () =>{
    props.navigation.navigate('ProjectEdit')
  }

  const onProjectFocus = () => {
    setProjectFocused(true)
  }
  const onProjectBlur = () => {
    setProjectFocused(false)
    timeInputRef.current.focus();
  }

  const onTimeFocus = () => {
    setTimeFocused(true)
  }
  const onTimeBlur = () => {
    setTimeFocused(false)
  }


  /****
   * Render
   */
  const _renderListCell = (item) => {
    return (
      <TouchableWithoutFeedback style={styles.listCell} onPress={navigateToEdit}>
        <Text style={styles.listCell__text}>{item}</Text>
        <Text style={styles.listCell__arrow}>{'>>'}</Text>
      </TouchableWithoutFeedback>
    )
  }
  const _listSeparator = () => {
    return (<View style={styles.separator}></View>)
  }


  /**
   * return
   */
  const dStyle = {
    project: projectFocused ? styles.focused : {},
    time: timeFocused ? styles.focused : {},
  }

  return (

    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listWrapper}
        data={projectsData}
        keyExtractor={(item, index)=> `pj_${index}`}
        renderItem={(data) => _renderListCell(data.item)}
        ItemSeparatorComponent={() => _listSeparator()}
        bounces={false}
      />

      <Modal
        isVisible={modalVisible}
      >
        <View style={styles.modalContents}>
          <View style={styles.modalContents__main}>

            <View style={styles.field}>
              <Text style={[styles.field__text]}>プロジェクト名</Text>
              <TextInput
                style={[styles.textInput, styles.projectName, dStyle.project]}
                onFocus={onProjectFocus}
                onBlur={onProjectBlur}
                autoFocus={true}
              />
            </View>
            
            

            <View style={styles.field} >
              {/* <Text style={styles.field__text}>月次割当(h)</Text> */}
              <View style={styles.time_row}>
                <TextInput
                  style={[styles.textInput, styles.time, dStyle.time]}
                  onFocus={onTimeFocus}
                  onBlur={onTimeBlur}
                  ref={timeInputRef}
                />
                <Text style={styles.time_row__text}>時間想定(時間/月)</Text>
              </View>
            </View>

          </View>
          <View style={styles.modalContents__footer}>
            <Button title="保存" onPress={_toggleModal} />
            <Button title="キャンセル" onPress={_toggleModal} />
          </View>
        </View>

      </Modal>

    </SafeAreaView>
  );

} //function


/**
 * conf
 */
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  listWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
  },
  listCell: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  listCell__text: {
    flex: 1,
    textAlign: 'center'
  },
  listCell__arrow: {
    marginRight: 30
  },

  separator: {
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  modal: {
    backgroundColor: "red",
    alignItems: 'center',
  },
  modalContents: {
    padding: 10,
    width: '90%',
    height: 300,
    backgroundColor: '#fdfdfd',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10
  },

  modalContents__main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContents__footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',

  },


  field: {
    margin: 20,
    // justifyContent: 'center',
    // alignItems: 'center',

  },
  field__text: {
    marginBottom: 20,
    fontSize: 20,
    // color:'#fff',

  },
  textInput: {
    borderWidth: 1,
    height: 40,
    borderColor: 'gray',
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff'
  },
  focused: {
    borderColor: '#358dde',
    backgroundColor: '#cbe2f7'
  },
  projectName: {
    width: 300
  },
  time_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'

  },
  time: {
    width: 50,
    height: 50,
  },

  time_row__text: {
    marginLeft: 10,
  },

});


const projectsData = [
  'プロジェクト1',
  'プロジェクト2',
  'プロジェクト3',
  'プロジェクト4',
  'プロジェクト5',
  'プロジェクト6',
  'プロジェクト7',
  'プロジェクト8',
  'プロジェクト9',
  'プロジェクト10',
  'プロジェクト11',
  'プロジェクト12',
  'プロジェクト13',
  'プロジェクト14',
  'プロジェクト15',
  'プロジェクト16',
  'プロジェクト17',
  'プロジェクト14',
  'プロジェクト15',
  'プロジェクト16',
  'プロジェクト17',
  'プロジェクト14',
  'プロジェクト15',
  'プロジェクト16',
  'プロジェクト17',

]


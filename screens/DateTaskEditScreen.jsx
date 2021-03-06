import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Modal,
} from 'react-native';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';

//component
import { ModalPicker } from '../components/ModalPicker'
// db
// import * as SQLite from 'expo-sqlite';
import { db } from '../util/db'

//realm
// import Realm from 'realm'
// import { realmOptions } from '../config/realm'

export default function DateTaskEditScreen({ navigation, route }) {

  const [project, setProject] = useState({});

  const [projectId, setProjectId] = useState();
  const [projectName, setProjectName] = useState();

  const [date, setDate] = useState('');

  const [taskId, setTaskId] = useState(0);
  const [taskTimeId, setTaskTimeId] = useState(0);
  const [taskName, setTaskName] = useState();

  const [name, setName] = useState('');

  // time
  const [time, setTime] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState('');
  const [timeOption, setTimeOption] = useState('');

  //data
  const [tasks, setTasks] = useState(taskList);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  //status
  const [projectIsActive, setProjectIsActive] = useState(false);
  const [timeIsActive, setTimeIsActive] = useState(false);

  /**
   * Use
   */
  useEffect(() => {
    init();
  }, [])

  const timeRef = useRef();

  /**
 *  init
 */
  const init = () => {
    if (route.params) {
      setDate(route.params.date)
      // setProject(route.params.project)
      setProjectId(route.params.projectId)
      setProjectName(route.params.projectName)

    }
  }


  /****
   * event
   */
  const onFocusProject = () => {
    setProjectIsActive(true)
  }
  const onBlurProject = () => {
    setProjectIsActive(false)
    const node = timeRef.current
    node.focus()
  }

  const onFocusTime = () => {
    setTimeIsActive(true)
  }
  const onBlurTime = () => {
    setTimeIsActive(false)
  }

  const onPressSave = () => {
    const res = insertTask()
  }

  const onPressDelete = () => {
    Alert.alert(
      "削除しますか？",
      '',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: destroy }
      ]
    )
  }


  /**
  * DB
  */
  //TODO:入力チェック
  const insertTask = () => {
    console.log("insertTask")
    const sql = 'INSERT INTO tasks (name, project_id) VALUES (?, ?)';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [name, project.id],
        (transaction, resultSet) => {
          insertTaskTime(resultSet.insertId)
        },
        (object, error) => { console.log('execute fail', error) }
      );
    })
  }

  const insertTaskTime = (taskId) => {
    const sql = 'INSERT INTO times (date,time,task_id, project_id) VALUES (?, ?, ?, ?)';
    console.log("insertTaskTime", taskId)
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [date, time, taskId, project.id],
        () => { console.log('execute success'); navigation.goBack() },
        (object, error) => { console.log('execute fail', error) }
      );
    })
  }



  /**
  * return
  */

  const projectdStyle = projectIsActive ? styles.textInput_active : {}
  const timedStyle = timeIsActive ? styles.textInput_active : {}


  const onPressTaskRow = () => {
    setTaskModalVisible(!taskModalVisible)
  }
  const onPressTimeRow = () => {
    setTimeModalVisible(!timeModalVisible)

  }

  /**
   * return
   */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listWrapper}>

        {/* <View style={styles.header}>
          <Text style={[styles.field__text, styles.projectNameText]}>{projectName} </Text>
          <Text style={[styles.field__text, styles.dateText]}>{date}</Text>
        </View> */}

        <TouchableWithoutFeedback style={styles.row}>
          <View style={styles.labelWrapper}><Text style={styles.label__text}>プロジェクト</Text></View>
          <View style={styles.valueWrapper}><Text>{projectName}</Text></View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback style={styles.row}>
          <View style={styles.labelWrapper}><Text style={styles.label__text}>日付</Text></View>
          <View style={styles.valueWrapper}><Text>{date}</Text></View>
        </TouchableWithoutFeedback>


        {/* Task */}
        <TouchableWithoutFeedback
          onPress={onPressTaskRow}
          style={styles.row}
          pointerEvents={'auto'}
        >
          <View style={styles.labelWrapper}><Text style={styles.label__text}>タスク</Text></View>
          <View style={styles.valueWrapper}>
            <TextInput
              onChangeText={(text) => setName(text)}
              value={taskName}
              placeholder={'タスクを選択してください'}
              placeholderTextColor={'#888'}
              // autoFocus={true}
              style={[styles.textInput]}
              editable={false}
            />
          </View>
        </TouchableWithoutFeedback>
        <ModalPicker
          data={tasks}
          modalVisible={taskModalVisible}
          onClose={() => { setTaskModalVisible(false) }}
          selectedValue={taskName}
          onValueChange={(v) => { setTaskName(v) }}
        >
        </ModalPicker>


        {/* Time */}
        <TouchableWithoutFeedback
          onPress={onPressTimeRow}
          pointerEvents={'auto'}
          style={styles.row}
        >
          <View style={styles.labelWrapper}><Text style={styles.label__text}>時間</Text></View>
          <View style={styles.valueWrapper}>
            <TextInput
              placeholder={'作業時間を選択してください'}
              placeholderTextColor={'#888'}
              value={timeOption}
              onChangeText={(text) => setTime(text)}
              keyboardType={'number-pad'}
              style={[styles.textInput, styles.time, timedStyle]}
              editable={false}
            />

          </View>
        </TouchableWithoutFeedback>
      </View>
      <ModalPicker
        data={timeOptions}
        modalVisible={timeModalVisible}
        onClose={() => { setTimeModalVisible(false) }}
        selectedValue={timeOption}
        onValueChange={(v) => { setTimeOption(v) }}
      >
      </ModalPicker>


      {/* Button */}
      <View style={styles.field} >
        <TouchableHighlight
          style={styles.saveButton}
          onPress={onPressSave}
        >
          <Text style={styles.button__text}>保存</Text>
        </TouchableHighlight>
      </View>

      {project &&
        <View style={styles.field} >
          <TouchableHighlight
            style={styles.deleteButton}
            onPress={onPressDelete}
          >
            <Text style={styles.button__text}>削除</Text>
          </TouchableHighlight>
        </View>
      }


    </SafeAreaView>
  );

} //function


/**
 * conf
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listWrapper: {
    borderTopWidth: 0.25,
    marginBottom: 30
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    height: 50,

    borderBottomWidth: 0.5,
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  labelWrapper: {
    marginLeft: 20
  },
  label__text: {
    fontWeight: 'bold',
    fontSize: 16
  },
  valueWrapper: {
    flex: 1,
    marginRight: 20,
    alignItems: 'flex-end'
  },
  value__text: {

  },

  header: {
    margin: 20,
    marginBottom: 0,
  },
  projectNameText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  dateText: {
    fontWeight: "bold",
    color: 'gray'
  },
  field: {
    margin: 20,
    marginBottom: 40,
  },

  field__text: {
    marginBottom: 20,
    fontSize: 16,
  },

  textInput: {
    // borderBottomWidth: 1,
    // borderColor: 'gray',
    padding: 5,
    borderRadius: 5,
    fontSize: 16,

    textAlign: 'right'

  },
  textInput_active: {
    // borderColor: '#ed7d3b',
    // borderBottomWidth: 1,
    // color:'#ed7d3b',
  },
  taskName: {
    width: '100%'
  },


  time_row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  time_row__text: {
    // marginLeft: 10,

  },
  time: {
    // width: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  saveButton: {
    backgroundColor: '#4287f5',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button__text: {
    color: '#fff',
    fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: '#f54842',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

  },
  taskListArea: {
    flex: 1,
  },
  taskList_title: {
    color: 'gray',
    marginLeft: 10,
  },
  taskList: {
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 0
  },
  separator: {
    borderWidth: 0.5,
    borderColor: 'gray',
    marginLeft: 10

  },
  listCell: {
    // marginVertical: 5,
    flexDirection: 'row',
    height: 44,
    marginLeft: 10,
    // justifyContent: 'center'
    alignItems: 'center',

  },
  listText: {
    // fontSize: 20,
    // fontWeight:'bold'
  },
  btnWrapper: {
    marginLeft: 20
  }
});


const taskList = [
  '画面設計',
  '画面設計2',
  '画面設計3',
  '画面設計4',
]


const timeOptions = [
  '0.5',
  '1.5',
  '2.0',
  '2.5',
  '3.0',
  '3.5',
  '4.5',
  '5.0',
  '5.5',
  '6.0',
  '6.5',
  '7.0',
  '7.5',
  '8.0',

]
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PlusMark from '../components/PlusMark'
import { Color, Font, Size } from '../util/global_style'
import { ModalPicker } from '../components/ModalPicker'
import { db } from '../util/db'
import Banner from '../components/Banner';


export default function DateTaskEditScreen({ navigation, route }) {

  //params
  const [date, setDate] = useState('');
  const [projectId, setProjectId] = useState();
  const [projectName, setProjectName] = useState();
  const [taskName, setTaskName] = useState('');
  const [taskTimeId, setTaskTimeId] = useState('')
  const [taskTime, setTaskTime] = useState('')
  const [taskMemo, setTaskMemo] = useState('')
  // task modal
  const [taskPickerData, setTaskPickerData] = useState([]);
  const [taskMaster, setTaskMaster] = useState([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  // time modal
  const [timeModalVisible, setTimeModalVisible] = useState('');

  // ----------------------------------------
  // hooks
  // ----------------------------------------
  useEffect(() => {
    init()
    // onfocus
    const unsubscribe = navigation.addListener('focus', () => {
      select()
    });
    return unsubscribe
  }, [])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '作業時間 編集',
      headerRight: () => _renderRightSaveButton()
    })
  }, [navigation, taskName, taskTime, taskTimeId]);

  const _renderRightSaveButton = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => onPressSave()}
        style={styles.addProjectBtn}
      >
        <Image
          source={require('../assets/save.png')}
          style={styles.addProjectBtn__Image}
        />
      </TouchableWithoutFeedback>
    )
  }


  // ----------------------------------------
  // init
  // ----------------------------------------
  const init = () => {
    if (route.params) {
      setDate(route.params.date)
      setProjectId(route.params.projectId)
      setProjectName(route.params.projectName)
      setTaskName(route.params.taskName || '')
      setTaskTime(route.params.taskTime || '')
      setTaskTimeId(route.params.taskTimeId || '')
      setTaskMemo(route.params.taskMemo || '')

    }
  }

  // ----------------------------------------
  // event
  // ----------------------------------------
  const onPressSave = () => {
    const errors = []
    if (!taskName) errors.push('タスクを選択してください。')
    if (!taskTime) errors.push('時間を入力してください。')

    if (errors.length > 0) {
      alert(errors.join("\n"))
    } else {
      taskTimeId ? udpateTaskTime() : insertTaskTime()
    }

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

  const onPressAddTask = () => {
    const params = {
      projectId: projectId,
      projectName: projectName
    }
    navigation.navigate('TaskEdit', params)
  }

  const onPressTaskRow = () => {
    if (taskPickerData.length == 0) {
      onPressAddTask()
    } else {
      if (!taskName) { setTaskName(taskMaster[taskMaster.length - 1].name) }
      setTaskModalVisible(!taskModalVisible)
    }
  }

  const onPressTimeRow = () => {
    if (!taskTime) { setTaskTime(timePickerData[0].value) }
    setTimeModalVisible(!timeModalVisible)
  }

  // ----------------------------------------
  // db
  // ----------------------------------------
  const select = () => {
    const sql_tasks = "SELECT * FROM tasks WHERE project_id = ? AND deleted = 0;"

    db.transaction(tx => {
      tx.executeSql(
        sql_tasks,
        [route.params.projectId],
        (transaction, resultSet) => { createData(resultSet.rows._array || []) },
        (transaction, error) => { console.log('execute fail', error) }
      );
    })
  }

  const createData = (tasks) => {
    const taskPickerData = tasks.map(task => {
      return { value: task.name, label: task.name }
    })
    setTaskPickerData(taskPickerData)
    //初期値は一番最新のタスクにする, 選択済のデータの場合はそれを表示したい..
    if(!route.params,taskName && taskPickerData.length > 0) setTaskName(taskPickerData[taskPickerData.length-1]['value'])
    setTaskMaster(tasks)
  }

  const insertTaskTime = () => {
    const sql = 'INSERT INTO times (date, time, memo, task_id, project_id) VALUES (?, ?, ?, ?, ?)';
    const taskId = fetchTaskId()

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [date, taskTime, taskMemo, taskId, projectId],
        (res, res2) => { console.log('execute success', res2); navigation.goBack() },
        (object, error) => { console.log('execute fail', error) }
      );
    })
  }

  const udpateTaskTime = () => {
    const sql = 'UPDATE times SET time=?, task_id=?, memo=? WHERE id = ?';
    const taskId = fetchTaskId()

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [taskTime, taskId, taskMemo, taskTimeId],
        (res, res2) => { console.log('execute success', res2); navigation.goBack() },
        (object, error) => { console.log('execute fail 2', error) }
      );
    })
  }

  const fetchTaskId = () => {
    const task = taskMaster.find(task => taskName == task.name)
    return task.id
  }

  const destroy = () => {
    const sql = 'UPDATE times SET deleted=1  WHERE id = ?';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [taskTimeId],
        (transaction, resultSet) => {
          navigation.goBack()
        },
        (object, error) => { console.log('execute fail', error) }
      );
    })
  }


  // ----------------------------------------
  // return
  // ----------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.header__Text}>{date}  </Text>
          <Text style={styles.header__Text}>{projectName}</Text>
        </View>

        <View style={styles.listWrapper}>

          {/* <TouchableWithoutFeedback style={[styles.row, styles.disable]}>
          <View style={styles.labelWrapper}><Text style={styles.label__text}>プロジェクト</Text></View>
          <View style={styles.valueWrapper}><Text>{projectName}</Text></View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback style={[styles.row, styles.disable]}>
          <View style={styles.labelWrapper}><Text style={styles.label__text}>日付</Text></View>
          <View style={styles.valueWrapper}><Text>{date}</Text></View>
        </TouchableWithoutFeedback> */}


          {/* Task */}
          <TouchableWithoutFeedback
            onPress={onPressTaskRow}
            style={[styles.row]}
            pointerEvents={'auto'}
          >
            <View style={styles.labelWrapper}><Text style={styles.label__text}>タスク</Text></View>

            {taskPickerData.length != 0 &&
              <View style={styles.valueWrapper}>
                {taskName == '' && <Text style={[styles.textInput, { color: '#888' }]}>タスクを選択してください</Text>}
                {taskName !== '' && <Text style={styles.textInput}>{taskName}</Text>}
              </View>
            }

            {taskPickerData.length == 0 &&
              <View style={styles.valueWrapper}>
                {taskName == '' && <Text style={[styles.textInput, { color: '#888' }]}>タスクを追加してください</Text>}
              </View>
            }

          </TouchableWithoutFeedback>


          <TouchableWithoutFeedback style={styles.row} onPress={onPressAddTask}>
            <View style={styles.labelWrapper}><Text style={styles.label__text}>タスクを追加する</Text></View>
            <View style={styles.valueWrapper}>
              <PlusMark size={25}
                onPress={onPressAddTask}
              />

            </View>
          </TouchableWithoutFeedback>

          <ModalPicker
            data={taskPickerData}
            modalVisible={taskModalVisible}
            onClose={() => { setTaskModalVisible(false) }}
            selectedValue={taskName}
            onValueChange={(v) => {
              setTaskName(v)
            }}
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
              {taskTime == '' && <Text style={[styles.textInput, { color: '#888' }]}>作業時間を選択してください</Text>}
              {taskTime !== '' && <Text style={styles.textInput}>{taskTime}</Text>}
            </View>
          </TouchableWithoutFeedback>
          <ModalPicker
            data={timePickerData}
            modalVisible={timeModalVisible}
            onClose={() => { setTimeModalVisible(false) }}
            selectedValue={taskTime}
            onValueChange={(v) => { setTaskTime(v) }}
          >
          </ModalPicker>

          {/* memo */}
          <View
            pointerEvents={'auto'}
            style={styles.memo__row}
          >
            <View style={styles.labelWrapper}><Text style={styles.label__text}>メモ</Text></View>
            <TextInput
              multiline={true}
              style={styles.memo__input}
              onChangeText={(text) => {
                console.log(text)
                setTaskMemo(text)
              }}
              defaultValue={taskMemo}
            />
          </View>
        </View>

        {/* Button */}
        <View style={styles.field} >
          <TouchableHighlight
            style={styles.saveButton}
            onPress={onPressSave}
          >
            <Text style={styles.button__text}>保存</Text>
          </TouchableHighlight>
        </View>

        {projectId != '' &&
          <View style={styles.field} >
            <TouchableHighlight
              style={styles.deleteButton}
              onPress={onPressDelete}
            >
              <Text style={styles.button__text}>削除</Text>
            </TouchableHighlight>
          </View>
        }


      </ScrollView>
      <Banner />
    </SafeAreaView>
  );

} //function


/**
 * conf
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  listWrapper: {
    borderTopWidth: 0.25,
    marginBottom: 30
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    height: Size.row_height,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  disable: {
    backgroundColor: '#dfdfdf'
  },
  taskRow: {
    borderBottomWidth: 0,
  },
  labelWrapper: {
    marginLeft: Size.cell_padding_left
  },
  label__text: {
    fontWeight: 'bold',

  },
  valueWrapper: {
    flex: 1,
    marginRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  header: {
    margin: 20,
    marginBottom: 0,
  },
  projectNameText: {
    fontWeight: "bold",
    fontSize: Font.labelSize,
  },
  header__Text: {
    fontWeight: "bold",
    fontSize: Font.labelSize,
    marginBottom: 10,
  },

  field: {
    margin: 20,
    marginBottom: 40,
  },


  textInput: {
    padding: 5,
    borderRadius: 5,
    textAlign: 'right'

  },
  time_row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  saveButton: {
    backgroundColor: Color.saveButton,
    width: Size.button_with,
    height: Size.button_height,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button__text: {
    color: '#fff',
    fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: Color.deleteButton,
    width: Size.button_with,
    height: Size.button_height,
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
    borderColor: Color.borderColor,
    marginTop: 0
  },
  separator: {
    borderWidth: 0.5,
    borderColor: Color.borderColor,
    marginLeft: 10
  },
  listCell: {
    flexDirection: 'row',
    height: Size.row_height,
    alignItems: 'center',
    marginLeft: 10,
  },
  memo__row: {
    padding: 10,
    borderBottomWidth: 0.5,
    backgroundColor: "#fff"

  },
  memo__input: {
    borderWidth: 0.5,
    margin: 10,
    height: 80,
    padding: 10,
    borderRadius: 5,
  },
  addProjectBtn: {
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProjectBtn__Image: {
    width: 30,
    height: 30
  },

});

const timePickerData = [
  { label: '0.5', value: '0.5' },
  { label: '1.0', value: '1.0' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2.0' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3.0' },
  { label: '3.5', value: '3.5' },
  { label: '4.0', value: '4.0' },
  { label: '4.5', value: '4.5' },
  { label: '5.0', value: '5.0' },
  { label: '5.5', value: '5.5' },
  { label: '6.0', value: '6.0' },
  { label: '6.5', value: '6.5' },
  { label: '7.0', value: '7.0' },
  { label: '7.5', value: '7.5' },
  { label: '8.0', value: '8.0' },
  { label: '8.5', value: '8.5' },
  { label: '9.0', value: '9.0' },
  { label: '9.5', value: '9.5' },
  { label: '10.0', value: '10.0' },
  { label: '10.5', value: '10.5' },
  { label: '11.0', value: '11.0' },
  { label: '11.5', value: '11.5' },
  { label: '12.0', value: '12.0' },
  { label: '12.5', value: '12.5' },
  { label: '13.0', value: '13.0' },
  { label: '13.5', value: '13.5' },
  { label: '14.0', value: '14.0' },
  { label: '14.5', value: '14.5' },
  { label: '15.0', value: '15.0' },
  { label: '15.5', value: '15.5' },
  { label: '16.0', value: '16.0' },
  { label: '16.5', value: '16.5' },
  { label: '17.0', value: '17.0' },
  { label: '17.5', value: '17.5' },
  { label: '18.0', value: '18.0' },
  { label: '18.5', value: '18.5' },
  { label: '19.0', value: '19.0' },
  { label: '19.5', value: '19.5' },
  { label: '20.0', value: '20.0' },
  { label: '21.5', value: '21.5' },
  { label: '22.0', value: '22.0' },
  { label: '22.5', value: '22.5' },
  { label: '23.0', value: '23.0' },
  { label: '23.5', value: '23.5' },
  { label: '24.0', value: '24.0' },

]


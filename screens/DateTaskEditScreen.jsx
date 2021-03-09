import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PlusMark from '../components/PlusMark'
import { Color, Font, Size } from '../util/global_style'

//component
import { ModalPicker } from '../components/ModalPicker'

// db
import { db } from '../util/db'

export default function DateTaskEditScreen({ navigation, route }) {

  //params
  const [date, setDate] = useState('');

  const [projectId, setProjectId] = useState();
  const [projectName, setProjectName] = useState();

  const [taskName, setTaskName] = useState('');

  const [taskTimeId, setTaskTimeId] = useState('')
  const [taskTime, setTaskTime] = useState('')


  // task modal
  const [taskPickerData, setTaskPickerData] = useState([]);
  const [taskMaster, setTaskMaster] = useState([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  // time modal
  const [timeModalVisible, setTimeModalVisible] = useState('');



  /**
   * Use
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      init()
    });
    return unsubscribe
  }, [])

  /**
 *  init
 */
  const init = () => {
    console.log(route.params)
    if (route.params) {
      setDate(route.params.date)
      setProjectId(route.params.project_id)
      setProjectName(route.params.project_name)
      setTaskName(route.params.task_name || '')
      setTaskTime(route.params.task_time || '')
      setTaskTimeId(route.params.task_time_id || '')
      select()
    }
  }


  /****
   * event
   */
  const onPressSave = () => {
    taskTimeId ? udpateTaskTime() : insertTaskTime()
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

  /**
  * db
  */
  const select = () => {
    const sql_tasks = "SELECT * FROM tasks WHERE project_id = ?;"

    db.transaction(tx => {
      tx.executeSql(
        sql_tasks,
        [route.params.project_id],
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
    setTaskMaster(tasks)
  }


  const insertTaskTime = () => {
    const sql = 'INSERT INTO times (date, time, task_id, project_id) VALUES (?, ?, ?, ?)';
    const taskId = fetchTaskId()

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [date, taskTime, taskId, projectId],
        (res, res2) => { console.log('execute success', res2); navigation.goBack() },
        (object, error) => { console.log('execute fail', error) }
      );
    },
    )
  }

  const udpateTaskTime = () => {
    console.log("udpateTaskTime")
    const sql = 'UPDATE times SET time=?, task_id=?  WHERE id = ?';
    const taskId = fetchTaskId()

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [taskTime, taskId, taskTimeId],
        (res, res2) => { console.log('execute success', res2); navigation.goBack() },
        (object, error) => { console.log('execute fail', error) }
      );
    })
  }


  const fetchTaskId = () => {
    const task = taskMaster.find(task => taskName == task.name)
    return task.id
  }

  const destroy = () => {
    const sql = 'DELETE FROM times WHERE id=?';
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


  /**
  * return
  */

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
          style={[styles.row, styles.taskRow]}
          pointerEvents={'auto'}
        >
          <View style={styles.labelWrapper}><Text style={styles.label__text}>タスク</Text></View>
          <View style={styles.valueWrapper}>
            {taskName == '' && <Text style={[styles.textInput, { color: '#888' }]}>タスクを選択してください</Text>}
            {taskName !== '' && <Text style={styles.textInput}>{taskName}</Text>}
          </View>

        </TouchableWithoutFeedback>

        <View style={{ width: '100%', alignItems: 'flex-end', borderBottomWidth: 0.5, backgroundColor: '#fff' }}>
          <PlusMark
            onPress={onPressAddTask}
            style={{ backgroundColor: '#fff', height: 50, alignItems: 'flex-end', paddingRight: 30 }}
            size={25}
          />

        </View>
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
      </View>
      <ModalPicker
        data={timePickerData}
        modalVisible={timeModalVisible}
        onClose={() => { setTimeModalVisible(false) }}
        selectedValue={taskTime}
        onValueChange={(v) => { setTaskTime(v) }}
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
    height: Size.cell_height,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    backgroundColor: "#fff"
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
  dateText: {
    fontWeight: "bold",

  },
  field: {
    margin: 20,
    marginBottom: 40,
  },

  field__text: {
    marginBottom: 20,

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
    height: Size.cell_height,
    alignItems: 'center',
    marginLeft: 10,
  },
});

const timePickerData = [
  { label: '0.5', value: '0.5' },
  { label: '1.0', value: '1.0' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2.0' },
  { label: '2.5', value: '2.5' },
]


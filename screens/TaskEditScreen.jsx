import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Color, Font, Size } from '../util/global_style'

// db
import { db } from '../util/db'

export default function TaskEditScreen({ navigation, route }) {

  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskName, setTaskName] = useState('');


  /**
   * Use
   */
  useEffect(() => {
    init();
  }, [])


  /**
 *  init
 */
  const init = () => {
    console.log("route.params", route.params)
    if (route.params) {
      setProjectId(route.params.projectId)
      setProjectName(route.params.projectName)
      setTaskId(route.params.taskId)
      setTaskName(route.params.taskName)
    }
    console.log("route.params", route.params)
  }


  /****
   * event
   */

  const onPressSave = () => {
    if (!taskName) {
      alert('タスク名を入力してく')
    } else {
      taskId ? updateTask() : insertTask()
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


  /**
  * DB
  */


  const insertTask = () => {
    const sql = 'INSERT INTO tasks (name, project_id) VALUES (?, ?)';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [taskName, projectId],
        (transaction, resultSet) => { navigation.goBack() },
        (object, error) => { console.log('insert fail', error) }
      );
    })
  }

  const updateTask = () => {
    console.log("updateTask")
    const sql = 'UPDATE tasks SET name = ? WHERE id = ?';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [taskName, taskId],
        (transaction, resultSet) => { navigation.goBack() },
        (object, error) => { console.log('update fail', error) }
      );
    })
  }
  const destroy = () => {
    // const sql = 'DELETE FROM tasks WHERE id=?';
    const sql = 'UPDATE tasks SET deleted=1 WHERE id = ?';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [taskId],
        (transaction, resultSet) => { navigation.goBack() },
        (object, error) => { console.log('execute fail', error) }
      );
    })

  }


  /**
   * return
   */
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.field} >
        <Text style={styles.projectName}>{projectName}</Text>
      </View>

      <View style={styles.field} >
        <View style={styles.time_row}>
          <TextInput
            onChangeText={(text) => setTaskName(text)}
            value={taskName}
            placeholder={'タスク名'}
            autoFocus={true}
            style={[styles.textInput]}
          >
          </TextInput>
        </View>
      </View>


      <View style={styles.field} >
        <TouchableHighlight
          style={styles.saveButton}
          onPress={onPressSave}
        >
          <Text style={styles.button__text}>保存</Text>
        </TouchableHighlight>
      </View>

      {taskId != null &&
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
    backgroundColor: "#fff"
  },
  header: {
    margin: 20,
    marginBottom: 0,
  },
  field: {
    margin: 20,
    marginBottom: 40,
  },

  field__text: {
    marginBottom: 20,
  },

  projectName: {
    fontWeight: "bold",
    fontSize: Font.labelSize,

  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: Color.borderColor,
    padding: 5,
    borderRadius: 5,


  },
  textInput_active: {
    borderColor: '#ed7d3b',
    borderBottomWidth: 1,
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

});



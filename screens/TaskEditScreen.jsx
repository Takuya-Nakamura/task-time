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
} from 'react-native';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';

// db
import { db } from '../util/db'

export default function TaskEditScreen({ navigation, route }) {

  const [projectId, setProjectId] = useState('');
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
    if (route.params) {
      setProjectId(route.params.projectId)
      setTaskId(route.params.taskId)
      setTaskName(route.params.taskName)
    }
  }


  /****
   * event
   */

  const onPressSave = () => {
    if (taskId) {
      updateTask()
    } else {
      insertTask()
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
    console.log("insertTask")
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
    const sql = 'DELETE FROM tasks WHERE id=?';

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
        <View style={styles.time_row}>
          <TextInput
            onChangeText={(text) => setTaskName(text)}
            value={taskName}
            placeholder={'タスク名'}
            autoFocus={true}
            style={[styles.textInput, styles.taskName]}
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
    fontSize: 16,
  },

  textInput: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 5,
    borderRadius: 5,
    fontSize: 16,

  },
  textInput_active: {
    borderColor: '#ed7d3b',
    borderBottomWidth: 1,
    // color:'#ed7d3b',
  },
  taskName: {
    // width: '70%'
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

});


const taskList = [
  '画面設計',
  '画面設計2',
  '画面設計3',
  '画面設計4',

]

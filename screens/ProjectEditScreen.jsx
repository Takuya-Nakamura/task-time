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
import * as SQLite from 'expo-sqlite';

//realm
// import Realm from 'realm'
// import { realmOptions } from '../config/realm'

export default function ProjectEditScreen({ navigation, route }) {

  const [id, setId] = useState();
  const [name, setName] = useState();
  const [time, setTime] = useState();
  const [tasks, setTasks] = useState([]);

  const [projectIsActive, setProjectIsActive] = useState(false);
  const [timeIsActive, setTimeIsActive] = useState(false);

  /**
   * Use
   */
  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      console.log("will focus")
      init();
      // createData()
    });

  }, [])

  const timeRef = useRef();

  /**
   *  init
   */
  const init = () => {
    if (route.params) {
      setId(route.params.id)
      select(route.params.id)
    }
  }

  /****
   * DB
   */

  const select = (id) => {
    const db = SQLite.openDatabase('db')
    const sql = 'SELECT * FROM Projects WHERE id = ?';
    const sql2 = 'SELECT * FROM tasks WHERE project_id = ?';
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [id],
        (transaction, resultSet) => {
          const data = resultSet.rows._array[0]
          setId(data.id)
          setName(data.name)
          setTime(data.time)
        },
        (object, error) => { console.log('execute fail', error) }
      );
      tx.executeSql(
        sql2,
        [id],
        (transaction, resultSet) => {
          setTasks(resultSet.rows._array)
        },
        (object, error) => { console.log('execute fail', error) }
      );

    })
  }


  const insert = () => {
    console.log("insert", [name, time])
    const db = SQLite.openDatabase('db')
    const sql = 'INSERT INTO Projects (name, time) VALUES (?, ?)';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [name, time],
        (transaction, resultSet) => {
          navigation.goBack()
        },
        (object, error) => { console.log('execute fail', error) }
      );
    },
    )
  }


  const update = () => {
    const db = SQLite.openDatabase('db')
    const sql = 'UPDATE Projects SET name=?, time=? WHERE id=?';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [name, time, id],
        (transaction, resultSet) => {
          navigation.goBack()

        },
        (object, error) => { console.log('execute fail', error) }
      );
    })

  }

  const destroy = () => {
    console.log("destroy", destroy)
    const db = SQLite.openDatabase('db')
    const sql = 'DELETE FROM Projects WHERE id=?';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [id],
        (transaction, resultSet) => {
          navigation.goBack()

        },
        (object, error) => { console.log('execute fail', error) }
      );
    })

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
    id ? update() : insert()
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
      projectId: id
    }
    navigation.navigate('TaskEdit', params)
  }
  const onPressTask = (task) => {
    const params = {
      projectId: id,
      taskId: task.id,
      taskName: task.name
    }
    navigation.navigate('TaskEdit', params)

  }


  /**
  * navigation
  */
  const back = () => {

  }


  /**
  * render
  */
  const _renderTasks = () => {
    return (
      <>
        <View style={styles.field} >
          <View style={styles.task_row}>
            <Text style={styles.task_text}>タスク</Text>
            <View style={styles.addButton__wrapper}>
              <TouchableWithoutFeedback style={styles.addButton} onPress={onPressAddTask}>
                <Text style={styles.addButton__text}>＋</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>

        {tasks.length > 0 &&
          <View style={styles.taskList} >
            {tasks.map((task) => {
              return (
                <TouchableWithoutFeedback
                  style={styles.taskItem}
                  onPress={() => onPressTask(task)}
                >
                  <Text style={styles.taskItem__text}>{task.name}</Text>
                  <Text style={styles.taskItem__icon}> {'>'} </Text>
                </TouchableWithoutFeedback>
              )
            })}
          </View>
        }

        {tasks.length == 0 &&
          <View style={styles.taskList} >
            <TouchableWithoutFeedback
              style={styles.taskItem}
              onPress={onPressAddTask}
            >
              <Text style={styles.taskItem__text}>タスクを追加しましょう</Text>
              <Text style={styles.taskItem__icon}> {'>'} </Text>
            </TouchableWithoutFeedback>
          </View>
        }


        
      </>
    )
  }

  /**
  * return
  */

  const projectdStyle = projectIsActive ? styles.textInput_active : {}
  const timedStyle = timeIsActive ? styles.textInput_active : {}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.field}>
          <Text style={[styles.field__text]}>プロジェクト名</Text>
          <TextInput
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder={'Webアプリ開発'}
            autoFocus={true}
            style={[styles.textInput, styles.projectName, projectdStyle]}
            onFocus={onFocusProject}
            onBlur={onBlurProject}
          >
          </TextInput>
        </View>



        <View style={styles.field} >
          <Text style={styles.field__text}>一ヶ月の想定作業時間</Text>
          <View style={styles.time_row}>
            <TextInput
              placeholder={'30'}
              value={time}
              onChangeText={(text) => setTime(text)}
              keyboardType={'number-pad'}
              style={[styles.textInput, styles.time, timedStyle]}
              onFocus={onFocusTime}
              onBlur={onBlurTime}
              ref={timeRef}
            >
            </TextInput>
            <Text style={styles.time_row__text}>時間</Text>
          </View>
        </View>


        {id != null && _renderTasks()}


        <View style={styles.field} >
          <TouchableHighlight
            style={styles.saveButton}
            onPress={onPressSave}
          >
            <Text style={styles.button__text}>保存</Text>
          </TouchableHighlight>
        </View>

        {id &&
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  field: {
    margin: 20,
  },
  field__text: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold'

  },
  task_text: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  task_row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 16
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

  projectName: {

  },
  time_row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  time_row__text: {
    // marginLeft: 10,

  },
  time: {
    width: 50,
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
    marginTop: 0,
  },
  taskList: {
    borderTopWidth: 0.5,
    borderColor: 'gray'
  },
  taskItem: {
    flexDirection: 'row',
    height: 40,
    borderBottomWidth: 0.5,
    // justifyContent: 'center',
    // alignContent:'center',
    alignItems: 'center',
    // marginBottom: 5,
    padding: 5,
    paddingLeft: 20,
    borderColor: 'gray',

  },
  taskItem__text: {
    flex: 1
  },
  taskItem__icon: {
    width: 40
  },
  addButton__wrapper: {
    marginLeft: 20
  },
  addButton: {
    backgroundColor: '#E02729',
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  addButton__text: {
    color: "white",
    fontSize: 24,

  }


});



// const tasks = [
//   'task_1',
//   'task_2',
//   'task_3',
//   'task_4',
//   'task_5',
//   'task_6',
// ]
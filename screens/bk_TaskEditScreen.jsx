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

//component
import PathButtonAnim from '../components/CheckMark'


// db
// import * as SQLite from 'expo-sqlite';
import { db } from '../util/db'

//realm
// import Realm from 'realm'
// import { realmOptions } from '../config/realm'

export default function TaskEditScreen({ navigation, route }) {

  const [project, setProject] = useState({});


  const [date, setDate] = useState('');

  const [taskId, setTaskId] = useState(0);
  const [taskTimeId, setTaskTimeId] = useState(0);


  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  //data
  const [tasks, setTasks] = useState(tasks);

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
      setProject(route.params.project)

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

  const onPressListCell = (name) => {
    setName(name)
    const node = timeRef.current
    node.focus()

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


  // const update = () => {
  //   const db = SQLite.openDatabase('db')
  //   const sql = 'UPDATE Projects SET name=?, time=? WHERE id=?';

  //   db.transaction(tx => {
  //     tx.executeSql(
  //       sql,
  //       [name, time, id],
  //       (transaction, resultSet) => {
  //         navigation.goBack()

  //       },
  //       (object, error) => { console.log('execute fail', error) }
  //     );
  //   })

  // }



  /**
  * return
  */

  const projectdStyle = projectIsActive ? styles.textInput_active : {}
  const timedStyle = timeIsActive ? styles.textInput_active : {}

  const _renderTaskList = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => onPressListCell(item.item)}
        style={styles.listCell}
      >

        <Text style={styles.listText}>{item.item}</Text>
        <View style={styles.btnWrapper}>
          <PathButtonAnim
            on={name == item.item}
            size={30}
          />
        </View>

      </TouchableWithoutFeedback>
    )
  }

  const _renderSeparator = (item) => {
    return (
      <View style={styles.separator}></View>
    )
  }

  /**
   * return
   */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.field__text, styles.projectNameText]}>{project.name} </Text>
        <Text style={[styles.field__text, styles.dateText]}>{date}</Text>

      </View>

      <View style={styles.field} >
        <View style={styles.time_row}>
          <TextInput
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder={'タスク名'}
            autoFocus={true}
            style={[styles.textInput, styles.taskName, projectdStyle]}
            onFocus={onFocusProject}
            onBlur={onBlurProject}
          >
          </TextInput>
          <TextInput
            placeholder={'1.5'}
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


      {/* 設定済みタスクリスト */}
      <View style={styles.taskListArea}>
        <View style={styles.taskList_title}>
          <Text >登録済みタスク </Text>
        </View>
        <FlatList
          data={taskList}
          renderItem={(item) => _renderTaskList(item)}
          keyExtractor={(item, index) => `task_${index}`}
          bounces={false}
          style={styles.taskList}
          ItemSeparatorComponent={_renderSeparator}
        >
        </FlatList>
      </View>

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
    flexDirection: 'row'
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
    width: '70%'
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
    marginLeft:20
  }
});


const taskList = [
  '画面設計',
  '画面設計2',
  '画面設計3',
  '画面設計4',

]

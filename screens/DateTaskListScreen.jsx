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


export default function DateTaskListScreen({ navigation, route }) {


  const [date, setDate] = useState('');


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

    }
  }


  /****
   * event
   */

  const _onPressAdd = (item) => {
    console.log("item onPress", item)

    const params = {
      date: date,
      projectId: item.project_id,
      projectName: item.project_name
    }
    // navigation.navigate('TaskEdit', params)
    navigation.navigate('DateTaskEdit', params)
  }

  /**
  * db
  */


  /**
  * return
  */

  const _renderProjectTasks = () => {
    return (
      <View>
        {taskList2.map((item) =>
          <View style={styles.projectWrapper}>
            <View style={styles.projectName}>
              <Text style={styles.projectNameText} >{item.project_name}</Text>
              <Text style={styles.projectTimeText} >{item.project_time} 時間</Text>
            </View>

            <View style={styles.taskList}>
              {item.tasks.map(task => _renderListCell(task))}
            </View>

            <View style={styles.addButton__wrapper}>
              {_renderAddButton(item)}
            </View>

          </View>
        )}
      </View>
    )
  }

  const _renderListCell = (task) => {
    return (
      <TouchableWithoutFeedback style={styles.listCell} onPress={() => _navigateToEdit(task.id)}>
        <Text style={styles.listCell__LeftText}>{task.task_name}</Text>
        <Text style={styles.listCell__text}>{task.time} 時間</Text>
        <Text style={styles.listCell__arrow}> {'>'} </Text>
      </TouchableWithoutFeedback>
    )
  }

  const _renderAddButton = (item) => {
    console.log("item", item)
    return (
      <TouchableWithoutFeedback style={styles.addButton} onPress={(e) => _onPressAdd(item)}>
        <Text style={styles.addButton__text}>+</Text>
      </TouchableWithoutFeedback>
    )
  }

  /**
   * return
   */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.field__text, styles.dateText]}>{date}</Text>
          {/* <Text style={[styles.field__text, styles.dateText]}>{date}</Text> */}
        </View>


        {_renderProjectTasks()}

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
  header: {
    margin: 20,

  },
  dateText: {
    fontWeight: "bold",
    fontSize: 25,
  },
  projectWrapper: {
    marginBottom: 20
  },
  projectName: {
    margin: 20,
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectNameText: {
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
  },
  projectTimeText: {
    // flex:1,
    // fontWeight:'bold',
    marginRight: 30,
    fontSize: 16,
  },

  listCell: {
    flexDirection: 'row',
    height: 44,

    // justifyContent: 'center'
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E02729',
    marginBottom: 15,
    padding: 5,
    // borderRadius:5
  },
  listText: {
    flex: 1,
    textAlign: 'center'
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButton: {
    // borderWidth:1,
    backgroundColor: '#E02729',
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15

  },
  addButton__text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25
  },
  addButton__wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    borderTopWidth: 0.5,
    marginBottom: 10,

  },

  listCell: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  listCell__LeftText: {
    flex: 1,
    marginLeft: 20,

  },
  listCell__text: {
    marginRight: 20
    // flex: 1,
    // paddingLeft: 20,
    // textAlign: 'center'
  },
  listCell__arrow: {
    width: 30
  },


});

const taskList = [
  'test1',
  'test2',
  'test3',
  'test4',
]



const taskList2 = [
  {
    'project_id': 1,
    'project_name': 'project1',
    'project_time': 2,
    'tasks': [
      { 'id': 1, 'task_name': 'test1', 'time': '1' },
      { 'id': 2, 'task_name': 'test2', 'time': '2' },
      { 'id': 3, 'task_name': 'test3', 'time': '3' },
      { 'id': 4, 'task_name': 'test4', 'time': '4' },
    ]
  },
  {
    'project_id': 2,
    'project_name': 'project2',
    'project_time': 2,
    'tasks': [
      { 'id': 1, 'task_name': 'test1', 'time': '1' },
      { 'id': 2, 'task_name': 'test2', 'time': '2' },
      { 'id': 3, 'task_name': 'test3', 'time': '3' },
      { 'id': 4, 'task_name': 'test4', 'time': '4' },
    ]
  },

  {
    'project_id': 3,
    'project_name': 'project3',
    'project_time': 2,
    'tasks': [
      { 'id': 1, 'task_name': 'test1', 'time': '1' },
      { 'id': 2, 'task_name': 'test2', 'time': '2' },
      { 'id': 3, 'task_name': 'test3', 'time': '3' },
      { 'id': 4, 'task_name': 'test4', 'time': '4' },
    ]
  },

  {
    'project_id': 4,
    'project_name': 'project4',
    'project_time': 2,
    'tasks': [
      // { 'id': 1, 'task_name': 'test1', 'time': '1' },
      // { 'id': 2, 'task_name': 'test2', 'time': '2' },
      // { 'id': 3, 'task_name': 'test3', 'time': '3' },
      // { 'id': 4, 'task_name': 'test4', 'time': '4' },
    ]
  }


]

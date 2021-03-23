import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PlusMark from '../components/PlusMark'
import { Color, Font, Size } from '../util/global_style'

// db
import { db } from '../util/db'


export default function DateTaskListScreen({ navigation, route }) {

  const [date, setDate] = useState('');
  const [taskTime, setTaskTime] = useState([]);

  // ----------------------------------------
  // init
  // ----------------------------------------
  useEffect(() => {
     const unsubscribe = navigation.addListener('focus', () => {
      init()
      setHeader()
    });
    return unsubscribe;
  }, [])
  const init = () => {
    if (route.params) {
      setDate(route.params.date)
      // setProject(route.params.project || null)
      select(route.params.date, route.params.project)
    }
  }

  const  setHeader = ()=>{
    navigation.setOptions({
      headerTitle: '作業時間リスト',
    })

  }

  // ----------------------------------------
  // navigate
  // ----------------------------------------

  const navigateToDateTaskEdit = (project, task = {}) => {
    console.log("navigateToDateTaskEdit", task)
    let task_params = {}
    if (task) {
      task_params = {
        task_time: task.time,
        task_time_id: task.id,
        task_name: task.task_name,
        task_memo: task.memo,
      }
    }
    const params = {
      date: date,
      project_id: project.project_id,
      project_name: project.project_name,
      ...task_params
    }
    navigation.navigate('DateTaskEdit', params)

  }

  // ----------------------------------------
  // db
  // ----------------------------------------
  let times_for_create = []
  let projects_for_create = []

  const select = (date, project) => {
    let sql_times = "\
      SELECT  \
      times.id as id, times.time as time,\
      times.memo as memo, \
      tasks.name as task_name, \
      projects.name as project_name, projects.time as project_time, projects.id as project_id  \
      FROM times \
      LEFT OUTER JOIN  projects  ON times.project_id = projects.id \
      LEFT OUTER JOIN  tasks ON times.task_id = tasks.id \
      WHERE times.date=? AND times.deleted=0 \
    "
    let params_times = [date]

    let sql_projects = 'SELECT * from projects WHERE deleted=0'
    let params_projects = []

    if (project) {
      sql_times += ' AND times.project_id = ?'
      sql_projects += ' AND id = ?'
      params_times.push(project.id)
      params_projects.push(project.id)
    }
    db.transaction(tx => {
      tx.executeSql(
        sql_times,
        params_times,
        (transaction, resultSet) => {
          times_for_create = resultSet.rows._array || []
        },
        (transaction, error) => { console.log('execute fail 1', error) }
      );
      tx.executeSql(
        sql_projects,
        params_projects,
        (transaction, resultSet) => {
          projects_for_create = resultSet.rows._array || []
        },
        (transaction, error) => console.log('execute fail 2', error)
      );

    },
      (e) => { console.log(e) },
      (s) => { createData(times_for_create, projects_for_create) }

    )
  }

  /**
   * selectの結果を以下のオブジェクトの配列に
  {
    'project_id': 1,
    'project_name': 'project1',
    'project_time': 2,
    'tasks': [
      { 'id': 1, 'task_name': 'test1', 'time': '1' },
      ...
    ]
    ...
  },
   */
  const createData = (times, projects) => {
    const taskTimeData = projects.map((project) => {
      const tasktimes = times.filter((time) => time.project_id == project.id)
      const projectTime = tasktimes.length ? tasktimes.reduce((a, c) =>  a + parseFloat(c.time), 0) : 0
      return {
        project_id: project.id,
        project_name: project.name,
        project_time: projectTime,
        tasks: tasktimes,
      }
    })
    setTaskTime(taskTimeData)

  }

  // ----------------------------------------
  // render
  // ----------------------------------------
  const _renderProjectTasks = () => {

    return (
      <View>
        {taskTime.map((item, index) =>
          <View key={index} style={styles.projectWrapper}>
            <View style={styles.projectName} key={index}>
              <Text style={styles.projectNameText} >{item.project_name}</Text>
              <Text style={styles.projectTimeText} >{item.project_time} 時間</Text>
            </View>

            <View style={styles.taskList}>
              {item.tasks.map((task, index) => _renderListCell(index, item, task))}
            </View>

            <View style={styles.addButton__wrapper}>
              <PlusMark size={30} onPress={() => navigateToDateTaskEdit(item)} />
              <Text style={styles.addButton__Text}>記録する</Text>
            </View>

          </View>
        )}
      </View>
    )
  }

  const _renderListCell = (index, project, task) => {
    return (
      <TouchableWithoutFeedback key={index} style={styles.listCell} onPress={() => navigateToDateTaskEdit(project, task)}>
        <Text style={styles.listCell__LeftText}>{task.task_name}</Text>
        <Text style={styles.listCell__text}>{task.time} 時間</Text>
        <Text style={styles.listCell__arrow}> {'>'} </Text>
      </TouchableWithoutFeedback>
    )
  }

  // ----------------------------------------
  // return
  // ----------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.field__text, styles.dateText]}>{date}</Text>
        </View>
        {_renderProjectTasks()}
      </ScrollView>
    </SafeAreaView>
  );
}


/**
 * conf
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    margin: 20,
  },

  dateText: {
    fontWeight: "bold",
    fontSize: Font.labelSize,
  },
  projectWrapper: {
    marginBottom: 30,
    
    paddingBottom:5
  },
  projectName: {
    margin: 20,
    marginBottom: 10,
    fontSize: Font.default,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectNameText: {
    fontWeight: "bold",
    fontSize: Font.labelSize,
    flex: 1,
  },
  projectTimeText: {
    marginRight: 30,
    fontWeight:'bold'

  },
  taskList: {
    borderTopWidth: 0.5,
    marginBottom: 10,

  },

  listCell: {
    height: Size.row_height,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  listCell__LeftText: {
    flex: 1,
    marginLeft: Size.cell_padding_left,
  },
  listCell__text: {
    marginRight: 20
  },
  listCell__arrow: {
    width: 30
  },
  addButton__wrapper:{
    justifyContent:'center',
    alignItems:'center'
  },
  addButton__Text:{
    marginTop:5
  }

});



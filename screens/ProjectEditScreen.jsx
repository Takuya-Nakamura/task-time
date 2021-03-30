import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PlusMark from '../components/PlusMark'
import CheckMark from '../components/CheckMark'
import { Color, Font, Size, projectColor, getColor } from '../util/global_style'

// db
import { db } from '../util/db'

export default function ProjectEditScreen({ navigation, route }) {

  const [id, setId] = useState(null);
  const [name, setName] = useState();
  const [time, setTime] = useState();
  const [tasks, setTasks] = useState([]);
  const [color, setColor] = useState(getColor(11));
  const [colorId, setColorId] = useState(11);

  const [projectIsActive, setProjectIsActive] = useState(false);
  const [timeIsActive, setTimeIsActive] = useState(false);

  // ----------------------------------------
  // init
  // ----------------------------------------
  useEffect(() => {
    init();
 
    const unsubscribe = navigation.addListener('focus', () => {
            
    });
    return unsubscribe
  }, [])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'プロジェクト編集',
      headerRight: () => _renderProjectSaveButton()
    })
  }, [navigation, name]);

  const nameRef = useRef();
  const timeRef = useRef();

  const init = () => {
    if (route.params) {
      setId(route.params.id)
      select(route.params.id)
    }
  }

  const _renderProjectSaveButton = () => {
    return (
      <TouchableWithoutFeedback
        onPress={()=>onPressSave(name)}
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
  // db
  // ----------------------------------------
  const select = (id) => {
    const sql = 'SELECT * FROM Projects WHERE id = ?';
    const sql2 = 'SELECT * FROM tasks WHERE project_id = ? and deleted=0';
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [id],
        (transaction, resultSet) => {
          const data = resultSet.rows._array[0]
          setId(data.id)
          setName(data.name)
          setTime(data.time)
          setColorId(data.color)
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
    const sql = 'INSERT INTO projects (name, time, color ) VALUES (?, ?, ?)';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [name, time, colorId],
        (transaction, resultSet) => {
          navigation.goBack()
        },
        (object, error) => { console.log('execute fail', error) }
      );
    },
    )
  }

  const update = () => {
    const sql = 'UPDATE projects SET name=?, time=?, color=? WHERE id=?';

    db.transaction(tx => {
      tx.executeSql(
        sql,
        [name, time, colorId, id],
        (transaction, resultSet) => {
          navigation.goBack()
        },
        (object, error) => { console.log('execute fail', error) }
      );
    })
  }

  const destroy = () => {
    const sql = 'UPDATE projects SET deleted=1 WHERE id=?';
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

  // ----------------------------------------
  // event
  // ----------------------------------------
  const onPressLabel = (ref) => {
    const node = ref.current
    node.focus()
  }

  const onPressSave = (name) => {
    if (!name) {
      alert("プロジェクト名を入力してください。")
    } else {
      id ? update() : insert()
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
      projectId: id,
      projectName: name
    }
    navigation.navigate('TaskEdit', params)
  }
  const onPressTask = (task) => {
    const params = {
      projectId: id,
      projectName: name,
      taskId: task.id,
      taskName: task.name
    }
    navigation.navigate('TaskEdit', params)

  }

  const onPressColor = (item) => {
    setColor(item.color)
    setColorId(item.id)
  }

  // ----------------------------------------
  // render
  // ----------------------------------------
  const _renderTasks = () => {
    
    return (
      <>
        <View style={styles.field} >
          <View style={styles.task_row}>
            <Text style={styles.task_text}>タスク</Text>

            <View style={styles.addButton__wrapper}>
              <PlusMark size={35} onPress={onPressAddTask} />
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

  const _renderColor = () => {
    const colors1 = projectColor.slice(0, 5)
    const colors2 = projectColor.slice(5, 10)

    return (
      <View style={styles.field} >
        <Text style={styles.field__text}>テーマカラー</Text>

        <View style={styles.color_row}>
          {colors1.map(item => _renderColorCell(item))}
        </View>

        <View style={styles.color_row}>
          {colors2.map(item => _renderColorCell(item))}
        </View>

      </View>
    )
  }
  const _renderColorCell = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => onPressColor(item)}
        style={[styles.color_cell, { backgroundColor: item.color }]}>

        <CheckMark
          on={colorId == item.id}
          size={35}
          fill={'#fff'}
        ></CheckMark>

      </TouchableWithoutFeedback>
    )
  }

  // ----------------------------------------
  // return
  // ----------------------------------------
  const projectdStyle = projectIsActive ? styles.textInput_active : {}
  const timedStyle = timeIsActive ? styles.textInput_active : {}


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.field}>
          <TouchableWithoutFeedback style={styles.field__row} onPress={() => onPressLabel(nameRef)}>
            <Text style={[styles.field__text]}>プロジェクト名</Text>
            <TextInput
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder={'アプリ開発'}
              // autoFocus={false}
              style={[styles.textInput, projectdStyle]}
              ref={nameRef}
              maxLength={25}
            >
            </TextInput>
          </TouchableWithoutFeedback>
        </View>



        <View style={styles.field} >
          <TouchableWithoutFeedback style={styles.field__row} onPress={() => onPressLabel(timeRef)}>
            <Text style={styles.field__text}>一ヶ月の想定作業時間</Text>
            <TextInput
              placeholder={'30'}
              value={time}
              onChangeText={(text) => setTime(text)}
              keyboardType={'number-pad'}
              style={[styles.textInput, timedStyle]}
              ref={timeRef}
            >
            </TextInput>

            <Text style={styles.time_row__text}>時間</Text>
          </TouchableWithoutFeedback>

        </View>




        {_renderColor()}

        {id != null && _renderTasks()}

{console.log("TouchableHighlight", name)}
        <View style={styles.field} >
          <TouchableHighlight
            style={styles.saveButton}
            onPress={()=>onPressSave(name)}
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


// ----------------------------------------
// style
// ----------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  field: {
    margin: 20,
  },
  field__row: {
    flexDirection: 'row',
    alignItems: 'center'

  },
  field__text: {
    marginBottom: 20,
    fontSize: Font.default,
    fontWeight: 'bold'

  },
  task_text: {
    fontSize: Font.default,
    fontWeight: 'bold'
  },
  task_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textInput: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 5,
    borderRadius: 5,
    fontSize: 18,
    flex: 1,
    marginLeft: 20,
    textAlign: 'right'

  },
  textInput_active: {
    borderColor: Color.defaultOrange,
    borderBottomWidth: 1,
  },

  time_row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  color_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  color_cell: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'

  },

  time: {
    width: 100,
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
    marginTop: 0,
  },
  taskList: {
    borderTopWidth: 0.5,
    borderColor: 'gray'
  },
  taskItem: {
    flexDirection: 'row',
    height: Size.row_height,
    borderBottomWidth: 0.5,
    alignItems: 'center',
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



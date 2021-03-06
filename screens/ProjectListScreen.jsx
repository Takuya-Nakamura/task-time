import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TextInput
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useFocusEffect } from '@react-navigation/native';

// db
import * as SQLite from 'expo-sqlite';


export default function ProjectListScreen(props) {

  const [projects, setProjects] = useState(projectsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectFocused, setProjectFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  useEffect(() => {
    console.log("useEffect")
    //main
    setHeader()
  }, [])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("useFocusEffect")
  //     select()
  //   })
  // );
  useFocusEffect(() => {
      select()
  });

  const timeInputRef = useRef();



  /**
   * Header
   */
  const setHeader = () => {
    props.navigation.setOptions({
      headerRight: () => _renderProjectAddButton()
    })
  }

  /****
   * navigate
   */
  const _navigateToEdit = (id) => {
    props.navigation.navigate('ProjectEdit', { id: id })
  }

  
  const onPressAdd = () => {
    props.navigation.navigate('ProjectEdit')
  }

  /****
   * DB
   */
  const select = () => {
    const db = SQLite.openDatabase('db')
    const sql = 'SELECT * FROM Projects';
    
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [],
        (transaction, resultSet) => {
          const data = resultSet.rows._array
          setProjects(data)
        },
        (transaction, error) => { console.log('execute fail', error) }
      );
    },
    )
  }

  /****
   * Render
   */
  const _renderListCell = (item) => {
    return (
      <TouchableWithoutFeedback style={styles.listCell} onPress={() => _navigateToEdit(item.id)}>
        <Text style={styles.listCell__text}>{item.name}</Text>
        <Text style={styles.listCell__arrow}> {'>'} </Text>
      </TouchableWithoutFeedback>
    )
  }
  
  const _listSeparator = () => {
    return (<View style={styles.separator}></View>)
  }

  const _renderProjectAddButton = () => {
    return (
      <TouchableWithoutFeedback
        onPress={onPressAdd}
        style={styles.addProjectBtn}
      >
        <Text>ADD</Text>
      </TouchableWithoutFeedback>
    )
  }


  /**
   * return
   */
  const dStyle = {
    project: projectFocused ? styles.focused : {},
    time: timeFocused ? styles.focused : {},
  }

  return (

    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.listWrapper}
        data={projects}
        keyExtractor={(item, index) => `pj_${index}`}
        renderItem={(data) => _renderListCell(data.item)}
        ItemSeparatorComponent={() => _listSeparator()}
        bounces={false}
      />


    </SafeAreaView>
  );

} //function


/**
 * conf
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',

  },
  listWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    // borderBottomWidth: 1,
    
  },
  listCell: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,


  },
  listCell__text: {
    flex: 1,
    paddingLeft:20,
    // textAlign: 'center'
  },
  listCell__arrow: {
    width:30
  },

  separator: {
    // borderTopWidth: 1,
    // borderColor: 'gray'
  },
  addProjectBtn: {
    backgroundColor: "#ccffff",
    height: 40,
    width: 40,
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },

});


const projectsData = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',

  // 'プロジェクト1',
  // 'プロジェクト2',
  // 'プロジェクト3',
  // 'プロジェクト4',
  // 'プロジェクト5',
  // 'プロジェクト6',
  // 'プロジェクト7',
  // 'プロジェクト8',
  // 'プロジェクト9',
  // 'プロジェクト10',
  // 'プロジェクト11',
  // 'プロジェクト12',
  // 'プロジェクト13',
  // 'プロジェクト14',
  // 'プロジェクト15',
  // 'プロジェクト16',
  // 'プロジェクト17',
  // 'プロジェクト14',
  // 'プロジェクト15',
  // 'プロジェクト16',
  // 'プロジェクト17',
  // 'プロジェクト14',
  // 'プロジェクト15',
  // 'プロジェクト16',
  // 'プロジェクト17',

]


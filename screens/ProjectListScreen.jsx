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
import { Color, Font, Size } from '../util/global_style'

// db
import * as SQLite from 'expo-sqlite';


export default function ProjectListScreen(props) {

  const [projects, setProjects] = useState([]);
  const [projectFocused, setProjectFocused] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  useEffect(() => {
    console.log("useEffect")
    //main
    setHeader()
  }, [])

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
   * db
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
  },
  listWrapper: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    
  },
  listCell: {
    height: Size.cell_height,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  listCell__text: {
    flex: 1,
    paddingLeft:Size.cell_padding_left,
  },
  listCell__arrow: {
    width:Size.cell_icon_width
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



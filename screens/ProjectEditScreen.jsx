import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function ProjectEditScreen(props) {

  useEffect(() => {
    console.log("useEffect")
  }, [])


  /****
   * render
   */


  /**
  * return
  */
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.field}>
        <Text style={styles.field__text}>プロジェクト名</Text>
        <TextInput
          style={[styles.textInput, styles.projectName]}
        >
        </TextInput>

      </View>

      <View style={styles.field} >
      <Text style={styles.field__text}>一ヶ月の想定作業時間(h)</Text>
        <View style={styles.time_row}>
          <TextInput style={[styles.textInput,styles.time] }></TextInput>
          {/* <Text style={styles.time_row__text}>時間</Text> */}
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#119833'
  },
  field: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  field__text:{
    marginBottom:20,
    fontSize:20,
    color:'#fff',
    fontFamily: 'Hiragino Mincho ProN' 
  },  

  textInput: {
    borderWidth: 1,
    height: 40,
    borderColor: 'gray',
    padding: 5,
    borderRadius:5,
    fontSize:16,
    textAlign:'center',
    backgroundColor:'#fff'
  },
  projectName: {
    width:300
  },
  time_row:{
    flexDirection:'row',
    alignItems:'center'
  },
  time_row__text:{
    marginLeft:10,
    
  },
  time: {
    width:50,
    flexDirection:'row',
    alignItems:'center'

  }
});



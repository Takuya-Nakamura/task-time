import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

export default function HomeScreen(props) {

  const [projects, setProjects] = useState(projectsData);
  const [data, setData] = useState(data1);
  const [listTransformX, setListTransformX] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log("useEffect")
    setHeader()
  }, [])
  const headerRef = useRef();
  /**
   * Components
   */
  const setHeader = () => {
    //navigation v5
    props.navigation.setOptions({
      headerTitle: '作業時間',
      headerRight: () => _renderProjectButton()
    })
  }





  /****
   * Render
   */
  const _renderProjectButton = () => {
    return (
      <TouchableWithoutFeedback
      style={styles.addProjectBtn}
      onPress={()=>{
        props.navigation.navigate('ProjectList')
      }}
      >
        <Text>Add PJ</Text>
      </TouchableWithoutFeedback>
    )
  }

  const _renderMenu = () => {
    return (
      <View style={styles.menu}>
        <Text style={styles.menu__text} >2021年2月</Text>
      </View>
    )
  }
  const _leftTopBox = () => {
    return (
      <View style={styles.leftTopBox}></View>
    )
  }
  const _renderProjectHeader = () => {
    return (
      <ScrollView
        horizontal={true}
        style={styles.projectHeader}
        bounces={false}
        ref={headerRef}
      >
        {projects.map((pj) => {
          return (
            <View style={[ styles.cell, styles.projectHeaderCell,]}>
              <Text style={styles.projectHeaderCell__text}>{pj}</Text>
            </View>
          )
        })}
      </ScrollView>
    )
  }

  const _renderDateHeader = () => {
    return (
      <View>
        {data1.map((data) => {
          return (
            <View style={[styles.cell,styles.dateHeaderCell ]}>
              <Text style={styles.dateHeaderCell__text}>{getDay(data.date)}</Text>
              <Text style={styles.dateHeaderCell__subText}>(月)</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const _renderProjectItem = () => {
    return (
      <View style={styles.projectRow}>
        {data1.map((data) => {
          return (
            <View style={[styles.projectItemCell, styles.cell]}>
              <Text>{data.time}</Text>
            </View>
          )
        })}
      </View>
    )

  }

  const getDay = (date) => {
    return date.split('-')[2]
  }

  /**
   * return
   */
  return (
    <SafeAreaView style={styles.container}>

      {/* テーブル */}
      <View>
        {_renderMenu()}
        {_leftTopBox()}
        {_renderProjectHeader()}
      </View>
      <ScrollView bounces={false} style={{flex:1}} >
        
        <View style={styles.flexRow}>
          {_renderDateHeader()}
          
          <ScrollView
            bounces={false}
            horizontal={true}
            scrollEventThrottle={1}
            onScroll={(e)=>{
              const node = headerRef.current
              node.scrollTo({x:e.nativeEvent.contentOffset.x,y:e.nativeEvent.contentOffset.y, animated:false })
            }}

          >
            {projects.map((data)=>_renderProjectItem())}

          </ScrollView>
        </View>

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
    flexDirection: 'column',
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  addProjectBtn:{
    backgroundColor:"#ccffff", 
    height:40, 
    width:40, 
    marginRight:30,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20
  

  },
  menu: {
    height: 60,
    // width: "100%",
    backgroundColor: "#dfdfdf",
    alignItems: "center",
    justifyContent: 'center'
  },
  menu__text: {
    fontSize: 32
  },
  leftTopBox: {
    height: 66,
    width: 66,
    position: 'absolute',
    left: 0,
    top: 60,
    borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    // zIndex:2,
  },
  cell: {
    height: 66,
    width: 66,
    borderWidth: 0.5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin:5
    
  },
  projectHeader: {
    marginLeft: 78,
    
  },
  projectHeaderCell: {
    backgroundColor: '#E02729',
    borderWidth:0,
    borderRadius:5,
    padding:5,
  },
  projectHeaderCell__text:{
    color:'white',
    textAlign:'center',
    fontWeight:'bold',
    // fontSize:32,
  },

// #49A83A
// #F4BD3A
// #49A839
// #159E98
// #3E98D8
// #252BD3
// #7C1BEF

  dateHeaderCell: {
    backgroundColor: '#49A839',
    borderWidth:0,
    borderRadius:5,
    padding:5
  },
  dateHeaderCell__text:{
    color:'white',
    fontSize:20
  },  
  dateHeaderCell__subText:{
    color:'white',
  },  

  projectRow:{
    backgroundColor:'#ffcccc',
    borderColor:'red',
    borderWidth:1,
  },
  projectItemCell: {

  },
  flexRow: {
    flexDirection: 'row',
  }

});



const projectsData = [
  'プロジェクト1',
  'プロジェクト2',
  'プロジェクト3',
  'プロジェクト4',
  'プロジェクト5',
  'プロジェクト6',
  'プロジェクト7',
  'プロジェクト8',
  'プロジェクト9',
]

const data1 = [
  { date: '2021-02-01', time: '8' },
  { date: '2021-02-02', time: '8' },
  { date: '2021-02-03', time: '8' },
  { date: '2021-02-04', time: '8' },
  { date: '2021-02-05', time: '8' },
  { date: '2021-02-06', time: '8' },
  { date: '2021-02-07', time: '8' },
  { date: '2021-02-08', time: '8' },
  { date: '2021-02-09', time: '8' },
  { date: '2021-02-10', time: '8' },
  { date: '2021-02-11', time: '8' },
  { date: '2021-02-12', time: '8' },
  { date: '2021-02-13', time: '8' },
  { date: '2021-02-14', time: '8' },
  { date: '2021-02-15', time: '8' },
  { date: '2021-02-16', time: '8' },
  { date: '2021-02-17', time: '8' },
  { date: '2021-02-18', time: '8' },
  { date: '2021-02-19', time: '8' },
  { date: '2021-02-20', time: '8' },
  { date: '2021-02-21', time: '8' },
  { date: '2021-02-22', time: '8' },
  { date: '2021-02-23', time: '8' },
  { date: '2021-02-24', time: '8' },
  { date: '2021-02-25', time: '8' },
  { date: '2021-02-26', time: '8' },
  { date: '2021-02-27', time: '8' },
  { date: '2021-02-28', time: '8' },

]


const data2 = [
  { date: '2021-02-01', time: '3' },
  { date: '2021-02-02', time: '3' },
  { date: '2021-02-03', time: '3' },
  { date: '2021-02-04', time: '3' },
  { date: '2021-02-05', time: '3' },
  { date: '2021-02-06', time: '3' },
  { date: '2021-02-07', time: '3' },
  { date: '2021-02-08', time: '3' },
  { date: '2021-02-09', time: '3' },
  { date: '2021-02-10', time: '3' },
  { date: '2021-02-11', time: '3' },
  { date: '2021-02-12', time: '3' },
  { date: '2021-02-13', time: '3' },
  { date: '2021-02-14', time: '3' },
  { date: '2021-02-15', time: '3' },
  { date: '2021-02-16', time: '3' },
  { date: '2021-02-17', time: '3' },
  { date: '2021-02-18', time: '3' },
  { date: '2021-02-19', time: '3' },
  { date: '2021-02-20', time: '3' },
  { date: '2021-02-21', time: '3' },
  { date: '2021-02-22', time: '3' },
  { date: '2021-02-23', time: '3' },
  { date: '2021-02-24', time: '3' },
  { date: '2021-02-25', time: '3' },
  { date: '2021-02-26', time: '3' },
  { date: '2021-02-27', time: '3' },
  { date: '2021-02-28', time: '3' },

]
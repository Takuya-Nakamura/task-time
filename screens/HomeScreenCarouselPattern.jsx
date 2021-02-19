import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  Easing,
  TouchableOpacity,
  Image
} from 'react-native';
import Animated from 'react-native-reanimated';




export default function HomeScreen(props) {

  const [projects, setProjects] = useState(projects1);
  const [data, setData] = useState(data1);
  const [listTransformX, setListTransformX] = useState(new Animated.Value(0));

  useEffect(() => {
    console.log("useEffect")
    setHeader()
  }, [])

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

  const updateData = () => {
    console.log("updateData")

    Animated.timing(listTransformX, {
      toValue: -360,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear
    }).start();

  }


  const backData = () => {
    console.log("updateData")

    Animated.timing(listTransformX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear
    }).start();
  }


  /****
   * Render
   */
  const _renderProjectButton = () => {
    return (
      <Text>testGGGGGG</Text>
    )
  }

  const _renderMenu = () => {
    return (
      <View style={styles.menu}>
        <Text style={styles.menu__text} >2021年2月</Text>
      </View>
    )
  }

  const _renderProjectMenu = () => {
    return (
      <View style={styles.projectMenu}>
        <TouchableOpacity style={styles.iconBox} onPress={backData}>
          <Image style={styles.icon} source={require('../assets/l.png')} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBox} onPress={updateData}>
          <Image style={styles.icon} source={require('../assets/r.png')} />
        </TouchableOpacity>

      </View>
    )
  }

  const dStyle = {
    transform: [
      { translateX: listTransformX },
    ],
  };

  const _renderTableHeader = () => {
    return (
      <View style={styles.tableHeader}>

        <View style={[styles.headerItem, styles.dateItem]}>
          <Text>日</Text>
        </View>

        {/* Visible View */}
        <View style={[styles.viewableArea]}>
          <Animated.View style={[styles.listItemGroup, dStyle]}>
            <View style={styles.headerItem}>
              <Text>{projects[0]}</Text>
            </View>
            <View style={styles.headerItem}>
              <Text>{projects[1]}</Text>
            </View>
            <View style={styles.headerItem}>
              <Text>{projects[2]}</Text>
            </View>

            <View style={styles.headerItem}>
              <Text>project4</Text>
            </View>
            <View style={styles.headerItem}>
              <Text>project5</Text>
            </View>
            <View style={styles.headerItem}>
              <Text>project6</Text>
            </View>
          </Animated.View>
          {/* /group2 */}

        </View>
        {/* /Visible View */}

      </View>
    )
  }

  //1行
  const _renderRow = (item) => {

    const date = item.date.split('-')[2]
    return (
      <View style={styles.listRow}>

        <View style={[styles.listItem, styles.dateItem]}>
          <Text>{date}</Text>
        </View>

        <View style={[styles.viewableArea]}>

          <Animated.View style={[styles.listItemGroup, dStyle]}>

            <View style={styles.listItem}>
              <Text>{item.time}</Text>
            </View>
            <View style={styles.listItem}>
              <Text>{item.time}</Text>
            </View>
            <View style={styles.listItem}>
              <Text>{item.time}</Text>
            </View>


            <View style={styles.listItem}>
              <Text>{item.time}</Text>
            </View>
            <View style={styles.listItem}>
              <Text>{item.time}</Text>
            </View>
            <View style={styles.listItem}>
              <Text>{item.time}</Text>
            </View>

          </Animated.View>
        </View>
      </View>
    )
  }

  /**
   * return
   */
  return (
    <SafeAreaView style={styles.container}>
      {_renderMenu()}
      {_renderProjectMenu()}
      {_renderTableHeader()}
      <FlatList
        style={styles.listBox}
        data={data}
        renderItem={(item) => _renderRow(item.item)}
        keyExtractor={(item, index) => index}
      />


      <View style={styles.iconBox}>

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
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    height: 60,
    width: "100%",
    backgroundColor: "#dfdfdf",
    alignItems: "center",
    justifyContent: 'center'
  },
  menu__text: {
    fontSize: 32
  },

  tableHeader: {

    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden'
    // justifyContent:'flex-start'
  },
  dateItem: {
    width: 50,
  },
  headerItem: {
    height: 50,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#99dfdf",
    borderColor: 'gray',
    borderWidth: 0.5,
  },

  listBox: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'gray'
  },
  listRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',

  },
  listItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 120,
    borderColor: 'gray',
    borderWidth: 0.5,
  },

  listItem__text: {
    fontSize: 24,
  },
  update: {
    height: 30,
    width: 30,
    backgroundColor: "blue",
  },

  viewableArea: {
    width: 360, overflow: "hidden", flexDirection: 'row'
  },
  listItemGroup: {
    flexDirection: 'row'
  },

  //
  projectMenu: {
    flexDirection: 'row',
    padding: 5,
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center'

  },
  icon: {
    width: 44,
    height: 44,
    marginHorizontal: 5,

  }
});



const projects1 = [
  'プロジェクト1',
  'プロジェクト2',
  'プロジェクト3',
]
const projects2 = [
  'プロジェクト4',
  'プロジェクト5',
  'プロジェクト6',
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
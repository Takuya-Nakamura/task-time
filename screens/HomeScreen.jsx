import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


// db
import { createTables, db } from '../util/db'

// layout
const width = Dimensions.get('window').width;


export default function HomeScreen({ navigation }) {

  const [times, setTimes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [cellData, setCellData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(2021);
  const [month, setMonth] = useState(2);

  // //for sync create
  let dateList_for_create = []
  let projects_for_create = []
  let times_for_create = []

  useEffect(() => {
    //db
    createTables()

    //data
    // createData()

    //main
    setHeader()

    const unsubscribe = navigation.addListener('focus', () => {
      console.log("focus")
      createData()
    });

  }, [])

  const headerRef = useRef();
  const cellRef = useRef();

  const setHeader = () => {
    //navigation v5
    navigation.setOptions({
      headerTitle: '作業時間',
      headerRight: () => _renderProjectButton(),
    })
  }


  /**
   *  event
   */

  const onPressCellItem = (date, project) => {
    const params = {
      date: date,
      project: project
    }
    // navigation.navigate('TaskEdit', params)
    navigation.navigate('DateTaskList', params)
  }

  const onPressProjectHeader = (projectId) => {
    const params = {
      id: projectId
    }
    //TODO本当はプロジェクトの今月の集計ページに行ったほうが良いかも
    navigation.navigate('ProjectEdit', params) 
  }

  /**
   *  data
   */

  /**
   * 今月の日付一覧を取得する 
   */
  const getThisMonthDateList = () => {
    const endDate = new Date(year, month, 0).getDate() //monthは0起算なので注意
    const list = []
    for (let d = 1; d <= endDate; d++) {
      list.push({
        date: `${year}-${padding(month)}-${padding(d)}`,
        weekDay: getWeekDayJp(year, month, d)
      })
    }
    dateList_for_create = list
    // return list
  }

  /**
   * 
   */
  const createData = () => {
    console.log("createData")
    //日付リスト作成
    getThisMonthDateList()

    //DBからデータ取得
    const sql_projects = 'SELECT * FROM projects;';
    const sql_times = 'SELECT id, date, project_id, SUM(time) AS time FROM times GROUP BY project_id, date;';

    db.transaction(tx => {
      tx.executeSql(
        sql_projects,
        null,
        (obj, resultSet) => {
          projects_for_create = resultSet.rows._array

        },
        (obj, error) => { console.log('execute fail', error) }
      );
      tx.executeSql(
        sql_times,
        null,
        (obj, resultSet) => {
          times_for_create = resultSet.rows._array

        },
        (obj, error) => { console.log('execute fail', error) }
      );
    },
      (e) => { console.log(e) },
      (s) => { createCellData(projects_for_create, dateList_for_create, times_for_create) }

    )
  }


  /**
   * ItemCell描画用のデータを作成
   * {
   *   project_id:[{date, time}],
   *   project_id:[{date, time}],
   * }
   * のデータを作成する
   * project毎 loop, date毎 loop
   */
  const createCellData = (projects, dateList, times) => {
    console.log("createCellData")
    const data = {}
    projects.map((pj) => {
      const items = dateList.map((date) => {
        return ({
          'date': date.date,
          'time': selectTime(times, pj.id, date.date)
        })
      })
      data[pj.id] = items
    })

    setCellData(data)
    setProjects(projects)
    setDateList(dateList)
    setTimes(times)
    setLoading(false)

  }

  const selectTime = (times, projectId, date) => {
    // console.log("selectTime",times, projectId, date)
    const time = times.find((time) => (time.project_id == projectId && time.date == date)) || null
    return time ? time.time : 0
  }

  /****
   * Render
   */
  const _renderProjectButton = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.addProjectBtn}
        onPress={() => {
          navigation.navigate('Project')
        }}
      >
        <Text>Project</Text>
      </TouchableWithoutFeedback>
    )
  }

  const _renderMenu = () => {
    return (
      <View style={styles.menu}>
        <Text style={styles.menu__text} >{year}年{month}月</Text>
      </View>
    )
  }

  const _leftTopBox = () => {
    return (
      <View style={styles.leftTopBox}>
        {/* <PathButtonAnim/> */}
      </View>
    )
  }

  const _renderProjectHeader = () => {

    console.log("projects", projects)
    return (
      <ScrollView
        horizontal={true}
        style={styles.projectHeader}
        bounces={false}
        ref={headerRef}
        scrollEnabled={true}
        scrollEventThrottle={1}
        onScroll={(e) => {
          const node = cellRef.current
          node.scrollTo({ x: e.nativeEvent.contentOffset.x, y: e.nativeEvent.contentOffset.y, animated: false })
        }}
      >
        {projects.map((pj, index) => (

          <TouchableWithoutFeedback
            key={index}
            style={[styles.cell, styles.projectHeaderCell,]}
            onPress={() => onPressProjectHeader(pj.id)} 

          >
            <Text style={styles.projectHeaderCell__text}>{pj.name}</Text>
          </TouchableWithoutFeedback>
        )
        )}
      </ScrollView>
    )
  }

  const _renderDateHeader = () => {

    return (
      <View style={{ borderRightWidth: 0.5 }}>
        {dateList.map((data, index) => {
          const day = getDay(data.date)

          // holiday
          const dstyle = (day % 7) == 0 || (day % 7) == 6 ? styles.headerHoliday : {}
          const dstyle__text = (day % 7) == 0 || (day % 7) == 6 ? styles.holidayTExt : {}

          //today
          const today_dstyle = isToday(year, month, day) ? styles.todayCell : {}

          return (
            <View key={index} style={[styles.cell, styles.dateHeaderCell, dstyle, today_dstyle]}>
              <Text style={[styles.dateHeaderCell__text, dstyle__text]}>{parseInt(getDay(data.date))}</Text>
              <Text style={[styles.dateHeaderCell__subText, dstyle__text]}>({data.weekDay})</Text>
            </View>
          )
        })}
      </View>
    )
  }


  const _renderProjectItem = (project, index) => {

    const projectData = cellData[project.id] || []
    return (
      <View key={index} style={styles.projectRow}>

        {projectData.map((item, index) => {

          const day = getDay(item.date)
          //isHoliday
          const dstyle = (day % 7) == 0 || (day % 7) == 6 ? styles.holiday : {}
          const dstyle__text = (day % 7) == 0 || (day % 7) == 6 ? styles.holidayTExt : {}
          //today
          const today_dstyle = isToday(year, month, day) ? styles.todayCell : {}

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => onPressCellItem(item.date, project)}
              index={index}
              style={[styles.projectItemCell, styles.cell, dstyle, today_dstyle]}>
              <Text style={dstyle__text}>{item.time}</Text>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    )
  }

  const _renderLoader = () => {
    return (
      <View style={styles.loader}>
        {/* <ActivityIndicator size="large" color="#000" /> */}
      </View>
    )
  }

  /**
   * return
   */
  if (loading == true) {
    return (_renderLoader())
  }

  return (
    <SafeAreaView style={styles.container}>


      {/* テーブル */}
      <View>
        {_renderMenu()}
        {_leftTopBox()}
        {_renderProjectHeader()}
      </View>


      <ScrollView bounces={false} style={{ flex: 1 }} >
        <View style={styles.flexRow}>
          {_renderDateHeader()}

          <ScrollView
            bounces={false}
            horizontal={true}
            scrollEventThrottle={1}
            onScroll={(e) => {
              const node = headerRef.current
              node.scrollTo({ x: e.nativeEvent.contentOffset.x, y: e.nativeEvent.contentOffset.y, animated: false })
            }}
            ref={cellRef}
          >
            {projects.map((project, index) => _renderProjectItem(project, index))}

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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
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
  addTasktBtn: {
    backgroundColor: "#ffcccc",
    height: 40,
    width: 40,
    marginLeft: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
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
    height: 76,
    width: 77,
    position: 'absolute',
    left: 0,
    top: 60,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  cell: {
    height: 66,
    width: 66,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,


  },
  projectHeader: {
    marginLeft: 78,
    borderBottomWidth: 0.5,
  },
  projectHeaderCell: {
    backgroundColor: '#E02729',
    borderWidth: 0,
    borderRadius: 5,
    padding: 5,
  },
  projectHeaderCell__text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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
    // backgroundColor: '#159E98',
    // borderBottomWidth:1,
    borderWidth: 0,

    borderColor: "#fcba03",
    borderRadius: 5,
    padding: 5
  },
  dateHeaderCell__text: {
    // color:'white',
    fontSize: 20
  },
  dateHeaderCell__subText: {
    // color:'white',
  },

  projectRow: {
    // backgroundColor:'#ffcccc',
    // borderColor:'red',
    // borderWidth:1,
  },
  projectItemCell: {
    // backgroundColor:'#ffcccc',
    padding: 5
  },
  holiday: {
    backgroundColor: '#ffdddd',
    borderWidth: 0
  },
  holidayTExt: {
    color: 'red'
  },

  headerHoliday: {
    backgroundColor: '#ffdddd',
    borderWidth: 0,
  },
  todayCell: {
    borderWidth: 5,
    borderColor: '#fcba03'
  },

  flexRow: {
    flexDirection: 'row',
  }

});



/**
 * util
 */

const getWeekDayJp = (year, month, day) => {
  const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"]
  const date = new Date(year, month - 1, day)
  const weekDay = date.getDay()
  return dayOfWeekStr[weekDay]
}

const padding = (num) => {
  return ('00' + num).slice(-2);
}

const getDay = (date) => {
  // return date
  return date.split('-')[2]
}

const isToday = (year, month, day) => {
  const today = new Date()
  const compare = new Date(year, month - 1, day)
  return today.toDateString() == compare.toDateString()
}

const isHoliday = () => {

}

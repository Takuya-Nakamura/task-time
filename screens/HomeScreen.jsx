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

import { Color, Font, Size } from '../util/global_style'

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

    //main
    setHeader()

    const unsubscribe = navigation.addListener('focus', () => {
      console.log("focus")
      createData()
    });
    return unsubscribe;

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
    navigation.navigate('DateTaskList', params)
  }

  const onPressDateHeader = (date) => {
    const params = {
      date: date,
    }
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
      (s) => { 
        console.log("test")
        createCellData(projects_for_create, dateList_for_create, times_for_create) 

      }

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
            <TouchableWithoutFeedback
              key={index}
              style={[styles.cell, styles.dateHeaderCell, dstyle, today_dstyle]}
              onPress={() => onPressDateHeader(data.date)}
            >
              <Text style={[styles.dateHeaderCell__text, dstyle__text]}>{parseInt(getDay(data.date))}</Text>
              <Text style={[styles.dateHeaderCell__subText, dstyle__text]}>({data.weekDay})</Text>
            </TouchableWithoutFeedback>
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


      <ScrollView bounces={false}>
        <View style={styles.row}>
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
  row: {
    flexDirection: 'row',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Color.backGroundColor,

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

  menu: {
    height: 60,
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
    zIndex: 2,
  },
  cell: {
    height: Size.cell,
    width: Size.cell,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: Color.cell

  },
  projectHeader: {
    marginLeft: Size.cell + 11,
    borderBottomWidth: 0.5,
  },
  projectHeaderCell: {
    backgroundColor: Color.defaultRed,
    borderWidth: 0,
    borderRadius: 5,
    padding: 5,
  },
  projectHeaderCell__text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },


  dateHeaderCell: {
    borderWidth: 0,
    borderColor: Color.defaultYellow,
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

  projectItemCell: {
    padding: 5
  },
  holiday: {
    backgroundColor: Color.holiday,
    borderWidth: 0
  },
  holidayTExt: {
    color: 'red'
  },

  headerHoliday: {
    backgroundColor: Color.holiday,
    borderWidth: 0,
  },
  todayCell: {
    borderWidth: 5,
    borderColor: Color.defaultYellow
  },


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

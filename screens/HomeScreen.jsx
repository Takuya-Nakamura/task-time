import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Color, Font, getColor, Size } from '../util/global_style'
import PlusMark from '../components/PlusMark'

// db
import { createTables, db } from '../util/db'
import {isIos} from  '../util/platform'
// layout
const { height } = Dimensions.get('window');




export default function HomeScreen({ navigation, route }) {

  const [projects, setProjects] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [cellData, setCellData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState();
  const [month, setMonth] = useState();

  const [dateSummary, setDateSummary] = useState();
  const [projectSummary, setProjectSummary] = useState();
  const [monthlySummary, setMonthlySummary] = useState();
  const [projectEstimateSummary, setProjectEstimateSummary] = useState();

  //同期的にデータを作成するために必要
  let dateList_for_create = []
  let projects_for_create = []
  let times_for_create = []
  let create_year = ''
  let create_month = ''

  //ref 
  const headerRef = useRef();
  const cellRef = useRef();
  const verticalScrillRef = useRef();

  // ----------------------------------------
  // init
  // ----------------------------------------
  useEffect(() => {
    init()
    setHeader()
    createTables()
    createData(true) //初期表示だけ今日の日付にスクロールしたい

    const unsubscribe = navigation.addListener('focus', () => {
      createData(false)
    });
    return unsubscribe;
  }, [])


  const init = () => {
    if (route.params) {
      create_year = (route.params.year)
      create_month = (route.params.month)
    } else {
      var today = new Date();
      create_year = (today.getFullYear())
      create_month = (today.getMonth() + 1)
    }
    setYear(create_year)
    setMonth(create_month)
  }
  const scrollToTody = () => {
    const date = new Date()
    const today = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    if (month == create_month && year == create_year) {
      const oneDayHeight = (Size.cell) + (Size.cell_border * 2) + (Size.cell_margin * 2)
      const node = verticalScrillRef.current
      if (node) node.scrollTo({ x: 0, y: oneDayHeight * (today) - height / 2, animated: true })
    }
  }
  const setHeader = () => {
    //navigation v5
    navigation.setOptions({
      headerTitle: '作業時間表',
      headerRight: () => _renderProjectButton(),
    })
  }

  // ----------------------------------------
  // event
  // ----------------------------------------

  const onPressAdd = () => {
    navigation.navigate('ProjectEdit')
  }

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

  const onPressProjectHeader = (project) => {
    // const params = {
    //   id: projectId
    // }
    // navigation.navigate('ProjectEdit', params)
    const params = {
      project: project,
      date: `${year}-${padding(month)}`,
      monthly:true
    }    
    navigation.navigate('DateTaskList', params)
  }



  const onPressMoveMonth = (diff) => {
    // loading
    setLoading(true)
    const date = new Date(year, (month - 1), 5)
    date.setMonth(date.getMonth() + diff);

    create_year = date.getFullYear()
    create_month = date.getMonth() + 1

    setYear(create_year)
    setMonth(create_month)
    createData()

  }


  // ----------------------------------------
  // action
  // ----------------------------------------
  const getThisMonthDateList = () => {

    const endDate = new Date(create_year, create_month, 0).getDate() //monthは0起算なので注意
    dateList_for_create = []
    for (let d = 1; d <= endDate; d++) {
      dateList_for_create.push({
        date: `${create_year}-${padding(create_month)}-${padding(d)}`,
        weekDay: getWeekDayJp(create_year, create_month, d)
      })
    }
  }

  const strFtime = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${padding(month)}-${padding(day)}`

  }

  // ----------------------------------------
  // create data
  // ----------------------------------------

  const createData = (willScroll = false) => {
    setLoading(true)

    //日付リスト作成
    getThisMonthDateList()
    let start = new Date(create_year, create_month - 1, 1);
    start.setDate(1);


    let end = new Date(create_year, create_month - 1, 1);
    end.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);

    //DBからデータ取得
    const sql_projects = 'SELECT * FROM projects WHERE deleted=0 ORDER BY sort_order ;';
    // const sql_times = 'SELECT id, date, project_id, SUM(time) AS time FROM times WHERE times.deleted=0 AND date >= ? AND date <= ? GROUP BY project_id, date;';

    const sql_times = ' \
    SELECT times.id as id, times.date as date, project_id, SUM(times.time) AS time, projects.deleted FROM times \
    LEFT OUTER JOIN projects ON times.project_id = projects.id \
    WHERE times.deleted=0 AND projects.deleted=0 \
    AND date >= ? AND date <= ? \
    GROUP BY project_id, date \
    \
    ';

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
        [strFtime(start), strFtime(end)],
        (obj, resultSet) => {
          times_for_create = resultSet.rows._array
        },

        (obj, error) => { console.log('execute fail', error) }
      );
    },
      (e) => { console.log(e) },
      (s) => {
        createDateSummrayData(projects_for_create, dateList_for_create, times_for_create)
        createProjectSummrayList(projects_for_create, times_for_create)
        createProjectEstimateSummray(projects_for_create)
        createMonthlySummray(times_for_create)
        createCellData(projects_for_create, dateList_for_create, times_for_create)

        setTimeout(() => setLoading(false), 100)
        if (willScroll) setTimeout(() => scrollToTody(), 150)


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
    setLoading(false)

  }

  /**
   * 日毎の作業時間合計データを作成
   *  [date:date, time:time ]
   */
  const createDateSummrayData = (projects, dateList, times) => {
    const list = dateList.map((item) => {
      const filterd_times = times.filter(time => time.date == item.date)
      const timeSum = filterd_times.reduce((a, c) => a + c.time, 0)
      return { 'date': item.date, 'time': timeSum }
    })
    setDateSummary(list)
  }
  /**
   * 日毎の作業時間合計データを作成
   * [project_id:project_id, time:time ]
   */
  const createProjectSummrayList = (projects, times) => {
    const list = projects.map((item) => {
      const filterd_times = times.filter(time => time.project_id == item.id)
      const timeSum = filterd_times.reduce((a, c) => a + c.time, 0)
      return { 'project_id': item.id, 'time': timeSum }
    })
    setProjectSummary(list)
  }

  /**
   * 月次の見積もり合計を取得
   */
  const createProjectEstimateSummray = (projects) => {
    const sum = projects.reduce((a, c) => a + parseInt(c.time || 0), 0)
    setProjectEstimateSummary(sum)
  }
  /**
   * 月次の実績合計を取得
   */
  const createMonthlySummray = (times) => {
    setMonthlySummary(times.reduce((a, c) => a + parseInt(c.time || 0), 0))
  }

  const selectTime = (times, projectId, date) => {
    const time = times.find((time) => (time.project_id == projectId && time.date == date)) || null
    return time ? time.time : 0
  }

  // ----------------------------------------
  // render
  // ----------------------------------------
  const _renderProjectButton = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.addProjectBtn}
        onPress={() => {
          navigation.navigate('Project')
        }}
      >
        <Image
          source={require('../assets/list_300.png')}
          style={styles.addProjectBtn_Image}
        />
      </TouchableWithoutFeedback>
    )
  }

  const _renderMenu = () => {
    return (
      <View style={styles.menu}>

        <TouchableOpacity style={styles.menu__left} onPress={() => onPressMoveMonth(-1)}>
          <Image
            source={require('../assets/left-arrow.png')}
            style={styles.menu__leftImage}
          />
        </TouchableOpacity>

        <Text style={styles.menu__text} >{year}年{month}月</Text>

        <TouchableOpacity style={styles.menu__right} onPress={() => onPressMoveMonth(1)}>
          <Image
            source={require('../assets/right-arrow.png')}
            style={styles.menu__rightImage}
          />
        </TouchableOpacity>

      </View>
    )
  }

  const _leftTopBox = () => {
    return (
      <View style={styles.leftTopBox}>
        {/* <PathButtonAnim/> */}
        <Text style={styles.LeftTop__subText} >合計</Text>
        <Text style={styles.leftTopBox__Text} >{monthlySummary}<Text style={styles.LeftTop__subText}> /{projectEstimateSummary}</Text></Text>
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
        scrollEnabled={isIos() ? true: false}
        scrollEventThrottle={1}
        onScroll={(e) => {
          if (isIos()){
            const node = cellRef.current
            node.scrollTo({ x: e.nativeEvent.contentOffset.x, y: e.nativeEvent.contentOffset.y, animated: false })
          }
        }}
      >
        {projects.map((pj, index) => {
          const proSum = projectSummary.find(item => item.project_id == pj.id)
          const sum = proSum['time'] || 0
          return (
            <View key={pj.id} style={{ flexDirection: 'column' }}>
              <TouchableWithoutFeedback
                key={index}
                style={[styles.cell, styles.projectHeaderCell, { backgroundColor: getColor(pj.color) }]}
                // onPress={() => onPressProjectHeader(pj.id)}
                onPress={() => onPressProjectHeader(pj)}
              >
                <Text style={styles.projectHeaderCell__text}>{pj.name}</Text>
              </TouchableWithoutFeedback>
              <View style={styles.projectSum}>
                <Text style={styles.sum}>{sum}  <Text style={styles.sum__subText}>{pj.time ? `/ ${pj.time}` : ''}</Text></Text>

              </View>
            </View>
          )
        })}
      </ScrollView>
    )
  }

  const _renderDateHeader = () => {
    return (
      <View style={{ borderRightWidth: 0.5 }}>
        {dateList.map((data, index) => {
          const day = getDay(data.date)
          // holiday
          const dstyle = isWeekEnd(year, month, day) ? styles.headerHoliday : {}
          const dstyle__text = isWeekEnd(year, month, day) ? styles.holidayText : {}

          //today
          const today_dstyle = isToday(year, month, day) ? styles.todayCell : {}
          const dateSum = dateSummary.find(item => item.date == data.date)
          const sum = dateSum ? dateSum['time'] : 0

          return (
            <TouchableWithoutFeedback
              key={index}
              style={[styles.cell, styles.dateHeaderCell, dstyle, today_dstyle]}
              onPress={() => onPressDateHeader(data.date)}
            >
              <Text style={[styles.dateHeaderCell__text, dstyle__text]}>{parseInt(getDay(data.date))}</Text>
              <Text style={[styles.dateHeaderCell__subText, dstyle__text]}>({data.weekDay})</Text>
              <Text style={[styles.dateHeaderCell__subText, dstyle__text]}>{sum}</Text>

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
          const dstyle = isWeekEnd(year, month, day) ? styles.holiday : {}
          const dstyle__text = isWeekEnd(year, month, day) ? styles.holidayText : {}
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
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  const _renderZero = () => {
    return (
      <View style={styles.zeroHome}>
        <Text style={styles.zeroText}>まずは下のボタンからプロジェクトを追加しましょう。</Text>
        <PlusMark size={60} onPress={onPressAdd} />
      </View>
    )
  }

  const _renderHome = () => {
    return (
      <>
        {_renderMenu()}
        {loading == true && _renderLoader()}
        {loading == false &&
          <>
            <View>
              {_leftTopBox()}
              {_renderProjectHeader()}
            </View>

            <ScrollView bounces={false} ref={verticalScrillRef}>
              <View style={styles.row} >
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
          </>
        }

      </>
    )
  }


  // ----------------------------------------
  // return
  // ----------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {loading == true && _renderLoader()}
      {loading == false && projects.length == 0 && _renderZero()}
      {loading == false && projects.length != 0 && _renderHome()}
    </SafeAreaView>
  );


} //function

// ----------------------------------------
// style
// ----------------------------------------
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Color.backGroundColor,

  },
  addProjectBtn: {
    marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addProjectBtn_Image: {
    width: 30,
    height: 30
  },

  menu: {
    height: 60,
    // backgroundColor: Color.backGroundColor,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: Color.borderColor

  },
  menu__left: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,

  },
  menu__leftImage: {
    height: 15,
    width: 15,

  },
  menu__right: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,

  },
  menu__rightImage: {
    height: 15,
    width: 15,

  },

  menu__text: {
    fontSize: Font.homeHeaderSize,
    marginHorizontal: 32
  },
  leftTopBox: {
    height: 76 + 21,
    width: 77,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftTopBox__Text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  LeftTop__subText: {
    fontSize: 12,
    fontWeight: 'normal'
  },
  cell: {
    height: Size.cell,
    width: Size.cell,
    borderWidth: Size.cell_border,
    borderRadius: 5,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: Size.cell_margin,
    backgroundColor: Color.cell

  },
  projectHeader: {
    marginLeft: Size.cell + 11,
    borderBottomWidth: 0.5,

  },
  projectHeaderCell: {
    // backgroundColor: Color.defaultRed,
    borderWidth: 0,
    borderRadius: 5,
    padding: 5,
  },
  projectHeaderCell__text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontWeight: 'bold',
    fontSize: 16

  },
  projectSum: {
    justifyContent: 'center',
    alignItems: 'center',
    // height:16,
    paddingBottom: 3,

  },

  dateHeaderCell: {
    borderWidth: 0,
    borderColor: Color.defaultYellow,
    borderRadius: 5,
    padding: 5
  },
  dateHeaderCell__text: {
    // color:'white',
    fontSize: Font.dateHeaderText
  },
  dateHeaderCell__subText: {
    // color:'white',
    fontSize: Font.dateHeaderSubText
  },

  projectItemCell: {
    padding: 5
  },
  holiday: {
    backgroundColor: Color.holiday,
    borderWidth: 0
  },
  holidayText: {
    color: Color.holidayText,
  },

  headerHoliday: {
    backgroundColor: Color.holiday,
    borderWidth: 0,
  },
  todayCell: {
    borderWidth: 5,
    borderColor: Color.defaultYellow
  },
  sum: {
    fontWeight: 'bold',
  },

  sum__subText: {
    fontWeight: '200',
  },
  zeroHome: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  zeroText: {
    width: '80%',
    fontWeight: 'bold',
    marginBottom: 40
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

const isWeekEnd = (year, month, day) => {
  const date = new Date(year, month - 1, day)
  const weekDay = date.getDay()
  return (weekDay == 6 || weekDay == 0) ? true : false

}


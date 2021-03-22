import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  Animated,
  Image
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Color, Font, getColor, Size } from '../util/global_style'
import DraggableFlatList  from 'react-native-draggable-flatlist';

// db
import * as SQLite from 'expo-sqlite';


export default function ProjectListScreen(props) {

  const [projects, setProjects] = useState([]);
  const [itemScale, setItemScale] = useState(new Animated.Value(1));
  useEffect(() => {
    //main
    setHeader()

    const unsubscribe = props.navigation.addListener('focus', () => {
      select()
    });
    return unsubscribe

  }, [])


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

  const _itemOnLongPress = (drag) => {
    _itemTransformAnimation(0.9)
    drag();
  }
  const _onDragEnd = ({ data }) => {
    setProjects(data)
    data.map((item, index) =>{
      updateOrder(item.id, index)
    })
    
  }

  const _itemTransformAnimation = (toValue) => {
    Animated.timing(itemScale, {
        toValue: toValue,
        duration: 200,
        useNativeDriver: true,
    }).start();
}


  /****
   * db
   */
  const select = () => {
    const db = SQLite.openDatabase('db')
    const sql = 'SELECT * FROM Projects WHERE deleted=0 ORDER BY sort_order';
    
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

  const updateOrder = (id, sort_order ) =>{
    const db = SQLite.openDatabase('db')
    const sql = 'UPDATE projects SET sort_order=? WHERE id=?';
    
    db.transaction(tx => {
      tx.executeSql(
        sql,
        [sort_order, id],
        (transaction, resultSet) => {},
        (transaction, error) => { console.log('execute fail', error) }
      );
    },
    )
  }


  /****
   * Render
   */
  const _renderListCell = ({ item, index, drag, isActive }) => {
    const dColor = getColor(item.color)
    console.log(item)
    
    const activeStyle = {
      // backgroundColor: "#ffdddd",
      // borderColor: "red",
      // borderWidth: 1,
      transform: [
          { scale: itemScale },
      ],
  };

  const dStyle = isActive ? activeStyle : []

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback);

    return (
      <AnimatedTouchable 
        style={[styles.listCell,dStyle]} 
        onPress={() => _navigateToEdit(item.id)}
        onLongPress={() => _itemOnLongPress(drag)}
      >
        <View style={[styles.listCell__color, {backgroundColor:dColor}]}></View>
        <Text style={styles.listCell__text}>{item.name}</Text>
        <Text style={styles.listCell__arrow}> {'>'} </Text>
      </AnimatedTouchable>
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
        <Image
            source={require('../assets/plus.png')}
            style={styles.addProjectBtn__Image}
          />

      </TouchableWithoutFeedback>
    )
  }


  /**
   * return
   */

  return (

    <SafeAreaView style={styles.container}>
      
      <DraggableFlatList
        style={styles.listWrapper}
        data={projects}
        keyExtractor={(item, index) => `pj_${index}`}
        // renderItem={(data) => _renderListCell(data.item)}
        renderItem={_renderListCell}
        ItemSeparatorComponent={() => _listSeparator()}
        bounces={false}
        onDragEnd={_onDragEnd}

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
    height: Size.row_height,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  listCell__color:{
    width:20,
    height:20,
    borderRadius:20,
    backgroundColor:"red",
    marginLeft:Size.cell_padding_left,
  },
  listCell__text: {
    flex: 1,
    marginLeft:Size.cell_padding_left,
  },
  listCell__arrow: {
    width:Size.cell_icon_width
  },

  addProjectBtn: {    
    marginRight:30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProjectBtn__Image: {
    width:30,
    height:30
  },


});



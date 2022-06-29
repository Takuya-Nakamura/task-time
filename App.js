import React from 'react';
import { Easing } from "react-native";
import HomeScreen from './screens/HomeScreen'
import ProjectListScreen from './screens/ProjectListScreen'
import ProjectEditScreen from './screens/ProjectEditScreen'
import TaskEditScreen from './screens/TaskEditScreen'
import DateTaskListScreen from './screens/DateTaskListScreen'
import DateTaskEditScreen from './screens/DateTaskEditScreen'

//navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //tab

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProjectStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // Animation Config
  const config = {
    animation: 'timing',
    config: {
      // stiffness: 1000,
      // damping: 500,
      // mass: 3,
      // overshootClamping: true,
      // restDisplacementThreshold: 0.01,
      // restSpeedThreshold: 0.01,
      duration: 180, //timingじゃ無いと指定できない, defaut250
      // easing: Easing.bounce,
    },
  };

  const options = {
    transitionSpec: {
      open: config,
      close: config,
    }
  }

  // Router
  const HomeRoute = () => (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
      />
    </HomeStack.Navigator>
  )
  const ProjectRoute = () => (
    <ProjectStack.Navigator initialRouteName="ProjectList">
      <ProjectStack.Screen name="ProjectList" component={ProjectListScreen} />
      <ProjectStack.Screen name="ProjectEdit" component={ProjectEditScreen} />
    </ProjectStack.Navigator>
  )


  // stack only
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Home"
      >
        <RootStack.Screen name="Home" component={HomeScreen} options={options} />
        <RootStack.Screen name="Project" component={ProjectListScreen} options={options} />
        <RootStack.Screen name="ProjectEdit" component={ProjectEditScreen} options={options} />

        <RootStack.Screen name="TaskEdit" component={TaskEditScreen} options={options} />
        <RootStack.Screen name="DateTaskList" component={DateTaskListScreen} options={options} />
        <RootStack.Screen name="DateTaskEdit" component={DateTaskEditScreen} options={options} />
      </RootStack.Navigator>


    </NavigationContainer>
  );

}


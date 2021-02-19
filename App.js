import React from 'react';
import HomeScreen from './screens/HomeScreen'
import ProjectListScreen from './screens/ProjectListScreen'
import ProjectEditScreen from './screens/ProjectEditScreen'

//navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //tab

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProjectStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

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
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Project" component={ProjectListScreen} />
        <RootStack.Screen name="ProjectEdit" component={ProjectEditScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );

  // modal only
  // return (
  //   <NavigationContainer>
  //     <RootStack.Navigator
  //       initialRouteName="Home" mode="modal"
  //     >
  //       <RootStack.Screen name="Home" component={HomeScreen} />
  //       <RootStack.Screen name="Project" component={ProjectListScreen} />
  //       <RootStack.Screen name="ProjectEdit" component={ProjectEditScreen} />
  //     </RootStack.Navigator>
  //   </NavigationContainer>
  // );

  // stack & modal
  // return (
  //   <NavigationContainer>
  //     <RootStack.Navigator
  //       initialRouteName="Home" mode="modal"
  //     >
  //       <RootStack.Screen
  //         name="Home"
  //         component={HomeRoute}
  //         options={{ headerShown: false }}
  //       />

  //       <RootStack.Screen
  //         name="Project"
  //         component={ProjectRoute}
  //         options={{ headerShown: false }}
  //       />

  //     </RootStack.Navigator>
  //   </NavigationContainer>
  // );


  // //tab
  // return (
  //   <NavigationContainer>
  //     <Tab.Navigator>
  //       <Tab.Screen name="Home" component={HomeRoute} />
  //       <Tab.Screen name="Project" component={ProjectRoute} />
  //     </Tab.Navigator>
  //   </NavigationContainer>
  // )

}


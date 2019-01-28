import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {createStackNavigator, createAppContainer} from "react-navigation";
import {Home} from './screens/home';
import {Settings} from './screens/settings';

const AppNavigator = createStackNavigator({
  home: Home,
  settings: Settings
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

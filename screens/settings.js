import React, {Component} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Dialog from "react-native-dialog";
import Picker from 'react-native-wheel-picker';
import { SegmentedControls } from 'react-native-radio-buttons';

var PickerItem = Picker.Item;

export class Settings extends Component {
  static navigationOptions = {
    headerLeft: (
      <Image source={require('android/app/src/main/res/mipmap-mdpi/ic_launcher.png')} />
    ),
    title: 'Settings',
    headerStyle: {
      backgroundColor: '#4ddbff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      whiteTime: '05:00',
      blackTime: '05:00',
      compensation: '00:05',
      compensationType: 'INCREMENT',
      timeDialogMode: 'timeControl',
      formatType: 'REGULAR',
      formatColor: 'both',
      selectedHours : 0,
      selectedMinutes: 0,
      selectedSeconds: 0,
      timeDialogVisible: false,
      hoursList: [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23'
      ],
      minutesList: [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
        '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
      ],
      secondsList: [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
        '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'
      ]
    };
  }

  changeTime(type, index) {
    if(type == 'Hours') {
      this.setState({
          selectedHours: index
      });
    }else if(type == 'Minutes') {
      this.setState({
          selectedMinutes: index
      });
    }else {
      this.setState({
          selectedSeconds: index
      })
    }
  }

  toggleTimeDialog(mode, color) {
    var timeControl = color == 'black' ? this.state.blackTime : this.state.whiteTime;
    var timeArray = mode == 'timeControl' ? timeControl.split(':') : this.state.compensation.split(':');
    var hoursIndex = timeArray.length > 2 ? this.state.hoursList.indexOf(timeArray[0]) : 0;
    var minutesIndex = timeArray.length > 2 ? this.state.minutesList.indexOf(timeArray[1]) : this.state.minutesList.indexOf(timeArray[0]);
    var secondsIndex = this.state.secondsList.indexOf(timeArray[timeArray.length - 1]);

    this.setState({
        timeDialogVisible: !this.state.timeDialogVisible,
        timeDialogMode: mode,
        selectedHours: hoursIndex,
        selectedMinutes: mode == 'timeControl' ? minutesIndex : 0,
        selectedSeconds: secondsIndex,
        formatColor: color
    });
  }

  createTime(mode) {
    var hours = this.state.hoursList[this.state.selectedHours];
    var minutes = this.state.minutesList[this.state.selectedMinutes];
    var seconds = this.state.secondsList[this.state.selectedSeconds];
    var newTime = (hours != '00' ? (hours + ':') : '') + minutes + ':' + seconds;

    this.setState({
      whiteTime: mode == 'timeControl' && this.state.formatColor != 'black' ? newTime : this.state.whiteTime,
      blackTime: mode == 'timeControl' && this.state.formatColor != 'white' ? newTime : this.state.blackTime,
      compensation: mode == 'compensation' ? newTime : this.state.compensation,
      timeDialogVisible: !this.state.timeDialogVisible
    });
  }

  goBack() {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onSelect({
      initialWhiteTime: this.state.whiteTime,
      initialBlackTime: this.state.formatType == 'REGULAR' ? this.state.whiteTime : this.state.blackTime,
      compensation: this.state.compensation,
      compensationType: this.state.compensationType,
      gameStarted: false,
      gameInProgress: false,
      playerTurn: null,
      whiteMoves: 0,
      blackMoves: 0
    });
  }

  render() {
    var hours = this.state.hoursList[this.state.selectedHours];
    var minutes = this.state.minutesList[this.state.selectedMinutes];
    var seconds = this.state.secondsList[this.state.selectedSeconds];

    const pickerArray = [
      {pickerName: 'hrs', currentValue: this.state.selectedHours, valueToChange: 'Hours', list: this.state.hoursList},
      {pickerName: 'min', currentValue: this.state.selectedMinutes, valueToChange: 'Minutes', list: this.state.minutesList},
      {pickerName: 'sec', currentValue: this.state.selectedSeconds, valueToChange: 'Seconds', list: this.state.secondsList}
    ];
    const formatColorArray = [
      {formatColor: 'white', color: 'WHITE', timeControl: this.state.whiteTime},
      {formatColor: 'black', color: 'BLACK', timeControl: this.state.blackTime}
    ];
    const compensationTypes = ['INCREMENT', 'DELAY'];
    const formatTypes = ['REGULAR', 'HANDICAP'];

    if(this.state.timeDialogMode == 'compensation') {
      pickerArray.splice(0, 2);
    }

    return (
      <View style={{flex: 1, padding: 10}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View style={{width: '80%', padding: 10}}>
            <SegmentedControls
              options={formatTypes}
              onSelection={(selectedOption) => this.setState({formatType: selectedOption})}
              selectedOption={this.state.formatType}
            />
          </View>
          {
            this.state.formatType == 'REGULAR' ?
            (
              <TouchableWithoutFeedback onPress={() => this.toggleTimeDialog('timeControl', 'both')}>
                <View style={[styles.center, styles.timeButton]}>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={[styles.timeTitle]}>TIME CONTROL:</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={[styles.time]}>GAME IN {this.state.whiteTime}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ) :
            (
              formatColorArray.map((format, i) => (
                <TouchableWithoutFeedback onPress={() => this.toggleTimeDialog('timeControl', format.formatColor)} key={i}>
                  <View style={[styles.center, styles.timeButton]}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={[styles.timeTitle]}>{format.color} TIME:</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={[styles.time]}>GAME IN {format.timeControl}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))
            )
          }
          <View style={{width: '80%', padding: 10}}>
            <SegmentedControls
              options={compensationTypes}
              onSelection={(selectedOption) => this.setState({compensationType: selectedOption})}
              selectedOption={this.state.compensationType}
            />
          </View>
          <TouchableWithoutFeedback onPress={() => this.toggleTimeDialog('compensation', 'both')}>
            <View style={[styles.center, styles.timeButton]}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={[styles.timeTitle]}>COMPENSATION:</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={[styles.time]}>{this.state.compensationType} {this.state.compensation}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={[styles.center, {flex: 0.2}]}>
          <TouchableWithoutFeedback onPress={() => this.goBack()}>
            <View style={[styles.center, styles.readyButton]}>
              <Text style={[styles.readyButtonText]}>READY</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Dialog.Container visible={this.state.timeDialogVisible}>
          <View style={[styles.center, {flex: 1, backgroundColor: '#006666'}]}>
            <View style={{flexDirection: 'row'}}>
              {
                pickerArray.map((picker, i) => (
                  <View style={[styles.center, {flex: 1}]} key={i}>
                    <Text style={{color: 'white', fontSize: 20}}>
                      {picker.pickerName}
                    </Text>
                    <Picker style={{width: '100%', height: '50%'}}
                      selectedValue={picker.currentValue}
                      itemStyle={{color: "white", fontSize: 26}}
                      onValueChange={(index) => this.changeTime(picker.valueToChange, index)}
                    >
                      {
                        picker.list.map((value, i) => (
                          <PickerItem label={value} value={i} key={picker.valueToChange+value}/>
                        ))
                      }
                    </Picker>
                  </View>
                ))
              }
            </View>
            <Text style={{fontSize: 50, color: 'white'}}>
              {this.state.timeDialogMode == 'timeControl' ? (hours + ' :') : ''} {minutes} : {seconds}
            </Text>
          </View>
          <Dialog.Button label="CANCEL" onPress={() => this.toggleTimeDialog(this.state.timeDialogMode)} />
          <Dialog.Button label="OKAY" onPress={() => this.createTime(this.state.timeDialogMode)} />
        </Dialog.Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  readyButton: {
    width: '100%',
    height: '50%',
    backgroundColor: '#0088cc'
  },
  readyButtonText: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold'
  },
  time: {
    color: '#595959',
    fontSize: 20,
    fontWeight: 'bold'
  },
  timeButton: {
    width: '100%',
    height: '20%',
    margin: 5,
    borderWidth: 1,
    flexDirection: 'row'
  },
  timeTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

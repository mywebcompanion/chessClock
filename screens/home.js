import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Dialog from "react-native-dialog";

const Sound = require('react-native-sound');
Sound.setCategory('Playback');
const tick = new Sound('tick.mp3', Sound.MAIN_BUNDLE);

export class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      initialWhiteTime: '05:00',
      initialBlackTime: '05:00',
      currentWhiteTime: '05:00',
      currentBlackTime: '05:00',
      compensation: '00:05',
      compensationType: 'INCREMENT',
      countDownInterval: null,
      gameStarted: false,
      gameInProgress: false,
      resetDialogVisible: false,
      playerTurn: null,
      whiteMoves: 0,
      blackMoves: 0
    };
  }

  onSelect = data => {
    this.setState(data);
  };

  resetClock() {
    this.setState({
      resetDialogVisible: !this.state.resetDialogVisible
    });
  }

  startClock() {
    if(this.state.gameStarted || this.state.resetDialogVisible) {
      this.setState({
        gameStarted: false,
        gameInProgress: false,
        resetDialogVisible: false,
        playerTurn: null,
        whiteMoves: 0,
        blackMoves: 0
      });
      clearInterval(this.state.countDownInterval);
    } else {
      this.setState({
        gameStarted: true,
        gameInProgress: true,
        resetDialogVisible: false,
        playerTurn: 'white',
        countDownInterval: setInterval(() => this.countDown('white'), 1000)
      });
    }

    this.setState({
      currentWhiteTime: this.state.initialWhiteTime,
      currentBlackTime: this.state.initialBlackTime
    });
  }

  convertToSeconds(time) {
    return time.split(':').reduce((acc, curr) => (60 * parseInt(acc, 10)) + parseInt(curr, 10));
  }

  countDown(player) {
    var currentTime = this.state.playerTurn == 'white' ? this.state.currentWhiteTime : this.state.currentBlackTime;
    var timeInSeconds = this.convertToSeconds(currentTime);
    timeInSeconds = timeInSeconds ? timeInSeconds - 1 : timeInSeconds;

    var hours   = Math.floor(timeInSeconds / 3600);
    var minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    var seconds = timeInSeconds - (hours * 3600) - (minutes * 60);

    hours = hours < 10 ? '0' + hours : '' + hours;
    minutes = minutes < 10 ? '0' + minutes : '' + minutes;
    seconds = seconds < 10 ? '0' + seconds : '' + seconds;

    var timeLeft = (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
    this.setState({
      currentWhiteTime: this.state.playerTurn == 'white' ? timeLeft : this.state.currentWhiteTime,
      currentBlackTime: this.state.playerTurn == 'black' ? timeLeft : this.state.currentBlackTime
    });
  }

  pauseClock() {
    if(this.state.gameStarted) {
      if(this.state.gameInProgress) {
        clearInterval(this.state.countDownInterval);
      }else {
        this.setState({
          countDownInterval: setInterval(() => this.countDown(this.state.playerTurn), 1000)
        });
      }
      this.setState({
        gameInProgress: !this.state.gameInProgress,
      });
    } else {
      this.startClock();
    }
  }

  pressClock(player) {
    clearInterval(this.state.countDownInterval);

    this.setState({
      playerTurn: this.state.playerTurn == 'white' ? 'black' : 'white',
      whiteMoves: this.state.playerTurn == 'white' ? this.state.whiteMoves + 1 : this.state.whiteMoves,
      blackMoves: this.state.playerTurn == 'black' ? this.state.blackMoves + 1 : this.state.blackMoves,
      countDownInterval: setInterval(() => this.countDown(this.state.playerTurn), 1000)
    });
    tick.play();
  }

  render() {
    var whiteTime = this.state.gameStarted ? this.state.currentWhiteTime : this.state.initialWhiteTime;
    var blackTime = this.state.gameStarted ? this.state.currentBlackTime : this.state.initialBlackTime;
    var whiteColor = this.state.playerTurn == 'white' ? (this.convertToSeconds(whiteTime) ? '#3399ff' : '#ff0000') : '#808080';
    var blackColor = this.state.playerTurn == 'black' ? (this.convertToSeconds(blackTime) ? '#3399ff' : '#ff0000') : '#808080';
    var playButton = this.state.gameInProgress ? 'pause' : 'play';

    return (
      <View style={{flex: 1, padding: 10}}>
        <TouchableWithoutFeedback
         disabled={
           (this.state.gameInProgress && this.state.playerTurn == 'white' && this.convertToSeconds(whiteTime)) ? false : true
         }
         onPress={() => this.pressClock('white')}
        >
          <View style={[{flex: 1, backgroundColor: whiteColor, borderRadius: 20}]}>
            <View style={[styles.center, {flex: 0.3}]}>
              <Text style={[styles.moves, {transform: [{ rotate: '180deg'}]}]}>MOVES: {this.state.whiteMoves}</Text>
            </View>
            <View style={[styles.center, {flex: 1}]}>
              <Text style={[styles.time, {transform: [{ rotate: '180deg'}]}]}>{whiteTime}</Text>
            </View>
            <View style={[styles.center, {flex: 0.3}]}>
              <Icon name='chess-king' color='white' style={{transform: [{ rotate: '180deg'}]}} size={40} />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.center, styles.options]}>
          {
            !this.state.gameInProgress || !(this.convertToSeconds(whiteTime) && this.convertToSeconds(blackTime)) ? (
              <View style={[styles.center, {flex: 1}]}>
                <Icon
                  name='cog'
                  size={50}
                  color='black'
                  onPress={() => this.props.navigation.navigate('settings', {onSelect: this.onSelect})}
                />
              </View>
            ) : null
          }
          <View style={[styles.center, {flex: 1}]}>
            {
              this.convertToSeconds(whiteTime) && this.convertToSeconds(blackTime) ? (
                <Icon
                  name={playButton}
                  size={50}
                  color='black'
                  onPress={() => this.pauseClock()}
                />
              ) : clearInterval(this.state.countDownInterval)
            }
          </View>
          {
            !this.state.gameInProgress || !(this.convertToSeconds(whiteTime) && this.convertToSeconds(blackTime)) ? (
              <View style={[styles.center, {flex: 1}]}>
                <Icon
                  name='redo'
                  size={50}
                  color='black'
                  onPress={() => this.resetClock()}
                />
              </View>
            ) : null
          }
        </View>
        <TouchableWithoutFeedback
         disabled={
           (this.state.gameInProgress && this.state.playerTurn == 'black' && this.convertToSeconds(blackTime)) ? false : true
         }
         onPress={() => this.pressClock('black')}
        >
          <View style={[{flex: 1, backgroundColor: blackColor, borderRadius: 20}]}>
            <View style={[styles.center, {flex: 0.3}]}>
              <Icon name='chess-king' color='black' size={40} />
            </View>
            <View style={[styles.center, {flex: 1}]}>
              <Text style={[styles.time]}>{blackTime}</Text>
            </View>
            <View style={[styles.center, {flex: 0.3}]}>
              <Text style={[styles.moves]}>MOVES: {this.state.blackMoves}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <Dialog.Container visible={this.state.resetDialogVisible}>
          <Dialog.Title style={{color: 'black'}}>
            Reset Clock
          </Dialog.Title>
          <Dialog.Description style={{color: 'black'}}>
            Do you want to reset the clock?
          </Dialog.Description>
          <Dialog.Button label="NO" onPress={() => this.resetClock()} />
          <Dialog.Button label="YES" onPress={() => this.startClock()} />
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
  moves: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  options: {
    flex: 0.5,
    margin: 5,
    flexDirection: 'row'
  },
  time: {
    fontSize: 120,
    fontFamily: 'DigitalClock',
    color: 'white'
  }
});

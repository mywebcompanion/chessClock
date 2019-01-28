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
      compensation: '00:05',
      compensationType: 'INCREMENT',
      gameStarted: false,
      gameInProgress: false,
      whiteMoves: 0,
      blackMoves: 0,
      playerTurn: null,
      resetDialogVisible: false
    };
  }

  onSelect = data => {
    this.setState(data);
  };

  resetClock() {
    var resetDialogVisible = this.state.resetDialogVisible;

    this.setState({
      resetDialogVisible: !resetDialogVisible
    });
  }

  startClock() {
    var resetDialogVisible = this.state.resetDialogVisible;
    var gameStarted = this.state.gameStarted;

    if(gameStarted || resetDialogVisible) {
      this.setState({
        gameStarted: false,
        gameInProgress: false,
        resetDialogVisible: false,
        playerTurn: null,
        whiteMoves: 0,
        blackMoves: 0
      });
    } else {
      this.setState({
        gameStarted: true,
        gameInProgress: true,
        resetDialogVisible: false,
        playerTurn: 'white'
      });
    }
  }

  pauseClock() {
    var gameStarted = this.state.gameStarted;
    var gameInProgress = this.state.gameInProgress;

    if(gameStarted) {
      this.setState({
        gameInProgress: !gameInProgress
      });
    } else {
      this.startClock();
    }
  }

  pressClock(player) {
    var playerTurn = this.state.playerTurn;
    var whiteMoves = this.state.whiteMoves;
    var blackMoves = this.state.blackMoves;

    this.setState({
      playerTurn: playerTurn == 'white' ? 'black' : 'white',
      whiteMoves: playerTurn == 'white' ? whiteMoves + 1 : whiteMoves,
      blackMoves: playerTurn == 'black' ? blackMoves + 1 : blackMoves
    });
    tick.play();
  }

  render() {
    var gameInProgress = this.state.gameInProgress;
    var playerTurn = this.state.playerTurn;
    var playButton = gameInProgress ? 'pause' : 'play';
    var whiteColor = playerTurn == 'white' ? '#3399ff' : '#808080';
    var blackColor = playerTurn == 'black' ? '#3399ff' : '#808080';
    var whiteMoves = this.state.whiteMoves;
    var blackMoves = this.state.blackMoves;
    var resetDialogVisible = this.state.resetDialogVisible;
    var initialWhiteTime = this.state.initialWhiteTime;
    var initialBlackTime = this.state.initialBlackTime;

    return (
      <View style={{flex: 1, padding: 10}}>
        <TouchableWithoutFeedback
         disabled={
           (gameInProgress && playerTurn == 'white') ? false : true
         }
         onPress={() => this.pressClock('white')}
        >
          <View style={[{flex: 1, backgroundColor: whiteColor, borderRadius: 20}]}>
            <View style={[styles.center, {flex: 0.3}]}>
              <Text style={[styles.moves, {transform: [{ rotate: '180deg'}]}]}>MOVES: {whiteMoves}</Text>
            </View>
            <View style={[styles.center, {flex: 1}]}>
              <Text style={[styles.time, {transform: [{ rotate: '180deg'}]}]}>{initialWhiteTime}</Text>
            </View>
            <View style={[styles.center, {flex: 0.3}]}>
              <Icon name='chess-king' color='white' style={{transform: [{ rotate: '180deg'}]}} size={40} />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.center, styles.options]}>
          {
            !gameInProgress ? (<View style={[styles.center, {flex: 1}]}>
              <Icon
                name='cog'
                size={50}
                color='black'
                onPress={() => this.props.navigation.navigate('settings', {onSelect: this.onSelect})}
              />
            </View>) : null
          }
          <View style={[styles.center, {flex: 1}]}>
            <Icon
              name={playButton}
              size={50}
              color='black'
              onPress={() => this.pauseClock()}
            />
          </View>
          {
            !gameInProgress ? (
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
           (gameInProgress && playerTurn == 'black') ? false : true
         }
         onPress={() => this.pressClock('black')}
        >
          <View style={[{flex: 1, backgroundColor: blackColor, borderRadius: 20}]}>
            <View style={[styles.center, {flex: 0.3}]}>
              <Icon name='chess-king' color='black' size={40} />
            </View>
            <View style={[styles.center, {flex: 1}]}>
              <Text style={[styles.time]}>{initialBlackTime}</Text>
            </View>
            <View style={[styles.center, {flex: 0.3}]}>
              <Text style={[styles.moves]}>MOVES: {blackMoves}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        <Dialog.Container visible={resetDialogVisible}>
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

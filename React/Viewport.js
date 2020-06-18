import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Linking,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native';
import Word from './Word';
import PlayerCards from './PlayerCards';
import styles from '../Styles/styles.js';
import store from '../Redux/store.js';
import { removeLetter, updateWordAndRemoveCard, setCardLocation, setDropLocation, addPlayerCard, seedWord, setPlayerCards, setTahminWord, setMessageWord, setAnswerWord, setTargetWord, cycleMode, clearMostRecentCards, setOriginalWord } from '../Redux/action-creators.js';
import { isValidWord, getPossibleWords, getNewCard, randomWord, dictionary, getStandardStart, getPathStart } from '../utils/wordutils';

const STARTINGCARDS = 5;


export default class Viewport extends Component {
  constructor(props) {
    super(props);

    //this.state = store.getState();
  this.state =  {
  word: '',
  playerCards: [],
  dropLocations: {},
  cardLocations: {},
  cardCounter: 0,
  mostRecentPlayerCards: [],
  mode: 'bil',
  possibleModes: ['uret','bil'],
  originalWord: '',
  targetWord: '',
  tahmin: '',
  answer: '',
  highScore: 0,
  message: "SUCCESSFUL.\nGO TO NEXT WORD."
  };
    this.pan = {};
    this.panResponders = {};
    this.playerCards = {};
    this.renderDraggable = this.renderDraggable.bind(this);
    this.addElementToViewport = this.addElementToViewport.bind(this);
    this.createCardResponder = this.createCardResponder.bind(this);
    this.handleDropZone = this.handleDropZone.bind(this);
    this.reset = this.reset.bind(this);
    this.rewind = this.rewind.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.createHighScore = this.createHighScore.bind(this);

  }

  componentDidMount (){
    this.createHighScore();  
    this.unsubscribe = store.subscribe(() => { this.setState(store.getState()) });
    this.reset();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  isDropZone(moveX, moveY) {
    if (moveX > this.dropZone.x && moveY > this.dropZone.y && moveY < (this.dropZone.y + this.dropZone.height) && moveX < (this.dropZone.x + this.dropZone.width)) {
      return true;
    } else {
      return false;
    }
  }

doClear() {
  if(this.refs["textInput"] != null){
    let textInput = this.refs["textInput"];
    textInput.clear();
     this.setState({tahmin: ""});
    }
  }

createHighScore = async () => {
      try {
        const highScore = await AsyncStorage.getItem('highScore');

        if(this.state.highScore > highScore){ 
          AsyncStorage.setItem("highScore", this.state.highScore.toString());
            this.setState({
                highScore: this.state.highScore
            })
        }else{
          this.setState({ highScore: highScore}); 

        }
      } catch (e) {
        console.log(e);
      }
    }

  render() {

    return (
      <View style={styles.mainContainer}>

        <View style={styles.topPad}>

        <View style={styles.iconView}>

        <Text style={styles.title}>Vocabulary </Text>
        <Text style={styles.score}>#{this.state.highScore}</Text>
        <TouchableOpacity onPress={() => this.setState({ mode: "hakkinda" })} style={ styles.TouchableOpacityFrame}>
          <Image source={require('../Dictionary/murekkep.png')} style={styles.icon} />
       </TouchableOpacity>

        </View>

        <View style={styles.topView}>
          { this.state.mode === 'uret' ? <Text style={styles.subtitle}>Find the word</Text>  : null }
          { this.state.mode === 'bil' ? <Text style={styles.subtitle}>Translate to English</Text>  : null }
        </View>

        </View>

        { this.state.mode === 'hakkinda' ?
        (<View style={styles.hakkindaView}>
         <Text style={styles.subtitle}>Vocabulary [English];{"\n"}
          it contains English words that are used extensively. {"\n"}{"\n"}

          The app has two modes. In the first mode, you try to find the word from the letters given. {"\n"}

           In the second mode, you have to guess the words translation in English.
           You can press the SHOW button for the word you do not know.{"\n"}
           You can change the word with Change Word in both modes. {"\n"}{"\n"}

          Versiyon : 1.0{"\n"}
          ---------------------------------------------------------------{"\n"}
          WARMET DNG CO{"\n"}

          Contact :{"\n"}
         </Text>

          <Button
            onPress={()=>{ Linking.openURL("mailto:sonerpalanci@gmail.com?subject=Vocabulary[English]&body=Error:")} }
            title="sonerpalanci@gmail.com"
            style={styles.menu}
            accessibilityLabel="Add comment"
          />

        <TouchableOpacity onPress={() => { Linking.openURL("https://www.buymeacoffee.com/spalanci")}} style={ styles.TouchableOpacityFrameCoffee}>
          <Image source={require('../Dictionary/coffee.png')} style={styles.coffee} />
        </TouchableOpacity>

        <Button
            onPress={this.reset}
            title=" CLOSE "
            color="#FF0000"
            style={styles.menu}
            accessibilityLabel="Close"
          />
        </View>
                )
                : null}

        { this.state.mode === 'bil' ? (
        <View
          onLayout={event => this.dropZone = event.nativeEvent.layout}
          style={styles.dropZone}>

            <Word word={this.state.word} />

        </View>):  null}


        { this.state.mode === 'bil' || this.state.mode === 'uret' ? (

        <View style={styles.inputView}>

        { this.state.mode === 'uret' ?
        (<View style={styles.playerCardsRow}>
        <Text style={styles.currentLetter}>{this.state.targetWord}</Text>
        </View>)
        : (<Text style={styles.outputText}>{this.state.targetWord}</Text>)}

        <View style={styles.tahminView}>
                    <TextInput
                        autoFocus={false}
                        ref="textInput"
                        style={styles.inputText}
                        placeholder={ "Write..." }
                        onChangeText={(tahmin) => this.setState({ tahmin: tahmin })}
                      />
      <Button
                 onPress={this.Control}
                 title=" OKEY "
                 style={styles.kontrol}
                 color='#1E6738'
                 accessibilityLabel="Cevap"
               />


      <Button
                 onPress={() => Alert.alert(
                  'Answer',
                  this.state.answer,
                  [
                    {text: 'Close', onPress: () => this.doClear() },
                    {text: 'Next', onPress: this.reset},
                  ],
                  { cancelable: false }
                  )}
                 title=" SHOW "
                 style={styles.ok}
                 accessibilityLabel="Answer"
               />
        </View>
        </View>) : null }

        <View style={styles.bottom}>
          <Button
            onPress={this.changeMode}
            title="CHANGE MODE"
            style={styles.menu}
            accessibilityLabel="Change mode"
          />

          <Button
            onPress={()=>{ Linking.openURL("https://play.google.com/store/apps/details?id=com.english")} }
            title="VOTE"
            style={styles.menu}
            accessibilityLabel="Add comment"
          />

          <Button
            onPress={this.reset}
            title="CHANGE WORD"
            style={styles.menu}
            accessibilityLabel="Change word"
          />

      </View>

      </View>
    );
  }


  Control = () =>{

    if( this.state.tahmin===this.state.answer )
    {
      this.scoreEkle(); 
      Alert.alert("RESULT",
                  this.state.message,
                  [
                    {text: 'Close', onPress: () => this.doClear() },
                    {text: 'Next', onPress: this.reset},
                  ],
                  { cancelable: false } );
    }
    else
    {
 
      Alert.alert("RESULT",
                  "NOT THE RIGHT WORD ",
                  [
                    {text: 'Close', onPress: () => this.doClear() },
                  ],
                  { cancelable: false })
 
    }
  }

  scoreEkle() {
          this.setState({ highScore: Number(this.state.highScore) + 1 });
          this.createHighScore(); 
  }

  changeMode() {
    store.dispatch(cycleMode());
    setTimeout(()=>this.reset(),0);
      this.doClear();
  }

  rewind() {
    let currentCards  = this.state.playerCards;
    let usedCards = this.state.mostRecentPlayerCards;
    let originalWord = this.state.originalWord;

    store.dispatch(setPlayerCards(currentCards.concat(usedCards)));
    store.dispatch(seedWord(originalWord));
  }

  reset() {
    let answer, message, tahmin, newWord, newCards,targetWord;
    if(this.state.mode==='bil'){
      let newCardsAndWord = getStandardStart();
      newWord = newCardsAndWord.newWord;
      newCards = newCardsAndWord.newCards;
      targetWord = newCardsAndWord.targetWord;
      answer = newCardsAndWord.answer;
      message = newCardsAndWord.message;
      tahmin = newCardsAndWord.tahmin;
      this.doClear();
    } else if(this.state.mode === 'uret'){
      let newCardsAndWord = getPathStart();
      newWord = newCardsAndWord.newWord;
      newCards = newCardsAndWord.newCards;
      targetWord = newCardsAndWord.targetWord;
      answer = newCardsAndWord.answer;
      message = newCardsAndWord.message;
      tahmin = newCardsAndWord.tahmin;
      this.doClear();
    }else{
      let newCardsAndWord = getStandardStart();
      newWord = newCardsAndWord.newWord;
      newCards = newCardsAndWord.newCards;
    }
    store.dispatch(seedWord(newWord));
    store.dispatch(clearMostRecentCards());
    store.dispatch(setPlayerCards(newCards));
    store.dispatch(setOriginalWord(newWord));
    if(targetWord)store.dispatch(setTargetWord(targetWord));
    if(answer)store.dispatch(setAnswerWord(answer));
    if(message)store.dispatch(setMessageWord(message));
    if(tahmin)store.dispatch(setTahminWord(tahmin));
  }

  addElementToViewport(str) {
    function addRef(element) {
      this.playerCards[str] = element;
    }
    return addRef.bind(this);
  }

  renderDraggable(str, index) {
    if (!this.pan[str+index]) this.pan[str+index] = new Animated.ValueXY;
    if (!this.panResponders[str+index]) this.createCardResponder(str,index);
    let panResponder = this.panResponders[str+index];
    return (
      <Animated.View
        key={index}
        {...panResponder.panHandlers}
        ref={this.addElementToViewport(str)}
        onLayout={setLocationOfCard(str)}
        style={[this.pan[str+index].getLayout(), styles.circle, styles.draggableContainer]}>
        <Text style={styles.text}>{str}</Text>
      </Animated.View>
    );
  }

  handleDropZone(str, indexOfCard, xCoord) {
    let index = this.getIndex(xCoord);
    let newWord = this.state.word.split('');
    if (index % 1) {
      newWord.splice(index + .5, 0, str);
    } else {
      newWord.splice(index, 1, str);
    }
    newWord = newWord.join('');
    if (isValidWord(newWord)) {
      store.dispatch(updateWordAndRemoveCard(newWord, str, indexOfCard));
        let newCard = getNewCard(this.state.playerCards, newWord, this.state.mostRecentPlayerCards);
        store.dispatch(addPlayerCard(newCard));
      return true;
    }
    return false;
  }

  getIndex(xCoord) {
    xCoord -= this.dropZone.x;
    let letters = this.state.dropLocations;
    for (var i = 0; i < Object.keys(letters).length; i++) {
      if (xCoord < letters[i].x) return i - 0.5;
      if (xCoord > letters[i].x && xCoord < letters[i].x + letters[i].width) return i;
    }
    return i - 0.5;
  }


  createCardResponder(str,index) {
    this.panResponders[str+index] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gesture) => {
        this.pan[str+index].setOffset({ x: 0, y: 0 });
        this.pan[str+index].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gesture) => {
        this.pan[str+index].x.setValue(gesture.dx);
        this.pan[str+index].y.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture.moveX, gesture.moveY) && this.handleDropZone(str, index, gesture.moveX)) {
          this.pan[str+index] = null;
        } else {
          Animated.spring(
            this.pan[str+index],
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      },
    })
    return this.panResponders[str+index];
  }

}

function setLocationOfCard(str) {
  return (event) => {
    store.dispatch(setCardLocation(str, event.nativeEvent.layout))
  }
}

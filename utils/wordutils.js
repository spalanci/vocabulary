import Dictionary from '../Dictionary/Dictionary.js';
import commonWordList from '../Dictionary/commonwordlist_os.js';
import commonWordListFull from '../Dictionary/commonwordlist_full.js';

const commonWordListOS = require('../Dictionary/commonwordlist_os.json');
const commonWordList_Full = require('../Dictionary/commonwordlist_full.json');

const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 7;

const LETTER_FREQUENCIES = {
  A: 10,
  B: 2,
  C: 2,
  Ç: 2,
  D: 2,
  E: 10,
  F: 4,
  G: 4,
  H: 6,
  I: 2,
  "İ": 8,
  J: 1,
  K: 7,
  L: 7,
  M: 10,
  N: 8,
  O: 3,
  Ö: 1,
  P: 1,
  R: 6,
  S: 6,
  Ş: 6,
  T: 9,
  U: 4,
  Ü: 4,
  V: 6,
  Y: 6,
  Z: 8,
  Â: 7,
  Î: 7,
  "'": 3,
  "-": 2
}

const LETTER_TABLE = [];

export const dictionary = new Dictionary;
dictionary.bulkAddWords(commonWordListFull);

export function getPathStart(){
    let targetWord = "";
    let tahmin = "";
    let message = "";
    let newCards = [];
    let newWord = randomWordFull(4 + Math.floor(Math.random() * 3));
    let newTargetWord = showMeaning2(newWord);

      newWord = newTargetWord.newWord;
      newCards = newTargetWord.newCards;
      targetWord = newTargetWord.targetWord;

    let answer = newWord;

    return {tahmin, message, newWord, answer, newCards, targetWord};
}

/*
export function getPathStart(){

    let newCards = [];
    let newWord = randomWord(4 + Math.floor(Math.random() * 2));
    let wordArr = [];
    let updatedWord;
    wordArr.push(newWord);
    let changes = 0;
    while (wordArr.length < 5){
      let possible = getAllCommonReachableWords(wordArr, wordArr[changes]);
      if (possible.length < 4) return getPathStart();
      updatedWord = possible[Math.floor(Math.random() * possible.length)];
      wordArr.push(updatedWord);
      if (updatedWord.length >= wordArr[changes].length){
        let index = 0;
        while (updatedWord.charAt(index) === wordArr[changes].charAt(index)){
          index++;
        }
            while (newCards.length < 10) {
              newCards.push(getNewCard(newCards, newWord, []));
            }
      }
      changes++;
    }
    let targetWord = wordArr[wordArr.length - 1];
    //console.log('end of pathstart', wordArr, targetWord);
    return {newWord, newCards, targetWord};
}
export function getStandardStart(){
    let newCards = [];
    let newWord = randomWord(4);
    while (newCards.length < 10) {
      newCards.push(getNewCard(newCards, newWord, []));
    }
    return {newWord, newCards};
}*/

export function getStandardStart(){
    let newCards = [];
    let newWord = randomWord(4 + Math.floor(Math.random() * 3));
    let newTargetWord = showMeaning(newWord);
    let message = '';
    let tahmin = '';

      newWord = newTargetWord.newWord;
      newCards = newTargetWord.newCards;
      targetWord = newTargetWord.targetWord;
      let answer = newWord;

      newWord = "??"+newWord.substring(2,newWord.length-2)+"??";

    return {message, tahmin, answer, newWord, newCards, targetWord};
}

export function shuffleArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function showMeaning(input) {
            if (LETTER_TABLE.length === 0)seedLetterTable();

            let newCards = [];
            // Use the ternary operator to check if the word
            // exists in the dictionary.
            const meaning = input in commonWordListOS ?  commonWordListOS[input] :  null

            let letterArr = input.split('');

            for (let i=0; i < letterArr.length; i++) {
                newCards.push(letterArr.slice(i));
            }

            let pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];

            while (newCards.length < 10) {
                newCards.push(LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)]);
            }

            // Update the state
            return {newWord:input, newCards:shuffleArray(newCards), targetWord:meaning};
        }

export function showMeaning2(input) {
            if (LETTER_TABLE.length === 0)seedLetterTable();

            let newCards = [];
            // Use the ternary operator to check if the word
            // exists in the dictionary.
            const meaning = input in commonWordList_Full ?  commonWordList_Full[input] :  null

            let letterArr = meaning.split(',');

            for (let i=0; i < letterArr.length; i++) {
                newCards.push(letterArr.slice(i));
            }

            
            // Update the state
            return {newWord:input, newCards:newCards, targetWord:meaning};
        }

export function randomWord(length) {
  let temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  while (temp.length !== length){
    temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  }
  return temp;
}

export function randomWordFull(length) {
  let temp = commonWordListFull[Math.floor(Math.random() * commonWordListFull.length)];
  while (temp.length !== length){
    temp = commonWordListFull[Math.floor(Math.random() * commonWordListFull.length)];
  }
  return temp;
}


export function isValidWord(word) {
    return dictionary.search(word);
}

export function getNewCard(currentCards = [], word = '', mostRecent = []) {
  if (LETTER_TABLE.length === 0)seedLetterTable();

  let invalid = currentCards.join('') + word + mostRecent.join('');

  let letters = "ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZÂÎ-'";

  let pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];

  while (invalid.includes(pick)) {
    pick = LETTER_TABLE[Math.floor(Math.random() * LETTER_TABLE.length)];
  }

  return pick;

}

export function seedLetterTable(){
  let letters = "ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZÂÎ-'";
  let letterArr = letters.split('');
  letterArr.forEach(letter => {
    let desiredNumber = Math.round(LETTER_FREQUENCIES[letter] * 100);
    while (desiredNumber){
      LETTER_TABLE.push(letter);
      desiredNumber--;
    }
  })
}


export function getPossibleWords(word, cards = []) {

  let possibleWords = [];
  const currentCards = cards;
  //try removing each letter
  for (let i = 0 ; i < word.length;i++){
    let newWord = word.slice(0, i) + word.slice(i + 1);
    if (isValidWord(newWord)){
      possibleWords.push(newWord)
    }
  }
  //try adding each letter to each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i <= word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i);
      if (isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  //try substituting each letter into each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i < word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i + 1);
      if (isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  possibleWords = possibleWords.filter(thisWord => thisWord !== word);
  return possibleWords;

}

export function getAllCommonReachableWords(alreadyUsed, word, cards = "ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZÂÎ-'".split('')) {
  let possibleWords = [];
  const currentCards = cards;
  //try removing each letter
  for (let i = 0 ; i < word.length;i++){
    let newWord = word.slice(0, i) + word.slice(i + 1);
    if (newWord !== word && isCommonWord(newWord) && !alreadyUsed.includes(newWord)){
      possibleWords.push(newWord)
    }
  }
  //try adding each letter to each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i <= word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i);
      if (newWord !== word && isCommonWord(newWord) && !alreadyUsed.includes(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  //try substituting each letter into each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i < word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i + 1);
      if (newWord !== word && isCommonWord(newWord) && !alreadyUsed.includes(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  return possibleWords;
}

export function isCommonWord(word){
  return commonWordListFull.includes(word);
}
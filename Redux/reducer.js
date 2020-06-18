import styles from '../Styles/styles.js';

let initialState = {
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
  message: "SUCCESSFUL.\nGO TO NEXT WORD."
}


export default function(state = initialState, action){

  let newState = Object.assign({}, state);

  switch (action.type){

  case 'SET_TAHMIN':
   newState.tahmin = action.tahmin;
  break;

  case 'SET_MESSAGE':
   newState.message = action.message;
  break;

  case 'SET_ANSWER_WORD':
   newState.answer = action.answer;
  break;

  case 'SET_TARGET_WORD':
   newState.targetWord = action.target;
  break;

  case 'CLEAR_RECENT_CARDS':
    newState.mostRecentPlayerCards = [];
  break;

  case 'SET_ORIGINAL_WORD':
    newState.originalWord = action.word;
  break;

  case 'SET_CARD_LOCATION':
    newState.cardLocations = Object.assign({}, newState.cardLocations, {[action.letter]: action.layout})
  break;

  case 'SET_DROP_LOCATION':
    newState.dropLocations[action.index] = Object.assign({}, action.layout);
  break;

  case 'UPDATE_WORD':
    newState.word = action.word;
    if(action.card.index<Infinity){
      newState.playerCards = newState.playerCards.slice(0,action.card.index).concat(newState.playerCards.slice(action.card.index+1));
    }else{
      newState.playerCards = newState.playerCards.filter(str=>str!==action.card.str);
    }
    if(newState.mode==='bil'){
      newState.mostRecentPlayerCards = [...newState.mostRecentPlayerCards, action.card.str];
    }else{
      newState.mostRecentPlayerCards = [...newState.mostRecentPlayerCards.slice(-4), action.card];
    }
  break;

  case 'ADD_PLAYER_CARD':
    newState.playerCards = [...newState.playerCards,action.card];
    newState.cardCounter++;
  break;

  case 'SET_PLAYER_CARDS':
    newState.playerCards = action.cards;
  break;

  case 'SEED_WORD':
    newState.word = action.word;
  break;

  case 'CHANGE_MODE':
    console.log('changing mode in reducer with action.mode',action.mode, 'current', newState.mode);
    if(action.mode!=='NEXT') newState.mode = action.mode;
    else{
      let currentModeIndex = newState.possibleModes.indexOf(newState.mode);
      newState.mode = newState.possibleModes[(currentModeIndex+1)%newState.possibleModes.length];
    }
  break;

  case 'REMOVE_LETTER':
    let temp = newState.word.split('')
    temp.splice(action.index,1);
    newState.word = temp.join('');
  break;
  }

  return newState;

}

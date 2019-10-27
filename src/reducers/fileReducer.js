const initState= {
  file: null,
  counter: null
}

const fileReducer = (state={...initState}, action)=> {
  switch(action.type){
    case 'OPEN_FILE':
      return {
        ...state,
        ...action
      };
    case 'SAVE_FILE_COUNTER':
      return {
        ...state,
        ...action
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        ...action
      }
    default:
      return state;
  }
} 

export default fileReducer;
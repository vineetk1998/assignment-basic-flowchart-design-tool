export const openFile = (input)=>{
  return (dispatch, getState)=>{
    var reader= new FileReader();
    reader.onload= ()=>{
      var text = reader.result;
      var obj= JSON.parse(text);
      console.log(obj);

      dispatch({type: 'OPEN_FILE', file: obj})
    };
    reader.readAsText(input.files[0]);
  }
}


export const saveFileCounter = ()=>{
  return (dispatch, getState)=>{
    dispatch({type: 'SAVE_FILE_COUNTER', counter: 1})
  }
}


export const clearAll = ()=>{
  return (dispatch, getState)=>{
    dispatch({type:'CLEAR_ALL', counter: null, file: null})
  }
}


import React from 'react';
import {connect} from 'react-redux';

import openFileImg from '../assets/openFile.png';
import saveFile from '../assets/saveFile.jpg';
import {openFile, saveFileCounter} from '../actions/fileActions'

class Topbar extends React.Component {
  constructor(props){
    super(props);
    this.state={}
    this.handleOpen=this.handleOpen.bind(this);
    this.handleSave=this.handleSave.bind(this);
  }

  handleOpen(e){
    e.preventDefault();
    this.props.openFile(e.target);
  }

  handleSave(e){
    this.props.saveFileCounter();
  }

  render() {
    return (
      <div className='Topbar'>
        <div className="topbar-container">
          <div className="Save">
           <img src={saveFile} alt="save file" title="save file" 
               className="imgSave" width= {"40px"} height= {"40px"}
               name="save" onClick={this.handleSave}/>
          </div>

          <div className="image-upload">
            <label for="file-input">
              <img src={openFileImg} width= {"40px"} height= {"40px"} />
            </label>
            <input width= {"40px"} height= {"40px"} type="file" id="file-input" onChange={this.handleOpen}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps= (dispatch)=>{
  return {
    openFile: (input)=> dispatch(openFile(input)),
    saveFileCounter: ()=> dispatch(saveFileCounter()),
  }
}

export default connect(null, mapDispatchToProps)(Topbar);
import React from 'react';
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux';
import {clearAll} from '../actions/fileActions';

class Canvas extends React.Component {
  constructor(props){
    super(props);
    this.state={
      rectangle:[[10,10,100,80, "resize from sides"],[400, 60, 100, 140, "double click text to edit"]],
      circle: [[120,250,150, "resize line from vertexes"],[250,200,100,"drag to move"]],
      triangle: [[100, 100, 20,20, 200, 0, "resize from vertexes"],
                  [ 500, 500, 900, 900, 900, 100, "drag and drop from sidebar"]],
      line: [[300,300,630, 230]]
    }
    // x1, y1, x2, y2, x3, y3
    this.mouseDown= this.mouseDown.bind(this);
    this.mouseMove= this.mouseMove.bind(this);
    this.mouseUp= this.mouseUp.bind(this);
    this.getCursorPosition= this.getCursorPosition.bind(this);
    this.moveResize= this.moveResize.bind(this);
    this.handleSave= this.handleSave.bind(this);
    this.onDragOver= this.onDragOver.bind(this);
    this.onDrop= this.onDrop.bind(this);
    this.onDoubleClick= this.onDoubleClick.bind(this);
    // details of figure which needs to be moved/resized
    this.toChangeAttribute= null;
  }

  componentDidMount() {
    this.canvas= findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
    this.cursorType= null;
    this.forceUpdate();
  }

  handleSave(e){
    // when user wants to download current figure data
    var data= {...this.state};
    console.log(this.state);
    var json= JSON.stringify(data);
    var blob= new Blob([json], {type: 'application/json'});
    var elem= window.document.createElement('a');
    elem.href= window.URL.createObjectURL(blob);
    elem.download= "heha.json";
    document.body.appendChild(elem);
    elem.click();        
    document.body.removeChild(elem);
  }

  componentWillReceiveProps(nextProps){
    // receives props from redux store
    // check if user want to save file
    if(nextProps.files.counter){
      this.handleSave();
      this.props.clearAll();
    }
    // check if file open when opened
    else if(nextProps.files.file){
      this.setState({
        ...nextProps.files.file
      })
      this.props.clearAll();
    }
  }

  componentDidUpdate(){
    // plots the whole state
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = "#aaa";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // for rectangle
    var temp, i;
    for (i in this.state.rectangle){
      temp= this.state.rectangle[i]
      this.ctx.beginPath();
      this.ctx.fillStyle= "black";
      this.ctx.fillRect(temp[0], temp[1], temp[2], temp[3]);
      this.ctx.fillStyle="white"
      this.ctx.fillRect(temp[0]+2, temp[1]+2, temp[2]-4, temp[3]-4);
      this.ctx.font="10px Arial"
      this.ctx.fillStyle = "black";
      this.ctx.textAlign= "center";
      this.ctx.fillText(temp[4], temp[0]+temp[2]/2, temp[1]+temp[3]/2);
    }

    // for circle
    for (i in this.state.circle){
      temp= this.state.circle[i]
      this.ctx.beginPath();
      this.ctx.arc(temp[0], temp[1], temp[2], 0, 2*Math.PI)
      this.ctx.fillStyle= "black";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(temp[0], temp[1], temp[2]-2, 0, 2*Math.PI)
      this.ctx.fillStyle= "white";
      this.ctx.fill();
      this.ctx.font="10px Arial"
      this.ctx.fillStyle = "black";
      this.ctx.textAlign= "center";
      this.ctx.fillText(temp[3], temp[0], temp[1]);
    }

    // for triangle
    for (i in this.state.triangle){
      temp= this.state.triangle[i]

      this.ctx.beginPath();
      this.ctx.moveTo(temp[0],temp[1])
      this.ctx.lineTo(temp[2], temp[3])
      this.ctx.lineTo(temp[4], temp[5])
      this.ctx.closePath();
      this.ctx.fillStyle= "white";
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(temp[0],temp[1])
      this.ctx.lineTo(temp[2], temp[3])
      this.ctx.lineTo(temp[4], temp[5])
      this.ctx.closePath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle="black";
      this.ctx.stroke();

      this.ctx.font="10px Arial"
      this.ctx.fillStyle = "black";
      this.ctx.textAlign= "center";
      this.ctx.fillText(temp[6], (temp[0]+temp[2]+temp[4])/3, (temp[1]+temp[3]+temp[5])/3);
    }

    // for line
    for (i in this.state.line){
      temp= this.state.line[i]
      this.ctx.moveTo(temp[0],temp[1]);
      this.ctx.lineTo(temp[2],temp[3]);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle="black";
      this.ctx.stroke();
    }
  }

  mouseMove(e){
    if(this.isMouseDown){
      this.moveResize(e)
    }
    else 
      this.whereInFigure(e);
    this.forceUpdate();
  }

  whereInFigure(e){
    // finds point lies on which figure, is to move/resize
    const [x,y]= this.getCursorPosition(e);
    this.error= 10;

    // onLine
    var l, i;
    for(i=0; i<this.state.line.length; i++){
      l= this.state.line[i];
      // distance b/w three points should equivalate
      const distDiff= -Math.sqrt((l[2]-l[0])*(l[2]-l[0]) + (l[3]-l[1])*(l[3]-l[1])) +
                      Math.sqrt((x-l[0])*(x-l[0]) + (y-l[1])*(y-l[1])) +
                      Math.sqrt((x-l[2])*(x-l[2]) + (y-l[3])*(y-l[3]));

      if( distDiff < 2 ){
        // check if its end of line for resizing
        if(x < l[0]+5 && x > l[0]-5 && y < l[1]+5 && y > l[1]-5){
          this.cursorType= "resize";
          // return "resize","line", index, vertex;
          return ["resize","line", i, 0];
        }
       else if(x < l[2]+5 && x > l[2]-5 && y < l[3]+5 && y > l[3]-5){
          this.cursorType= "resize";
          return ["resize","line", i, 2];
        }
        else {
          this.cursorType= "move";
          return ["move","line", i, x, y];
        }
      }
    }

    // in triangle
    var v;
    for(i=0; i<this.state.triangle.length; i++){
      v= this.state.triangle[i];
      // make 3 triangles from, if their cummulative area is same as original tirangles are
      var cumArea, totalArea;
      cumArea= this.areaTriangle([x, y, v[0], v[1], v[2], v[3]]) +
              this.areaTriangle([x, y, v[0], v[1], v[4], v[5]]) +
              this.areaTriangle([x, y, v[4], v[5], v[2], v[3]]);
      totalArea= this.areaTriangle(v);

      if(cumArea< totalArea+this.error && cumArea> totalArea-this.error){
        // if vertex(resize) or area(move)
        if(x < v[0]+this.error && x > v[0]-this.error && 
          y < v[1]+this.error && y > v[1]-this.error){
          this.cursorType= "resize";
          // return "resize","triangle", index, vertex;
          return ["resize","triangle", i, 0];
        }
        else if(x < v[2]+this.error && x > v[2]-this.error && 
          y < v[3]+this.error && y > v[3]-this.error){
          this.cursorType= "resize";
          return ["resize","triangle", i, 2];
        }
        else if(x < v[4]+this.error && x > v[4]-this.error && 
          y < v[5]+this.error && y > v[5]-this.error){
          this.cursorType= "resize";
          return ["resize","triangle", i, 4];
        }
        else {
          this.cursorType= "move";
          return ["move","triangle", i, x, y];
        }
      }
    }

    // in circle
    var c;
    for(i=0; i<this.state.circle.length; i++){
      c= this.state.circle[i];
      // Compare radius of circle with distance of its center from given point
      var dist= (x-c[0])*(x-c[0]) + (y-c[1])*(y-c[1])
      if(c[2]*c[2] > dist-this.error*this.error){
        // on circumference or inside
        if(c[2]*c[2] < dist+this.error*this.error){
          this.cursorType= "resize";
          return ["resize","circle", i];
        }
        else{
          this.cursorType= "move";
          return ["move","circle", i, x, y];
        }
      }
    }

    // in rectangle
    var r;
    for(i=0; i<this.state.rectangle.length; i++){
      r= this.state.rectangle[i];
      if(x > r[0]-2 && x < r[0]+r[2]+2 && y > r[1]-2 && y < r[1]+r[3]+2){
        if(x < r[0]+2){
          this.cursorType= "resize";
          return ["resize","rectangle", i, 0];
        }
        else if(x > r[0]+r[2]-2){
          this.cursorType= "resize";
          return ["resize","rectangle", i, 2];
        }
        else if(y < r[1]+2){
          this.cursorType= "resize";
          return ["resize","rectangle", i, 1];
        }
        else if(y > r[1]+r[3]-2){
          this.cursorType= "resize";
          return ["resize","rectangle", i, 3];
        }
        else {
          this.cursorType= "move";
          return ["move","rectangle", i, x, y];
        }
      }
    }

    this.cursorType= null;
  }

  areaTriangle(v){
    // finds area of triangle
    // ((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2)
    return Math.abs((v[0]*(v[3]-v[5]) + v[2]*(v[5]-v[1]) + v[4]*(v[1]-v[3]) )/ 2);
  }

  mouseDown(e){
    if(this.isMouseDown) return;
    this.isMouseDown=1;
    this.toChangeAttribute= this.whereInFigure(e);
    if(this.toChangeAttribute && this.toChangeAttribute[0] === "move") {
      this.cursorType= "grab";
    }
    // this.moveResize(e);
    this.forceUpdate();
  }

  mouseUp(e){
    this.isMouseDown= 0;
    this.cursorType= null;
    this.forceUpdate();
  }

  moveResize(e){
    // moves and resize element selected in toChangeAttribute
    const [x, y]= this.getCursorPosition(e);
    const elm= this.toChangeAttribute;

    this.mouseDown(e)

    if(!elm){
      return ;
    }

    var copy_state = this.state

    // check if resize/move/nothing
    if(elm[0] === "resize"){
      if(elm[1] === "line"){
        copy_state.line[elm[2]][elm[3]]= x;
        copy_state.line[elm[2]][elm[3]+1]= y;
      }
      else if(elm[1] === "triangle"){
        copy_state.triangle[elm[2]][elm[3]]= x;
        copy_state.triangle[elm[2]][elm[3]+1]= y;
      }
      else if(elm[1] === "circle"){
        // find distance from center and set as radius
        copy_state.circle[elm[2]][2] = 
                Math.sqrt(Math.pow(x-this.state.circle[elm[2]][0]) + 
                Math.pow(y-this.state.circle[elm[2]][1]));
      }
      else{
        if(elm[3]=== 0){
          copy_state.rectangle[elm[2]][2] += this.state.rectangle[elm[2]][0]-x;
          copy_state.rectangle[elm[2]][elm[3]] = x;
        }
        else if(elm[3]=== 1){
          copy_state.rectangle[elm[2]][3] += this.state.rectangle[elm[2]][1]-y;
          copy_state.rectangle[elm[2]][elm[3]] = y;
        }
        else if(elm[3]=== 2){
          copy_state.rectangle[elm[2]][elm[3]] = x- this.state.rectangle[elm[2]][0];
        }
        else if(elm[3]=== 3){
          copy_state.rectangle[elm[2]][elm[3]] = y- this.state.rectangle[elm[2]][1];
        }
      }
    }

    else{
      // get relative position shift and shift params acc.
      // 3 & 4 are origin index
      const deltaX = x- elm[3];
      const deltaY = y- elm[4];

      if(elm[1] === "line"){
        copy_state.line[elm[2]][0]+= deltaX;
        copy_state.line[elm[2]][1]+= deltaY;
        copy_state.line[elm[2]][2]+= deltaX;
        copy_state.line[elm[2]][3]+= deltaY;
      }
      else if(elm[1] === "triangle"){
        copy_state.triangle[elm[2]][0]+= deltaX;
        copy_state.triangle[elm[2]][1]+= deltaY;
        copy_state.triangle[elm[2]][2]+= deltaX;
        copy_state.triangle[elm[2]][3]+= deltaY;
        copy_state.triangle[elm[2]][4]+= deltaX;
        copy_state.triangle[elm[2]][5]+= deltaY;
      }
      else if(elm[1] === "circle"){
        // find distance from center and set as radius
        copy_state.circle[elm[2]][0] += deltaX;
        copy_state.circle[elm[2]][1] += deltaY;
      }
      else{
        copy_state.rectangle[elm[2]][0] += deltaX;
        copy_state.rectangle[elm[2]][1] += deltaY;
      }
      this.toChangeAttribute[3]= x;
      this.toChangeAttribute[4]= y;
    }

    this.setState({
      ...copy_state
    })
  }

  getCursorPosition(e){
    const {top, left, width, height}= this.canvas.getBoundingClientRect();

    var mouseX= e.clientX - left;
    var mouseY= e.clientY - top;
    // console.log(e.clientX, e.pageX, e.screenX)
    // console.log(e.clientY, e.pageY, e.screenY)

    // console.log(width, this.canvas.width)
    // console.log(height, this.canvas.height)
    // mouseX /= width;
    // mouseY /= height;

    // mouseX *= this.canvas.width;
    // mouseY *= this.canvas.height;
    return [mouseX-3, mouseY-2];
  }

  onDragOver(e){
    e.preventDefault();
  }

  onDrop(e){
    const [x, y] = this.getCursorPosition(e)
    let id= e.dataTransfer.getData('id');
    var copy_state= this.state;
    if(id==="rectangle"){
      copy_state.rectangle.push([x-25,y-25,60,60, ""])
    }
    else if(id==="circle"){
      copy_state.circle.push([x,y,30, ""])
    }
    else if(id==="triangle"){
      copy_state.triangle.push([x,y-25,x-25,y+25,x+25,y+25,""])
    }
    else if(id==="line"){
      copy_state.line.push([x-30, y-30, x+30, y+30])
    }
    else 
      console.log("error onDrop");
    this.setState({...copy_state})
  }

  onDoubleClick(e){
    // edits the text inside the figure element
    const temp= this.whereInFigure(e);
    if(!temp) return;
    const textRef= this.state[temp[1]][temp[2]]
    const text= textRef[textRef.length -1];
    console.log(text);
    if(temp[0]==="move"){
      var newText= prompt("Enter the text",text);
      if(!newText) return;
      var copy_state= this.state;
      copy_state[temp[1]][temp[2]][textRef.length -1]= newText;

      this.setState({copy_state})
    }
  }

  render() {
    return (
      <div className='Canvas'>
        <canvas
            className={"canvas "+ this.cursorType} 
            ref= {canvas=>{this.canvasRef= canvas}}
            width= {"1200px"}
            height= {"550px"}
            onDragOver={e=>this.onDragOver(e)}
            onDrop={e=>this.onDrop(e)}
            onMouseDown={this.mouseDown}
            onMouseMove={this.mouseMove}
            onMouseUp={this.mouseUp}
            onDoubleClick={this.onDoubleClick}
        > Your browser doesnot support canvas. </canvas>
      </div>
    );
  }
}

const mapStateToProps= (state)=>{
  const files= state.files;
  console.log(files);
  return {files}
}

const mapDispatchToProps= (dispatch)=>{
  return {
    clearAll: ()=>dispatch(clearAll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);

// using ref to access in react, if it would've been plain js 
// document.getElementById("canvas")
import React from 'react';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state={}

  }

  onDragStart(e,id){
    console.log('dragstart: ',id);
    e.dataTransfer.setData("id",id);
    
  }

  componentDidMount(){
    const rectCanvas = this.refs.rectRef;
    const rectCtx = rectCanvas.getContext("2d");
    rectCtx.beginPath();
    rectCtx.fillStyle= "black";
    rectCtx.fillRect(20, 20, 60, 60);
    rectCtx.fillStyle= "white";
    rectCtx.fillRect(20+2, 20+2, 60-4, 60-4);


    const triCanvas = this.refs.triRef;
    const triCtx = triCanvas.getContext("2d");
    triCtx.beginPath();
    triCtx.moveTo(50, 25);
    triCtx.lineTo(75, 75);
    triCtx.lineTo(25, 75);
    triCtx.closePath();
    triCtx.fillStyle= "white";
    triCtx.fill();

    triCtx.beginPath();
    triCtx.moveTo(50, 25);
    triCtx.lineTo(75, 75);
    triCtx.lineTo(25, 75);
    triCtx.closePath();
    triCtx.lineWidth= 2;
    triCtx.strokeStyle= "black";
    triCtx.stroke();


    const circleCanvas = this.refs.circleRef;
    const circleCtx = circleCanvas.getContext("2d");
    circleCtx.beginPath();
    circleCtx.arc(50, 50, 25, 0, 2*Math.PI)
    circleCtx.fillStyle= "black";
    circleCtx.fill();
    circleCtx.beginPath();
    circleCtx.arc(50, 50, 25-2, 0, 2*Math.PI)
    circleCtx.fillStyle= "white";
    circleCtx.fill();


    const lineCanvas = this.refs.lineRef;
    const lineCtx = lineCanvas.getContext("2d");
    lineCtx.beginPath();
    lineCtx.moveTo(25, 25);
    lineCtx.lineTo(75, 75);
    lineCtx.lineWidth= 2;
    lineCtx.strokeStyle= "black";
    lineCtx.stroke();

  }


  render() {
    return (
      <div className='Sidebar'>
        <div className="Rectangle">
          <canvas
              draggable
              onDragStart= {e=> this.onDragStart(e, "rectangle")}
              ref= "rectRef"
              width= {"100px"}
              height= {"100px"}
          > 
            Your browser doesnot support canvas. 
          </canvas>
        </div>
        <div className="Triangle">
          <canvas
              draggable
              onDragStart= {e=> this.onDragStart(e, "triangle")}
              ref= "triRef"
              width= {"100px"}
              height= {"100px"}
          > 
            Your browser doesnot support canvas. 
          </canvas>
        </div>
        <div className="Circle">
          <canvas
              draggable
              onDragStart= {e=> this.onDragStart(e, "circle")}
              ref= "circleRef"
              width= {"100px"}
              height= {"100px"}
          > 
            Your browser doesnot support canvas. 
          </canvas>
        </div>
        <div className="Line">
          <canvas
              draggable
              onDragStart= {e=> this.onDragStart(e, "line")}
              ref= "lineRef"
              width= {"100px"}
              height= {"100px"}
          > 
            Your browser doesnot support canvas. 
          </canvas>
        </div>
      </div>
    );
  }
}

export default Sidebar;
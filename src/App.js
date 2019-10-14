import React, { Component }from 'react';
import ReactDOM from 'react-dom';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import {fabric} from 'fabric';
import logo from './logo.svg';
import golden from './goldencircle.png';
import vpc from './vpc.png';
import './App.css';
import imgpointer from './cursor.svg';
import txticon from './text.png';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
const queryString = require('query-string');
const socket = socketIOClient("localhost:4001");
    const idgolden = "golden";
    const idvpc = "vpc";
let cur = {};

var fcanvas = new fabric.Canvas('canvas');
//let canvas = document.getElementById("canvas");
class App extends Component {

  handleOpen = () => {
    this.setState({
      setOpen:true
    });
  };

  handleClose = () => {
    this.setState({
      setOpen:false
    });
  };
  constructor(props) {
    super(props);
    this.state = {
      styles : {display:"none"},
      classpoint : "hide",
      x: 0,
      y: 0,
      j:0,
      xobj : 100,
      yobj:100,
      endpoint:"localhost:4001",
      color: 'white',
      pointers:{},
      c:{},
       setOpen : false,
     };

  }

  send = () => {
    socket.emit('change color', this.state.color) // change 'red' to this.state.color
  }

 _onMouseMove(e) {
  this.setState({
    x:e.nativeEvent.offsetX,
    y:e.nativeEvent.offsetY,
    styles:{
    position:"absolute",
    top:this.state.y,
    left:this.state.x},
    classpoint : "mouse pointer  icon",
    projectid:"",

  })
  socket.emit("mousemove",{
    x:this.state.x,
    y:this.state.y
  });
 }


 _addImagetoCanvas = (image) => {
     var images = document.getElementById(image);
     console.log(fcanvas);
     var fcanvas = new fabric.Canvas('canvas');
     var imgInstance = new fabric.Image(images,{
       left: 100,
       top: 100,
     });
     fcanvas.add(imgInstance);
      console.log(image);
      //ctx.drawImage(images, this.state.xobj, this.state.yobj);
      this.setState({
        setOpen:false,
      });
      console.log(image);
 };


  componentDidMount(){


    const canvast = document.getElementById("canvas");
    canvast.width = window.innerWidth;     // equals window dimension
    canvast.height = window.innerHeight;
    //console.log(window.location.search);
    const parsed = queryString.parse(window.location.search);
    var url = 'http://localhost:8000/api/member/'+parsed.id+'/'+parsed.userid;

    axios.get(url)
    .then(response=> {
      // handle success
      const data = response.data;
      cur = data;
      const curs = cur.map(data=><i id={data.user_id} class="hidden">{data.name}</i>);
      ReactDOM.render(curs, document.getElementById("cursor"));
      //console.log(cur);
    });

    socket.emit("join_project",parsed);
  const curso = [];
  //console.log(this.state.c);
    socket.on("moving",function(data){
          var i = data.project.userid;
          curso[i] = document.getElementById(data.project.userid);
          curso[i].setAttribute("class","mouse pointer  icon");
          curso[i].setAttribute("style","position:absolute;display:grid;top:"+data.data.y+"px"+";left:"+data.data.x+"px")
    });

  }
  render(){
    return (
    <div className="App">
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="modal"
      open={this.state.setOpen}
      onClose={this.handleClose}
      closeAfterTransition
    >
      <Fade in={this.state.setOpen}>
        <div className="paper">
          <div class="templatelist ui medium bordered">
            <img class="ui medium  image" src={golden} id="golden" />
            <button class="ui primary button" onClick={this._addImagetoCanvas.bind(this, idgolden)}>add</button>
          </div>
          <div class="templatelist ui medium bordered">
            <img class="ui medium  image" src={vpc} id="vpc"/>
            <button class="ui primary button" onClick={this._addImagetoCanvas.bind(this, idvpc)}>add</button>
          </div>
        </div>
      </Fade>
    </Modal>
      <header className="App-header">
        <img src="http://catalist.space/assets/images/catalist_logo_full.png" className="App-logo" alt="logo" />
        <nav>
          <a href="#">Project Name</a>
          <a href="#">Save</a>
        </nav>
      </header>
      <div class="stationary">
        <a title="Cursors"> <i class="mouse pointer large icon"></i> </a>
        <a title="Text"> <i class="font large icon"></i> </a>
        <a title="Template" onClick={this.handleOpen}> <i class=" table large icon"></i> </a>
        <a title="Sticky Note"> <i class="sticky note outline large icon"></i></a>
        <a title="Connection"> <i class="exchange large icon"></i></a>
        <a title="Pencil"> <i class="pencil alternate large icon"></i></a>
        <a title="Comment"><i class="comment alternate outline large icon"></i></a>
        <a title="Frame"><i class="expand large icon"></i></a>
        <a title="Upload"><i class="upload large icon"></i></a>
      </div>
      <div class="stationary-down">
        <a title="Chat"> <i class="comments outline large icon"></i> </a>
        <a title="Camera"> <i class="camera large icon"></i> </a>
        <a title="Bolt"> <i class=" bolt large icon"></i> </a>
      </div>
      <div id="cursor" >

      </div>
      <canvas id="canvas" className="canvas" onMouseMove={this._onMouseMove.bind(this)}>

      </canvas>
    </div>
  );
}
}
// const Tab = ({ name }) => {
//   return (
//     <i className="mouse pointer  icon" style={top:{y},left:{x},position:"absolute"}>
//       { name }
//     </i>
//   );
// }
export default App;

import React, { Component }from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import imgpointer from './cursor.svg';
import txticon from './text.png';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
const queryString = require('query-string');
const socket = socketIOClient("localhost:4001");
let cur = {};

const that = this;
//let canvas = document.getElementById("canvas");
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      styles : {display:"none"},
      classpoint : "hide",
      x: 0,
      y: 0,
      endpoint:"localhost:4001",
      color: 'white',
      pointers:{},
      c:{},
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


  componentDidMount(){

    console.log(window.location.search);
    const parsed = queryString.parse(window.location.search);
    var url = 'http://localhost:8000/api/member/'+parsed.id+'/'+parsed.userid;
    console.log(url);
    axios.get(url)
    .then(response=> {
      // handle success
      const data = response.data;
      cur = data;
      // this.setState(
      //   {c:data}
      // );
      const curs = cur.map(data=><i id={data.user_id} class="hidden">{data.name}</i>);
      ReactDOM.render(curs, document.getElementById("cursor"));
      console.log(cur);
    });
    console.log(cur);
    socket.emit("join_project",parsed);

  // socket.on("ready",function(project){
  //   const users = array.map((user)=>
  //     <i id={user.userid}></i>
  //   );
  //
  // })
  const curso = [];
  console.log(this.state.c);
    socket.on("moving",function(data){
        //this.setState({ top: data.data.x, left: data.data.y });
      // cursors.style.left = this.state.x;
      // cursors.style.top = this.state.y;
       // console.log(data);

          var i = data.project.userid;
          curso[i] = document.getElementById(data.project.userid);
          curso[i].setAttribute("class","mouse pointer  icon");
          curso[i].setAttribute("style","position:absolute;display:grid;top:"+data.data.y+"px"+";left:"+data.data.x+"px")

    });

  }
  render(){
    return (
    <div className="App">
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
        <a title="Template"> <i class=" table large icon"></i> </a>
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

import io from 'socket.io-client'
import settings from './settings.js'
const CHAT={
  msgObj:document.getElementsByClassName("body-wrapper")[0],
  username:null,
  socket:null,
  msgArr:[],

  //提交聊天消息内容
  submit:function(obj){
    this.socket.emit('sendMsg', obj);
  },
  message: function(username) {
    console.log('message')
      this.socket.on('to' + username, function(obj) {
        CHAT.msgArr.push(obj)
        console.log('CHAT.msgArr', obj)
      })
  },
  init:function(username){
    //连接websocket后端服务器
    this.socket = io.connect(settings.socket,{'force new connection': true})
    this.socket.on('open', function() {
      console.log('已连接')
    })
    this.socket.emit('addUser', username)

  },

  socketPing:function(socket){
      this.socket.on('reconnect_failed', function(data){
          console.log(data);
          createUser(data);
      })
  },
  socketPong:function(socket){
      this.socket.on('reconnect', function(data){
          console.log(data);
          bindUser(data);
      })
  }
}
export default CHAT

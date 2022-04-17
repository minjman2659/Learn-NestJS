const socket = io('/chats'); // 괄호안의 내용은 namespace : 서버의 라우팅과 비슷하다고 보면 됨!

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  // socket.on 데이터 이후 socket.emit 의 콜백 함수가 실행됨
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (resData) => {
    console.log(resData);
  });
  socket.on('hello_user', (data) => {
    console.log(data);
  });
}

function init() {
  helloUser();
}

init();

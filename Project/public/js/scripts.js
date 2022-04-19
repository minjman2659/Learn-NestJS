const socket = io('/chats'); // 괄호안의 내용은 namespace : 서버의 라우팅과 비슷하다고 보면 됨!

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//* draw functions
const drawHelloStranger = (username) => {
  helloStrangerElement.innerText = `Hello ${username}`;
};

const drawChat = (chat, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${chat}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${chat}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

//* global socket handler
socket.on('user_connected', (username) => {
  drawChat(`${username} Come In!`);
});

socket.on('new_chat', (data) => {
  const { chat, username } = data;
  drawChat(`${username}: ${chat}`);
});

socket.on('disconnected_user', (username) => {
  drawChat(`${username} Come Out...`);
});

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawChat(`me: ${inputValue}`, true);
    event.target.elements[0].value = '';
  }
};

function helloUser() {
  // socket.on 데이터 이후 socket.emit 의 콜백 함수가 실행됨
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
  //* 이벤트 연결
  formElement.addEventListener('submit', handleSubmit);
}

init();

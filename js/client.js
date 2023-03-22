const socket = io('https://gupshup-chat-server.onrender.com')  // add server

// getting Form by Id
const form = document.getElementById('send-container')

// getting input field of Form by id
const messageInput = document.getElementById('messageInp')

// getting message container(div) by querySelector
const messageContainer = document.querySelector('.container')

// Audio that will play on receiving message
var audio = new Audio('notification.mp3')

// creating a method to append the info of joiner in the message container
const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    if(position == 'left'){
        audio.play()
    }
}


// Ask to enter new joiner name 
const newJoiner = prompt("Enter your name to join")

// firing an event by getting 'new-user-joined' from server by passing new joiner name as callback to the server 
// Basically If a new user join, let the server Know
socket.emit('new-user-joined', newJoiner)


// append the name of joiner into the div container (message container) 
// Basically If a new user join, receive his/her name form the server
socket.on('user-joined', name => {
    // calling append method
    append(`${name} joined the chat`, 'right')        // right -> You
})

// append the receive message of receiver   
// Basically If server sends a message, receive it 
socket.on('receive', data => {
    // calling append method
    append(`${data.name}: ${data.message}`, 'left')     // left -> reciever
})

// If a user leave the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})

// if the form gets submitted, send server the message (by creatig a form event listener)
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = messageInput.value
    append(`You: ${message}`, 'right')
    socket.emit('send', message)
    messageInput.value = ""
})
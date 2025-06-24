const socket = io.connect('http://localhost:1250');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

const user = getUserInformation(); // Implement this function according to your login mechanism

submitBtn.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value
    });
    message.value = '';
});

socket.on('chat', data => {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + ': </strong>' + data.message + '</p>';
});

socket.on('typing', data => {
    feedback.innerHTML = '<i>' + data + ' yazıyor...</i>';
});

const chatBox = document.querySelector('.chat-box');
let userMessages = [];
let assistantMessages = [];
let myDateTime = ''

function start() {
    const date = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    if (date === '') {
        alert('생년월일을 입력해주세요.');
        return;
    }
    myDateTime = date + hour;

    document.getElementById("intro").style.display = "none";
    document.getElementById("chat").style.display = "block";
}

const sendMessage = async (message) => {
    const chatInput = document.querySelector('.chat-input input');
    const chatMessage = document.createElement('div');
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'block'; // show loading overlay

    if(typeof message === "string") {
        chatMessage.classList.add('chat-message');
        chatMessage.innerHTML = `
            <p>${message}</p>
        `;
        chatBox.appendChild(chatMessage);
        userMessages.push(message);
    } else {
        chatMessage.classList.add('chat-message');
        chatMessage.innerHTML = `
            <p>${chatInput.value}</p>
        `;
        chatBox.appendChild(chatMessage);
        userMessages.push(chatInput.value);
        chatInput.value = '';
    }

    const response = await fetch('http://localhost:3000/fortuneTell', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            myDateTime: myDateTime,
            userMessages: userMessages,
            assistantMessages: assistantMessages,
        })
    });

    loadingOverlay.style.display = 'none'; // hide loading overlay
    const data = await response.json();
    assistantMessages.push(data.assistant);
    const astrologerMessage = document.createElement('div');
    astrologerMessage.classList.add('chat-message');
    astrologerMessage.innerHTML = `
        <p class='assistant'>${data.assistant}</p>
    `;
    chatBox.appendChild(astrologerMessage);
};

document.querySelector('.chat-input button').addEventListener('click', sendMessage);

// start recognition on button click
document.querySelector('.voice').addEventListener('click', () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // create new speech recognition object
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
    
        // set recognition parameters
        recognition.lang = 'ko';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    
        // when speech is recognized, do something with it
        recognition.onresult = event => {
            const transcript = event.results[0][0].transcript;
        
            // speak the recognized text back
            const speech = new SpeechSynthesisUtterance();
            speech.lang = 'ko';
            speech.text = transcript;
            window.speechSynthesis.speak(speech);
            sendMessage(transcript);
        }

        recognition.start();
    } else {
        alert('음성 인식을 지원하지 않는 브라우저입니다.');
    }

});


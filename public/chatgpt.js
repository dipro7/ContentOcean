document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Function to handle sending messages
    const sendMessage = async () => {
        const message = userInput.value;

        if (message.trim() === '') return;

        appendMessage('User', message);
        userInput.value = '';

        // Display the "Generating..." message
        const generatingMessageElement = document.createElement('div');
        generatingMessageElement.classList.add('message', 'bot-message', 'generating');
        generatingMessageElement.innerHTML = '<strong>ContentOcean:</strong> Generating...';
        chatBox.appendChild(generatingMessageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Remove the "Generating..." message
            chatBox.removeChild(generatingMessageElement);

            // Append the actual response message
            appendMessage('ContentOcean', data.response);
        } catch (error) {
            chatBox.removeChild(generatingMessageElement);
            appendMessage('ContentOcean', 'Error: Could not get a response.');
            console.error('Error:', error);
        }
    };

    // Send message when the send button is clicked
    sendButton.addEventListener('click', sendMessage);

    // Send message when the Enter key is pressed
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent a new line from being added
            sendMessage();
        }
    });

    // Function to format and append messages to the chat box
    function formatMessage(message) {
        return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'User' ? 'user-message' : 'bot-message');
        messageElement.innerHTML = formatMessage(message);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

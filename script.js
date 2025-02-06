let timeLeft = 90; // Total time: 30 seconds per question * 3 questions
let timerInterval;
let currentQuestionIndex = 0;
let score = 0;

let questions = [
    {
        question: "What is the capital of India?",
        options: ["Bangalore", "Delhi", "Mumbai", "Mysore"],
        correct: "Delhi"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: "Mars"
    },
    {
        question: "What is 5 + 3?",
        options: ["5", "8", "10", "3"],
        correct: "8"
    },
    {
        question: "The number of objects in a Web page which consists of 4 jpeg images and HTML text is ________?",
        options: ["4", "8", "10", "23"],
        correct: "4"
    },
    {
        question: "The time taken by a packet to travel from client to server and then back to the client is called __________?",
        options: ["STT", "RTT", "PTT", "JTT"],
        correct: "RTT"
    }
];

function startQuiz() {
    // Hide start button, show quiz container
    document.querySelector("button").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("submit-button").style.display = "none";
    loadQuestion();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("time").textContent = timeLeft;
        } else {
            clearInterval(timerInterval);
            alert("Time's up!");
            showResult();
        }
    }, 1000);
}

function loadQuestion() {
    let question = questions[currentQuestionIndex];
    document.getElementById("question-container").innerHTML = `<h2>${question.question}</h2>`;
    let optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    question.options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    let correctAnswer = questions[currentQuestionIndex].correct;
    if (selectedOption === correctAnswer) {
        score++; // Increment score if the answer is correct
    }
    document.getElementById("next-button").style.display = "block"; // Show next button after answering
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        document.getElementById("next-button").style.display = "none"; // Hide next button until next question
    } else {
        clearInterval(timerInterval);  // Stop the timer
        document.getElementById("next-button").style.display = "none"; // Hide the next button on last question
        document.getElementById("submit-button").style.display = "block"; // Show submit button on last question
    }
}

function showResult() {
    alert(`Quiz finished! Your score: ${score} out of ${questions.length}`);
    resetQuiz();
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quiz-container").style.display = "none"; // Hide quiz container
    document.querySelector("button").style.display = "inline-block"; // Show start button
    document.getElementById("next-button").style.display = "none"; // Hide next button
    document.getElementById("submit-button").style.display = "none"; // Hide submit button
    document.getElementById("time").textContent = timeLeft = 90; // Reset timer
}

// Chatbot Function
async function chatWithGPT(userMessage) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY" // Replace with your API key
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    });

    const data = await response.json();
    if (data.error) {
        console.error("Error from GPT-3:", data.error.message);
        return "Sorry, there was an error processing your request.";
    }

    if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
    } else {
        return "Sorry, I couldn't understand that.";
    }
}

// Function to handle 'Enter' key press for chatbot
async function handleKeyPress(event) {
    if (event.key === "Enter") {
        let userInput = document.getElementById("user-input").value;
        if (userInput.trim() === "") return;

        let chatWindow = document.getElementById("chat-window");
        chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
        document.getElementById("user-input").value = ""; // Clear the input box

        try {
            let botResponse = await chatWithGPT(userInput);
            chatWindow.innerHTML += `<p><strong>Bot:</strong> ${botResponse}</p>`;
        } catch (error) {
            console.error("Error in getting chatbot response:", error);
            chatWindow.innerHTML += `<p><strong>Bot:</strong> Sorry, there was an error.</p>`;
        }

        // Scroll chat window to the bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}





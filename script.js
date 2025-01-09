// Global variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeRemaining = 55;  // Timer set to 55 seconds
let questions = [];
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Categories with 10 questions each
const categories = {
    general: [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: "Paris" },
        { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], correctAnswer: "Da Vinci" },
        { question: "Which ocean is the largest?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correctAnswer: "Pacific" },
        { question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Austen"], correctAnswer: "Shakespeare" },
        { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correctAnswer: "100°C" },
        { question: "Who is known as the father of computers?", options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"], correctAnswer: "Charles Babbage" },
        { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Pb", "Fe"], correctAnswer: "Au" },
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: "Jupiter" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Garlic"], correctAnswer: "Avocado" },
        { question: "Which continent is the Sahara Desert located on?", options: ["Africa", "Asia", "Australia", "North America"], correctAnswer: "Africa" }
    ],
    science: [
        { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "H2"], correctAnswer: "H2O" },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"], correctAnswer: "Mitochondria" },
        { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Marie Curie"], correctAnswer: "Albert Einstein" },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], correctAnswer: "Mars" },
        { question: "What is the smallest unit of matter?", options: ["Atom", "Molecule", "Electron", "Neutron"], correctAnswer: "Atom" },
        { question: "What is the symbol for the element oxygen?", options: ["O", "Ox", "O2", "O3"], correctAnswer: "O" },
        { question: "What is the chemical formula for methane?", options: ["CH4", "C2H6", "C2H4", "CH3"], correctAnswer: "CH4" },
        { question: "What is the most common element in the Earth's crust?", options: ["Oxygen", "Silicon", "Iron", "Carbon"], correctAnswer: "Oxygen" },
        { question: "What is the process by which plants make their own food?", options: ["Photosynthesis", "Respiration", "Digestion", "Transpiration"], correctAnswer: "Photosynthesis" },
        { question: "What is the chemical formula for salt?", options: ["NaCl", "H2O", "CO2", "C6H12O6"], correctAnswer: "NaCl" }
    ],
    history: [
        { question: "Who was the first President of the United States?", options: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "Franklin Roosevelt"], correctAnswer: "George Washington" },
        { question: "In what year did World War I begin?", options: ["1912", "1914", "1916", "1920"], correctAnswer: "1914" },
        { question: "Which ancient civilization built the pyramids?", options: ["Mayan", "Egyptian", "Greek", "Roman"], correctAnswer: "Egyptian" },
        { question: "Who discovered America in 1492?", options: ["Christopher Columbus", "Ferdinand Magellan", "Marco Polo", "Vasco da Gama"], correctAnswer: "Christopher Columbus" },
        { question: "Who was the leader of the Soviet Union during World War II?", options: ["Joseph Stalin", "Vladimir Lenin", "Nikita Khrushchev", "Leon Trotsky"], correctAnswer: "Joseph Stalin" },
        { question: "In which year did the Titanic sink?", options: ["1912", "1915", "1920", "1925"], correctAnswer: "1912" },
        { question: "Who was the first man to walk on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], correctAnswer: "Neil Armstrong" },
        { question: "Which war was fought between the North and South in the United States?", options: ["The Civil War", "The Revolutionary War", "The War of 1812", "World War II"], correctAnswer: "The Civil War" },
        { question: "Who was the first Emperor of China?", options: ["Qin Shi Huang", "Emperor Wu", "Emperor Gaozu", "Emperor Taizong"], correctAnswer: "Qin Shi Huang" },
        { question: "Which country was ruled by Napoleon Bonaparte?", options: ["France", "Germany", "Italy", "Spain"], correctAnswer: "France" }
    ],
    geography: [
        { question: "Which is the largest country in the world?", options: ["United States", "Canada", "China", "Russia"], correctAnswer: "Russia" },
        { question: "Which continent is the Amazon rainforest located?", options: ["Asia", "Africa", "South America", "Australia"], correctAnswer: "South America" },
        { question: "Which is the longest river in the world?", options: ["Nile", "Amazon", "Yangtze", "Mississippi"], correctAnswer: "Nile" },
        { question: "Which is the highest mountain in the world?", options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"], correctAnswer: "Mount Everest" },
        { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "South Korea", "Japan", "India"], correctAnswer: "Japan" },
        { question: "Which desert is the largest in the world?", options: ["Sahara", "Gobi", "Kalahari", "Atacama"], correctAnswer: "Sahara" },
        { question: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correctAnswer: "Pacific" },
        { question: "Which city is known as the Big Apple?", options: ["Los Angeles", "New York", "Chicago", "San Francisco"], correctAnswer: "New York" },
        { question: "Which is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correctAnswer: "Vatican City" },
        { question: "Which country has the most islands?", options: ["Norway", "Sweden", "Finland", "Indonesia"], correctAnswer: "Sweden" }
    ],
};

// Start the quiz by category
function startQuiz(category) {
    questions = categories[category];
    currentQuestionIndex = 0;  // Reset the question index
    score = 0;  // Reset the score
    $('#score').text(score);  // Display the score at the start
    displayQuestion();
    $('#category-selection').hide();
    $('#quiz-container').show();
    startTimer();
}

// Timer functionality
function startTimer() {
    timeRemaining = 55;  // Set the timer to 55 seconds
    $('#timer').text(timeRemaining);
    timer = setInterval(() => {
        $('#timer').text(timeRemaining);
        if (timeRemaining === 0) {
            clearInterval(timer);
            checkAnswer(null);  // Automatically check the answer when time runs out
        }
        timeRemaining--;
    }, 1000);
}

// Stop Timer
function stopTimer() {
    clearInterval(timer);
}

// Display the current question and options
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    const questionHtml = `
        <h2>${question.question}</h2>
        <div id="options">
            ${question.options.map(option => `
                <button class="option-btn" onclick="checkAnswer('${option}')">${option}</button>
            `).join('')}
        </div>
        <div class="progress">
            <div id="progress-bar" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;
    $('#quiz-container').html(questionHtml);
    updateProgressBar();
}

// Update the progress bar as you move through the quiz
function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    $('#progress-bar').css({
        width: `${progress}%`,
        transition: 'width 0.5s ease-in-out' // Smooth floating effect
    });
}

// Check if the selected answer is correct and handle logic
function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        score++;
        $('#score').text(score);
        $('#correct-sound')[0].play();  // Play sound for correct answer
    } else {
        $('#incorrect-sound')[0].play();  // Play sound for incorrect answer
    }

    // Highlight the correct answer
    $('#options button').each(function() {
        if ($(this).text() === correctAnswer) {
            $(this).css('background-color', '#4CAF50'); // Green for correct
        }
    });

    // After selecting an answer, show the next button
    $('#next-button').show();  // Show next button after answering
}

// Handle Next Button click
$('#next-button').click(() => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;  // Proceed to the next question
        displayQuestion();  // Show next question
        $('#next-button').hide();  // Hide next button again
    } else {
        saveLeaderboard();
        showLeaderboard();
    }
});

// Show the leaderboard
function showLeaderboard() {
    $('#quiz-container').hide();
    $('#score-container').hide();
    $('#next-button').hide();
    $('#leaderboard-container').show();
    $('#leaderboard').empty();
    leaderboard.forEach((entry) => {
        $('#leaderboard').append(`<li>${entry.name}: ${entry.score}</li>`);
    });
}

// Save the leaderboard to localStorage
function saveLeaderboard() {
    const name = prompt("Enter your name to save your score:");
    if (name) {
        leaderboard.push({ name: name, score: score });
        leaderboard.sort((a, b) => b.score - a.score);  // Sort leaderboard by score
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
}

// Start Button click
$('#start-button').click(() => {
    $('#start-button').hide();
    $('#category-selection').show();
});

// Category button click to start a specific category quiz
$('.category-btn').click(function() {
    const category = $(this).data('category');
    startQuiz(category);
});

// Timer functionality
function startTimer() {
    timeRemaining = 55;  // Set the timer to 55 seconds
    $('#timer').text(timeRemaining);
    timer = setInterval(() => {
        $('#timer').text(timeRemaining);
        if (timeRemaining === 0) {
            clearInterval(timer);
            endQuiz();  // Call endQuiz function when time is up
        }
        timeRemaining--;
    }, 1000);
}

// End the quiz (when timer runs out or when all questions are answered)
function endQuiz() {
    // Stop the timer and automatically check the answer if necessary
    stopTimer();
    // Automatically move to leaderboard or save score after timer ends
    saveLeaderboard();
    showLeaderboard();
}

// Save the leaderboard to localStorage
function saveLeaderboard() {
    const name = prompt("Enter your name to save your score:");
    if (name) {
        leaderboard.push({ name: name, score: score });
        leaderboard.sort((a, b) => b.score - a.score);  // Sort leaderboard by score
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
}

// Show the leaderboard
function showLeaderboard() {
    $('#quiz-container').hide();
    $('#score-container').hide();
    $('#next-button').hide();
    $('#leaderboard-container').show();
    $('#leaderboard').empty();
    leaderboard.forEach((entry) => {
        $('#leaderboard').append(`<li>${entry.name}: ${entry.score}</li>`);
    });
}

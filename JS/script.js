const quizQuestion = document.getElementById("quizQuestion");
const choices = Array.from(document.getElementsByClassName("choiceText"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("nextButton");
const restartButton = document.getElementById("restartButton");
const progressBar = document.getElementById("progressBar");

let currentQuestion = 0;
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

const SCORE_POINTS = 10;
const MAX_QUESTIONS = 10;

// Fetching questions from the API
async function fetchQuestions() {
  try {
    // API call dynamically fetches 10 questions from the API, in case we want to change the number of questions in the future
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${MAX_QUESTIONS}&category=18&difficulty=easy&type=multiple`
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const loadedQuestions = await res.json();
    // For readability break down the code into smaller functions
    questions = formatQuestions(loadedQuestions.results);
    startGame();
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    alert("Failed to load quiz questions. Please try again later.");
  }
}

// Function to format the questions
function formatQuestions(loadedQuestions) {
  return loadedQuestions.map((loadedQuestion) => {
    const formattedQuestion = {
      question: loadedQuestion.question,
    };

    const answerChoices = [...loadedQuestion.incorrect_answers];
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
    answerChoices.splice(
      formattedQuestion.answer - 1,
      0,
      loadedQuestion.correct_answer
    );

    answerChoices.forEach((choice, index) => {
      formattedQuestion[`choice${index + 1}`] = choice;
    });

    return formattedQuestion;
  });
}

// Function to start the game
// Be consistent with your function declarations, use either function declaration or arrow functions
function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
}

// Function to get a new question
// Be consistent with your function declarations, use either function declaration or arrow functions
function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    return window.location.assign(`/result.html?score=${score}`);
  }

  questionCounter++;

  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  quizQuestion.innerText = currentQuestion.question;

  choices.forEach((choice, index) => {
    choice.innerText = currentQuestion["choice" + (index + 1)];
    choice.parentElement.classList.remove("correct", "incorrect");
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
  nextButton.disabled = true;
}

// Using Event listener for the multiple choices
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.classList[1].replace("choice", "");

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    selectedChoice.parentElement.classList.add(classToApply);

    if (classToApply === "incorrect") {
      const correctChoice = choices.find((choice) =>
        choice.classList.contains(`choice${currentQuestion.answer}`)
      );
      correctChoice.parentElement.classList.add("correct");
    }

    if (classToApply === "correct") {
      incrementScore(SCORE_POINTS);
    }

    nextButton.disabled = false;
  });
});

// Event listener for the Next button
nextButton.addEventListener("click", () => {
  getNewQuestion();
});

// Event listener for the Restart button
restartButton.addEventListener("click", () => {
  window.location.assign("/index.html");
});

// Function to increment the score
incrementScore = (num) => {
  score += num;
  // Remember to remove console.log statements
  console.log(score);
  scoreText.innerText = score;
};

fetchQuestions(); //calling the function to start the game

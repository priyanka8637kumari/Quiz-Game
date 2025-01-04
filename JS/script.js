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

// Function to fetch questions from the API
async function fetchQuestions() {
  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    );
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const loadedQuestions = await res.json();
    questions = loadedQuestions.results.map((loadedQuestion) => {
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
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    displayErrorMessage(
      "Failed to load quiz questions. Please try again later."
    );
  }
}

// Function to handle error
displayErrorMessage = (message) => {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.innerText = message;
  document.body.appendChild(errorMessage);
};

// Function to start the game
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

// Function to get a new question
getNewQuestion = () => {
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
  // nextButton.style.display = "none";
  // restartButton.style.display = "none";

};

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
    // setTimeout(() => {
    //   selectedChoice.parentElement.classList.remove(classToApply);
    //   nextButton.style.display = "block";
    //   restartButton.style.display = "block";
    //   // getNewQuestion();
    // }, 1000);
    if (classToApply === "incorrect") {
      const correctChoice = choices.find(choice => choice.classList.contains(`choice${currentQuestion.answer}`));
      correctChoice.parentElement.classList.add("correct");
    }

    // nextButton.style.display = "block"; // Show the Next button
    // restartButton.style.display = "block"; // Show the Restart button
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
  console.log(score);
  scoreText.innerText = score;
};

fetchQuestions(); //calling the function to start the game

// startGame();

// Purpose: Fetch questions from the Open Trivia DB API

// async function fetchQuestions() {
//   try {
//     const response = await fetch(
//       "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
//     );
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.log("Error fetching questions", error);
//     alert("Error fetching questions");
//   }
// }

// fetchQuestions();

import { DOMSelectors } from "./DOM";
const API = "https://opentdb.com/api.php?amount=1&type=multiple";
function shuffle(array) {
  // Fisher-Yates algorithm from w3schools.com
  let arrLength = array.length,
    t,
    i;
  while (arrLength) {
    i = Math.floor(Math.random() * arrLength--);
    t = array[arrLength];
    array[arrLength] = array[i];
    array[i] = t;
  }

  return array;
}
async function buttonCreator(arr) {
  const answerContainer = document.querySelector(".answer-container");
  for (let i = 0; i < arr.length; i++) {
    const button = document.createElement("button");
    button.id = `response${i}`;
    button.classList = "answerButton";
    button.innerHTML = `
    <p class="text">${arr[i]}</p>`;
    button.disabled = true;
    answerContainer.appendChild(button);
    setTimeout(function () {
      button.disabled = false;
    }, 6000);
  }
}
async function buttonListener(button, score, answer) {
  for (let x = 0; x < button.length; x++) {
    button[x].addEventListener("click", function (event) {
      event.preventDefault();
      if (button[x].textContent.trim() == answer) {
        score += 100;
        DOMSelectors.score.innerHTML = `${score}`;
      } else {
        score -= 100;
        DOMSelectors.score.innerHTML = `${score}`;
      }
      button.forEach((btn) => {
        btn.disabled = true;
      });
      DOMSelectors.answerTeller.innerHTML = `correct answer: ${answer}`;
      setTimeout(function () {
        createArr();
      }, 1000);
    });
  }
}
async function cardCreator(arr) {
  DOMSelectors.cardContainer.innerHTML = "";
  arr.forEach((i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h1 class="question-heading">${i.question}</h1>
      <div class="answer-container">
      </div>
      `;
    DOMSelectors.cardContainer.appendChild(card);
    const corrAnswer = i.correctAnswer;
    const choicesArray = Object.values(i.choiceContainer).filter(Boolean);
    shuffle(choicesArray);
    buttonCreator(choicesArray);
    const buttonClickable = document.querySelectorAll(".answerButton");
    const score = Number(DOMSelectors.score.innerHTML);
    buttonListener(buttonClickable, score, corrAnswer);
  });
}

async function createArr() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    console.log("response code: " + data.response_code);
    const cluebaseAPI = data.results;
    DOMSelectors.answerTeller.innerHTML = "";
    const cluebaseArr = cluebaseAPI.map((arr) => ({
      question: arr.question,
      choiceContainer: {
        response1: arr.incorrect_answers[0],
        response2: arr.incorrect_answers[1],
        response3: arr.incorrect_answers[2],
        response4: arr.correct_answer,
      },
      correctAnswer: arr.correct_answer,
    }));

    cardCreator(cluebaseArr);
    if (data.response_code != 0) {
      throw new Error(data.response_code);
    }
  } catch (error) {
    console.log(error);
    DOMSelectors.heading.innerHTML = `${error}`;
  }
}
createArr();

/* emmetapp, animate on scroll */
import { DOMSelectors } from "./DOM";
const API = "https://opentdb.com/api.php?amount=1&type=multiple";
function shuffle(array) {
  // this is also known as the Fisher-Yates shuffle
  let arrLength = array.length,
    t,
    i;
  while (arrLength) {
    // checks if array length has not been completely depleted
    i = Math.floor(Math.random() * arrLength--); // takes a random value from 1 to array length -1 (in this case, 3)
    t = array[arrLength]; // t is the arrLength indice inside the array
    array[arrLength] = array[i]; // the indice of arr length in array is equal to the indice of the random value given
    array[i] = t; // the indice of the random value is now the indice of the arrlength, basically switching them.
  }

  return array;
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
    const answerContainer = document.querySelector(".answer-container");
    const corrAnswer = i.correctAnswer;
    const choicesArray = Object.values(i.choiceContainer).filter(Boolean); // undefined is a falsy value, which would be filtered. out through boolean -- removes undefineds if there are only 3 or 2 answer choices
    shuffle(choicesArray);
    for (let i = 0; i < choicesArray.length; i++) {
      const button = document.createElement("button");
      button.id = `response${i}`;
      button.classList = "answerButton";
      button.innerHTML = `
      <p class="text">${choicesArray[i]}</p>`;
      button.disabled = true;
      answerContainer.appendChild(button);
      setTimeout(function () {
        button.disabled = false;
      }, 6000);
    }
    const buttonClickable = document.querySelectorAll(".answerButton");
    for (let x = 0; x < buttonClickable.length; x++) {
      var score = Number(DOMSelectors.score.innerHTML);
      buttonClickable[x].addEventListener("click", function (event) {
        event.preventDefault();
        if (buttonClickable[x].textContent.trim() == corrAnswer) {
          score += 100;
          DOMSelectors.score.innerHTML = `${score}`;
        } else {
          score -= 100;
          DOMSelectors.score.innerHTML = `${score}`;
        }
        buttonClickable.forEach((btn) => {
          btn.disabled = true;
        });
        DOMSelectors.answerTeller.innerHTML = `correct answer: ${corrAnswer}`;
        setTimeout(function () {
          createArr();
        }, 1000);
      });
    }
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
    console.log("uhoh");
  }
}
createArr();

// https://www.sitepoint.com/simple-javascript-quiz/

/*
const buttonClickable = document.querySelectorAll(".answerButton");
    for (let i = 0; i < buttonClickable.length; i++) {
      buttonClickable[i].addEventListener("click", function (event) {
        event.preventDefault();
        if (buttonClickable[i].textContent == i.correctAnswer) {
          Number(DOMSelectors.score.value) + 100 == DOMSelectors.score.value;
          createArr();
        }
      });
    }
    */
/*
    const randomInt = Math.floor(Math.random() * 4); //number from 1-4
    const correctButton = document.querySelector(`#response${randomInt}`);
    correctButton.classList = ""; // clears classlist so it is not ".notAnswer"
    correctButton.innerHTML = `<p class="correctAnswer">${i.correctAnswer}</p>`;
    console.log(i.choiceContainer);
    for (const choice of i.choiceContainer) {
      //iterates through choice container array
      if (choice != i.correctAnswer) {
        // check if choice is correct answer( it should not be)
        const choiceArray = []; // pushes incorrect answers into array
        choiceArray.push(choice);
        const button = document.querySelectorAll(".notAnswer"); // any buttons that have the class ".notAnswer"
        for (x = 0; x++; x < 2) {
          // 3 repeats for 3 wrong answers
          button[x].innerHTML = `<p>${choiceArray[x]}</p>`; // for every button, its html should have the corresponding wrong answer
        }
      }
    }
    */

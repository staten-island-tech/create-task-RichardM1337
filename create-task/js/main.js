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
  DOMSelectors.cardContainer.innerHTML = ""; // clear the container that holds the card
  arr.forEach((i) => {
    // for the api array
    const card = document.createElement("div"); // create a card
    card.classList.add("card"); // and add "card" to its class list
    card.innerHTML = `
      <h1 class="question-heading">${i.question}</h1>
      <div class="answer-container">
      </div>
      `; // inside the card should  be the question and the container of answers
    DOMSelectors.cardContainer.appendChild(card); // add the card to the cardContainer already in the html
    const answerContainer = document.querySelector(".answer-container"); // call the answer-container created inside the card
    const corrAnswer = i.correctAnswer; // set variable corrAnswer to the array's correct answer
    const choicesArray = Object.values(i.choiceContainer).filter(Boolean); // undefined is a falsy value, which would be filtered. out through boolean -- removes undefineds if there are only 3 or 2 answer choices -- the array should be the value of answers in the container
    shuffle(choicesArray); // shuffle using Fisher-Yates algorithm
    for (let i = 0; i < choicesArray.length; i++) {
      // iterate through choicesArray
      const button = document.createElement("button"); // create button element
      button.id = `response${i}`; // where its id is the response number -- from the iteration
      button.classList = "answerButton"; // its classlist should have answer button
      button.innerHTML = `
      <p class="text">${choicesArray[i]}</p>`; // and its HTML should have the answers, iterated to create buttons for the nuber of answers
      button.disabled = true; // disable it for now
      answerContainer.appendChild(button); // add it to the answer container
      setTimeout(function () {
        button.disabled = false;
      }, 6000); // turn on the button 6 seconds later -- this is bypassing the API request limit of once every 5 seconds
    }
    const buttonClickable = document.querySelectorAll(".answerButton"); // call the answerbuttons in an array
    for (let x = 0; x < buttonClickable.length; x++) {
      // iterate through the amount of buttons there are
      var score = Number(DOMSelectors.score.innerHTML); // give a variable to the score (intially 0)
      buttonClickable[x].addEventListener("click", function (event) {
        // every button should listen for click and
        event.preventDefault(); // don't reload
        if (buttonClickable[x].textContent.trim() == corrAnswer) {
          // check, without whitespaces, if that's the correct answqer
          score += 100; // add 100 to the score
          DOMSelectors.score.innerHTML = `${score}`; // set the HTML score variable to the score given
        } else {
          // if wrong
          score -= 100; // subtract 100 points
          DOMSelectors.score.innerHTML = `${score}`;
        }
        buttonClickable.forEach((btn) => {
          // for each button
          btn.disabled = true; // disable the button after it was clicked
        });
        DOMSelectors.answerTeller.innerHTML = `correct answer: ${corrAnswer}`; // tell the user the correct answer
        setTimeout(function () {
          createArr(); // give them time to read the correct answer and call another card after a second
        }, 1000);
      });
    }
  });
}
async function createArr() {
  // createArr function is asynced to wait for API call
  try {
    const response = await fetch(API); // wait to fetch api
    const data = await response.json(); // wait to fetch api call to json
    console.log("response code: " + data.response_code); // console.log reponse code for dev use
    const cluebaseAPI = data.results; // set results to array
    DOMSelectors.answerTeller.innerHTML = ""; // clear answerTeller html
    const cluebaseArr = cluebaseAPI.map((arr) => ({
      question: arr.question, // question = API question
      choiceContainer: {
        response1: arr.incorrect_answers[0], // responses = incorrect answers in array
        response2: arr.incorrect_answers[1],
        response3: arr.incorrect_answers[2],
        response4: arr.correct_answer, // correct answer
      },
      correctAnswer: arr.correct_answer, // also correct answer for checking purposes
    }));

    cardCreator(cluebaseArr); // create card
    if (data.response_code != 0) {
      throw new Error(data.response_code); // throws error from response code
    }
  } catch (error) {
    console.log(error); // tell dev error has occured by printing error
    DOMSelectors.heading.innerHTML = `${error}`; // print error to user
  }
}
createArr(); // create array

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

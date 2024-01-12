/* emmetapp, animate on scroll */
const sampleArr = {};
const API = "https://opentdb.com/api.php?amount=10";
function cardCreator(arr) {
  arr.forEach((i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <h1 class="question-heading">${question}</h1>
    <div class="answer-container"></div>`;
    const answerContainer = document.querySelector(".answer-container");
    for (answer in i.answers) {
      const button = document.createElement("button");
    }
    DOMSelectors.itemcontainer.appendChild(card);
  });
}
async function createArr() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    console.log(data.response_code);
    const cluebaseAPI = data.results;
    const cluebaseArr = cluebaseAPI.map((arr) => ({
      question: arr.question,
      answers: {
        answer: arr.correct_answer,
        incResponse1: arr.incorrect_answers[1],
        incResponse2: arr.incorrect_answers[2],
        incResponse3: arr.incorrect_answers[3],
      },
    }));
    console.log(cluebaseArr);
    cardCreator(cluebaseArr);
    if (data.status != 200) {
      throw new Error(data.error);
    }
  } catch (error) {
    console.log("uhoh");
  }
}
createArr();
// https://www.sitepoint.com/simple-javascript-quiz/

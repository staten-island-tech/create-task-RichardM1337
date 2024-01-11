/* emmetapp, animate on scroll */
const sampleArr = {};
const API = "https://opentdb.com/api.php?amount=10";
function cardCreator(arr) {
  arr.forEach((i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = ``;
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
      answer: arr.correct_answer,
      incResponse1: arr.incorrect_answers[1],
      incResponse2: arr.incorrect_answers[2],
      incResponse3: arr.incorrect_answers[3],
    }));
    console.log(cluebaseArr);
  } catch (error) {
    console.log("uhoh");
  }
}
createArr();

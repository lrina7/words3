let currentWordIndex = 0;
let userErrors = [];
let isMistakeMode = false;
let mistakeWords = [];

const wordContainer = document.getElementById("word");
const resultEl = document.getElementById("result");
const checkButton = document.getElementById("checkButton");
const finalScreen = document.getElementById("finalScreen");
const mistakeList = document.getElementById("mistakeList");
const mistakesContainer = document.getElementById("mistakesContainer");
const owlImage = document.getElementById("owlImage");
const h2 = document.querySelector("h2");
const retryMistakesBtn = document.getElementById("retryMistakes");
const playAgainBtn = document.getElementById("playAgain");

function getCurrentList() {
  return isMistakeMode ? mistakeWords : words;
}

function renderWord() {
  wordContainer.innerHTML = "";
  resultEl.textContent = "";
  owlImage.src = "assets/image/cat.jpg";

  const current = getCurrentList()[currentWordIndex];
  let answerIndex = 0;

  const inputFields = [];

  current.word.split("").forEach((char) => {
    if (char === "_") {
      const input = document.createElement("input");
      input.setAttribute("maxlength", "1");
      input.classList.add("missing-letter");
      input.dataset.answerIndex = answerIndex;
      inputFields.push(input);
      wordContainer.appendChild(input);
      answerIndex++;
    } else {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("word-part");
      wordContainer.appendChild(span);
    }
  });

  inputFields.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      if (e.inputType !== "deleteContentBackward") {
        if (input.value && inputFields[idx + 1]) {
          inputFields[idx + 1].focus();
        }
      }
    });
  });

  if (inputFields[0]) inputFields[0].focus();
}

function checkAnswer() {
  const inputs = wordContainer.querySelectorAll("input");
  const current = getCurrentList()[currentWordIndex];
  const userAnswers = Array.from(inputs).map((input) =>
    input.value.toLowerCase()
  );
  const correctAnswers = current.answers;

  const isCorrect = userAnswers.join("") === correctAnswers.join("");

  if (isCorrect) {
    resultEl.textContent = "Молодец!";
    resultEl.className = "result correct";
    owlImage.src = "assets/image/smile.png";
    showStar();
  } else {
    resultEl.textContent = "Ошибка!";
    resultEl.className = "result wrong";
    owlImage.src = "assets/image/cry.png";
    userErrors.push(current);
  }

  setTimeout(() => {
    currentWordIndex++;
    if (currentWordIndex >= getCurrentList().length) {
      showFinalScreen();
    } else {
      renderWord();
    }
  }, 800);
}

function showFinalScreen() {
  // Скрываем заголовок и очищаем поле слова
  h2.style.display = "none";
  wordContainer.innerHTML = "";
  resultEl.textContent = "";

  wordContainer.style.minHeight = "auto";

  // Показываем финальный экран
  finalScreen.style.display = "block";

  // Очищаем список ошибок
  mistakeList.innerHTML = "";

  // Создаём финальный текст
  const finalText = document.createElement("p");
  finalText.className = "praise";

  if (userErrors.length > 0) {
    finalText.innerHTML = "Ты допустил ошибки🧐";

    // Показываем контейнер ошибок и список
    mistakesContainer.style.display = "block";

    userErrors.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word.fullWord;
      mistakeList.appendChild(li);
    });

    // Показываем кнопку "Работа над ошибками"
    retryMistakesBtn.style.display = "inline-block";
  } else {
    finalText.innerHTML =
      "Ура!<br>Все слова без ошибок!<br>Ты — суперзвезда! 🌟";

    mistakesContainer.style.display = "none";
    retryMistakesBtn.style.display = "none";
  }

  // Вставляем финальный текст в wordContainer
  wordContainer.appendChild(finalText);

  // Показываем кнопку "Играть ещё раз"
  playAgainBtn.style.display = "inline-block";

  // Скрываем кнопку "Проверить"
  checkButton.style.display = "none";

  // Возвращаем стандартное изображение
  owlImage.src = "assets/image/cat.jpg";
}

// Запуск игры, с параметром — режим повторения ошибок
function startGame(fromMistakes = false) {
  isMistakeMode = fromMistakes;
  currentWordIndex = 0;
  owlImage.src = "assets/image/cat.jpg";

  if (fromMistakes) {
    mistakeWords = [...userErrors];
    userErrors = [];
  } else {
    userErrors = [];
  }

  finalScreen.style.display = "none";
  h2.style.display = "block";
  checkButton.style.display = "inline-block";
  mistakesContainer.style.display = "none";
  retryMistakesBtn.style.display = "none";
  playAgainBtn.style.display = "none";

  renderWord();
}

function showStar() {
  const star = document.createElement("div");
  star.classList.add("star-animation");
  star.textContent = "⭐";
  star.style.left = Math.random() * 80 + 10 + "%";
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 1500);
}

// Обработчики кнопок
checkButton.addEventListener("click", checkAnswer);

retryMistakesBtn.addEventListener("click", () => {
  if (userErrors.length > 0) {
    startGame(true);
  }
});

playAgainBtn.addEventListener("click", () => {
  startGame(false);
});

// Обработчик Enter для проверки
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && checkButton.style.display !== "none") {
    checkAnswer();
  }
});

// Запускаем игру при загрузке
startGame();

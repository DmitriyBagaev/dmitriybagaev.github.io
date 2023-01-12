const questions = [
    {
        type: 'radio',
        question: "Сколько будет 5×5?",
        answers: ["10", "−100", "25", "15"],
        correct: 3,
    },
    {
        type: 'radio',
        question: "Какой город является столицей России?",
        answers: ["Петрозаводск 💪", "Санкт-Петербург", "Москва", "Новосибирск"],
        correct: 3,
    },
    {
        type: 'radio',
        question: "Какая настоящая фамилия у В.И. Ленина?",
        answers: ["Ульянов", "Сталин", "Черчилль"],
        correct: 1,
    },
    {
        type: 'radio',
        question: "Поддерживает ли JavaScript ООП?",
        answers: ["Да", "Нет"],
        correct: 1,
    },
    {
        type: 'radio',
        question: "В каком году началась Вторая мировая война",
        answers: ["1917", "1991", "1941", "1945", "1914", "1939"],
        correct: 6,
    }
];

// Находим элементы
const headerContainer = document.querySelector('#header')
const listContainer = document.querySelector('#list')
const submitButton = document.querySelector('#submit')

// Переменные игры
let score = 0; // количество правильный ответов
let questionIndex = 0; // текущий вопрос

clearPage();
showQuestion();
submitButton.onclick = checkAnswer;
function clearPage(){
    headerContainer.innerHTML = '';
    listContainer.innerHTML = '';
}
function showQuestion(){
    // Отображаем вопрос на странице
    const headerTemplate = `<h2 class="QuizHeaderText">%title%</h2>`
    const title = headerTemplate.replace('%title%', questions[questionIndex]['question']);
    headerContainer.innerHTML = title;

    // Проход по всем вариантам ответа в массиве и отображаем ответы
    let answerNumber = 1;
    for (let answerText of questions[questionIndex]['answers']) {

        const questionTemplate =
            `<li>
                <label>
                    <input value="%number%" type="radio" class="answer" name="answer">
                    <span>%answer%</span>
                </label>
            </li>`

        const answerHTML = questionTemplate
            .replace('%answer%', answerText)
            .replace('%number%', answerNumber)

        listContainer.innerHTML += answerHTML;
        answerNumber++;
    }
}

function checkAnswer() {
    // Поиск выбранного ответа
    const checkedAnswer = listContainer.querySelector('input:checked')

    // Если не выбран ответ
    if (!checkedAnswer) {
        submitButton.blur();
        return;
    }

    // Номер ответа пользователя
    const userAnswer = parseInt(checkedAnswer.value);

    // Проверка правильности ответа
    if (userAnswer === questions[questionIndex]['correct']) {
        score++;
    }

    if (questionIndex !== questions.length - 1) {
        questionIndex++;
        clearPage();
        showQuestion();
    } else {
        clearPage();
        showResults()
    }
}

function showResults(){
   const resultsTemplate = `<h2 class="QuizHeaderText">%result%</h2>`

    let result = `${score} из ${questions.length}`;

    const finalMessage = resultsTemplate.replace('%result%', result + ' — ваш результат')

    headerContainer.innerHTML = finalMessage;

    submitButton.blur();
    submitButton.innerText = 'Повторить тестирование'
    submitButton.onclick = function (){
        history.go();
    }
}
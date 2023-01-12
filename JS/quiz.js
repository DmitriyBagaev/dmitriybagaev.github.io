const questions = [
    {
        question: "Сколько будет 5×5?",
        answers: ["8", "9", "25", "15"],
        correct: 3
    },
    {
        question: "Какой город является столицей России?",
        answers: ["Петрозаводск 💪", "Санкт-Петербург", "Москва", "Новосибирск"],
        correct: 3
    },
    {
        question: "Сколько будет 5×5?",
        answers: ["8", "9", "25", "15"],
        correct: 3
    },
    {
        question: "Чему равен квадратный корень из 25",
        answers: ["5", "-5", "8", "16"],
        correct: 1
    },
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

shuffle();
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
        return;
    } else {
        clearPage();
        showResults()
    }
}

function showResults(){
   const resultsTemplate = `<h2 class="QuizHeaderText">%result%</h2>`

    // let title, message;
    // if (score === questions.length) {
    //     title = 'Поздравляем';
    //     message = 'Вы ответили верно на все вопросы';
    // } else if((score * 100 / questions.length >= 50)) {
    //     title = 'Неплохо';
    //     message = 'Вы ответили на половину вопросов верно';
    // } else {
    //     title = 'Стоит постараться';
    //     message = 'Менее половины правильных ответов';
    // }

    let result = `${score} из ${questions.length}`;


    const finalMessage = resultsTemplate.replace('%result%', result + ' — ваш результат')

    headerContainer.innerHTML = finalMessage;

    submitButton.blur();
    submitButton.innerText = 'Повторить тестирование'
    submitButton.onclick = function (){
        history.go();
    }
}

// function shuffle(questions) {
//     let j, temp;
//     for (let i = questions.length - 1; i > 0; i--) {
//         j = Math.floor(Math.random() * (i + 1));
//         temp = questions[j];
//         questions[j] = questions[i];
//         questions[i] = temp;
//     }
//     return questions;
// }

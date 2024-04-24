const apiUrl = "https://opentdb.com/api.php?amount=15&difficulty=easy&type=multiple";

const questions = [
    // {
    //     question : "Which is the largest animal in the world?",
    //     answers : [
    //         {text:"Shark",correct:"false"},
    //         {text:"Blue Whale",correct:"true"},
    //         {text:"Elephant",correct:"false"},
    //         {text:"Lion",correct:"false"},
    //     ]
    // },
    // {
    //     question : "What does HTML stand for",
    //     answers : [
    //         {text:"Hyper Text Modifiable Language",correct:"false"},
    //         {text:"Hidden Translate Markup Language",correct:"false"},
    //         {text:"Hyper Text Markup Language",correct:"true"},
    //         {text:"Hyper Transfer Management Language",correct:"false"},
    //     ]
    // },
    // {
    //     question : "JavaScript's conventional name is ?",
    //     answers : [
    //         {text:"TypeScript",correct:"false"},
    //         {text:"Node JS",correct:"false"},
    //         {text:"SigmaScript",correct:"false"},
    //         {text:"EcmaScript",correct:"true"},
    //     ]
    // },
    // {
    //     question : "Who invented telephone?",
    //     answers : [
    //         {text:"Alexander GrahamBell",correct:"true"},
    //         {text:"Pados ke chacha",correct:"false"},
    //         {text:"Myself",correct:"false"},
    //         {text:"Thomas Bhai",correct:"false"},
    //     ]
    // },
]

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

async function startQuiz()
{
    const response = await fetch(apiUrl);
    var data = await response.json();
    console.log(data.results);
    data.results.forEach((result)=>
    {
        const questionObject = {};
        questionObject.question = result.question;
        questionObject.answers = [];
        result.incorrect_answers.push(result.correct_answer);
        const shuffle = (array) => { 
            for (let i = array.length - 1; i > 0; i--) { 
                const j = Math.floor(Math.random() * (i + 1)); 
                [array[i], array[j]] = [array[j], array[i]]; 
            } 
            return array; 
        };
        const answersOfQuestion =  shuffle(result.incorrect_answers);
        answersOfQuestion.forEach((answer)=>{
            const answerObject = {};
            answerObject.text = answer;
            if(answer==result.correct_answer)
            {
                answerObject.correct = "true";
            }
            else
            {
                answerObject.correct = "false";
            }           
            questionObject.answers.push(answerObject);
        })
        questions.push(questionObject);
        console.log(questionObject)
        // console.log(questions);
    })
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion()
{
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer =>{
        const button = document.createElement("button")
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct)
        {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click",selectAnswer)
    })
}

startQuiz();

function resetState()
{
    nextButton.style.display = "none";
    while(answerButtons.firstChild)
    {
        answerButtons.removeChild(answerButtons.firstChild)
    }
}

function selectAnswer(e)
{
    const selectedBtn = e.target;
    if(selectedBtn.dataset.correct === "true")
    {
        selectedBtn.classList.add("correct");
        score++;
    }
    else
    {       
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button =>{
        if(button.dataset.correct === "true")
        {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}


nextButton.addEventListener("click",()=>{
    if(currentQuestionIndex<questions.length)
    {
        handleNextButton();
    }
    else
    {
        startQuiz();
    }
})

function handleNextButton()
{
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length)
    {
        showQuestion();
    }
    else
    {
        showScore();
    }
}

function showScore()
{
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}
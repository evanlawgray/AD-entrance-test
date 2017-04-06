'use strict';

$(function () {
    var $quizOneButton = $('#quiz-1');
    var $quizTwoButton = $('#quiz-2');
    var $restartButton = $('#restart-button');

    var $welcomeScreen = $('#welcome-screen');
    var $quizScreen = $('#quiz-screen');
    var $scoreScreen = $('#score-screen');

    var $answerButtons = $('.answer-button');
    var $questionNumberHeader = $('.question-number');
    var $questionText = $('.question-text');

    var $scoreCounter = $('.score-counter');
    var $scoreReadout = $('.score-readout');
    var $gradeReadout = $('.grade-readout');

    var questions = [];
    var questionsAnswered = 0;
    var score = 0;
    var answered = void 0;

    function showQuizScreen() {
        $welcomeScreen.animate({ opacity: 0 }, 500);
        $welcomeScreen.hide();
        $quizScreen.show().animate({ opacity: 1 }, 550);
    }

    function showScoreScreen() {
        $quizScreen.animate({ opacity: 0 }, 500);
        $quizScreen.hide();
        $scoreScreen.show().animate({ opacity: 1 }, 550);

        $scoreReadout.text('Your final score is ' + score);
        $gradeReadout.text('Grade: ' + calculateGrade() + '%');

        answered = false;
    }

    function restartQuiz() {
        questions = [];
        questionsAnswered = 0;
        score = 0;
        answered = false;

        $scoreScreen.animate({ opacity: 0 }, 500);
        $scoreScreen.hide();
        $welcomeScreen.show().animate({ opacity: 1 }, 550);
    }

    function calculateGrade() {
        var scoreRatio = score / questions.length;
        var grade = void 0;

        if (Number.isInteger(scoreRatio)) {
            grade = 100;
        } else {
            grade = (100 * scoreRatio).toPrecision(2);
        }

        return grade;
    }

    function updateQuestions(questions, questionsAnswered) {
        $questionNumberHeader.text('Question # ' + (questionsAnswered + 1));
        $questionText.text(questions[questionsAnswered].question);

        for (var i = 0; i < questions[questionsAnswered].answers.length; i++) {
            $answerButtons[i].innerHTML = questions[questionsAnswered].answers[i].content;
            $answerButtons[i].setAttribute('val', questions[questionsAnswered].answers[i].value);
        }

        for (var _i = 0; _i < $answerButtons.length; _i++) {
            $($answerButtons[_i]).removeClass('correct-answer').removeClass('incorrect-answer');
        }

        answered = false;
    }

    function printScore() {
        $scoreCounter.text('Your score is: ' + score);
    }

    function submitAnswer(selectedAnswer) {
        if ($(selectedAnswer).attr('val') === 'true') {
            score++;
            $(selectedAnswer).addClass('correct-answer');
        } else {
            $(selectedAnswer).addClass('incorrect-answer');
        }
    }

    $quizOneButton.click(function () {
        $.get('../src/quiz.json', function (data) {
            questions = data.quizzes[0].questions;

            showQuizScreen();

            printScore();

            updateQuestions(questions, questionsAnswered);
        }).fail(function () {
            $('.welcome-header').text('Sorry, quiz data is unavailable.');
        });
    });

    $quizTwoButton.click(function () {
        $.get('../src/quiz.json', function (data) {
            questions = data.quizzes[1].questions;

            showQuizScreen();

            printScore();

            updateQuestions(questions, questionsAnswered);
        }).fail(function () {
            $('.welcome-header').text('Sorry, quiz data is unavailable.');
        });
    });

    $answerButtons.click(function () {

        if (answered !== true) {

            questionsAnswered++;

            submitAnswer(this);

            printScore();

            answered = true;

            if (questionsAnswered < questions.length) {
                var loadNewQuestion = window.setTimeout(updateQuestions, 2000, questions, questionsAnswered);
            } else {
                var showScore = window.setTimeout(showScoreScreen, 2000);
            }
        }
    });

    $restartButton.click(function () {
        restartQuiz();
    });
});
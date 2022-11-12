/********************** Variables Settings ******************************/
var userClickedPattern = []; // User color pattern
var gamePattern = []; // Game pattern

var game_start = false; // Check if game status is initialized

var level = 1; // Starting level
var score = 0;
var highScore = 0;

var buttonColours = ["red", "blue", "green", "yellow"]; // Color sequence


/********************** Functions Settings ******************************/
function blink(currentColour) {
    currentColour.fadeOut(100).fadeIn(100);
}

function hideElement(){
    /* Hide element of the page */
    for (var i = 0; i < arguments.length; i++){
        $(arguments[i]).addClass("not-displayed");
    }
}


function showElement(){
    /* Show element on the page */
    for (var i = 0; i < arguments.length; i++){
        $(arguments[i]).removeClass("not-displayed");
    }
}


function playSound(name) {
    /* Play a given sound */
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}


function animatePress(currentColour) {
    /*
        Show a short animation
        when user press a button
    */
    currentColour.addClass("pressed")
    setTimeout(function () {
        currentColour.removeClass("pressed");
    }, 100);
}


function nextSequence() {
    /*
        Generate random number between 0 and 3
        And create a random game pattern
    */
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];

    var colorBox = $("." + randomChosenColour);

    // Animate the chosen colour
    blink(colorBox);
    playSound(randomChosenColour);

    gamePattern.push(randomChosenColour);

    userClickedPattern = [];

    if (score > highScore) {
        highScore = score;
    }

    $(".score .current-score").text("Score: " + score);
    $(".score .high-score").text("High Score: " + highScore);

    hideElement(".last-window");

    $("footer").html();
    $("h1").text("Level " + level++);

}


function checkAnswer() {
    uL = userClickedPattern.length;
    gL = gamePattern.length;

    if(gamePattern[uL-1] !== userClickedPattern[uL-1]){
        //LOSE
        gameOver();
        startOver();
    }else if(gL === uL){
        //WIN
        ++score;
        setTimeout(nextSequence, 1000);
    }
}


function gameOver() {
    playSound("wrong");
    hideElement(".circle", ".button-container");
    showElement("footer", ".last-window");
    $("h1").text("Game Over! :(");
    $("footer").html("devXIstefan");
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
}


function startOver() {
    /* Restart the game if player lose*/
    level = 1;
    score = 0;
    gamePattern = [];
    game_start = false;
}


/********************** Events Settings ******************************/


/* Start screen only is shown */
hideElement(".score", ".button-container", ".last-window");


/* When user click a button */
$("button").click(function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    var userChosenColour_blink = $(this);
    animatePress(userChosenColour_blink);
    playSound(userChosenColour);

    checkAnswer();
});


/* Detect when main button is clicked */
$(".start-game-button").on("click", () => {
    if (!game_start) {
        showElement(".score", ".button-container", ".circle");
        hideElement(".first-window", "footer");
        nextSequence();
        game_start = true;
    }
});

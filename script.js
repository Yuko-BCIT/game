"use strict";

// detect user's screen height to avoid styling distortion when mobile keyboard appears
// https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
let windowHeight = document.documentElement.clientHeight;
// $('.target-element').height(windowHeight) <-- this didn't work since it adds scrolls
$(".screen, img").outerHeight(windowHeight);

const player = {
  name: "",
  nameInput: $("#name"), // player name <input>
  nameDisplay: $("#player"), // name display based of the <input> data
  lives: 10,
  level: "Easy",

  reduceLives: () => {
    player.lives -= 1;
    $("#lives").html(player.lives);
    if (player.lives < 0) {
      game.isRunning = false;
      $("#guess, #enter").prop("disabled", true); //disable the input area
      $("#game").hide();
      $("#gameover").show();
    }
  },
};

const game = {
  title: "High Low",
  isRunning: false,
  hiorlow: $("#hiorlow"), // number suggestion based on player guess
  playerGuess: $("#guess").val(), // the number player guessed
  secretNumber: null, // secret number not set at start

  init: () => {
    game.resetGame(); // reset on fresh start or
    $("#back, #quit").on("click", () => {
      // reset after ending the game on click
      game.resetGame();
    });

    $("#levelchoice input").on("click", () => {
      // level choice on radio buttons
      player.level = $("#levelchoice input[name=options]:checked").val();
    });

    player.nameInput.on("click", () => {
      player.nameInput.val(""); // clears the input if player wants to change the name previously entered
    });

    $("#start").on("click", () => {
      // start game by clicking this button
      // checking if input is empty
      if (player.nameInput.val() === "") {
        $("#alert1").css("visibility", "visible"); // show warning message
        $("#name").on("click", () => {
          $("#alert1").css("visibility", "hidden"); // hide the message again
        });
        // if name was enteted, switch to game screen and generate random number based on the chosen level
      } else {
        game.isRunning = true;
        player.nameDisplay.html(`${player.nameInput.val()}`); // display player name
        $("#splash, #gameover").hide();
        $("#game").show();
        $("#level").html(`${player.level}`); // display difficulty
        $("#lives").html(`${player.lives}`); // show lives left

        game.generateSecretNumber(); // generate random number, on click start
        // reveal the secret number on gameover screen (if player lose)
        $("#answer").html(game.secretNumber);
      }
      // number range instruction
      if (player.level === "Easy") {
        $("#range").html("1 and 100");
      } else if (player.level === "Medium") {
        $("#range").html("1 and 500");
      } else {
        $("#range").html("1 and 1000");
      }
    });

    // number validation procedure
    $("#enter").on("click", () => {
      game.playerGuess = Number($("#guess").val()); // retrive number entery by player and convert it to number
      // if non-number was entered or input was empty,
      if (isNaN(game.playerGuess) || !game.playerGuess) {
        $("#alert2").css("visibility", "visible"); // warn
        $("#guess").on("click", () => {
          $("#guess").val(""); // clear the input field so it doesn't reduce lives
          $("#alert2").css("visibility", "hidden");
        });
        //if number was provided, but out of range
      } else if (
        (player.level === "Easy" &&
          (game.playerGuess < 1 || game.playerGuess > 100)) || // when the level is easy
        (player.level === "Medium" &&
          (game.playerGuess < 1 || game.playerGuess > 500)) || // medium
        (player.level === "Hard" &&
          (game.playerGuess < 1 || game.playerGuess > 1000)) // hard
      ) {
        $("#alert2").css("visibility", "visible");
        $("#guess").on("click", () => {
          $("#guess").val("");
          $("#alert2").css("visibility", "hidden");
        });
        // if correct guess was made, finally compares to the secret number
      } else {
        game.checkSecretNumber();
        $("#guess").val("");
      }
    });
  },

  generateSecretNumber: () => {
    // generates ramdom numbers, sort by levels
    if (player.level === "Easy") {
      game.secretNumber = Math.floor(Math.random() * 100) + 1;
    } else if (player.level === "Medium") {
      game.secretNumber = Math.floor(Math.random() * 500) + 1;
    } else {
      game.secretNumber = Math.floor(Math.random() * 1000) + 1;
    }
  },

  checkSecretNumber: () => {
    if (game.playerGuess === game.secretNumber) {
      // the number matches
      game.setGameover(); // don't need to reduce lives
      // no match and guess is too low
    } else if (game.playerGuess < game.secretNumber) {
      game.hiorlow.html("go higher! ");
      game.hiorlow.css("color", "red");
      player.reduceLives();
      // no match and guess is too high
    } else if (game.playerGuess > game.secretNumber) {
      game.hiorlow.html("go lower! ");
      game.hiorlow.css("color", "lightskyblue");
      player.reduceLives();
    }

    // warn the player when it is their last life
    if (player.lives === 1) {
      $('<span id="last">this is your last chance &#128561;</span>')
        .appendTo(game.hiorlow)
        .css({
          "background-color": "#fc5e24",
          color: "black",
          "border-radius": "10px",
        });
    }

    // no more life
    if (player.lives < 1) {
      // guess is wrong && user used up all the lives
      game.setGameover();
    }
  },

  setGameover: () => {
    $("#game").hide();
    $("#gameover").show();
    if (game.playerGuess === game.secretNumber) {
      $("#win").show();
      $("#lose").hide();
    } else {
      $("#win").hide();
      $("#lose").show();
    }
  },

  resetGame: () => {
    // set everything to initial state
    game.isRunning = false;
    $("#last").remove(); // remove the appendTo() element
    game.hiorlow.text(""); // empty the 'go higher' or 'go lower' text
    $("#guess").val(""); // clear the number guess input
    player.lives = 10;
    player.level = "Easy";
    $("#option1").click(); // put 'checked' on level 'Easy' as if user clicked on it
    $("#guess, #enter").prop("disabled", false); //enables disabled form
    $("#game, #gameover").hide();
    $("#splash").show();
  },
};

game.init();

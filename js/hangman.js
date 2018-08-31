// dinhnluong@gmail.com 08.31.2018

// set Difficulty variables
var diffLevel;
var startVar;
var startLength;
var startMaxLength;

var userName;
var score;
var resultArray;
var blankWordArray = [];
var maxGuesses = 6;
var wordHTML = "";
var getWordTries;
var difficultyLevel;
const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

$(document).ready(function() {

	pullLeaderBoard();
	appendButtons();

	$("#Start").click(function(){
			document.getElementById('hint').disabled = false;
			userName = document.getElementById('userName').value;
			if (userName == "") {
				userName = "Name";
			}
		   	if (document.getElementById('diffEasy').checked) {
		   		diffLevel = 1;
		   		startLength = 3;
		   		startMaxLength = 5;
		   		startVar = 3500;
		   		difficultyLevel = "easy";
		   	} else if (document.getElementById('diffMedium').checked) {
		   		diffLevel = 3;
		   		startLength = 3;
		   		startMaxLength = 7;
		   		startVar = 2500;
		   		difficultyLevel = "medium";
		   	} else if (document.getElementById('diffHard').checked) {
		   		diffLevel = 6;
		   		startLength = 6;
		   		startMaxLength = 9;
		   		startVar = 3500;
		   		difficultyLevel = "hard";
		   		document.getElementById("hint").setAttribute("disabled", "disabled");
		   	}

			score = 0;
			getWordTries = 1;
			setGameSettings();
	});

	function getWord() {

		var start = Math.floor(Math.random() * (startVar - 1) + 1);

		$.ajax({ 
			type: "GET",
			dataType: "text",
			url: "http://app.linkedin-reach.io/words?difficulty=" + diffLevel + "&minLength=" + startLength + "&maxLength=" + startMaxLength + "&start=" + start + "&count=1",
			success: function(data){
				if (data == "" && getWordTries <= 3) {
					getWordTries++;
					getWord();
				} else if (data == "" && getWordTries > 3) {
					alert("Unable to retrieve word. Please try again.");
				} else {
					startGame(data);
				}
			}
		});
	}

	function startGame(result) {

		jQuery('#message').html("<b>Choose a Character</b>");
		
		resultArray = result.split('');

		//populate Blank Word Array based on how many Characters the WORD has
		for (var i = 0; i < resultArray.length; i++) {
			blankWordArray[i] = "_";
		}

		jQuery('#word').html('');

		// Create a HTML string to append to HTML
		for (var i = 0; i < resultArray.length; i++) {
			wordHTML += blankWordArray[i] + " ";
		}
	
		jQuery('#word').html("<font size=\"5px\"><b>" + wordHTML + "</b></font>");

		listenForChars();
		listenForHintClick();
	}

	//create event listener for all characters
	function listenForChars() {
		for (let i = 0; i < chars.length; i++) {
		    $("#Char_" + chars[i]).click(function() {
		    	keyDown(chars[i]);
		     });
		}
	}

	function keyDown(key) {
		document.getElementById("Char_" + key).setAttribute("disabled", "disabled");
		if (resultArray.indexOf(key.toLowerCase()) >= 0) {

					document.getElementById("Char_" + key).setAttribute("class", "btn btn-success btn-circle col-md-3");

					jQuery('#message').html('');
					$("#message").append("<b>" + key + " is correct!</b>");
					var index = [];

					// Update Blank Word Array with the correct Character guesses
		    		for (var i = 0; i < resultArray.length; i++) {
		    			if (resultArray[i] == key.toLowerCase()) {
		    				blankWordArray[i] = key.toLowerCase();
		    				wordHTML += blankWordArray[i] + " ";
		    				index.push(i);
		    			}
		    		}

					jQuery('#word').html('');
					jQuery('#word').html("<font size=\"5px\"><b>" + blankWordArray.join(" ") + "</b></font>");

					// Compare result and blank array to see if all Characters has been guessed correctly
					if (resultArray.join() == blankWordArray.join()) {
						jQuery('#message').html('');
						jQuery('#message').html("<b>YOU WIN!!</b>");
						continueGame("win");
					}
		} else {
			maxGuesses--;
			appendGuess(maxGuesses);
			appendHangmanImg(maxGuesses);

			jQuery('#message').html('');
			$("#message").append("<b>" + key + " is wrong, try again!</b>");
		}

		if (maxGuesses == 0) {
			alert("Game Over!");
			for (let i = 0; i < chars.length; i++) {
			    jQuery("#Char_"+chars[i]).unbind('click');
			}
			jQuery('#word').html('');
			jQuery('#word').html("<font size=\"5px\"><b>" + resultArray.join(" ") + "</b></font>");
			continueGame("lost");
		}
	}

	function continueGame(gameStatus) {
		if (gameStatus == "lost" && score > 0) {
			keepScore(userName, score);
		} else if (gameStatus == "win") {
			document.getElementById('hint').disabled = false;
			score += 100;
			setGameSettings();
		}		
	}

	function setGameSettings() {
		jQuery("#hint").unbind('click');
		resultArray = undefined;
		blankWordArray = [];
		maxGuesses = 6;
		wordHTML = "";
		appendGuess(maxGuesses);
		appendHangmanImg("Start");
		appendScore(score);
		getWord();
		appendButtons();
	}

	//Keep score and update Leader Board
	function keepScore(userName, score) {
		var storedNames = JSON.parse(localStorage.getItem("topScore"));

		if (storedNames == null && score > 0) {
			var names = [{"Name": userName, "Score": score}];
			localStorage.setItem("topScore", JSON.stringify(names));
			var storedNames = JSON.parse(localStorage.getItem("topScore"));
		} else {
			storedNames.push({"Name": userName, "Score": score});
		}

		var top10 = storedNames.sort(function(a, b) { return a.Score < b.Score ? 1 : -1; }).slice(0, 10);
		localStorage.setItem("topScore", JSON.stringify(top10));
		appendLeaderBoard(top10);
		
	}

	function pullLeaderBoard() {
		var storedNames = JSON.parse(localStorage.getItem("topScore"));
		if (storedNames != null) {
			var top10 = storedNames.sort(function(a, b) { return a.Score < b.Score ? 1 : -1; }).slice(0, 10);
			appendLeaderBoard(top10);
		}
	}

	// Listen for Hint button and disable Characters based on difficulty level
	function listenForHintClick() {
		$("#hint").click(function(){
			document.getElementById("hint").setAttribute("disabled", "disabled");
			if (difficultyLevel == "easy") {
				disableCharsBasedOnDifficulty(8);
			} else if (difficultyLevel == "medium") {
				disableCharsBasedOnDifficulty(4);
			} 
		});
	}

	function disableCharsBasedOnDifficulty(maxHints) {
		jQuery("#hint").unbind('click');
		for (var i = 0; i < maxHints; i++) {
			var randomIndex = Math.floor(Math.random() * chars.length);
			if (document.getElementById("Char_" + chars[randomIndex]).disabled == false && resultArray.indexOf(chars[randomIndex].toLowerCase()) == -1) {
				document.getElementById("Char_" + chars[randomIndex]).setAttribute("disabled", "disabled");
			} else {
				maxHints++;
			}
		}
	}
});
// dinhnluong@gmail.com 08.25.2018

var result;
var wrongGuess = [];
var diffLevel;
var startVar;
var startLength;
var startMaxLength;
var gameStatus;
var userName;
var score;

$(document).ready(function() { 

	$("#Start").click(function(){

		  if ($('#userName').val() == '') {
		      alert('Name can not be blank');
		   } else {
		   	userName = document.getElementById('userName').value;
		   	//check difficulty level
			if (document.getElementById('diffEasy').checked) {
				console.log("Easy is checked");
				diffLevel = 1;
				startLength = 3;
				startVar = 15000;
			} else if (document.getElementById('diffMedium').checked) {
				console.log("Medium is checked");
				diffLevel = 4;
				startVar = 7000;
			} else if (document.getElementById('diffHard').checked) {
				console.log("Hard is checked");
				diffLevel = 7;
				startVar = 1700;
			} 

			console.log('Username is: ' + userName);
			// get LinkedIn API
		   	getWord();
		   }		
	});

	function getWord() {
		// get randonize start number to pull only 1 data

		var start = Math.floor(Math.random() * (startVar - 1) + 1);
		console.log(start);

		$.ajax({ 
			type: "GET",
			dataType: "text",
			headers: {  'Access-Control-Allow-Origin': 'http://app.linkedin-reach.io' },
			url: "http://app.linkedin-reach.io/words?difficulty=" + diffLevel + "&minLength=3&maxLength=5&start=" + start + "&count=1",
			success: function(data){
				console.log(data);
				result = data.toString();

				if (data == "") {
					console.log("There is no result");
					getWord();
				}

				console.log("Result Length is : " + result.length);
				jQuery('#API').html('');
				$("#API").append(result);
				startGame();
			}
		});
	}

	function startGame() {

		console.log("In start game, word to guess is : " + result);

		var guess = 0;
		var resultArray = result.split('');
		var wrongGuessArray = [];

		// creat underscore array to use to compare with result array
		var blankWordArray = [];

		for (var i = 0; i < resultArray.length; i++) {
			blankWordArray[i] = "_";
		}

		console.log("Result Array is :" + resultArray);

		// Write code to display word
		jQuery('#word').html('');
		var wordHTML = "";

		for (var i = 0; i < resultArray.length; i++) {
			wordHTML += blankWordArray[i] + " ";
		}
		jQuery('#word').html("<h2><b>" + wordHTML + "</b></h2>");

		// Listen for a key down event
		document.addEventListener("keydown", function(e){
			


			// Keys must be a-z and not any other key
			if(e.key.toLowerCase() >= 'a' && e.key.toLowerCase() <= 'z' && e.key.toLowerCase().length === 1) {
				if (gameStatus == "win") {
					// next level
					$("#Start").html('Next Level');
				} else {
				console.log("Keydown is good");
				const resultChar = resultArray.filter(resultArray => resultArray === e.key.toLowerCase());

				console.log("Result Char before If Statement :" + resultChar);

				// if not in array statement
				if (resultChar == "") {
					console.log("Character does not exist in words matching array: " + e.key);
					// jQuery('#message').html('');
					// $("#message").append("Wrong guess! Character : " + e.key);
					const wrongGuessResult = wrongGuess.filter(wrongGuess => wrongGuess === e.key.toLowerCase());

					if (wrongGuessResult == "" ) {
						// keep track of guesses
						guess++;

						if (guess >= 6) {
							// write code for game over
				    		jQuery('#guess').html("Guest Left: 00");
				    		console.log("GAME OVER!");
				    		jQuery('#imgHangman').html("");
				    		jQuery('#imgHangman').html("<img src=\"images/Hangman6.png\" style=\"width:200px;height:200px;\">");
				    		jQuery('#message').html('');
				    		$("#message").append("No more guess, Game OVER!");

			    		} else {

			    			wrongGuess.push(e.key);
							console.log(wrongGuess);

							jQuery('#guess').html("Guest Left: 0" + (6 - guess));
							jQuery('#imgHangman').html("");
							jQuery('#imgHangman').html("<img src=\"images/Hangman" + guess +".png\" style=\"width:200px;height:200px;\">");
						
							console.log(guess);
							jQuery('#message').html('');
							$("#message").append("Wrong guess! Character already guessed : " + e.key);
							wrongGuessArray.push(e.key.toUpperCase());
							jQuery('#characterGuessed').html('');

							$("#characterGuessed").append("Guessed: <b>" + wrongGuessArray + "</b>");

						}		
			    	} else if (guess < 6) {
			    		// do not do anything because guess already guessed
			    		jQuery('#message').html('');
						$("#message").append("Guess already been guessed: " + e.key);
		    			// write alert message to tell user guess already used
		    			console.log("Wrong Guess already in array : " + e.key + ". " + wrongGuess);
		    		}		
		    	} else if (guess < 6) {
		    		// write code for good guess
		    		console.log("Found character in matching word array " + resultChar);
		    		// filter array for correct character guess
		    		var index = [];

		    		for (var i = 0; i < resultArray.length; i++) {
		    			if (resultArray[i] == resultChar[0]) {
		    				blankWordArray[i] = resultChar[0];
		    				console.log("In If/For statement, result Char is :" + resultChar);
		    				index.push(i);
		    			}
		    		}

		    		console.log("Characters in array with : " + resultChar + ". Indexes : " + index);

					// append correct guess to HTML
					jQuery('#word').html('');
					var wordHTML = "";

					for (var i = 0; i < resultArray.length; i++) {
						wordHTML += blankWordArray[i] + " ";
					}

					jQuery('#word').html("<h2><b>" + wordHTML + "</b></h2>");

					if(JSON.stringify(resultArray)==JSON.stringify(blankWordArray)){
						jQuery('#message').html('');
						jQuery('#message').html("<h3><b>YOU WIN!!</b></h3>");
						gameStatus = "win";
						$("#Start").html('Next Level');
					}

				}
				}
			}
		});

	}
});
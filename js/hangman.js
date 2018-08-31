// dinhnluong@gmail.com 08.25.2018

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
const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

$(document).ready(function() {

	pullLeaderBoard();
	appendButtons();

	$("#Start").click(function(){
			userName = document.getElementById('userName').value;
			if (userName == "") {
				userName = "Name";
			}
			//document.getElementById("userName").setAttribute("disabled", "disabled");
		   	if (document.getElementById('diffEasy').checked) {
		   		diffLevel = 1;
		   		startLength = 3;
		   		startMaxLength = 5;
		   		startVar = 3500;
		   		document.getElementById("diffMedium").disabled = true;
		   		document.getElementById("diffHard").disabled = true;
		   	} else if (document.getElementById('diffMedium').checked) {
		   		diffLevel = 3;
		   		startLength = 3;
		   		startMaxLength = 7;
		   		startVar = 2500;
		   		document.getElementById("diffEasy").disabled = true;
		   		document.getElementById("diffHard").disabled = true;
		   	} else if (document.getElementById('diffHard').checked) {
		   		diffLevel = 6;
		   		startLength = 6;
		   		startMaxLength = 9;
		   		startVar = 3500;
		   		document.getElementById("diffEasy").disabled = true;
		   		document.getElementById("diffMedium").disabled = true;
		   	} 

		   	console.log('Username is: ' + userName);
			// get LinkedIn API
			score = 0;
			setGameSettings();
			//getWord();
	});

	function getWord() {
		// get randonize start number to pull only 1 data

		var start = Math.floor(Math.random() * (startVar - 1) + 1);
		console.log(start);

		$.ajax({ 
			type: "GET",
			dataType: "text",
			headers: {  'Access-Control-Allow-Origin': 'http://app.linkedin-reach.io' },
			url: "http://app.linkedin-reach.io/words?difficulty=" + diffLevel + "&minLength=" + startLength + "&maxLength=" + startMaxLength + "&start=" + start + "&count=1",
			success: function(data){
				if (data == "") {
					console.log("There is no result");
					getWord();
				}

				jQuery('#API').html('');
				$("#API").append(data);
				startGame(data);
			}
		});
	}

	function startGame(result) {

		console.log("In start game, word to guess is : " + result);
		jQuery('#message').html("<b>Choose a character</b>");
		
		resultArray = result.split('');

		for (var i = 0; i < resultArray.length; i++) {
			blankWordArray[i] = "_";
		}

		console.log("Result Array is :" + resultArray);

		// Write code to display word
		jQuery('#word').html('');

		for (var i = 0; i < resultArray.length; i++) {
			wordHTML += blankWordArray[i] + " ";
		}

		console.log(blankWordArray);
		
		jQuery('#word').html("<font size=\"5px\"><b>" + wordHTML + "</b></font>");

		listenForChars();

	}

	//create event listener for all characters
	function listenForChars() {
		for (let i = 0; i < chars.length; i++) {
		    $("#Char_"+chars[i]).click(function() {
		    	keyDown(chars[i]);
		     });
		}
	}

	// key down, now do something with it
	function keyDown(key) {
		document.getElementById("Char_" + key).setAttribute("disabled", "disabled");
		console.log(resultArray.indexOf(key.toLowerCase()));
		if (resultArray.indexOf(key.toLowerCase()) >= 0) {
			console.log("Char exist in words Array :" + key);
					document.getElementById("Char_" + key).setAttribute("class", "btn btn-success btn-circle col-md-3");
					jQuery('#message').html('');
					$("#message").append("<b>" + key + " is correct!</b>");
					var index = [];

		    		for (var i = 0; i < resultArray.length; i++) {
		    			if (resultArray[i] == key.toLowerCase()) {
		    				blankWordArray[i] = key.toLowerCase();
		    				wordHTML += blankWordArray[i] + " ";
		    				console.log("In If/For statement, result Char is :" + key);
		    				index.push(i);
		    			}
		    		}

		    		console.log("Characters in array with : " + key + ". Indexes : " + index);

					// append correct guess to HTML
					jQuery('#word').html('');
					jQuery('#word').html("<font size=\"5px\"><b>" + blankWordArray.join(" ") + "</b></font>");

					console.log(blankWordArray);

					if (resultArray.join() == blankWordArray.join()) {
						jQuery('#message').html('');
						jQuery('#message').html("<b>YOU WIN!!</b>");
						continueGame("win");
					}
		} else {
			maxGuesses --;
			appendGuess(maxGuesses);
			appendHangmanImg(maxGuesses);

			console.log(maxGuesses);
			jQuery('#message').html('');
			$("#message").append("<b>" + key + " is wrong, try again!</b>");
			console.log("Key does not exist in words array");
		}

		if (maxGuesses == 0) {
			alert("Game Over!");
			for (let i = 0; i < chars.length; i++) {
			    jQuery("#Char_"+chars[i]).unbind('click');
			}

			continueGame("lost");
		}
	}

	function continueGame(gameStatus) {
		console.log(gameStatus);
		if (gameStatus == "lost" && score > 0) {
			keepScore(userName, score);
		} else if (gameStatus == "win") {
			score += 100;
			setGameSettings();
		}		
	}

	function setGameSettings() {
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

	function keepScore(userName, score) {

		var storedNames = JSON.parse(localStorage.getItem("topScore"));

		if (storedNames == null && score > 0) {
			var names = [{"Name": userName, "Score": score}];
			localStorage.setItem("topScore", JSON.stringify(names));
			var storedNames = JSON.parse(localStorage.getItem("topScore"));

			console.log("storedNames");
		} else {
			storedNames.push({"Name": userName, "Score": score});
		}

		console.log(storedNames);

		var top10 = storedNames.sort(function(a, b) { return a.Score < b.Score ? 1 : -1; }).slice(0, 10);

		localStorage.setItem("topScore", JSON.stringify(top10));

		appendLeaderBoard(top10);

		
	}

	function pullLeaderBoard() {
		var storedNames = JSON.parse(localStorage.getItem("topScore"));
		if (storedNames == null) {
			//write code for null data
		} else {
			var top10 = storedNames.sort(function(a, b) { return a.Score < b.Score ? 1 : -1; }).slice(0, 10);
			appendLeaderBoard(top10);
		}
	}

});
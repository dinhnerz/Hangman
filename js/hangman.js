// dinhnluong@gmail.com 08.25.2018

// set Difficulty variables
var diffLevel;
var startVar;
var startLength;
var startMaxLength;

var userName = "Name";
var score = 0;
var level = 1;
var resultArray;
var blankWordArray = [];
var maxGuesses = 6;
var wordHTML = "";
const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

$(document).ready(function() {

	appendButtons();

	$("#Start").click(function(){
			userName = document.getElementById('userName').value;
			document.getElementById("userName").setAttribute("disabled", "disabled");
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

		   	document.getElementById("Start").setAttribute("disabled", "disabled");
		   	console.log('Username is: ' + userName);
			// get LinkedIn API

			getWord();	
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
		jQuery('#word').html("<h2><b>" + wordHTML + "</b></h2>");

		listenForChars();
		//listenForKeys();

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
					jQuery('#word').html("<h2><b>" + blankWordArray.join(" ") + "</b></h2>");

					console.log(blankWordArray);

					if (resultArray.join() == blankWordArray.join()) {
						jQuery('#message').html('');
						jQuery('#message').html("<b>YOU WIN!!</b>");
						
						document.getElementById("Start").removeAttribute("disabled");
						$("#Start").html('Next Level');
						jQuery('#Start').unbind('click');
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
			document.getElementById("Start").removeAttribute("disabled");
			$("#Start").html('New Game');
			jQuery('#Start').unbind('click');
			continueGame("lost");
		}
	}

	function continueGame(gameStatus) {
		console.log(gameStatus);
		if (gameStatus == "lost") {
			// write code for game lost
			keepScore(userName, score);
			$("#Start").click(function() {
		    	window.location.reload();
		     });
			// then use window reload to refresh game
			//window.location.reload();
		} else if (gameStatus == "win") {
			score += 100;
			console.log(score);
			resultArray = undefined;
			blankWordArray = [];
			maxGuesses = 6;
			wordHTML = "";
			level ++;
			appendGuess(maxGuesses);
			appendHangmanImg("Start");
			appendScore(score);
			getWord();
			appendButtons();
		}
		
	}

	function keepScore(userName, score) {

		var names = [{"Name": "Dinh", "Rank": "1", "Score": "3500"},
					 {"Name": "Dinh", "Rank": "2", "Score": "2500"},
					 {"Name": "Dinh", "Rank": "3", "Score": "2000"}];

		localStorage.setItem("names", JSON.stringify(names));

		var storedNames = JSON.parse(localStorage.getItem("names"));

		console.log(storedNames);

		// var leaderBoardRank = JSON.parse(localStorage["userRank"]);
		// var leaderBoardScore = JSON.parse(localStorage["userScore"]);
		// var leaderBoardName = JSON.parse(localStorage["userName"]);

		// console.log(leaderBoardRank);
		// console.log(leaderBoardName);
		// console.log(leaderBoardScore);

		// if (leaderBoardRank == null && score > 0) {

		// 	userRank = [1,2,3,4,5,6,7,8,9,10];
		// 	userScore = [score,0,0,0,0,0,0,0,0,0];
		// 	userName = [userName, "Name", "Name", "Name", "Name", "Name", "Name", "Name", "Name", "Name"];

		// 	localStorage.setItem('userRank', JSON.stringify(userRank));
		// 	localStorage.setItem('userScore', JSON.stringify(userScore));
		// 	localStorage.setItem('userName', JSON.stringify(userName));

		// } else if (score > 0) {
		// 	for (var i = 0; i < leaderBoardScore.length; i++) {
		// 		if (leaderBoardScore[i] > score && leaderBoardScore[i+1] < score) {
		// 			console.log("Update for this position: " + (i+1));
		// 			leaderBoardScore[i+1] = score;
		// 			leaderBoardName[i+1] = userName;
		// 		} else if (leaderBoardScore[0] < score) {
		// 			leaderBoardScore[0] = score;
		// 			leaderBoardName[0] = userName;
		// 		} 
		// 		localStorage.setItem('userRank', JSON.stringify(leaderBoardRank));
		// 		localStorage.setItem('userScore', JSON.stringify(leaderBoardScore));
		// 		localStorage.setItem('userName', JSON.stringify(leaderBoardName));
		// 	}
		// }
		
	}

});
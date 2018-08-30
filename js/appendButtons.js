function appendButtons() {
	var buttonsHTML = "";
	jQuery('#Characters').html('');
	for (var i = 0; i < chars.length; i++) {
		buttonsHTML += "<button type=\"button\" id=\"Char_" + chars[i] +"\" class=\"btn btn-primary btn-circle col-md-3\">" + chars[i] +"</button>";
	}
	$("#Characters").append(buttonsHTML);
}

function appendGuess(guesses) {
	jQuery('#guess').html("");
	jQuery('#guess').html("<font size=\"4px\"><b>Guesses Left: </b></font><font size=\"4px\" color=\"#0077B5\"><b>" + guesses + "</font></b>");
}

function appendHangmanImg(status) {
	jQuery('#imgHangman').html("");
	jQuery('#imgHangman').html("<img src=\"images/Hangman" + status + ".png\" style=\"width:200px;height:200px;\">");
}

function appendScore(score) {
	jQuery('#score').html("");
	jQuery('#score').html("<font size=\"4px\"><b>Score: </b></font><font size=\"4px\" color=\"#0077B5\"><b>" + score + "</font></b>");
}
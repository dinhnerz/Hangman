# Overview

Hangman is word guessing game written for LinkedIn Reach Program's coding challenge. It is written in JavaScript, HTML and CSS utilizing bootstrap and jQuery libraries by Dinh Luong.

## Motivation

The game is inspired by the original [Hangman game](https://en.wikipedia.org/wiki/Hangman_(game)). As a part of LinkedIn's Reach program, we are given a coding challenge to create a word guessing game. I have decided to go with JavaScript as it is my favorite coding language. UI design is modeled after LinkedIn's color scheme. 

## Installation

- Extract to folder of your choice
- Install Allow-Control-Allow-Origin (CORS) [Chrome extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)
- Load Index.html > Choose difficulty level > New Game

## Playing the game

Player plays against the Word Keeper (computer). Player has 6 guesses to guess the word correctly. 
Player will win the game if can guess all characters in the secret word before 6 guesses are up.

## Code Structure

Applying SOLID principles where possible. I wrote the game to use single responsibility functions. Once the New Game button is clicked, it sets difficulty parameters (difficulty, minLength, maxLength, and start) based on the difficulty selection.

Event Listeners are created for each Character button and is appended to the HTML page. If the Player push a Character button, the button is cross reference with the Word Array to check if the Character exist in the word Array and button is then disabled.

Word is pulled by invoking LinkedIn's Word REST API, unfortunately I faced the cross-domain policy issue and could not be processed and thus I had to use the CORS Chrome extension to get around this issue (Allow-Control-Allow-Origin). 

Word is casted into an Array and a Blank Underscore Array is created to display in the UI. Word Array is used to compare when the Player guess a Character correctly or incorrectly. If the Player guesses a Character correctly, the Blank Underscore Array is then populated with the correctly guessed Character.

Array.indexOf is used to check if a Character exist in the Word Array, if exist, push the position of the Character to an Index Array to be used to populate Blank Underscore Array by using indexes of the Word Array as a reference for existing Characters. Array.join is used to compare Word Array and Blank Underscore Array as a String if the Player has successfully guessed all the words.

If the Player guessed the word correctly, the Player is rewarded with 100 points and moves to the next Word. If the game is lost and the Player has a minimum score of 100, the keepScore function is called to add the Player and Score to the Score Object in the backend using Cache and then the object is filtered for the top 10 scores and is displayed in the frontend.

Hint mode works by filtering through all 26 Characters and determine if a Character exist in the Word Array or is already guessed. If exist in Word array or already guessed, Hint mode will skip this Character. It randomly search and disable 8 Character buttons for easy mode and 4 for medium mode. This mode is not available for hard mode. 

## Extensions

- Difficulty Levels (easy, medium, hard). Difficulty levels is implmented using API parameters; difficulty, minLength, and maxLength. Lower parameter settings for easier modes, etc.
- Leader Board (top 10 scores). Leader board data is stored in the backend and displayed in the UI (cache parse to JSON).
- Hint (disable 8 characters for easy mode, 4 characters for medium mode, not available for hard mode). Hint mode randomizes the characters to be disabled that are not in the word result array or already guessed.


## Resources

- [LinkedIn Words API](http://app.linkedin-reach.io/words)
- [Hangman game](https://en.wikipedia.org/wiki/Hangman_(game))
- [Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)


# Overview

Hangman is word guessing game written for LinkedIn Reach Program's coding challenge. It is written in JavaScript, HTML and CSS utilizing bootstrap and jQuery libraries by Dinh Luong.

## Motivation

The game is inspired by the original [Hangman game](https://en.wikipedia.org/wiki/Hangman_(game)). As a part of LinkedIn's Reach program, we are given a coding challenge to create a word guessing game. I have decided to go with JavaScript as it is my favorite coding language. UI design is modeled after LinkedIn's color scheme. 

## Installation

- Extract to folder of your choice
- Load Index.html > Choose difficulty level > New Game
- Game uses CORS proxy server as a workaround for cross-domain policy


## Playing the game

Player plays against the Word Keeper (computer). Player has 6 guesses to guess the word correctly. 
Player will win the game if can guess all characters in the secret word before 6 guesses are up.

## Code Structure

Applying SOLID principles where possible. I wrote the game to use single responsibility functions. Once the New Game button is clicked, it sets difficulty parameters (difficulty, minLength, maxLength, and start) based on the difficulty mode. 

Word is pulled by invoking LinkedIn's Word REST API, unfortunately the payload is returned in text/html and could not be processed
as JSON/JSONP thus I use the CORS Chrome extension to get around this issue (Allow-Cntrol-Allow_Origin). 

Event Listeners are created for each Character button and is appended to the HTML page. If the Player push a Character button, the
button is cross reference with the Word Array and button is then disabled.

Word is processed into an Array and a Blank Underscore Array is created to display in the UI. Word Array is used to compare when the Player guess a Character correctly or incorrectly. If Player guess a Character correctly, the Blank Underscore Array is then populated with the correctly guessed Character.

Array.indexOf is used to check if Character clicked exist in the array, if so, push the index to Index Array to be
referenced with Word Array and populate Blank Underscore Array if Character exists. Array.join is used to compare Word Array and Blank Underscore Array if the Player has successfully guessed all the words.

If the Player guessed the words correctly, they are rewarded with 100 points and moves to the next level. If the game
is lost and the Player has a minimum score of 100, the keepScore function is called to be added to the Score Object
in the backend and then the object is filtered for the top 10 scores and is displayed in the frontend.

Hint mode works by filtering through all 26 Characters and determine if a Character exist in the Word Array or is
already guessed. It then randomly disable 8 Character buttons for easy mode and 4 for medium mode. This mode is not
available for hard mode. 


## Extensions

- Difficulty Levels (easy, medium, hard). Difficulty levels is implmented using API parameters; difficulty, minLength, and maxLength. Lower parameter settings for easier modes, etc.
- Leader Board (top 10 scores). Leader board data is stored in the backend and displayed in the UI (cache parse to JSON).
- Hint (disable 8 characters for easy mode, 4 characters for medium mode, not available for hard mode). Hint mode randomizes the characters to be disabled that are not in the word result array or already guessed.


## Resources

- [LinkedIn Words API](http://app.linkedin-reach.io/words)
- [Hangman game](https://en.wikipedia.org/wiki/Hangman_(game))
- [Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)


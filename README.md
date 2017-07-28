# MBTI Flashcards Application

Quickly compare MBTI types to one another using sortable flashcards. Each shown flashcard toggles its cognitive functions' visibility when the "H" key is pressed so that the cognitive functions of each type may be studied and memorized.

## How to Use

Please note this application depends on the following files:
* /js/lib/jquery.js
* /js/mbti-flashcards.js
* /css/mbti-flashcards.css

Within your HTML page, call the `MbtiFlashcards.initialize()` method like so:
```html
<body>
    <div id="app-container"></div>
    <script>
        MbtiFlashcards.initialize($('#app-container'));
    </script>
</body>
```
..where the `<div id="app-container"></div>` is the container for the application.

You may navigate to this repo's demo page to see exactly how to place this JavaScript application within your own page.

# Educational Purposes Only

This application's only intent is to help educate and research the nuances of MBTI personality types. This application and its code is for educational purposes only and is in no way affiliated with [The Myers & Briggs Foundation](http://www.myersbriggs.org/myers-and-briggs-foundation/).

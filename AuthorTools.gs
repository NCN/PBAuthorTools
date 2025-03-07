/**
 * When the app is installed from the marketplace
 * call onOpen to create the menu items.
 */

function onInstall(e) {
  onOpen(e);
}

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  var ui = DocumentApp.getUi();
  var menu = ui.createAddonMenu();
  menu.addItem('Manuscript word count', 'wordCountMenuItemClicked')
  .addSubMenu(ui.createMenu('Set art notes font color')
          .addItem('Black', 'textBlackMenuItemClicked')
          .addItem('Gray', 'textGrayMenuItemClicked')
          .addItem('Light gray', 'textLightGrayMenuItemClicked')
          .addItem('Red', 'textRedMenuItemClicked')
          .addItem('Blue', 'textBlueMenuItemClicked')
          .addItem('Other', 'textCustomMenuItemClicked'))
  .addSubMenu(ui.createMenu('Italicize art notes')
          .addItem('Italics on', 'italicsOnMenuItemClicked')
          .addItem('Italics off', 'italicsOffMenuItemClicked'))
  .addSubMenu(ui.createMenu('Align art notes')
        .addItem('Align left', 'alignLeftMenuItemClicked')
        .addItem('Align right', 'alignRightMenuItemClicked')
        .addItem('Align left + indent 1 tab', 'alignLeftTabOneMenuItemClicked')
        .addItem('Align left + indent 2 tabs', 'alignLeftTabTwoMenuItemClicked'))
  //.addItem('Delete all comments', 'deleteCommentsMenuItemClicked')
  .addSubMenu(ui.createMenu('Word Frequency')
    .addItem('Word frequency list', 'wordFrequencyMenuItemClicked')
    .addItem('Word cloud', 'wordCloudMenuItemClicked'))
  .addSubMenu(ui.createMenu('Rhyme tools')
        .addItem('Detect syllabically ambiguous words', 'detectBadRhymingWordsMenuItemClicked')
        .addItem('Show list of syllabically ambiguous words', 'showBadRhymingWordsMenuItemClicked'))
  .addSubMenu(ui.createMenu('Adverbs')
    .addItem('Adverb detector', 'detectAdverbsMenuItemClicked')
    .addItem('Show list of adverbs', 'showAdverbsMenuItemClicked'))
  //.addSubMenu(ui.createMenu('Text formatting')
  //  .addItem('CAPITALIZE selected text', 'textFormatCapitalize'))
  .addItem('Toggle hightlighting art notes', 'highlightingMenuItemClicked')
  .addSeparator()
  .addItem('About', 'aboutMenuItemClicked').addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * User clicked About menu item.
 * Display dialog with name and links.
 */
function aboutMenuItemClicked() {

  // 1.0.0 - original release
  //version = "1.1.0" // 1.1.0 - refactor to support nested art notes and dangling art notes
  //version = "1.2.0" // 1.2.0 - Added custom color picker
  //version = "1.2.1" // 1.2.1 - Fixed minor formatting issue
  //version = "1.2.2" // 1.2.2 - Prevent error formatting 0-length art note
  //version = "1.2.3" // 1.2.3 - Don't log any text from manuscript
  //version = "1.2.4" // 1.2.4 - Don't log any text from manuscript
  //version = "1.3.0" // 1.3.0 - Added word cloud feature
  //version = "1.3.1" // 1.3.1 - Don't log any text from manuscript in Word Cloud function
  //version = "1.4.0" // 1.4.0 - Include brackets in art notes color-changes
  //version = "1.5.0" // 1.5.0 - Options to left-align with tab indents
  //version = "1.6.0" // 1.6.0 - Added Adverb detector
  //version = "1.7.0" // 1.7.0 - Problematic rhyming words detector
  //version = "1.8.0" // 1.8.0 - Added paragraph and character counts
  //version = "1.9.0" // Make this show up as an art note: (Action note – on title page, Emma watches Poppy wind his clock.)
  //version = "1.9.1" // Attempt to address possible crash while updating formatting.
  //version = "1.9.2" // Added more ambiguous rhyming words.
  //version = "1.9.3" // Added more ambiguous rhyming words.
  //version = "1.9.4" //  Updated error-handling and added some help text.
  //version = "1.9.5" //  Updated homepage link.
  //version = "1.9.6" //  Added more problematic rhyming words to the checklist.
  var version = "1.9.6" 
  var relNotes = "v1.9.6: Added more problematic rhyming words to the checklist."
  // TODO: 
  // Added text capitalize tool.
  // Count "weak words" (Aimee Satterlee)
  // "Count Unique Words" -- Option for "Word cloud" as a list... WITHOUT stop-wordss... just list of each word and the count, like adverb count list...
  // Michael Wayne request... if a line starts with "ALL CAPS:" a name in caps followed by a colon, then treat that as a note... handle a case where a line starts like that, and then still has a bracketed art note later... but don't consider these "names" to be "notes" because we don't want them counted towards number of art notes
  // 

  var htmlText = '<body style="word-break:break-word;font-size:small;font-family:sans-serif;">';
  htmlText = htmlText + relNotes;
  htmlText = htmlText + '<br><br>Handy tools for picture book authors, created by Nathan Christopher.<br><br>Twitter: <a href="https://twitter.com/Nathan_C_Books" target="_blank">@Nathan_C_Books</a><br><br>Discord chat: <a href="https://discord.com/invite/KSYfkNg" target="_blank">PB Workshop Chat</a><br><br>Visit the <a href="https://hellonathan.ca/stuff-for-authors/pb-author-tools/" target="_blank">PB Author Tools homepage</a></body>'

  var htmlOutput = HtmlService
    .createHtmlOutput(htmlText)
    .setWidth(425) //optional
    .setHeight(180); //optional
DocumentApp.getUi().showModalDialog(htmlOutput, 'Picture Book Author Tools v' + version);
}

/**
 * Generate the word count for the picture book manuscript.
 * Includes with and without art notes.
 */
function wordCountMenuItemClicked() {
  Logger.log('wordCountMenuItemClicked()');

  // If there was a selection -> retrieve the Range
  // If nothing was selected -> build a Range of the whole doc
  var bodyTextRange = getApplicableRange(0); // Returns a 'Range'

  // Contains one elementMapObject for every element in the selection or doc
  var elementMap = buildElementMap(bodyTextRange); 

  if (elementMap.length > 0) {
    
    var totalWordCount = 0;
    var artNotesWordCount = 0;
    var textWordCount = 0;
    
    var numberOfArtNotes = 0;
    
    var totalCharacterCount = 0; 
    var artNotesCharacterCount = 0; 
    var textCharacterCount = 0;
    
    var totalParagraphCount = 0; // TODO: FIX count stanzas/paragraphs excluding art notes
    var numberOfCapsDialogNames = 0; // TODO: count names with all caps followed by colon at start of line

    var elements = bodyTextRange.getRangeElements(); // RangeElement[] array
    Logger.log('These should match. elementMap.length: ' + elementMap.length + ', elements.length: ' + elements.length)

    // Loop through element map to calculate word count
    for (var i = 0; i < elementMap.length; ++i) {
      elementMapObject = elementMap[i]; // the object at i in our map
      var elementText = getElementTextFromElement(elements[i]); // the actual textElement at i
      //Logger.log('i: '+ i + ',elementText: "' + elementText + '", elementMapObject.state: ' + elementMapObject.state)
      if (0 == elementMapObject.state) {
        Logger.log('elementMap[' + i + '] — Non-text object')
        continue;
      }
      else {
        if (1 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Text')
          // words = countWordsSimple(elementText);
          // totalWordCount += words;
          // textWordCount += words;
          obj = countWordsComplex(elementText);
          totalWordCount += obj.words;
          textWordCount += obj.words;
          totalCharacterCount += obj.characters;
          textCharacterCount += obj.characters;
          totalParagraphCount++;
        }
        else if (2 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Art notes')
          // words = countWordsSimple(elementText);
          // totalWordCount += words;
          // artNotesWordCount += words;
          obj = countWordsComplex(elementText);
          totalWordCount += obj.words;
          artNotesWordCount += obj.words;
          totalCharacterCount += obj.characters;
          artNotesCharacterCount += obj.characters;
          numberOfArtNotes++;
        }
        else if (3 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Text with nested art notes')
          var nestedArtNotes = elementMapObject.nestedArtNotes;
          var textSubstring;
          var lastArtNoteEnd = 1000;
          totalParagraphCount++;
          
          for (var j = 0; j < nestedArtNotes.length; ++j) {
            var artNoteObject = nestedArtNotes[j];
            var start = artNoteObject.start; // start index of this nested art note
            var end = artNoteObject.end + 1; // end index of this nested art note
            textSubstring = elementText.substring(start, end);
            //Logger.log('Art note [' + j + ']: ' + textSubstring + ', start: ' + start + ', lastArtNoteEnd: ' + lastArtNoteEnd);
            // words = countWordsSimple(textSubstring);
            // totalWordCount += words;
            // artNotesWordCount += words;
            obj = countWordsComplex(textSubstring);
            totalWordCount += obj.words;
            artNotesWordCount += obj.words;
            totalCharacterCount += obj.characters;
            artNotesCharacterCount += obj.characters;
            numberOfArtNotes++;
            
            // if 0th art note has a start > 0, we need to assume
            // the substring from index 0 to 'start' is text, and contribute 
            // that to text word count
            if ((0 == j) && (start > 1)) {
              textSubstring = elementText.substring(0, start-1);
              //Logger.log('Start of line text before art note [' + j + ']: ' + textSubstring);
              // words = countWordsSimple(textSubstring);
              // totalWordCount += words;
              // textWordCount += words;
              obj = countWordsComplex(textSubstring);
              totalWordCount += obj.words;
              textWordCount += obj.words;
              totalCharacterCount += obj.characters;
              textCharacterCount += obj.characters;
            }

            // if this art note is more than one character beyond the end
            // of the previous nested art note, there must be text in 
            // between that needs to be counted
            if (start > (lastArtNoteEnd + 1)) {
              textSubstring = elementText.substring(lastArtNoteEnd, start-1);
              //Logger.log('Intermediate text between nested art notes [' + j + ']: ' + textSubstring);
              // words = countWordsSimple(textSubstring);
              // totalWordCount += words;
              // textWordCount += words;
              obj = countWordsComplex(textSubstring);
              totalWordCount += obj.words;
              textWordCount += obj.words;
              totalCharacterCount += obj.characters;
              textCharacterCount += obj.characters;
            }

            lastArtNoteEnd = end;
          }

          // if there's text in the element affter the last art note, count that too
          if (elementText.length > lastArtNoteEnd) {
            textSubstring = elementText.substring(lastArtNoteEnd, elementText.length);
            //Logger.log('Final text after last nested art notes: ' + textSubstring);
            // words = countWordsSimple(textSubstring);
            // totalWordCount += words;
            // textWordCount += words;
            obj = countWordsComplex(textSubstring);
            totalWordCount += obj.words;
            textWordCount += obj.words;
            totalCharacterCount += obj.characters;
            textCharacterCount += obj.characters;
          }
        }
        else if (4 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Combination of text and partial art note start')

          // 1. Get elementText substring UP TO [ or (
          // 2. Get elementText AFTER  [ or (
          // 3. Get wordCount for 1 and put in text
          // 4. Get wordCount fof 2 and put in art notes

          // if state == 4, this will be populated to contain
          // info about partial art note that started in this element
          var textText = elementText.substring(0, elementMapObject.partialArtNoteStartIndex);
          // words = countWordsSimple(textText);
          // totalWordCount += words;
          // textWordCount += words;
          obj = countWordsComplex(textText);
          totalWordCount += obj.words;
          textWordCount += obj.words;
          totalCharacterCount += obj.characters;
          textCharacterCount += obj.characters;

          // If this dangling art note has actual text in front of it, then count
          // it as a paragraph.
          if (obj.words > 0) {
            totalParagraphCount++;
          }

          var artText = elementText.substring(elementMapObject.partialArtNoteStartIndex, elementText.length);
          // words = countWordsSimple(artText);
          // totalWordCount += words;
          // artNotesWordCount += words;
          obj = countWordsComplex(artText);
          totalWordCount += obj.words;
          artNotesWordCount += obj.words;
          totalCharacterCount += obj.characters;
          artNotesCharacterCount += obj.characters;
          //Logger.log('Text: ' + textText + '(' + textWordCount + ')\r\nArt notes: ' + artText  + '(' +  + '(' + textWordCount + ')');

          numberOfArtNotes++;
        }
        else if (5 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Combination of text and partial art note end')
          
          // 1. Get elementText substring UP TO ] or )
          // 2. Get elementText AFTER  ] or )
          // 3. Get wordCount for 1 and put in art notes
          // 4. Get wordCount fof 2 and put in text

          // if state == 5, this will be populated to contain
          // info about partial art note that ended in this element
          var artText = elementText.substring(0, elementMapObject.partialArtNoteEndIndex);
          // words = countWordsSimple(artText);
          // totalWordCount += words;
          // artNotesWordCount += words;
          obj = countWordsComplex(artText);
          totalWordCount += obj.words;
          artNotesWordCount += obj.words;
          totalCharacterCount += obj.characters;
          artNotesCharacterCount += obj.characters;

          var textText = elementText.substring(elementMapObject.partialArtNoteEndIndex + 1, elementText.length);
          // words = countWordsSimple(textText);
          // totalWordCount += words;
          // textWordCount += words;
          obj = countWordsComplex(textText);
          totalWordCount += obj.words;
          textWordCount += obj.words;
          totalCharacterCount += obj.characters;
          textCharacterCount += obj.characters;

          //Logger.log('Text: ' + textText + '(' + textWordCount + ')\r\nArt notes: ' + artText  + '(' +  + '(' + textWordCount + ')');
        }
        else if (6 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Art notes within multiple line art notes')
          // words = countWordsSimple(elementText);
          // totalWordCount += words;
          // artNotesWordCount += words;
          obj = countWordsComplex(elementText);
          totalWordCount += obj.words;
          artNotesWordCount += obj.words;
          totalCharacterCount += obj.characters;
          artNotesCharacterCount += obj.characters;
        }
      }
    }
  
    Logger.log('totalWordCount: ' + totalWordCount)
    Logger.log('textWordCount: ' + textWordCount)
    Logger.log('artNotesWordCount: ' + artNotesWordCount)
    Logger.log('totalCharacterCount: ' + totalCharacterCount)
    Logger.log('textCharacterCount: ' + textCharacterCount)
    Logger.log('artNotesCharacterCount: ' + artNotesCharacterCount)

    var alertText = 'Word count (text): ' + textWordCount + '\r\nWord count (art notes): ' + artNotesWordCount + '\r\nTotal word count (text plus art notes): ' + totalWordCount;

    alertText = alertText + '\r\n\r\nNumber of art notes: ' + numberOfArtNotes;

    alertText = alertText + '\r\n\r\nNumber of characters (text): ' + textCharacterCount;
    alertText = alertText + '\r\nNumber of characters (art notes): ' + artNotesCharacterCount;

    if (totalParagraphCount < -10) {
      alertText = alertText + '\r\n\r\nNumber of paragraphs/stanzas: ' + totalParagraphCount;
    }

    if (!DocumentApp.getActiveDocument().getSelection()) {
     alertText = alertText + '\r\n\r\nTIP: Select some text before clicking "Manuscript word count" to display the word count for only that selection (useful for excluding title, back-matter, etc.).';
    }

    okAlert('Manuscript word count', alertText);
  }
}

/**
 * Build a map of all elements in the text range, indicating
 * for each one whether it is an art note, is text, or contains
 * nested art notes, or is a partial art note.
 */
function buildElementMap(bodyTextRange) {
  // Contains one elementMapObject for every element in the selection or doc
  var elementMap = []; 

  var elementMapObject = new Object();
  elementMapObject.state = -1; 
    // 0 == element is not a text element, cannot use
    // 1 == element is text
    // 2 == element is art note
    // 3 == element contains nested art notes
    // 4 == partial art note starts in this element
    // 5 == partial art note ends in this element
    // 6 == standalone art note text within dangling start and end

  // if state == 1 or 2, no sub-objects are needed 

  // if state == 3, this will be populated to contain 
  // info on the nested art notes within the element
  elementMapObject.nestedArtNotes = []; // array of nested art notes
  var nestedArtNoteObject = new Object();
  nestedArtNoteObject.start = -1; // start index of this nested art note
  nestedArtNoteObject.end = -1; // end index of this nested art note

  // if state == 4, this will be populated to contain
  // info about partial art note that started in this element
  elementMapObject.partialArtNoteStartIndex = -1; // - index in this element where art note starts
  elementMapObject.artNoteEndElement = -1; // - element ID where art note ends

  // if state == 5, this will be populated to contain
  // info about partial art note that ended in this element
  elementMapObject.partialArtNoteEndIndex = -1; // - index in this element where art note ends
  elementMapObject.artNoteStartElement = -1; // - element ID  where art note starts

  // Loop through all elements in the body or selection.
  // For each element determine which 'state' it is from the above list.
  // And populate the ith element of the elementMap with info about the element.
  var danglingArtNoteOpen = 0;
  var danglingArtNoteBracketType = -1; // 0 = [] or 1 = ()
  var danglingArtNoteStartElement = -1;
  var danglingArtNoteEndNotFoundCounter;

  var elements = bodyTextRange.getRangeElements(); // RangeElement[]
  for (var i = 0; i < elements.length; ++i) {
    Logger.log('\r\nElement ' + i);
    // Get "elementText" from element[i]. elements[i] is a RangeElement
    var elementText = getElementTextFromElement(elements[i])
    if (elementText) {
      // This check is necessary to exclude images, which return a blank
      // text element.
      
      if (1 == danglingArtNoteOpen) {
        // Special case we already have a dangling art note open...  
        // Look in this element for the end of the dangler.
        // If we don't find it, we need to mark this whole element as art note.
        // If we do find it, we need to mark this as state 4
        partialArtNoteObject = checkForDanglingArtNoteEnd(elementText, danglingArtNoteBracketType);
        if (partialArtNoteObject) {
          // We found the end to a dangling art note, either open or close
          // CREATE elementMapObject WITH STATE 3 s
          elementMapObject = new Object();
          elementMapObject.state = 5; // 5 == partial art note ends in this elements
          elementMapObject.artNoteStartElement = danglingArtNoteStartElement;
          elementMapObject.partialArtNoteEndIndex = partialArtNoteObject.partialArtNoteEndIndex; // Index in this element where art note starts
          elementMapObject.artNoteEndElement = -1; // Element ID where art note ends, not yet known
          elementMap[i] = elementMapObject;
          Logger.log ('Found END to dangler in ele ' + i + ', set danglingArtNoteOpen=0, partialArtNoteEndIndex: ' + elementMap[i].partialArtNoteEndIndex);

          elementMapObject = elementMap[danglingArtNoteStartElement];
          elementMapObject.artNoteEndElement = i;
          Logger.log ('Updated START to dangling art note in element ' + danglingArtNoteStartElement + ', partialArtNoteEndIndex: ' + partialArtNoteObject.partialArtNoteEndIndex);
          elementMap[danglingArtNoteStartElement] = elementMapObject;

          danglingArtNoteOpen = 0;
          danglingArtNoteBracketType = -1;
          danglingArtNoteStartElement = -1;
        }
        else {
          // We have an open dangler, but didn't find the end to the dangler.
          // Assume this entire element is art note
          elementMapObject = new Object();
          elementMapObject.state = 6 // 6 == standalone art note text within dangling start and end
          elementMap[i] = elementMapObject;
          //Logger.log('elementMap[' + i + '].state: ' + elementMap[i].state + ' — ART NOTE WITHIN DANGLER — "' + elementText + '"');
          danglingArtNoteEndNotFoundCounter++;
          if (danglingArtNoteEndNotFoundCounter >= 5) {
            // We have an open dangling art note but have gone through X 
            // elements without finding the end. Throw an error.
            okAlert('Error — Failed to idenify art notes', 'We found a line which contained an open "[" or "(", but failed to find the end to that art note on a later line. We apologize for the error.\r\n\r\nPlease search your text for any open "[" or "(" and make sure there is a corresponding close "]" or ")".');
            elementMap = [];
            break;
          }
        }
        continue;
      }
      
      // 1. check if the entire element is an art note
      var result = checkIfEntireElementIsArtNote(elementText);
      if (result[0]) {
        // We know the current complete element is an art note.
        // CREATE elementMapObject WITH STATE 0 
        elementMapObject = new Object();
        elementMapObject.state = 2; // 2 == element is art note
        elementMapObject.start = result[1];
        elementMapObject.end = result[2];
        elementMap[i] = elementMapObject;

        //Logger.log('elementMap[' + i + '].state: ' + elementMap[i].state + ' — ART NOTE — "' + elementText + '" ... start: ' + elementMapObject.start + ', end: ' + elementMapObject.end);
      }
      else {
        // Now we know the current complete element is NOT an art note.
        // But we don't know that it's just text. It could be a line
        // that contains both text and art notes.
        // It could be an art note that starts in one element and spans
        // into another. 
        // So dig deeper.

        // 1. Find [] or () art notes within a line of text.
        // using regex (word1).*(word2)
        var arrayOfNestedArtNotes = checkIfTextStringContainsBracketedArtNotes(elementText);
        if (arrayOfNestedArtNotes.length > 0) {
          //Logger.log('TEXT LINE CONTAINING NESTED ART NOTES: "' + elementText + '"');
          var nestedArtNotes = [];
          for (var j = 0; j < arrayOfNestedArtNotes.length; ++j) {
            var artNoteObject = arrayOfNestedArtNotes[j];
            //Logger.log('Art note [' + j + ']: ' + elementText.substring(artNoteObject.start, artNoteObject.end));

            nestedArtNoteObject = new Object();
            nestedArtNoteObject.start = artNoteObject.start; // start index of this nested art note
            nestedArtNoteObject.end = artNoteObject.end-1; // end index of this nested art note
            nestedArtNotes[j] = nestedArtNoteObject;
          }

          // CREATE elementMapObject WITH STATE 3 AND nestedArtNotes[] POPULATED AND ADD OBJECT TO elementMap
          elementMapObject = new Object();
          elementMapObject.state = 3; // 3 == element has nested art notes
          elementMapObject.nestedArtNotes = nestedArtNotes;
          elementMap[i] = elementMapObject;

          //Logger.log('elementMap[' + i + '].state: ' + elementMap[i].state + ' — NESTED ART NOTES — "' + elementText + '"');
        }
        else {
          //Logger.log('Text is not standalone art note and does not contain any nested art notes "' + elementText + '"\r\nNow look for partial art notes.');
          // Now we know the current complete element is NOT an art note.
          // AND we know it's not a text line containing nested art notes...
          // But it could be an art note that starts in one element and spans
          // into another. 
          // So dig deeper.

          var foundDangler = 0;
          if (0 == danglingArtNoteOpen) {
            partialArtNoteObject = checkForDanglingArtNoteStart(elementText, danglingArtNoteOpen);
            if (partialArtNoteObject) {
              // We found some dangling art notes, either open or close
              // We are looking for the end of an art note
              // If art note open, we consider these an art note ending:
              // ... ] or ... )
              danglingArtNoteOpen = 1;
              danglingArtNoteEndNotFoundCounter = 0;
              danglingArtNoteStartElement = i;
              danglingArtNoteBracketType = partialArtNoteObject.bracketType; // [] or ()
              foundDangler = 1;

              // CREATE elementMapObject WITH STATE 4 s
              elementMapObject = new Object();
              elementMapObject.state = 4; // 4 == partial art note starts in this elements
              elementMapObject.partialArtNoteStartIndex = partialArtNoteObject.partialArtNoteStartIndex; // Index in this element where art note starts
              elementMapObject.artNoteEndElement = -1; // Element ID where art note ends, not yet known
              elementMap[i] = elementMapObject;

              //Logger.log ('Found OPEN to dangler in ele ' + i + ', set danglingArtNoteOpen=1, partialArtNoteStartIndex: ' + elementMap[i].partialArtNoteStartIndex + ', bracketType: ' + danglingArtNoteBracketType);
            }
          }

          if (0 == foundDangler) {
            // Now we know this line is text only.
            // CREATE elementMapObject WITH STATE 0 
            elementMapObject = new Object();
            elementMapObject.state = 1; // 1 == element is text
            elementMap[i] = elementMapObject;

            //Logger.log('elementMap[' + i + '].state: ' + elementMap[i].state + ' — TEXT LINE — "' + elementText + '"');
          }
        }
      }
    }
    else {
      elementMapObject = new Object();
      elementMapObject.state = 0; // non-text 
      elementMap[i] = elementMapObject;
      //Logger.log('elementMap[' + i + '].state: ' + elementMap[i].state + ' — NON-TEXT ELEMENT');
    }
  }

  return elementMap;
}

/**
 * Get applicable document range
 */
function getApplicableRange(forceFullBody) {
  // Determine if we have selection or whole doc
  var doc = DocumentApp.getActiveDocument();

  // Create bodyTextRange which is a range of all 
  // RangeElements in the body
  // If there was a selection, retrieve the Range
  var bodyTextRange = doc.getSelection(); // Returns a Range
  if ((!bodyTextRange) || (1==forceFullBody)) { 
    // If nothing was selected, build a Range of the whole doc
    var body = doc.getBody();
    var rangeBuilder = doc.newRange();
    var firstElement = body.getChild(0); // First element in the body
    rangeBuilder.addElement(firstElement);
    var sibling = firstElement.getNextSibling();
    while (sibling !== null) { // Iterate through other elements adding them to the range
      rangeBuilder.addElement(sibling);
      sibling = sibling.getNextSibling();
    }
    bodyTextRange = rangeBuilder.build();
  }

  return bodyTextRange;
}

/**
 * From either a partial or full element, extract
 * and return the elementText.
 */
function getElementTextFromElement(element) {
  // Get "elementText" from element
  var elementText = null;
  if (element.isPartial()) {
    //Logger.log('element: ' + element + ', Partial element');

    var elementAsText = element.getElement().asText();
    var startIndex = element.getStartOffset();
    var endIndex = element.getEndOffsetInclusive();
    elementText = elementAsText.getText().substring(startIndex, endIndex + 1);
  } else 
  {
    //Logger.log('element: ' + element + ', Full element');
    
    var fullElement = element.getElement();
    
    // Only translate elements that can be edited as text; skip images and
    // other non-text elements.
    if (fullElement.editAsText) {
      elementText = fullElement.asText().getText();
    }
  }
  return elementText;
}

/**
 * Check if a string of text is DEFINITELY an art note based
 * on a series of rules.
 */
function checkIfEntireElementIsArtNote(elementText) {
  // Check if line is contained in square brackets
  var s = elementText.replace(/\r\n|\r|\n/g, " ");
  var punctuationless = s.replace(/.,\/#—!$%\^&\*;:{}=\-_`~"?“”/g," ");
  var finalString = punctuationless.replace(/\s{2,}/g," ");
  var finalStringWithoutWhitespace = finalString.trim();
  var string = finalStringWithoutWhitespace.toString();
  var brackets = 0;

  var startSubstring = string.substring(0,1);
  var endSubstring = string.substring(finalStringWithoutWhitespace.length-1, finalStringWithoutWhitespace.length);

  // Check if first element contains [
  if (-1 != startSubstring.indexOf("[")) brackets++;

  // Check if last element contains ]
  if (-1 != endSubstring.indexOf("]")) brackets++;

  // Return true for any line that is [inside brackets]
  if (2 == brackets) {
    Logger.log('checkIfEntireElementIsArtNote return TRUE because [ ]')
    return [true, elementText.indexOf('['), elementText.indexOf(']')];
  }

  //  Logger.log('startSubstring: ' + startSubstring + ', endSubstring: ' + endSubstring + ', finalStringWithoutWhitespace.length: ' + finalStringWithoutWhitespace.length + ', brackets: ' + brackets);
  brackets = 0; // reset back to zero
  // Check if first element contains [
  if (-1 != startSubstring.indexOf("(")) brackets++;

  // Check if last element contains ]
  if (-1 != endSubstring.indexOf(")")) brackets++;

  // If an element is (inside parentheses)
  // It may be a complete art note, but we need to also
  // Look for the magic words
  if (2 == brackets) {

    lowerCase = elementText.toLowerCase();

    // Check for
    // "illo:"
    // "illus:"
    // "illus."
    // "illus note"
    // "art note"
    // "action note"
    // "illustration note"
    // "art:"

    var matches = lowerCase.match( /illo:|illus:|illus.|illus note|art note|action note|illustration note|art:/g );

    if (matches) {
      Logger.log('checkIfEntireElementIsArtNote return TRUE because ( ) plus a magic word')
      return [true, elementText.indexOf('('), elementText.indexOf(')')];
    }
  }

  return [false, -1, -1];
}

/**
 * Check if a string of text is DEFINITELY an art note based
 * on a series of rules.
 */
function checkIfTextStringContainsBracketedArtNotes(elementText) {
  // Check if line is contained in square brackets
  var s = elementText.replace(/\r\n|\r|\n/g, " ");
  var punctuationless = s.replace(/.,\/#—!$%\^&\*;:{}=\-_`~"?“”/g," ");
  var finalString = punctuationless.replace(/\s{2,}/g," ");
  var finalStringWithoutWhitespace = finalString.trim();
  var string = finalStringWithoutWhitespace.toString();

  // This function returns an array of art notes
  // that are contained in this line of text
  // For each art note: start index, end index
  var arrayOfArtNotes = [];
  var numberOfArtNotes = 0;

  // Find all matches for [...] within this string, cycle through them
  // and add their indices to an array of object.
  var matches = string.match( /(\[).*(\])/g );
  if (matches) {
    Logger.log('checkIfTextStringContainsBracketedArtNotes — text line contains [...]')
    
    for (var i = 0; i < matches.length; ++i) {
      var start = elementText.indexOf(matches[i]);
      var length = matches[i].length;
      var end = start + length;

      var artNoteObject = new Object();
      artNoteObject.start = start;
      artNoteObject.end = end;

      arrayOfArtNotes[numberOfArtNotes] = artNoteObject;
      numberOfArtNotes++;

      //Logger.log('matches[i]: ' + matches[i] + ', start: ' + start + ', length: ' + length + ', end: ' + end + ', numberOfArtNotes: ' + numberOfArtNotes);
    }
  }
  
  var matches = string.match( /(\().*(\))/g );
  if (matches) {
    // Loop through all substrings in the element that are (...)
    for (var i = 0; i < matches.length; ++i) {
      // Extract the substring inside (...)
      var start = elementText.indexOf(matches[i]);
      var length = matches[i].length;
      var end = start + length;
      var substringWithinParen = elementText.substring(start, end);

      // Convert to lowercase and  check for magic words
      lowerCase = substringWithinParen.toLowerCase();
      //Logger.log('substringWithinParen: ' + substringWithinParen);
      var magicWordMatches = lowerCase.match( /illo:|illus:|illus.|illus note|art note|action note|illustration note|art:/g );
      if (magicWordMatches) {
        //Logger.log('Text line contains (...) plus a magic word')

        var artNoteObject = new Object();
        artNoteObject.start = start;
        artNoteObject.end = end;

        arrayOfArtNotes[numberOfArtNotes] = artNoteObject;
        numberOfArtNotes++;

        //Logger.log('matches[i]: ' + matches[i] + ', start: ' + start + ', length: ' + length + ', end: ' + end + ', numberOfArtNotes: ' + numberOfArtNotes);
      }
    }
  }

  return arrayOfArtNotes;
}

/**
 * Check if a string of text contains the start 
 * of an art note, but not the whole art note.
 */
function checkForDanglingArtNoteStart(elementText) {
  // Check if line is contained in square brackets
  var s = elementText.replace(/\r\n|\r|\n/g, " ");
  var punctuationless = s.replace(/.,\/#—!$%\^&\*;:{}=\-_`~"?“”/g," ");
  var finalString = punctuationless.replace(/\s{2,}/g," ");
  var finalStringWithoutWhitespace = finalString.trim();
  var string = finalStringWithoutWhitespace.toString();

  var partialArtNoteObject = new Object();

  // Find all matches for ...[... within this string, cycle through them
  // and add their indices to an array of object.
  var matches = string.match( /\[/ );
  if (matches) {
    partialArtNoteObject.partialArtNoteStartIndex = elementText.indexOf(matches[matches.length-1]); // - index in this element where art note starts
    partialArtNoteObject.bracketType = 0; // []
    Logger.log('checkForDanglingArtNoteStart — text line contains [... partialArtNoteStartIndex: ' + partialArtNoteObject.partialArtNoteStartIndex);
    return partialArtNoteObject;
  }
  
  var matches = string.match( /\(/ );
  if (matches) {
    Logger.log('checkForDanglingArtNoteStart — text line contains (...')

    // Extract the substring inside (...)
    var start = elementText.indexOf(matches[matches.length-1]);
    var length = matches[matches.length-1].length;
    var end = start + length;
    var substringWithinParen = elementText.substring(start, elementText.length);

    // Convert to lowercase and  check for magic words
    lowerCase = substringWithinParen.toLowerCase();
    //Logger.log('matches.length-1: ' + (matches.length-1) + ', start: ' + start + ', length: ' + length + ', end: '+ end + ', substringWithinParen: ' + substringWithinParen);
    //Logger.log('substringWithinParen: ' + substringWithinParen);
    var magicWordMatches = lowerCase.match( /illo:|illus:|illus.|illus note|art note|action note|illustration note|art:/g );
    if (magicWordMatches) {
      partialArtNoteObject.partialArtNoteStartIndex = elementText.indexOf(matches[matches.length-1]); // - index in this element where art note starts
      partialArtNoteObject.bracketType = 1; // ()
      Logger.log('Text line contains dangling (... plus a magic word ... partialArtNoteStartIndex: ' + partialArtNoteObject.partialArtNoteStartIndex);
      return partialArtNoteObject;
    }
  }

  return null;
}

/**
 * Check if a string of text contains the start 
 * of an art note, but not the whole art note.
 */
function checkForDanglingArtNoteEnd(elementText, danglingArtNoteBracketType) {
  // Check if line is contained in square brackets
  var s = elementText.replace(/\r\n|\r|\n/g, " ");
  var punctuationless = s.replace(/.,\/#—!$%\^&\*;:{}=\-_`~"?“”/g," ");
  var finalString = punctuationless.replace(/\s{2,}/g," ");
  var finalStringWithoutWhitespace = finalString.trim();
  var string = finalStringWithoutWhitespace.toString();

  var partialArtNoteObject = new Object();

  if (0 == danglingArtNoteBracketType) {
    // Search for ... ]
    var matches = string.match( /\]/ );
    if (matches) {
      partialArtNoteObject.partialArtNoteEndIndex = elementText.indexOf(matches[matches.length-1]); // Index in this element where art note ends
      Logger.log('checkForDanglingArtNoteEnd — text line contains ...] partialArtNoteEndIndex: ' + partialArtNoteObject.partialArtNoteEndIndex);
      return partialArtNoteObject;
    }
  }
  else {
    // Search for ... )
    var matches = string.match( /\)/ );
    if (matches) {
      partialArtNoteObject.partialArtNoteEndIndex = elementText.indexOf(matches[matches.length-1]); // Index in this element where art note ends
      Logger.log('checkForDanglingArtNoteEnd — text line contains ...) partialArtNoteEndIndex: ' + partialArtNoteObject.partialArtNoteEndIndex);
      return partialArtNoteObject;
    }
  }
  
  return null;
}

/**
 * Count words in a text element.
 * Simpler function that doesn't do art 
 * note checks,.
 */
/*function countWordsSimple(elementText) {
  //Logger.log('countWordsSimple(' + elementText + ')');
  var wordCount = 0;

  if (elementText.length === 0) {
    return 0;
  }

  // Count the words in the line
  //A simple \n replacement didn't work, neither did \s not sure why
  var s = elementText.replace(/\r\n|\r|\n/g, " ");
  //Logger.log('s: ' + s);

  // We want compound words like spear-in-your-ankle to count as one
  // but spear - in - your - ankle to count as 4
  // So replace standalone hyphens with spaces " "
  var compoundWordsFixed = s.replace(/\s-\s/g," ");
  //Logger.log('compoundWordsFixed: ' + compoundWordsFixed);
  
  //In cases where you have "...last word.First word..." 
  //it doesn't count the two words around the period.
  //so I replace all punctuation with a space
  //var punctuationless = compoundWordsFixed.replace(/[.,\/#—!$%\^&\*;:{}=\-_`~()"?“”…\[\]]/g," ");
  var punctuationless = compoundWordsFixed.replace(/[.,\/#—!$%\^&\*;:{}=\_-`~()"?“”…\[\]]/g," ");
  //Logger.log('punctuationless: ' + punctuationless);

  //Finally, trim it down to single spaces (not sure this even matters)
  var finalString = punctuationless.replace(/\s{2,}/g," ");
  //Logger.log('finalString: ' + finalString);

  if (isEmptyOrSpaces(finalString)) {
    Logger.log('finalString was only whitespace');
    return 0;
  }

  //Actually count it
  var words = finalString.trim().split(/\s+/)

  wordCount = words.length;
  // Logger.log('words: ' + wordCount);
  // for (var j = 0; j < wordCount; ++j) {
  //   Logger.log('words[' + j + '] = '+words[j]);
  // }

  return wordCount;
}*/

/**
 * Count words, characters, and paragraphs in a text element.
 */
function countWordsComplex(elementText) {
  //Logger.log('countWordsComplex(' + elementText + ')');

  var countObject = new Object();
  countObject.words = 0; 
  countObject.characters = 0;
  countObject.dialogNames = 0;

  if (elementText.length === 0) {
    return countObject;
  }

  // Count the words in the line
  //A simple \n replacement didn't work, neither did \s not sure why
  var s = elementText.replace(/\r\n|\r|\n/g, " ");
  //Logger.log('s: ' + s);

  // We want compound words like spear-in-your-ankle to count as one
  // but spear - in - your - ankle to count as 4
  // So replace standalone hyphens with spaces " "
  var compoundWordsFixed = s.replace(/\s-\s/g," ");
  //Logger.log('compoundWordsFixed: ' + compoundWordsFixed);
  
  //In cases where you have "...last word.First word..." 
  //it doesn't count the two words around the period.
  //so I replace all punctuation with a space
  //var punctuationless = compoundWordsFixed.replace(/[.,\/#—!$%\^&\*;:{}=\-_`~()"?“”…\[\]]/g," ");
  var punctuationless = compoundWordsFixed.replace(/[.,\/#—!$%\^&\*;:{}=\_-`~()"?“”…\[\]]/g," ");
  //Logger.log('punctuationless: ' + punctuationless);

  //Finally, trim it down to single spaces (not sure this even matters)
  var finalString = punctuationless.replace(/\s{2,}/g," ");
  //Logger.log('finalString: ' + finalString);

  if (isEmptyOrSpaces(finalString)) {
    Logger.log('finalString was only whitespace');
    return countObject;
  }

  //Actually count it
  var words = finalString.trim().split(/\s+/)

  countObject.words = words.length;
  countObject.characters = finalString.length;
  countObject.dialogNames = 0;
  /*Logger.log('words: ' + wordCount);
  for (var j = 0; j < wordCount; ++j) {
    Logger.log('words[' + j + '] = '+words[j]);
  }*/

  return countObject;
}

/**
 * Check if string is nothing but empty spaces (to avoid word count error)
 */
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

/**
 * Finds all art notes and updates the fformatting
 * on them based on the type and setting.
 */
function updatFormattingAllTypes(type, setting) {
  Logger.log('updatFormattingAllTypes');
  // type
  // 1 = color
  // 2 = italics
  // 3 = align
  // 4 = highlighter
  // 5 = align plus tab

  var cursorOriginal = DocumentApp.getActiveDocument().getCursor();
  var numberOfArtNotes = 0;
  var offset = 0;
  if ((2 == type) || (4 == type)) {
    offset = 1; // Set to 1 to NOT include brackets in color changes
  }
 
  // Always use the whole document for highlight toggle
  var forceFullBody = 0;
  if (4 == type) { // highlighter
    forceFullBody=1;
  }
  // bodyTextRange is a range of elements
  bodyTextRange = getApplicableRange(forceFullBody);

  // Contains one elementMapObject for every element in the selection or doc
  var elementMap = buildElementMap(bodyTextRange); 

  if (elementMap.length > 0) {
    var elements = bodyTextRange.getRangeElements(); // RangeElement[] array
    Logger.log('These should match. elementMap.length: ' + elementMap.length + ', elements.length: ' + elements.length)

    // Loop through element map to calculate word count
    for (var i = 0; i < elementMap.length; ++i) {
      elementMapObject = elementMap[i]; // the object at i in our map
      //Logger.log('i: '+ i + ', elementMapObject.state: ' + elementMapObject.state)
      if (0 == elementMapObject.state) {
        //Logger.log('elementMap[' + i + '] — Non-text object')
        continue; // Don't try to format
      }
      else if (1 == elementMapObject.state) {
        //Logger.log('elementMap[' + i + '] — Text')
        continue; // Don't try to format
      }
      else {
        var elementText = getElementTextFromElement(elements[i]); // the actual textElement at i
        var element = elements[i].getElement();

        if (2 == elementMapObject.state) {
          //Logger.log('elementMap[' + i + '] — Art notes — elementText: ' + elementText);
          numberOfArtNotes++;

          var start = elementMapObject.start + offset // 1;
          var end = elementMapObject.end - offset; // elementText.length-2;
          updateFormat(i, element, start, end, type, setting);
        }
        else if (6 == elementMapObject.state) {
          //Logger.log('elementMap[' + i + '] — Art notes — elementText: ' + elementText);
          numberOfArtNotes++;

          // TODO: known issue... with intermediate lines between
          // dangling art notes, alignment might not work correctly.

          var start = 0;
          var end = elementText.length-1;
          updateFormat(i, element, start, end, type, setting);
        }
        else if (3 == elementMapObject.state) {
          //Logger.log('elementMap[' + i + '] — Text with nested art notes — elementText: ' + elementText);

          if ((3 == type) || (5 == type)) continue; // Don't change alignment for text lines with nested art notes

          var nestedArtNotes = elementMapObject.nestedArtNotes;
          for (var j = 0; j < nestedArtNotes.length; ++j) {
            var artNoteObject = nestedArtNotes[j];
            //Logger.log('Art note [' + j + ']: ' + elementText.substring(artNoteObject.start, artNoteObject.end));

            var start = artNoteObject.start + offset; // start index of this nested art note
            var end = artNoteObject.end - offset; // end index of this nested art note
            
            updateFormat(i, element, start, end, type, setting);
            numberOfArtNotes++;
          }
        }
        else if (4 == elementMapObject.state) {
          //Logger.log('elementMap[' + i + '] — Combination of text and partial art note start — elementText: ' + elementText);

          // if state == 4, this will be populated to contain
          // info about partial art note that started in this element
          var start = elementMapObject.partialArtNoteStartIndex + offset // Index in this element where art note starts
          var end = elementText.length - 1;

          if (((3 == type) || (5 == type)) && (start > 2)) {
            continue; // Don't change alignment for lines with real text on them
          }

          updateFormat(i, element, start, end, type, setting);

          numberOfArtNotes++;
        }
        else if (5 == elementMapObject.state) {
          Logger.log('elementMap[' + i + '] — Combination of text and partial art note end — elementText: ' + elementText);
          
          // if state == 5, this will be populated to contain
          // info about partial art note that ended in this element
          var start = 0;
          var end = elementMapObject.partialArtNoteEndIndex - offset; // Index in this element where art note ends

          if (((3 == type) || (5 == type)) && (end < (elementText.length - 2))) {
            continue; // Don't change alignment for lines with real text on them
          }

          updateFormat(i, element, start, end, type, setting);
        }
      } 
    }
  }
  
  if (0 == numberOfArtNotes) {
    noArtNotesDetected();
  }
  else if (cursorOriginal) {
    DocumentApp.getActiveDocument().setCursor(cursorOriginal);
  }
}

function updateFormat(index, element, start, end, type, setting) {
  Logger.log('updateFormat(' + index + ', ' + element.getText() + ', '+start+', ' + end + ', ' + type + ', ' + setting);
  // type
  // 1 = color
  // 2 = italics
  // 3 = align
  // 4 = highlighter
  // 5 = align left plus tabs

  if ((end-start) < 2) {
    Logger.log('1 or fewer characters - do not try to format')
    return;
  }

  // Added due to error encountered in production Sep 13 2021: Index (-1) 
  // value must be greater or equal to zero. Exception: Index (-1) value 
  // must be greater or equal to zero. at updateFormat(AuthorTools:1091:37) 
  // at updatFormattingAllTypes(AuthorTools:1029:13) at 
  // textGrayMenuItemClicked(AuthorTools:1235:3)
  if ((-1 == start) || (-1 == end)) {
    Logger.log('Start ('+start+') or end ('+end+') was -1 - do not try to format')
    return;
  }

  switch(type) {
    case 1: // color
      element.asText().editAsText().setForegroundColor(start, end, setting);
    break;
    case 2: // italics
      element.asText().editAsText().setItalic(start, end, (1 == setting)?true:false);
    break;
    case 3: // align
      var paragraph;
      var text = element.asText();
      if (text.getType() == DocumentApp.ElementType.PARAGRAPH) { 
        paragraph = text;
      }
      else if (text.getType() == DocumentApp.ElementType.TEXT) { 
        paragraph = text.getParent();
      }
      
      if (paragraph.getType() == DocumentApp.ElementType.PARAGRAPH) {
        paragraph.asParagraph().setAlignment(setting);
        paragraph.asParagraph().setIndentStart(0);
        paragraph.asParagraph().setIndentFirstLine(0);
      }
      else {
        Logger.log('paragraph was not PARAGRAPH. type: ' + paragraph.getType());
      }
    break;
    case 4: // highlighter
      var highlighter = '#ccff00';
      var text = element.asText().editAsText(); // Text.editAsText() Obtains a Text version of the current element, for editing
      if (text.getBackgroundColor(start) == highlighter) {
        text.setBackgroundColor(start, end, null);
      }
      else {
        text.setBackgroundColor(start, end, highlighter);
      }
      break;
    case 5: // align left plus tab
      var paragraph;
      var text = element.getText() // getText() Return String — the contents of the element as text string
      Logger.log('1. align left plus tab — text: ' + text);
      
      textSubstring = text.substring(0, 1);

      // Tab characters and 'indentation' are two different things
      
      var indent = element.getIndentStart();
      var indentFirstLine = element.getIndentFirstLine();
      Logger.log('  indent: ' + indent + ', indentFirstLine:' + indentFirstLine);

      // Remove start indents
      if (indent > 0) {
        Logger.log('  Set indent to 0');
        element.asParagraph().setIndentStart(0);
      }
      else {
        Logger.log('  indent = 0 or null?');
      }

      // Remove first line indents
      if (indentFirstLine > 0) {
        Logger.log('  Set indentFirstLine to 0');
        element.asParagraph().setIndentFirstLine(0);
      }
      else {
        Logger.log('  indentFirstLine = 0 or null ?');
      }

      // Make sure paragraph is left aligned
      element.asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);

      // Remove space and tab characters at start of line
      // TODO: PROBLEM THIS REMOVES TEXT COLOR AND ITALICS
      // Save off element color and style first and then set them back?
      // element.setText(text.trim().toString())

      // Add first line indent back to paragraph
      element.setIndentStart(36*setting);
      element.setIndentFirstLine(36*setting);
    break;    default:
    ;
  }
}

/**
 * Sets all art notes to left-align
 */
function alignLeftMenuItemClicked() {
  updatFormattingAllTypes(3, DocumentApp.HorizontalAlignment.LEFT);
}

/**
 * Sets all art notes to right-align
 */
function alignRightMenuItemClicked() {
  updatFormattingAllTypes(3, DocumentApp.HorizontalAlignment.RIGHT);
}

/**
 * Sets all art notes to left-align with 1 tab
 */
function alignLeftTabOneMenuItemClicked() {
  updatFormattingAllTypes(5, 1);
}

/**
 * Sets all art notes to left-align with 2 tab
 */
function alignLeftTabTwoMenuItemClicked() {
  updatFormattingAllTypes(5, 2);
}

/**
 * Highlights art notes yellow, or removes highlighting.
 * Useful for checking if the script is detecting art
 * notes correctly.
 */
function highlightingMenuItemClicked() {
  Logger.log('highlightingMenuItemClicked');
  updatFormattingAllTypes(4, null);
}

/**
 * Change text color of art notes to black.
 */
function textBlackMenuItemClicked() {
  updatFormattingAllTypes(1, '#000000');
}

/**
 * Change text color of art notes to black.
 */
function textBlueMenuItemClicked() {
  updatFormattingAllTypes(1, '#0000ff');
}

/**
 * Change text color of art notes to red.
 */
function textRedMenuItemClicked() {
  updatFormattingAllTypes(1, '#ff0000');
}

/**
 * Change text color of art notes to gray.
 */
function textGrayMenuItemClicked() {
  updatFormattingAllTypes(1, '#5b5b5b');
}

/**
 * Change text color of art notes to gray.
 */
function textLightGrayMenuItemClicked() {
  updatFormattingAllTypes(1, '#8e8e8e');
}

/**
 * Sets art notes italics to ON.
 */
function italicsOnMenuItemClicked() {
  Logger.log('italicsOnMenuItemClicked()');
  updatFormattingAllTypes(2, 1)
}

/**
 * Sets art notes italics to OFF.
 */
function italicsOffMenuItemClicked() {
  Logger.log('italicsOnMenuItemClicked()');
  updatFormattingAllTypes(2, 0);
}

/**
 * Display an alert that says no art notes were found.
 */
function noArtNotesDetected() {
  okAlert('Error', 'No art notes detected.');
}

/**
 * Display a generic Ok button alert
 */
function okAlert(title, text) {
  var ui = DocumentApp.getUi(); // Same variations.
  ui.alert(title, text, ui.ButtonSet.OK);
}

/**
 * User confirm before all comments in the document.
 */
/*function deleteCommentsMenuItemClicked() {
  // TODO: ask confirmation
  deleteAllComments();
}*/

/**
 * Delete all comments in the document.
 */
/*function deleteAllComments() {
  // TODO: not currently supported by API
}*/

//Custom Sidebar
function sidebar(){
  var ui = DocumentApp.getUi();
  var html = HtmlService
    .createTemplateFromFile("index")
    .evaluate();
  
  html.setTitle("Standard Color Test");
  ui.showSidebar(html);

};

/**
 * Change text color of art notes to black.
 * TODO custom color picker
 */
function textCustomMenuItemClicked(){
  var ui = DocumentApp.getUi();
  var html = HtmlService
    .createTemplateFromFile("index")
    .evaluate();
  ui.showModalDialog(html, "Pick a color");
};

// Creates an import or include function so files can be added 
// inside the main index.
function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};

//Receives data from prompt or sidebar and updates the first cell.
function receiveData(data){
  if(data[0].indexOf("Select") !== -1){
    DocumentApp.getUi().alert("You need to select a color!");
    return;
  };
  updatFormattingAllTypes(1, data[0]);
}

/**
 * Highlight list of words passed in
 */
function detectWordList(wordArrayLowerCase, label, labelCap) {
  Logger.log('detectWordList()');

  // 1. GET ARRAY OF ALL WORDS IN MANUSCRIPT

  // If there was a selection -> retrieve the Range
  // If nothing was selected -> build a Range of the whole doc
  var bodyTextRange = getApplicableRange(0); // Returns a 'Range'
  var elements = bodyTextRange.getRangeElements(); // RangeElement[]
  
  // Make one big string containing all the words
  var totalText = ' ';
  for (var i = 0; i < elements.length; ++i) {
    //Logger.log('\r\nElement ' + i);
    // Get "elementText" from element[i]. elements[i] is a RangeElement
    var elementText = getElementTextFromElement(elements[i])
    if (elementText) {
      // This check is necessary to exclude images, which return a blank
      // text element.
      totalText = totalText + ' ' + elementText;
    }
  }

  // Clean up special characters
  //Logger.log('totalText: ' + totalText);
  //A simple \n replacement didn't work, neither did \s not sure why
  var s = totalText.replace(/\r\n|\r|\n/g, " ");
  // We want compound words like spear-in-your-ankle to count as one
  // but spear - in - your - ankle to count as 4
  // So replace standalone hyphens with spaces " "
  var compoundWordsFixed = s.replace(/\s-\s/g," ");
  //Logger.log('compoundWordsFixed: ' + compoundWordsFixed);
  //In cases where you have "...last word.First word..." 
  //it doesn't count the two words around the period.
  //so I replace all punctuation with a space
  var punctuationless = compoundWordsFixed.replace(/[.,\/#—!$%\^&\*;:{}=\_-`’'~()"?“”…\[\]]/g,"");
  //Logger.log('punctuationless: ' + punctuationless);
  //Finally, trim it down to single spaces (not sure this even matters)
  var noDoubleSpaces = punctuationless.replace(/\s{2,}/g," ");
  //Logger.log('noDoubleSpaces: ' + noDoubleSpaces);
  
  var finalString = noDoubleSpaces.toLowerCase();

  if (isEmptyOrSpaces(finalString)) {
    Logger.log('finalString was only whitespace');
    okAlert('Error — No text', 'Either your document has no text, or you selected a portion of the document with no text.');
    return;
  }

  var wordsArray = finalString.replace(/[.]/g, '').split(/\s/);

  // 2. GET ARRAY OF ALL WORDS (passed in as argument noe)

  // 3. Intersect the two arrays
  var filteredArray = wordsArray.filter(function(n) {
    return wordArrayLowerCase.indexOf(n) !== -1;
  });

  if (filteredArray.length == 0) {
    // NO WORDS FOUND
    Logger.log('filteredArray.length == 0');
    if (!DocumentApp.getActiveDocument().getSelection()) {
      okAlert('No ' + label + ' detected', 'No ' + label + ' were detected in the document.');
    }
    else {
      okAlert('No ' + label + ' detected', 'No ' + label + ' were detected in the selected text.');
    }
    return;
  }
  else {
    // WORDS FOUND
    // Create a map of words and frequencies and sort by value
    var wordFreqMap = wordFreqFromArray(filteredArray);
    var mapSort1 = new Map([...wordFreqMap.entries()].sort((a, b) => b[1] - a[1]));
    //Logger.log(mapSort1);

    // Convert map to array, and keep only top 15 words
    var arr = [...mapSort1].map(([name, value]) => ({ name, value }));

    htmlString = '<body style="word-break:break-word;font-size:100%;font-family:sans-serif;">'
    for (var i = 0; i < arr.length; ++i) {
      Logger.log('arr['+i+']: '+ arr[i].name + ', - ' + arr[i].value);
      if (arr[i].value > 1) {
        var tm = "times"
      }
      else {
        var tm = "time"
      }
      htmlString = htmlString + capitalizeFirstLetter(arr[i].name) + ' — ' + arr[i].value + ' ' + tm + '<br>'
      // if (arr[i].value > maxOccurences) maxOccurences = arr[i].value;
      // if (arr[i].value < minOccurences) minOccurences = arr[i].value;
    }
    htmlString = htmlString + '</body>';
    Logger.log('htmlString: ' + htmlString);

    var htmlOutput = HtmlService.createHtmlOutput(htmlString);
    //.setWidth(425) //optional
    //.setHeight(150); //optional
    DocumentApp.getUi().showModalDialog(htmlOutput,  labelCap);
  }
}

/**
 * Highlight adverbs
 */
function detectAdverbsMenuItemClicked() {
  Logger.log('detectAdverbsMenuItemClicked()');

  adverbs(true);
}

/**
 * Show list of adverbs
 */
function showAdverbsMenuItemClicked() {
  Logger.log('showAdverbsMenuItemClicked()');

  adverbs(false);
}

/**
 * Either detect all adverbs or show list of adverbs depending on the argument
 */
function adverbs(detect) {
  Logger.log('adverbs()');

  var adverbArrayLowerCase = ["abnormally", "abruptly", "absently", "absentmindedly", "accidentally", "accusingly", "actually", "adventurously", "adversely", "amazingly", "angrily", "anxiously", "arrogantly", "awkwardly", "badly", "bashfully", "beautifully", "bitterly", "bleakly", "blindly", "blissfully", "boastfully", "boldly", "bravely", "briefly", "brightly", "briskly", "broadly", "busily", "calmly", "carefully", "carelessly", "cautiously", "certainly", "cheerfully", "clearly", "cleverly", "closely", "coaxingly", "colorfully", "continually", "coolly", "correctly", "courageously", "crossly", "cruelly", "curiously", "daintily", "daringly", "dearly", "deceivingly", "deeply", "defiantly", "deliberately", "delightfully", "desperately", "determinedly", "diligently", "dimly", "doubtfully", "dreamily", "eagerly", "easily", "elegantly", "energetically", "enormously", "enthusiastically", "especially", "evenly", "eventually", "excitedly", "extremely", "fairly", "faithfully", "famously", "fatally", "ferociously", "fervently", "fiercely", "fondly", "foolishly", "fortunately", "frankly", "frantically", "freely", "frenetically", "frightfully", "fully", "furiously", "generally", "generously", "gently", "gladly", "gleefully", "gracefully", "gratefully", "greatly", "greedily", "happily", "harshly", "hastily", "healthily", "heartily", "heavily", "helpfully", "helplessly", "highly", "honestly", "hopelessly", "hungrily", "hurriedly", "immediately", "inadequately", "increasingly", "innocently", "inquisitively", "instantly", "intensely", "intently", "interestingly", "inwardly", "irritably", "jaggedly", "jealously", "jovially", "joyfully", "joyously", "jubilantly", "judgmentally", "justly", "keenly", "kiddingly", "kindheartedly", "kindly", "knavishly", "knowingly", "knowledgeably", "kookily", "lazily", "lightly", "limply", "lively", "loftily", "longingly", "loosely", "loudly", "lovingly", "loyally", "madly", "majestically", "meaningfully", "mechanically", "merrily", "miserably", "mockingly", "mortally", "mysteriously", "naturally", "neatly", "nervously", "nicely", "noisily", "obediently", "obnoxiously", "oddly", "offensively", "officially", "openly", "optimistically", "overconfidently", "painfully", "partially", "patiently", "perfectly", "physically", "playfully", "politely", "poorly", "positively", "potentially", "powerfully", "promptly", "properly", "proudly", "punctually", "quaintly", "queasily", "questionably", "quicker", "quickly", "quietly", "quirkily", "quizzically", "randomly", "rapidly", "ravenously", "readily", "reassuringly", "recklessly", "regularly", "reluctantly", "repeatedly", "reproachfully", "restfully", "righteously", "rightfully", "rigidly", "roughly", "rudely", "sadly", "safely", "scarcely", "scarily", "searchingly", "sedately", "seemingly", "seldom", "selfishly", "separately", "seriously", "shakily", "sharply", "sheepishly", "shrilly", "shyly", "silently", "sleepily", "slowly", "smoothly", "softly", "solemnly", "solidly", "speedily", "stealthily", "sternly", "strictly", "stubbornly", "stupidly", "successfully", "suddenly", "supposedly", "surprisingly", "suspiciously", "sweetly", "swiftly", "sympathetically", "tenderly", "tensely", "terribly", "thankfully", "thoroughly", "thoughtfully", "tightly", "tremendously", "triumphantly", "truly", "truthfully", "ultimately", "unabashedly", "unaccountably", "unbearably", "understandingly", "unethically", "unexpectedly", "unfortunately", "unhappily", "unimpressively", "unnaturally", "unnecessarily", "unwillingly", "urgently", "usefully", "uselessly", "usually", "utterly", "vacantly", "vaguely", "vainly", "valiantly", "vastly", "verbally", "viciously", "victoriously", "violently", "vivaciously", "voluntarily", "warmly", "weakly", "wearily", "wetly", "wholly", "wildly", "willfully", "wisely", "woefully", "wonderfully", "worriedly", "wrongly", "yawningly", "yearly", "yearningly", "yieldingly", "youthfully", "zealously", "zestfully", "zestily"];

  if (detect) {
      detectWordList(adverbArrayLowerCase, "adverbs", "Adverbs detected!");
      return;
  }

  // Display list of bad rhyming words
  htmlString = '<body style="word-break:break-word;font-size:100%;font-family:sans-serif;">'
  arr = adverbArrayLowerCase;
  for (var i = 0; i < arr.length; ++i) {
    htmlString = htmlString + capitalizeFirstLetter(arr[i]) + '<br>'
  }
  htmlString = htmlString + '</body>';
  Logger.log('htmlString: ' + htmlString);

  var htmlOutput = HtmlService.createHtmlOutput(htmlString);
  DocumentApp.getUi().showModalDialog(htmlOutput, "List of adverbs used in 'adverb detector'");
}

/**
 * Detect problematic rhyming words
 */
function detectBadRhymingWordsMenuItemClicked() {
  Logger.log('detectBadRhymingWordsMenuItemClicked()');

  badRhymingWords(true);
}

/**
 * Show list of problematic rhyming words
 */
function showBadRhymingWordsMenuItemClicked() {
  Logger.log('showBadRhymingWordsMenuItemClicked()');

  badRhymingWords(false);
}

function badRhymingWords(detect) {
  Logger.log('badRhymingWords()');

  var rhymeWordArrayLowerCase = ["actually", "again", "buyer", "camera", "caramel", "chocolate", "choir", "comfortable", "crayon", "different", "drawer", "every", "extraordinary", "family", "favorite", "file", "finally", "fire", "fired", "flower", "glorious", "gnarled", "grocery", "hour", "idea", "into", "interesting", "laboratory", "layer", "liar", "library", "loyal", "mayonnaise", "oil", "orange", "pile", "poem", "probably", "restaurant", "royal", "school", "schools", "schoolhouse", "separate", "shower", "sizzling", "smile", "squirrel", "steal", "steel", "style", "sure", "tire", "tired", "toward", "while", "wild"];

  if (detect) {
      detectWordList(rhymeWordArrayLowerCase, "problematic rhyme words", "Syllabically ambiguous words detected");
      return;
  }

  // Display list of bad rhyming words
  htmlString = '<body style="word-break:break-word;font-size:100%;font-family:sans-serif;">'
  arr = rhymeWordArrayLowerCase;
  for (var i = 0; i < arr.length; ++i) {
    htmlString = htmlString + capitalizeFirstLetter(arr[i]) + '<br>'
  }
  htmlString = htmlString + '</body>';
  Logger.log('htmlString: ' + htmlString);

  var htmlOutput = HtmlService.createHtmlOutput(htmlString);
  DocumentApp.getUi().showModalDialog(htmlOutput, "List of problematic / syllabically ambiguous words");

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Show a word cloud of the most frequently used words
 */
function wordFrequencyMenuItemClicked() {
  Logger.log('wordFrequencyMenuItemClicked()');


}

/**
 * Show a word cloud of the most frequently used words
 */
function wordCloudMenuItemClicked() {
  Logger.log('wordCloudMenuItemClicked()');
  // If there was a selection -> retrieve the Range
  // If nothing was selected -> build a Range of the whole doc
  var bodyTextRange = getApplicableRange(0); // Returns a 'Range'
  var elements = bodyTextRange.getRangeElements(); // RangeElement[]
  
  // Make one big string containing all the words
  var totalText = ' ';
  for (var i = 0; i < elements.length; ++i) {
    //Logger.log('\r\nElement ' + i);
    // Get "elementText" from element[i]. elements[i] is a RangeElement
    var elementText = getElementTextFromElement(elements[i])
    if (elementText) {
      // This check is necessary to exclude images, which return a blank
      // text element.
      totalText = totalText + ' ' + elementText;
    }
  }

  // Clean up special characters
  //Logger.log('totalText: ' + totalText);
  //A simple \n replacement didn't work, neither did \s not sure why
  var s = totalText.replace(/\r\n|\r|\n/g, " ");
  // We want compound words like spear-in-your-ankle to count as one
  // but spear - in - your - ankle to count as 4
  // So replace standalone hyphens with spaces " "
  var compoundWordsFixed = s.replace(/\s-\s/g," ");
  //Logger.log('compoundWordsFixed: ' + compoundWordsFixed);
  //In cases where you have "...last word.First word..." 
  //it doesn't count the two words around the period.
  //so I replace all punctuation with a space
  var punctuationless = compoundWordsFixed.replace(/[.,\/#—!$%\^&\*;:{}=\_-`’'~()"?“”…\[\]]/g,"");
  //Logger.log('punctuationless: ' + punctuationless);
  //Finally, trim it down to single spaces (not sure this even matters)
  var noDoubleSpaces = punctuationless.replace(/\s{2,}/g," ");
  //Logger.log('noDoubleSpaces: ' + noDoubleSpaces);
  var stopWords = [
        "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an",
        "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot",
        "could", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get",
        "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i",
        "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may",
        "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often",
        "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should",
        "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these",
        "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what",
        "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet",
        "you", "your", "illo", "illus"
    ];

  //var stopWords = ['as', 'at', 'he', 'the', 'was', 'and', 'she', 'a', 'of', 'to', 'it', 'an', 'in', 'his', 'is', 'that', 'i'];
  var finalString = noDoubleSpaces.toLowerCase().replace(new RegExp('\\b('+stopWords.join('|')+')\\b', 'g'), '');

  if (isEmptyOrSpaces(finalString)) {
    Logger.log('finalString was only whitespace');
    okAlert('Error — No text', 'Either your document has no text, or you selected a portion of the document with no text.');
    return;
  }
  //Logger.log('finalString: ' + finalString);

  // Create a map of words and frequencies and sort by value
  var wordFreqMap = wordFreq(finalString);
  var mapSort1 = new Map([...wordFreqMap.entries()].sort((a, b) => b[1] - a[1]));
  //Logger.log(mapSort1);

  // Convert map to array, and keep only top 15 words
  var maxOccurences = 0;
  var minOccurences = 9999;
  var arr = [...mapSort1].map(([name, value]) => ({ name, value }));
  //Logger.log(arr);
  arr = arr.slice(0,24); // Limit to 1st X words

  // Figure out range of occurrences, smallest to largest
  for (var i = 0; i < arr.length; ++i) {
    //Logger.log('arr['+i+']: '+arr[i].name);
    if (arr[i].value > maxOccurences) maxOccurences = arr[i].value;
    if (arr[i].value < minOccurences) minOccurences = arr[i].value;
  }
  Logger.log('maxOccurences: '+ maxOccurences);

  varHtmlString = '';
  var htmlString = '<!DOCTYPE html>'
  var htmlString = htmlString + '<!--'
  var htmlString = htmlString + 'Add a standard color picker '
  var htmlString = htmlString + 'access hex color:'
  var htmlString = htmlString + 'document.getElementById("color-result-hex").innerText'
  var htmlString = htmlString + 'access Google palette color name: '
  var htmlString = htmlString + 'document.getElementById("color-result-name").innerText'
  var htmlString = htmlString + 'access text color:'
  var htmlString = htmlString + 'document.getElementById("color-result").style.color;'
  var htmlString = htmlString + '-->'
  var htmlString = htmlString + '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">'
  var htmlString = htmlString + '<style>'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'html, body {'
  //var htmlString = htmlString + 'height: 100vh;'
  //var htmlString = htmlString + 'width: 100vw;'
  var htmlString = htmlString + 'margin: 0;'
  var htmlString = htmlString + 'padding: 0;'
  var htmlString = htmlString + 'display: flex;'
  var htmlString = htmlString + 'align-items: center;'
  var htmlString = htmlString + 'justify-content: center;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud {'
  var htmlString = htmlString + 'list-style: none;'
  var htmlString = htmlString + 'padding-left: 0;'
  var htmlString = htmlString + 'display: flex;'
  var htmlString = htmlString + 'flex-wrap: wrap;'
  var htmlString = htmlString + 'align-items: center;'
  var htmlString = htmlString + 'justify-content: center;'
  var htmlString = htmlString + 'line-height: 2.75rem;'
  var htmlString = htmlString + 'width: 450px;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud a {'
  var htmlString = htmlString + '/* '
  var htmlString = htmlString + 'Not supported by any browser at the moment :('
  var htmlString = htmlString + '--size: attr(data-weight number); '
  var htmlString = htmlString + '*/'
  var htmlString = htmlString + '--size: 4;'
  var htmlString = htmlString + '--color: #a33;'
  var htmlString = htmlString + 'color: var(--color);'
  var htmlString = htmlString + 'font-size: calc(var(--size) * 0.25rem + 0.5rem);'
  var htmlString = htmlString + 'display: block;'
  var htmlString = htmlString + 'padding: 0.125rem 0.25rem;'
  var htmlString = htmlString + 'position: relative;'
  var htmlString = htmlString + 'text-decoration: none;'
  var htmlString = htmlString + '/* '
  var htmlString = htmlString + 'For different tones of a single color'
  var htmlString = htmlString + 'opacity: calc((15 - (9 - var(--size))) / 15); '
  var htmlString = htmlString + '*/'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud a[data-weight="1"] { --size: 1; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="2"] { --size: 2; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="3"] { --size: 3; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="4"] { --size: 4; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="5"] { --size: 6; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="6"] { --size: 8; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="7"] { --size: 10; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="8"] { --size: 13; }'
  var htmlString = htmlString + 'ul.cloud a[data-weight="9"] { --size: 16; }'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul[data-show-value] a::after {'
  var htmlString = htmlString + 'content: " (" attr(data-weight) ")";'
  var htmlString = htmlString + 'font-size: 1rem;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud li:nth-child(2n+1) a { --color: #181; }'
  var htmlString = htmlString + 'ul.cloud li:nth-child(3n+1) a { --color: #33a; }'
  var htmlString = htmlString + 'ul.cloud li:nth-child(4n+1) a { --color: #c38; }'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud a:focus {'
  var htmlString = htmlString + 'outline: 1px dashed;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud a::before {'
  var htmlString = htmlString + 'content: "";'
  var htmlString = htmlString + 'position: absolute;'
  var htmlString = htmlString + 'top: 0;'
  var htmlString = htmlString + 'left: 50%;'
  var htmlString = htmlString + 'width: 0;'
  var htmlString = htmlString + 'height: 100%;'
  var htmlString = htmlString + 'background: var(--color);'
  var htmlString = htmlString + 'transform: translate(-50%, 0);'
  var htmlString = htmlString + 'opacity: 0.15;'
  var htmlString = htmlString + 'transition: width 0.25s;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + 'ul.cloud a:focus::before,'
  var htmlString = htmlString + 'ul.cloud a:hover::before {'
  var htmlString = htmlString + 'width: 100%;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + ''
  var htmlString = htmlString + '@media (prefers-reduced-motion) {'
  var htmlString = htmlString + 'ul.cloud * {'
  var htmlString = htmlString + 'transition: none !important;'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + '}'
  var htmlString = htmlString + '</style>'
  var htmlString = htmlString + ''
  var htmlString = htmlString + '<ul class="cloud" role="navigation" aria-label="Webdev word cloud">'

  arr = shuffle(arr);
  for (var i = 0; i < arr.length; ++i) {
    var occurrences = arr[i].value;
    var relativeMagnitude = Math.round(((occurrences - minOccurences + 1 ) / (maxOccurences - minOccurences + 1)) * 9);
    var htmlString = htmlString + '<li><a href="#" data-weight="'+relativeMagnitude+'">' + arr[i].name + '</a></li>'
    //var htmlString = htmlString + '<li><a href="#" data-weight="'+relativeMagnitude+'">' + arr[i].name + ' (' + arr[i].value + ')</a></li>'
    //Logger.log('arr['+i+']: '+arr[i].name + ', occurrences: ' + occurrences + ', relativeMagnitude: ' + relativeMagnitude);
  }
  var htmlString = htmlString + '</ul>'

  var html = HtmlService.createHtmlOutput(htmlString);
  var ui = DocumentApp.getUi();
  ui.showModalDialog(html, "Word cloud");
}

/**
 * Capitalize the selected text
 */
function textFormatCapitalize() {
  Logger.log('textFormatCapitalize()');
}

/**
 * Create a map with each word in string
 * and its occurrence frequency
 */
function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);
    //Logger.log('words: ' + words);
    var freqMap = new Map();
    words.forEach(function(w) {
      if (!isEmptyOrSpaces(w)) {
        if (!freqMap.has(w)) {
          freqMap.set(w,0);
        }
        freqMap.set(w, freqMap.get(w)+1);
        //Logger.log('freqMap.get('+w+'): '+freqMap.get(w));
      }
    });
    return freqMap;
}

/**
 * Create a map with each word in string
 * and its occurrence frequency
 */
function wordFreqFromArray(words) {
    //var words = string.replace(/[.]/g, '').split(/\s/);
    //Logger.log('words: ' + words);
    var freqMap = new Map();
    words.forEach(function(w) {
      if (!isEmptyOrSpaces(w)) {
        if (!freqMap.has(w)) {
          freqMap.set(w,0);
        }
        freqMap.set(w, freqMap.get(w)+1);
        //Logger.log('freqMap.get('+w+'): '+freqMap.get(w));
      }
    });
    return freqMap;
}

/**
 * Put array items in random order
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



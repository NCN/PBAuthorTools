/**
 * Syllable Count Function Tester
 * 
 * This script tests a syllable counting function against a reference CSV file
 * containing words and their known syllable counts.
 * 
 * Usage:
 * 1. Place this file alongside your syllable-counting function
 * 2. Place the syllable count CSV file in the same directory
 * 3. Run the script with Node.js: node syllable-count-tester.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ========================================================================
// Import your syllable counting function here
// You can either import it directly, or paste the function here
// ========================================================================

// Option 1: Import your function from another file
// const { countSyllables } = require('./your-syllable-counter.js');

// Option 2: Paste your function here
/*function countSyllables(word) {
  // Replace this with your actual syllable counting function
  
  // This is just a placeholder implementation and should be replaced!
  // Trim and convert to lowercase
  word = word.toLowerCase().trim();

  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');

  // If word is empty, return 0
  if (word.length === 0) return 0;

  // Count vowel groups
  const syllableMatches = word.match(/[aeiouy]+/g) || [];
  let count = syllableMatches.length;

  // Adjust for silent 'e' at the end
  if (word.endsWith('e') && count > 1 && 
      !word.endsWith('le') && !word.endsWith('age')) {
    count--;
  }
  
  // Ensure at least one syllable
  count = Math.max(1, count);
  
  return count;
}*/

function countSyllables2(word) {
  // Trim and convert to lowercase
  word = word.toLowerCase().trim();

  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');

  // If word is empty, return 0
  if (word.length === 0) return 0;

  // Truly irregular words (rare exceptions)
  const specialCases = {
      'colonel': 3,    // unique pronunciation
      'lengthwise': 2, // tricky syllable structure
      'squirrel': 2    // non-standard syllable break
  };

  // Check special cases first
  if (specialCases.hasOwnProperty(word)) {
      return specialCases[word];
  }

  // Preprocessing rules
  // 1. Handle silent 'e' at the end
  if (word.endsWith('e')) {
      // Remove silent 'e' for syllable counting, but with exceptions
      const exceptions = ['le', 'age', 'ige'];
      if (!exceptions.some(ex => word.endsWith(ex))) {
          word = word.slice(0, -1);
      }
  }

  // Improved vowel group detection
  // This regex looks for sequences of vowels that create distinct syllables
  const syllableMatches = word.match(/[aeiouy]+/g) || [];

  // Base syllable count from vowel groups
  let syllableCount = syllableMatches.length;

  // Adjust for specific phonetic rules
  // Diphthongs and triphthongs often count as one syllable
  const diphthongs = ['ai', 'au', 'ea', 'ee', 'ei', 'ie', 'oa', 'oe', 'oo', 'ou'];
  const complexVowelReduction = syllableMatches.filter(group =>
      diphthongs.includes(group) || group.length > 2
  ).length;

  const splitVowelPatterns = ['ier', 'yer', 'iet', 'iet', 'ual', 'ium', 'ia', 'uo'];

  // Adjust syllable count
  syllableCount -= complexVowelReduction;

  // Adjust for vowel combinations that should be split into separate syllables
  const splitVowelAdjustment = syllableMatches.filter(group => 
      splitVowelPatterns.some(pattern => group.includes(pattern))
  ).length;

  // Adjust syllable count (add this line after syllableCount -= complexVowelReduction;)
  syllableCount += splitVowelAdjustment;
  
  // Sophisticated handling of 'io' combinations
  // Context-aware syllable adjustment
  const complexWordPatterns = [
      // Patterns where 'io' is part of a single syllable
      /[aeiou]tion$/,   // action, fiction
      /^[aeiou]nion/,   // onion

      // Patterns where 'io' might split into two syllables
      /^li[oa]n/        // lion
  ];

  // Check if the word matches any of these patterns
  const matchedPattern = complexWordPatterns.some(pattern => pattern.test(word));

  // Adjust syllable count based on pattern matching
  if (matchedPattern) {
      if (/^li[oa]n/.test(word)) {
          // Specifically handle words like 'lion'
          syllableCount++;
      } else if (/[aeiou]tion$/.test(word) || /^[aeiou]nion/.test(word)) {
          // Ensure correct syllable count for words like 'action', 'onion'
          syllableCount = syllableCount;
      }
  }

  // Ensure at least one syllable
  syllableCount = Math.max(1, syllableCount);

  // Prevent unreasonably high syllable counts
  syllableCount = Math.min(syllableCount, word.length);

  return syllableCount;
}

function countSyllables3(word) {
  word = word.toLowerCase();

  // exception_add are words that need extra syllables
  // exception_del are words that need less syllables
  const exception_add = ['serious', 'crucial'];
  const exception_del = ['fortunately', 'unfortunately'];

  const co_one = ['cool', 'coach', 'coat', 'coal', 'count', 'coin', 'coarse', 'coup', 'coif', 'cook', 'coign', 'coiffe', 'coof', 'court'];
  const co_two = ['coapt', 'coed', 'coinci'];

  const pre_one = ['preach'];

  let syls = 0; // added syllable number
  let disc = 0; // discarded syllable number

  // 1) if letters < 3 : return 1
  if (word.length <= 3) {
      syls = 1;
      return syls;
  }

  // 2) if doesn't end with "ted" or "tes" or "ses" or "ied" or "ies", discard "es" and "ed" at the end.
  // if it has only 1 vowel or 1 set of consecutive vowels, discard. (like "speed", "fled" etc.)
  if (word.slice(-2) === "es" || word.slice(-2) === "ed") {
      const doubleAndtripple_1 = (word.match(/[eaoui][eaoui]/g) || []).length;
      if (doubleAndtripple_1 > 1 || (word.match(/[eaoui][^eaoui]/g) || []).length > 1) {
          if (word.slice(-3) === "ted" || word.slice(-3) === "tes" || word.slice(-3) === "ses" || word.slice(-3) === "ied" || word.slice(-3) === "ies") {
              // pass
          } else {
              disc += 1;
          }
      }
  }

  // 3) discard trailing "e", except where ending is "le"
  const le_except = ['whole', 'mobile', 'pole', 'male', 'female', 'hale', 'pale', 'tale', 'sale', 'aisle', 'whale', 'while'];

  if (word.slice(-1) === "e") {
      if (word.slice(-2) === "le" && !le_except.includes(word)) {
          // pass
      } else {
          disc += 1;
      }
  }

  // 4) check if consecutive vowels exists, triplets or pairs, count them as one.
  const doubleAndtripple = (word.match(/[eaoui][eaoui]/g) || []).length;
  const tripple = (word.match(/[eaoui][eaoui][eaoui]/g) || []).length;
  disc += doubleAndtripple + tripple;

  // 5) count remaining vowels in word.
  const numVowels = (word.match(/[eaoui]/g) || []).length;

  // 6) add one if starts with "mc"
  if (word.slice(0, 2) === "mc") {
      syls += 1;
  }

  // 7) add one if ends with "y" but is not surrounded by vowel
  if (word.slice(-1) === "y" && !["a", "e", "o", "u", "i"].includes(word.slice(-2, -1))) {
      syls += 1;
  }

  // 8) add one if "y" is surrounded by non-vowels and is not in the last word.
  for (let i = 0; i < word.length; i++) {
      if (word[i] === "y") {
          if (i !== 0 && i !== word.length - 1) {
              if (!["a", "e", "o", "u", "i"].includes(word[i - 1]) && !["a", "e", "o", "u", "i"].includes(word[i + 1])) {
                  syls += 1;
              }
          }
      }
  }

  // 9) if starts with "tri-" or "bi-" and is followed by a vowel, add one.
  if (word.slice(0, 3) === "tri" && ["a", "e", "o", "u", "i"].includes(word[3])) {
      syls += 1;
  }

  if (word.slice(0, 2) === "bi" && ["a", "e", "o", "u", "i"].includes(word[2])) {
      syls += 1;
  }

  // 10) if ends with "-ian", should be counted as two syllables, except for "-tian" and "-cian"
  if (word.slice(-3) === "ian") {
      if (word.slice(-4) === "cian" || word.slice(-4) === "tian") {
          // pass
      } else {
          syls += 1;
      }
  }

  // 11) if starts with "co-" and is followed by a vowel, check if exists in the double syllable dictionary, if not, check if in single dictionary and act accordingly.
  if (word.slice(0, 2) === "co" && ["a", "e", "o", "u", "i"].includes(word[2])) {
      if (co_two.includes(word.slice(0, 4)) || co_two.includes(word.slice(0, 5)) || co_two.includes(word.slice(0, 6))) {
          syls += 1;
      } else if (co_one.includes(word.slice(0, 4)) || co_one.includes(word.slice(0, 5)) || co_one.includes(word.slice(0, 6))) {
          // pass
      } else {
          syls += 1;
      }
  }

  // 12) if starts with "pre-" and is followed by a vowel, check if exists in the double syllable dictionary, if not, check if in single dictionary and act accordingly.
  if (word.slice(0, 3) === "pre" && ["a", "e", "o", "u", "i"].includes(word[3])) {
      if (pre_one.includes(word.slice(0, 6))) {
          // pass
      } else {
          syls += 1;
      }
  }

  // 13) check for "-n't" and cross match with dictionary to add syllable.
  const negative = ["doesn't", "isn't", "shouldn't", "couldn't", "wouldn't"];

  if (word.slice(-3) === "n't") {
      if (negative.includes(word)) {
          syls += 1;
      } else {
          // pass
      }
  }

  // 14) Handling the exceptional words.
  if (exception_del.includes(word)) {
      disc += 1;
  }

  if (exception_add.includes(word)) {
      syls += 1;
  }

  // calculate the output
  return numVowels - disc + syls;

}

/**
 * Counts syllables in a word using various linguistic rules
 * @param {string} word - The word to count syllables for
 * @return {number} - The number of syllables
 */
function countSyllables(word) {
  word = word.toLowerCase();

  // exception_add are words that need extra syllables
  // exception_del are words that need less syllables
  const exception_add = ['serious', 'crucial'];
  const exception_del = ['fortunately', 'unfortunately'];

  const co_one = ['cool', 'coach', 'coat', 'coal', 'count', 'coin', 'coarse', 'coup', 'coif', 'cook', 'coign', 'coiffe', 'coof', 'court'];
  const co_two = ['coapt', 'coed', 'coinci'];

  const pre_one = ['preach'];

  let syls = 0; // added syllable number
  let disc = 0; // discarded syllable number

  // 1) if letters < 3 : return 1
  if (word.length <= 3) {
      syls = 1;
      return syls;
  }

  // 2) if doesn't end with "ted" or "tes" or "ses" or "ied" or "ies", discard "es" and "ed" at the end.
  // if it has only 1 vowel or 1 set of consecutive vowels, discard. (like "speed", "fled" etc.)
  if (word.slice(-2) === "es" || word.slice(-2) === "ed") {
      const doubleAndtripple_1 = (word.match(/[eaoui][eaoui]/g) || []).length;
      if (doubleAndtripple_1 > 1 || (word.match(/[eaoui][^eaoui]/g) || []).length > 1) {
          if (word.slice(-3) === "ted" || word.slice(-3) === "tes" || word.slice(-3) === "ses" || word.slice(-3) === "ied" || word.slice(-3) === "ies") {
              // pass
          } else {
              disc += 1;
          }
      }
  }

  // 3) discard trailing "e", except where ending is "le"
  const le_except = ['whole', 'mobile', 'pole', 'male', 'female', 'hale', 'pale', 'tale', 'sale', 'aisle', 'whale', 'while'];

  if (word.slice(-1) === "e") {
      if (word.slice(-2) === "le" && !le_except.includes(word)) {
          // pass
      } else {
          disc += 1;
      }
  }

  // 4) check if consecutive vowels exists, triplets or pairs, count them as one.
  const doubleAndtripple = (word.match(/[eaoui][eaoui]/g) || []).length;
  const tripple = (word.match(/[eaoui][eaoui][eaoui]/g) || []).length;
  disc += doubleAndtripple + tripple;

  // 5) count remaining vowels in word.
  const numVowels = (word.match(/[eaoui]/g) || []).length;

  // 6) add one if starts with "mc"
  if (word.slice(0, 2) === "mc") {
      syls += 1;
  }

  // 7) add one if ends with "y" but is not surrounded by vowel
  if (word.slice(-1) === "y" && !["a", "e", "o", "u", "i"].includes(word.slice(-2, -1))) {
    if ((word.slice(-3) === "ely") || (word.slice(-3) === "ety")) {
      // Skip adding a syllable for -ly endings
    } else {
        syls += 1;
    }
  }

  // 8) add one if "y" is surrounded by non-vowels and is not in the last word.
  for (let i = 0; i < word.length; i++) {
      if (word[i] === "y") {
          if (i !== 0 && i !== word.length - 1) {
              if (!["a", "e", "o", "u", "i"].includes(word[i - 1]) && !["a", "e", "o", "u", "i"].includes(word[i + 1])) {
                  syls += 1;
              }
          }
      }
  }

  // 9) if starts with "tri-" or "bi-" and is followed by a vowel, add one.
  if (word.slice(0, 3) === "tri" && word.length > 3 && ["a", "e", "o", "u", "i"].includes(word[3])) {
      syls += 1;
  }

  if (word.slice(0, 2) === "bi" && word.length > 2 && ["a", "e", "o", "u", "i"].includes(word[2])) {
      syls += 1;
  }

  // 10) if ends with "-ian", should be counted as two syllables, except for "-tian" and "-cian"
  if (word.slice(-3) === "ian") {
      if (word.length > 4 && (word.slice(-4) === "cian" || word.slice(-4) === "tian")) {
          // pass
      } else {
          syls += 1;
      }
  }

  // 11) if starts with "co-" and is followed by a vowel, check if exists in the double syllable dictionary, if not, check if in single dictionary and act accordingly.
  if (word.slice(0, 2) === "co" && word.length > 2 && ["a", "e", "o", "u", "i"].includes(word[2])) {
      if (co_two.includes(word.slice(0, 4)) || co_two.includes(word.slice(0, 5)) || co_two.includes(word.slice(0, 6))) {
          syls += 1;
      } else if (co_one.includes(word.slice(0, 4)) || co_one.includes(word.slice(0, 5)) || co_one.includes(word.slice(0, 6))) {
          // pass
      } else {
          syls += 1;
      }
  }

  // 12) if starts with "pre-" and is followed by a vowel, check if exists in the double syllable dictionary, if not, check if in single dictionary and act accordingly.
  if (word.slice(0, 3) === "pre" && word.length > 3 && ["a", "e", "o", "u", "i"].includes(word[3])) {
      if (pre_one.includes(word.slice(0, 6))) {
          // pass
      } else {
          syls += 1;
      }
  }

  // 13) check for "-n't" and cross match with dictionary to add syllable.
  const negative = ["doesn't", "isn't", "shouldn't", "couldn't", "wouldn't"];

  if (word.slice(-3) === "n't") {
      if (negative.includes(word)) {
          syls += 1;
      } else {
          // pass
      }
  }

  // 14) Handling the exceptional words.
  if (exception_del.includes(word)) {
      disc += 1;
  }

  if (exception_add.includes(word)) {
      syls += 1;
  }

  // calculate the output
  const result = numVowels - disc + syls;
  
  // Ensure at least 1 syllable for any word
  return Math.max(1, result);
}

// ========================================================================
// Test configuration
// ========================================================================

const CSV_FILE = 'syllable-count-csv.csv'; // Update this if your CSV has a different name

// ========================================================================
// Test runner
// ========================================================================

async function runTests() {
  console.log('\n=====================================================');
  console.log('🔍 Syllable Count Function Tester');
  console.log('=====================================================\n');
  
  try {
    // Check if the CSV file exists
    if (!fs.existsSync(CSV_FILE)) {
      console.error(`❌ Error: CSV file '${CSV_FILE}' not found.`);
      console.log(`Please ensure the file exists in the same directory as this script.`);
      return;
    }
    
    // Read and parse the CSV file
    console.log(`📊 Reading reference data from ${CSV_FILE}...`);
    const words = await parseCSV(CSV_FILE);
    console.log(`✅ Successfully loaded ${words.length} words.\n`);
    
    // Test the syllable counting function against each word
    const results = testSyllableCounts(words);
    
    // Print detailed report
    printTestReport(results);
    
  } catch (error) {
    console.error('❌ An error occurred while running the tests:', error);
  }
}

async function parseCSV(filePath) {
  const words = [];
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  // Skip the header row
  let isFirstLine = true;
  
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    
    const [word, syllableCountStr] = line.split(',');
    const syllableCount = parseInt(syllableCountStr, 10);
    
    if (word && !isNaN(syllableCount)) {
      words.push({ word, expectedCount: syllableCount });
    }
  }
  
  return words;
}

function testSyllableCounts(words) {
  console.log('🧪 Testing syllable counting function...');
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  for (const { word, expectedCount } of words) {
    // Test the function
    const calculatedCount = countSyllables(word);
    
    if (calculatedCount === expectedCount) {
      passed++;
    } else {
      failed++;
      failures.push({
        word,
        expected: expectedCount,
        calculated: calculatedCount
      });
    }
  }
  
  return {
    total: words.length,
    passed,
    failed,
    failures
  };
}

function printTestReport(results) {
  const { total, passed, failed, failures } = results;
  const passRate = ((passed / total) * 100).toFixed(2);
  
  console.log('\n=====================================================');
  console.log('📋 TEST RESULTS');
  console.log('=====================================================');
  console.log(`Total words tested: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Pass rate: ${passRate}%\n`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Your syllable counting function is working perfectly.');
  } else {
    console.log('❌ Some tests failed. Here are the mismatches:');
    console.log('=====================================================');
    console.log('Word\t\tExpected\tCalculated');
    console.log('-----------------------------------------------------');
    
    // Group failures by syllable count difference for better analysis
    const groupedFailures = {};
    
    failures.forEach(failure => {
      const diff = failure.calculated - failure.expected;
      if (!groupedFailures[diff]) {
        groupedFailures[diff] = [];
      }
      groupedFailures[diff].push(failure);
    });
    
    // Print all failures
    failures.forEach(({ word, expected, calculated }) => {
      // Pad the word for better readability
      const paddedWord = word.padEnd(15, ' ');
      console.log(`${paddedWord}\t${expected}\t\t${calculated}`);
    });
    
    // Print summary of failure patterns
    console.log('\n=====================================================');
    console.log('📊 FAILURE PATTERNS');
    console.log('=====================================================');
    
    for (const diff in groupedFailures) {
      const count = groupedFailures[diff].length;
      const message = diff > 0 ? 
        `Overestimated by ${diff} syllable(s)` : 
        `Underestimated by ${Math.abs(diff)} syllable(s)`;
      
      console.log(`${message}: ${count} words (${((count / failed) * 100).toFixed(2)}%)`);
      
      // Print some examples
      const examples = groupedFailures[diff].slice(0, 5).map(f => f.word).join(', ');
      console.log(`Examples: ${examples}${groupedFailures[diff].length > 5 ? ', ...' : ''}\n`);
    }
    
    // Provide improvement suggestions based on patterns
    provideImprovementSuggestions(groupedFailures);
  }
}

function provideImprovementSuggestions(groupedFailures) {
  console.log('=====================================================');
  console.log('💡 IMPROVEMENT SUGGESTIONS');
  console.log('=====================================================');
  
  // Check for common patterns and provide suggestions
  const diffs = Object.keys(groupedFailures).map(Number);
  
  if (diffs.includes(1) && groupedFailures[1].length > 5) {
    console.log('➡️ Your function is frequently overestimating syllables by 1.');
    console.log('   Consider adjusting rules for diphthongs (two vowels that form one sound).');
    console.log('   Examples: "ea", "ai", "ou"');
  }
  
  if (diffs.includes(-1) && groupedFailures[-1].length > 5) {
    console.log('➡️ Your function is frequently underestimating syllables by 1.');
    console.log('   Check if you\'re handling special cases like:');
    console.log('   - Words ending in "-ion", "-ious", "-ia"');
    console.log('   - Words with silent vowels or consonants');
  }
  
  console.log('\n➡️ Consider adding special case handling for commonly misidentified words.');
  console.log('➡️ Adjust rules for recognizing vowel combinations that form single syllables.');
  console.log('➡️ Add handling for prefixes and suffixes that affect syllable count.');
  
  console.log('\nFor more accurate syllable counting, you may need a combination of:');
  console.log('1. Rule-based approaches (phonetic patterns)');
  console.log('2. Dictionary lookup for exceptions');
  console.log('3. Machine learning approaches trained on phonetic data');
}

// Run the tests
runTests();

const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate(text, locale) {
    if(text === '') return { error: 'No text to translate' };
    if(!text || !locale) return { error: 'Required field(s) missing' };
    if(!['american-to-british', 'british-to-american'].includes(locale)) return { error: 'Invalid value for locale field' };

    let bucket = [];
    if(locale === 'american-to-british') {
      Object.keys(americanOnly).forEach(usEng => {
        if(new RegExp('\\b' + usEng + '\\b', 'i').test(text)) bucket.push([usEng, americanOnly[usEng]]);
      });
      let words = text.split(/\s/);
      console.log(words);
      for(let i = 0; i < words.length; i++) {
        let time = words[i].match(/\d{1,2}[.:]\d{1,2}/g);
        if(time) time.forEach(a => bucket.push([a, this.parseTime(a, locale, a.search(/[.:]/))]));
        else {
          if(americanToBritishSpelling.hasOwnProperty(words[i])) bucket.push([words[i], americanToBritishSpelling[words[i]]]);
          if(americanToBritishTitles.hasOwnProperty(words[i].toLowerCase())) bucket.push([words[i].slice(0, words[i].search(/\./)) + '\\.', americanToBritishTitles[words[i].toLowerCase()].replace(/^\w/, c => c.toUpperCase())]);
        }
      }
    }
    else {
      Object.keys(britishOnly).forEach(ukEng => {
        if(new RegExp('\\b' + ukEng + '\\b', 'i').test(text)) bucket.push([ukEng, britishOnly[ukEng]]);
      });
      let words = text.split(/\s/), britishToAmericanSpelling = {}, britishToAmericanTitles = {};

      for(let [usEng, ukEng] of Object.entries(americanToBritishSpelling)) {
        britishToAmericanSpelling[ukEng] = usEng;
      }
      for(let [usEng, ukEng] of Object.entries(americanToBritishTitles)) {
        britishToAmericanTitles[ukEng] = usEng;
      }
      console.log(words);
      for(let i = 0; i < words.length; i++) {
        let time = words[i].match(/\d{1,2}[.:]\d{1,2}/g);
        if(time) time.forEach(a => bucket.push([a, this.parseTime(a, locale, a.search(/[.:]/))]));
        else {
          if(britishToAmericanSpelling.hasOwnProperty(words[i])) bucket.push([words[i], britishToAmericanSpelling[words[i]]]);
          if(britishToAmericanTitles.hasOwnProperty(words[i].toLowerCase())) bucket.push([words[i], britishToAmericanTitles[words[i].toLowerCase()].replace(/^\w/, c => c.toUpperCase())]);
        }
      }
    }
    
    if(bucket.length === 0) return { text, translation : "Everything looks good to me!" };
    let translation = text;
    bucket.forEach(change => {
      translation = translation.replace(new RegExp('\\b' + change[0] + '(?=\\.|\\s|$)', 'i'), '<span class="highlight">' + change[1] + '</span>');
    })
    
    return { text, translation };
  }

  parseTime(time, locale, separator) {
    if(locale === 'american-to-british') return time.slice(0, separator) + '.' + time.slice(separator + 1);
    return time.slice(0, separator) + ':' + time.slice(separator + 1);
  }
}

module.exports = Translator;
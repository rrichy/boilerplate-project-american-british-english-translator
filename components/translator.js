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
        if(text.includes(usEng)) bucket.push([usEng, americanOnly[usEng]]);
      });
      let words = text.split(' ');
      for(let i = 0; i < words.length; i++) {
        let time = words[i].match(/\d{1,2}[.:]\d{1,2}/g);
        if(time) time.forEach(a => bucket.push([time, this.parseTime(a, locale)]));
        else {
          if(americanToBritishSpelling.hasOwnProperty(words[i])) bucket.push([words[i], americanToBritishSpelling[words[i]]]);
          if(americanToBritishTitles.hasOwnProperty(words[i])) bucket.push([words[i], americanToBritishTitles[words[i]]]);
        }
      }
    }
    else {
      Object.keys(britishOnly).forEach(ukEng => {
        if(text.includes(ukEng)) bucket.push(ukEng);
      });
    }

    console.log(bucket);

   

    /* If text requires no translation, return "Everything looks good to me!" for the translation value. */
  }

  parseTime(time, locale) {
    if(locale === 'american-to-british') return time.slice(0, 2) + '.' + time.slice(3);
    return time.slice(0, 2) + ':' + time.slice(3);
  }
}

module.exports = Translator;
'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      console.log(req.body);
      const { text, locale } = req.body;

      let translated = translator.translate(text, locale);
      console.log(translated);  // returns an object to be passed on res.json after logging
      res.json(translated);
    });
};

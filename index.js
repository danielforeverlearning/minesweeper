//github.com --> settings --> integration-applications --> render.com configure
//environment variable BASE_URL 0.0.0.0
//npm init
//npm install express
//npm install path
//npm install formidable
//npm install ejs

const express      = require('express');
const path         = require('path');
const formidable   = require('formidable');
const PORT         = process.env.PORT || 666;


express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => { res.render("game_board", { rows:20, cols:20 }) })
  .post('/mypost', async (req, res) => {
	
/*****
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
              res.send("route post mypost form.parse ERROR = " + err);
              return;
          }
          key = fields.key_name[0];
		  mycalculate();
      })//form.parse
	  ********/
	  
  }) //mypost
  .listen(PORT, () => console.log(`Listening to ${ PORT }`))

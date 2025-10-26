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

const rows = 20;
const cols = 20;
const total_cells = rows * cols;
const mine_percent = 0.4;
const total_mines = total_cells * mine_percent;
const mine_random_num = 4294967295 * mine_percent;
const map = [];

function InitializeMap()
{
	/**************************************************************************************************
	Secure random numbers:
	For applications requiring high security, such as cryptography, 
	Math.random() is not secure because its output is not truly random and can be predicted. 
	Instead, use the Web Crypto API, which is available in modern browsers. 
	The crypto.getRandomValues() method generates cryptographically secure pseudo-random values.

	The maximum value for a 32-bit unsigned integer (uint32) 
	in JavaScript is (2^{32}-1), which equals 4,294,967,295.
	*************************************************************************************************/
	console.log("mine_random_num = " + mine_random_num);
	const randomBuffer = new Uint32Array(1);
	var mine_count = 0;
	for (let rr = 0; rr < rows; rr++)
	{
		map[rr] = [];
		for (let cc = 0; cc < cols; cc++)
		{
			crypto.getRandomValues(randomBuffer);
			if ((randomBuffer[0] <= mine_random_num) &&
				(mine_count <= total_mines))
			{
				map[rr][cc] = "M";
				mine_count++;
			}
			else
				map[rr][cc] = "E";
		}
	}
	console.log("mine_count = " + mine_count);
}//InitializeMap


express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => { 
	  InitializeMap();
	  res.render("game_board", { rows:rows, cols:cols }); 
  })
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

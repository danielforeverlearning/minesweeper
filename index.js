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
const opened = [];
const map = [];

function MapAnotherPass(temp)
{
	const randomBuffer = new Uint32Array(1);
	var mine_count = temp;
	var pass=1;

	while (mine_count < total_mines)
	{
		for (let rr = 0; rr < rows; rr++)
		{
			for (let cc = 0; cc < cols; cc++)
			{
				if (mine_count < total_mines && map[rr][cc] == "E")
				{
					crypto.getRandomValues(randomBuffer);
					if (randomBuffer[0] <= mine_random_num)
					{
						map[rr][cc] = "M";
						mine_count++;
					}
				}
				else
					map[rr][cc] = "E";
			}
		}
		console.log("MapAnotherPass " + pass + ": mine_count = " + mine_count);
		pass++;
	}
}//MapAnotherPass

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
		opened[rr] = [];
		for (let cc = 0; cc < cols; cc++)
		{
			opened[rr][cc] = false;
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
	MapAnotherPass(mine_count);
}//InitializeMap


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
	  res.render("home");  
  })
  .post('/new_game', (req, res) => {
	  InitializeMap();
	  res.render("game_board", { rows:rows, cols:cols, opened:opened, map:map });   
  }) //mypost
  .post('/game_click', (req, res) => {
	  var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
              res.send("route post game_click form.parse ERROR = " + err);
              return;
          }
          const keys_obj = Object.keys(fields);
		  const keys = JSON.stringify(keys_obj);
		  //console.log("keys = " + keys);
		  //console.log("typeof keys = " + typeof keys);
		  const splitarray = keys.split("_");
		  //console.log("splitarray[1] = " + splitarray[1]);
		  //console.log("splitarray[2] = " + splitarray[2]);
		  const index = splitarray[2].indexOf('"');
		  const open_cc = splitarray[2].substring(0, index);
		  //console.log("splitarray[1] = " + splitarray[1] + " " + typeof splitarray[1]);
		  //console.log("open_cc = " + open_cc + " " + typeof open_cc);
		  opened[splitarray[1]][open_cc] = true;
		  res.render("game_board", { rows:rows, cols:cols, opened:opened, map:map });
      })//form.parse
  })
  .listen(PORT, () => console.log(`Listening to ${ PORT }`))

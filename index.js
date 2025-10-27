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
const hard_mine_percent = 0.4;
const easy_mine_percent = 0.2;
const map_status = [];
const map = [];
var opened_flagged_count = 0;

function PutNumber(rr,cc)
{
	var mine_count=0;
	if (rr==0 && cc==0)
	{
		if (map[0][1]==="M")
			mine_count++;
		if (map[1][1]==="M")
			mine_count++;
		if (map[1][0]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (rr==0 && cc==(cols-1))
	{
		if (map[0][cols-2]==="M")
			mine_count++;
		if (map[1][cols-2]==="M")
			mine_count++;
		if (map[1][cols-1]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (rr==(rows-1) && cc==(cols-1))
	{
		if (map[rows-2][cols-1]==="M")
			mine_count++;
		if (map[rows-2][cols-2]==="M")
			mine_count++;
		if (map[rows-1][cols-2]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (rr==(rows-1) && cc==0)
	{
		if (map[rows-2][0]==="M")
			mine_count++;
		if (map[rows-2][1]==="M")
			mine_count++;
		if (map[rows-1][1]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (rr==0)
	{
		if (map[0][cc-1]==="M")
			mine_count++;
		if (map[1][cc-1]==="M")
			mine_count++;
		if (map[1][cc]==="M")
			mine_count++;
		if (map[1][cc+1]==="M")
			mine_count++;
		if (map[0][cc+1]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (cc==(cols-1))
	{
		if (map[rr-1][cc]==="M")
			mine_count++;
		if (map[rr-1][cc-1]==="M")
			mine_count++;
		if (map[rr][cc-1]==="M")
			mine_count++;
		if (map[rr+1][cc-1]==="M")
			mine_count++;
		if (map[rr+1][cc]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (rr==(rows-1))
	{
		if (map[rr][cc-1]==="M")
			mine_count++;
		if (map[rr-1][cc-1]==="M")
			mine_count++;
		if (map[rr-1][cc]==="M")
			mine_count++;
		if (map[rr-1][cc+1]==="M")
			mine_count++;
		if (map[rr][cc+1]==="M")
			mine_count++;
		return mine_count.toString();
	}
	else if (cc==0)
	{
		if (map[rr-1][0]==="M")
			mine_count++;
		if (map[rr-1][1]==="M")
			mine_count++;
		if (map[rr][1]==="M")
			mine_count++;
		if (map[rr+1][1]==="M")
			mine_count++;
		if (map[rr+1][0]==="M")
			mine_count++;
		return mine_count.toString();
	}	
	else
	{
		if (map[rr-1][cc-1]==="M")
			mine_count++;
		if (map[rr-1][cc]==="M")
			mine_count++;
		if (map[rr-1][cc+1]==="M")
			mine_count++;
		if (map[rr][cc+1]==="M")
			mine_count++;
		if (map[rr+1][cc+1]==="M")
			mine_count++;
		if (map[rr+1][cc]==="M")
			mine_count++;
		if (map[rr+1][cc-1]==="M")
			mine_count++;
		if (map[rr][cc-1]==="M")
			mine_count++;
		return mine_count.toString();
	}
}//PutNumber

function MapPutNumbers()
{
	for (let rr = 0; rr < rows; rr++)
	{
		for (let cc = 0; cc < cols; cc++)
		{
			if (map[rr][cc]==="E")
				map[rr][cc] = PutNumber(rr,cc);
		}
	}
}//MapPutNumbers

function MapAnotherPass(temp, total_mines, mine_random_num)
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
				if (mine_count < total_mines && map[rr][cc] === "E")
				{
					crypto.getRandomValues(randomBuffer);
					if (randomBuffer[0] <= mine_random_num)
					{
						map[rr][cc] = "M";
						mine_count++;
					}
				}
			}
		}
		console.log("MapAnotherPass " + pass + ": mine_count = " + mine_count);
		pass++;
	}
}//MapAnotherPass

function InitializeMap(gametype)
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
	var total_mines = total_cells * easy_mine_percent;
	var mine_random_num = 4294967295 * easy_mine_percent;
	if (gametype==="HARD")
	{
		total_mines = total_cells * hard_mine_percent;
		mine_random_num = 4294967295 * hard_mine_percent;
	}
	
	opened_flagged_count = 0;
	const randomBuffer = new Uint32Array(1);
	var mine_count = 0;
	for (let rr = 0; rr < rows; rr++)
	{
		map[rr] = [];
		map_status[rr] = [];
		for (let cc = 0; cc < cols; cc++)
		{
			map_status[rr][cc] = "closed";
			crypto.getRandomValues(randomBuffer);
			if ((randomBuffer[0] <= mine_random_num) &&
				(mine_count < total_mines))
			{
				map[rr][cc] = "M";
				mine_count++;
			}
			else
				map[rr][cc] = "E";
		}
	}
	console.log("mine_count = " + mine_count);
	MapAnotherPass(mine_count, total_mines, mine_random_num);
	MapPutNumbers();
}//InitializeMap


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
	  res.render("home");  
  })
  .post('/new_game', (req, res) => {
	  var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
              res.send("route post new_game form.parse ERROR = " + err);
              return;
          }
          
		  const gametype = fields.gametype[0];
		  console.log("gametype = " + gametype);
	  })
	  InitializeMap(gametype);
	  res.render("game_board", { rows:rows, cols:cols, map_status:map_status, map:map, clicktype:"Flag", endgame:"CONTINUE" });
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
		  //const keys = JSON.stringify(keys_obj);
		  //console.log("keys = " + keys);
		  //console.log("typeof keys = " + typeof keys);
		  
		  const clicktype = fields.click_type[0];
		  console.log("clicktype = " + clicktype);
		  
		  var buttonstr = "";
		  for (ii=0; ii < keys_obj.length; ii++)
		  {
			  if (keys_obj[ii].startsWith("button"))
				  buttonstr = keys_obj[ii];
		  }
				  
		  const splitarray = buttonstr.split("_");
		  
		  //console.log("splitarray[1] = " + splitarray[1]);
		  //console.log("splitarray[2] = " + splitarray[2]);

		  var endgame = "";
		  if (clicktype==="Flag")
		  {
			  if (map_status[splitarray[1]][splitarray[2]] === "flagged")
			  {
				  //console.log("change map_status " + splitarray[1] + " " + splitarray[2] + "to closed");
				  map_status[splitarray[1]][splitarray[2]] = "closed";
				  opened_flagged_count--;
			  }
			  else
			  {
				  //console.log("change map_status " + splitarray[1] + " " + splitarray[2] + "to flagged");
				  map_status[splitarray[1]][splitarray[2]] = "flagged";
				  opened_flagged_count++;
			  }
		  }
		  else  //Dig
		  {
			  map_status[splitarray[1]][splitarray[2]] = "open";
			  opened_flagged_count++;
			  if (map[splitarray[1]][splitarray[2]]==="M")
				  endgame="LOSE";
		  }

		  //check win condition
		  if (endgame !== "LOSE" && opened_flagged_count==total_cells)
		  {
			  for (rr=0; rr < rows; rr++)
			  {
				  for (cc=0; cc < cols; cc++)
				  {
					  if (map_status[rr][cc] === "flagged" && map[rr][cc] !== "M")
					  {
						   rr=rows;
						   cc=cols;
						   endgame="CONTINUE";
					  }
				  }
			  }

			  if (endgame !== "CONTINUE")
				  endgame = "WIN";
		  }
		  
		  res.render("game_board", { rows:rows, cols:cols, map_status:map_status, map:map, clicktype:clicktype, endgame:endgame });
      })//form.parse
  })
  .listen(PORT, () => console.log(`Listening to ${ PORT }`))

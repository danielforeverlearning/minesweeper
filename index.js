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

async function fetchStock(tickerstr) {
            var apiUrl = 'https://finnhub.io/api/v1/quote?token=cnajgk9r01ql0f89cc00cnajgk9r01ql0f89cc0g&symbol='; 
            apiUrl += tickerstr;
            
            try {
                const response = await fetch(apiUrl);

                // Check if the response was successful
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const answer = await response.json(); // Parse the JSON response

				console.log(answer);
				
				const result = { ticker: tickerstr, currentvalue: answer.c };
                return (result);
                

            } catch (error) {
                console.error('Error fetching stock:', error);
            }
}


express()
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async (req, res) => { res.render("home")})
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
	  
	let jsonArray = [];
	  
    const intc_obj = await fetchStock("INTC");
	jsonArray.push(intc_obj);
	  
    const msft_obj = await fetchStock("MSFT");
	jsonArray.push(msft_obj);
	  
    const tsm_obj = await fetchStock("TSM");
	jsonArray.push(tsm_obj);
	  
	const amd_obj = await fetchStock("AMD");
	jsonArray.push(amd_obj);
	  
    const cost_obj = await fetchStock("COST");
	jsonArray.push(cost_obj);

	const now = new Date();
	const options = {
	  weekday: 'long', // "Monday"
	  year: 'numeric', // "2025"
	  month: 'long',   // "October"
	  day: 'numeric',  // "20"
	  hour: '2-digit', // "11"
	  minute: '2-digit', // "31"
	  second: '2-digit', // "00"
	  timeZone: "America/New_York",
	  timeZoneName: 'short', // "PDT"
	};
	const customFormatted = new Intl.DateTimeFormat('en-US', options).format(now);

	res.render("home", { rows: jsonArray, timestr: customFormatted });
	  
  }) //mypost
  .listen(PORT, () => console.log(`Listening to ${ PORT }`))

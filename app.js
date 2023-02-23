const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { static } = require('express');
const app = express();
// day month and time
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = dd + '-' + mm + '-' + yyyy;
console.log(formattedToday);
// Use EJS Templating
app.set('view engine', 'ejs')
// Use body parser
app.use(bodyParser.urlencoded({
    extended: true
  }))
// Use sttic pages
app.use(express.static('public'));


// Send the home page
app.get('/', function (req, res){
    res.sendFile(__dirname + '/index.html')
})

// Renders to solah page when Buttton is clicked 
app.get("/solah", function(req, res){

  res.render('solah')  
})

// Fetching API & adds information to solah.ej s
app.post("/solah",function(req,res){
const query = req.body.city;
    
const url = "https://api.aladhan.com/v1/timingsByAddress/"+formattedToday+"?address="+query+"&method=99&methodSettings=18.5%2Cnull%2C17.5"

https.get(url,function(response){
  response.on('data', function(data){ 
    const json = JSON.parse(data) 
    const numDay = json.data.date.gregorian.day
    const day = json.data.date.gregorian.weekday.en
    const month = json.data.date.gregorian.month.en
    const year = json.data.date.gregorian.year
    const date =  `${day} ${numDay} ${month} ${year}`

    function addMinutesconvertTime(time, time24) {
      // Add 20 minutes
      function z(n){
        return (n<10? '0':'') + n;
      }
      var bits = time.split(':');
      var mins = bits[0]*60 + (+bits[1]) + (+20);
      // Convert to 12 hours
      var ts = time24;
      var H = +ts.substr(0, 2);
      var h = (H % 12) || 12;
      h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
      var ampm = H < 12 ? " AM" : " PM";
      ts = h + ts.substr(2, 3) + ampm;
      zs = z(mins%(24*60)/60 | 0) + ':' + z(mins%60)
      return ts; 
    }
    const city = query
    const cityCap = city.charAt(0).toUpperCase() + city.slice(1)
    const fajr = addMinutesconvertTime(json.data.timings.Fajr,json.data.timings.Fajr)
    const dhuhr = addMinutesconvertTime(json.data.timings.Dhuhr,json.data.timings.Dhuhr)
    const asr = addMinutesconvertTime(json.data.timings.Asr,json.data.timings.Asr)
    const maghrib = addMinutesconvertTime(json.data.timings.Maghrib,json.data.timings.Maghrib)
    const isha = addMinutesconvertTime(json.data.timings.Isha,json.data.timings.Isha)
    res.render('solah',{date:date, city:cityCap , fajr:fajr, dhuhr:dhuhr, asr:asr, maghrib:maghrib ,isha:isha})
  }) 
})

})


// 
app.listen(3000,function (){
    console.log('server is working on port 5000');
})

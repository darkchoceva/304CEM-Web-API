const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

const apikey = '613e6d96762b49de35e8e86a6d0e263f';
const db = "mongodb+srv://eva:1stmongodb@cluster0.urh19.mongodb.net/TwilightDB?retryWrites=true&w=majority";
var sunriseHour, sunsetHour, weather, temperature, countryCode;

const twilightSchema = new mongoose.Schema({
    sunriseHour: {type: String},
    sunsetHour: {type: String},
    weather: {type: String},
    temperature: {type: String},
    countryCode: {type: String}
});

const record = mongoose.model('records', twilightSchema);
mongoose.connect(db).then(() => {
    console.log("Connected to database");
}).catch(() => {
    console.log("Error connecting to database");
});

//delete many 
app.get('/deleteRecords', (req, res) => {
    record.deleteMany({}, function (err){});
})

//insert
app.get('/insertSun', (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");

    const lat = req.query.lat;
    const lng = req.query.lng;
    const querystrSun = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`;
    const querystrWeather = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apikey}`;

    axios.get(querystrSun).then((response) => {
        sunriseHour = response.data.results.sunrise;
        sunsetHour = response.data.results.sunset;

        axios.get(querystrWeather).then((response) => {
            weather = response.data.weather[0].description;
            temperature = (response.data.main.temp - 273.15).toFixed(2); //convert Kelvin into Celsius
            countryCode = response.data.sys.country;

            twilightValue = new record ({
                sunriseHour: sunriseHour,
                sunsetHour: sunsetHour,
                weather: weather,
                temperature: temperature,
                countryCode: countryCode
            });

            twilightValue.save().then(result => {
                console.log("Success" + result);
            }).catch(error => {
                console.log("Error" + error);
            });
            
            //retrieve all records from db
            record.find({}, 'countryCode sunriseHour sunsetHour weather temperature -_id', function (err, docs){
                res.end(
                    //array in json format
                    JSON.stringify({
                        docs:docs
                    })
                );
                //console.log(docs);
            });
        });
    })
});

app.listen(5000, () => {
    console.log('Server listening to port 5000');
});
const apiKey="8ee56800e293ff166b81244d88480e1f";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


const searchBox = document.querySelector("#search-city input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector("#icon");

async function checkWeather(city) {
    const response=await fetch(apiUrl + city+`&appid=${apiKey}`);
    var data= await response.json();
    console.log(data);

  //for date and day from timezone 
    const timezone = data.timezone;

  function getDateTimeByOffset(offsetInSeconds) {
    const offsetInMilliseconds = offsetInSeconds * 1000;
    const localDate = new Date();

    // Convert local time to UTC and apply the timezone offset
    const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000);
    const targetDate = new Date(utc + offsetInMilliseconds);

    // Extract day and formatted date-time
    const options = {
        weekday: 'long',    // Day of the week
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format; set to true for 12-hour format
    };

    // Get day and dateTime strings
    const day = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateTime = targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      + ', ' + targetDate.toLocaleTimeString('en-US', { hour12: true });

    // Return JSON object
    return {
        day: day,
        dateTime: dateTime
    };
  }

    console.log(getDateTimeByOffset(timezone));
    const {day,dateTime}= getDateTimeByOffset(timezone);
    document.querySelector("#date").innerHTML = dateTime;
    document.querySelector("#day").innerHTML = day;

    document.querySelector("#city").innerHTML = data.name;
    document.querySelector("#wind").innerHTML = data.wind.speed + "km/hr";
    document.querySelector(".temp-max").innerHTML = Math.trunc(data.main.temp_max) + "°C";
    document.querySelector(".temp-min").innerHTML = Math.trunc(data.main.temp_min) +"°C";
    document.querySelector("#degree").innerHTML = Math.trunc(data.main.feels_like)+"°C";
    document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
    document.querySelector("#comment").innerHTML = data.weather[0].description.toUpperCase();

    const weatherCondition = data.weather[0].main;
    const newIcon = getWeatherIcon(weatherCondition);
    weatherIcon.className = "";  // Removes all existing classes
    // Remove all classes except "weather-icon"
    weatherIcon.className = newIcon;

    // Add the new icon classes
   newIcon.split(" ").forEach(className => {
     weatherIcon.classList.add(className);
    });
   }

function getWeatherIcon(weather) {
    switch (weather) {
        case "Clear":
            return "fas fa-sun";  // Sun icon for clear weather
        case "Clouds":
            return "fas fa-cloud";  // Cloud icon for cloudy weather
        case "Rain":
            return "fas fa-cloud-showers-heavy";  // Rain icon
        case "Snow":
            return "fas fa-snowflake";  // Snow icon
        case "Thunderstorm":
            return "fas fa-bolt";  // Thunderstorm icon
        case "Drizzle":
            return "fas fa-cloud-rain";  // Drizzle icon
        case "Mist":
        case "Fog":
            return "fas fa-smog";  // Fog or mist icon
        default:
            return "fas fa-cloud";  // Default cloudy icon
    }
}


searchBtn.addEventListener("click", ()=>{
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        alert("Please enter a city name");
    }
})

document.querySelector("#search-city input").addEventListener('keypress', function(event) {
  const city = searchBox.value.trim();
  if(event.key==='Enter'){
      checkWeather(city);
  }
});











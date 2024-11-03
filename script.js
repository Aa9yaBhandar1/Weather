const apiKey="8ee56800e293ff166b81244d88480e1f";
const apiUrlWeather="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiUrlForecast="https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";


const searchBox = document.querySelector("#search-city input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector("#icon");
const landingPage = document.querySelector("#landing-page");
const mainPage = document.querySelector("#main-page");
const goHome = document.querySelector("#home");
const navbarRight=document.querySelector("#navbar-right");


// -----------------for Weather API------------------------

async function checkWeather(city) {
    const response=await fetch(apiUrlWeather + city+`&appid=${apiKey}`);
    var data= await response.json();
    console.log(data);

  //----------------for date and day from timezone---------- 
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
        hour12: false // 24-hour format; set to true for 12-hour format
    };
    // Get day and dateTime strings
    const day = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateTime = targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      + ', ' + targetDate.toLocaleTimeString('en-US', { hour12: true });
    // Return JSON object
    return {
        day: day,
        dateTime: dateTime
    };
  }
    console.log(getDateTimeByOffset(timezone));
    const {day,dateTime}= getDateTimeByOffset(timezone);

  // ------------setting values to the weather condition datas---------------
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

// ------------activate weather and forecast screen by clickHomeing search button-----
searchBtn.addEventListener("click", ()=>{
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
        getForecast(city);
        //showMainPage();
        togglePage();
    } else {
        alert("Please enter a city name");
    }
});

// ----------activate by entering the key ------------------
document.querySelector("#search-city input").addEventListener('keypress', function(event) {
  const city = searchBox.value.trim();
  if(event.key==='Enter'){
      checkWeather(city);
      getForecast(city);
      //showMainPage();
      togglePage();
  }
});

 //goHome.addEventListener("click", showLandingPage);

function togglePage(){
  //if(mainPage.classList.contains('hidden')){
    //mainPage.classList.remove('hidden');
    landingPage.classList.add('hidden');
    mainPage.classList.add('active');

    document.body.classList.add("landing-hidden");
    document.body.classList.remove("main-hidden");

  //}
 /* else{
    mainPage.classList.remove('active')
    mainPage.classList.add('hidden');
    landingPage.classList.remove('hidden');
    landingPage.classList.add('active');

    document.body.classList.add("main-hidden");
    document.body.classList.remove("landing-hidden");

  }*/
}
/* function showLandingPage(){
  mainPage.classList.remove('active');
  mainPage.classList.add('hidden');
  landingPage.classList.remove('hidden');
  landingPage.classList.add('active');
}
function showMainPage(){
  landingPage.classList.add('hidden');
  mainPage.classList.remove('hidden');
  mainPage.classList.add('active');
  navbarRight.classList.remove("main-hidden");
  navbarRight.classList.add("landing-hidden");
}*/

// ------------- Weekly Forecast ------------------
async function getForecast(city) {
    const response = await fetch(apiUrlForecast + city + `&appid=${apiKey}`);
    const forecast = await response.json();

    const filteredForecasts = forecast.list.filter(forecastWeather => {
        const timeFromForecast = forecastWeather.dt_txt.split(' ')[1];
        return timeFromForecast === '12:00:00';
    });
    console.log(filteredForecasts);
    updateForecast(filteredForecasts);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Get month in 'Nov' format
    const month = date.toLocaleString('en-US', { month: 'short' });
    
    // Get day of month (1, 2, 3, etc.)
    const day = date.getDate();
    
    // Get day of week in 'SAT' format
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    
    // Combine them in the desired format
    return `${month} ${day}, ${dayOfWeek}`;
}

function updateForecast(forecastData) {
    const weatherBoxes = document.querySelectorAll(".week-forecast .weatherBox");
    
    forecastData.forEach((data, index) => {
        if (weatherBoxes[index]) {
            // Format the date
            const formattedDate = formatDate(data.dt_txt);
            
            // Update the elements
            weatherBoxes[index].querySelector(".forecast-day").innerText = formattedDate;
            weatherBoxes[index].querySelector(".forecast-temperature").innerText = (data.main.temp) + "°C";
    
            forecastData.forEach((data, index) => {
                if (weatherBoxes[index]) {
                    // Format date and update temperature as before...
                    
                    // Update weather icon
                    const forecastIcons = weatherBoxes[index].querySelector(".forecast-icons2");
                    if (forecastIcons) {
                        const forecastCondition = data.weather[0].main;
                        const newForecastIcon = getWeatherIcon(forecastCondition);
                        
                        // First, remove all existing classes but keep 'weather-icon'
                        forecastIcons.className = 'forecast-icons2';
                        
                        // Add the new FontAwesome classes
                        newForecastIcon.split(' ').forEach(className => {
                            forecastIcons.classList.add(className);
                        });
                        
                        // Debug
                        console.log('Updated icon for condition:', {
                            condition: forecastCondition,
                            newClasses: newForecastIcon,
                            finalClassName: forecastIcons.className
                        });
                    }
                }
            });
           
        } 
       }
    );
}







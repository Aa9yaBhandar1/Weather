const apiKey="8ee56800e293ff166b81244d88480e1f";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


const searchBox = document.querySelector("#search-city input");
const searchBtn = document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response=await fetch(apiUrl + city+`&appid=${apiKey}`);
    var data= await response.json();
    console.log(data);
    document.querySelector("#city").innerHTML = data.name;
    document.querySelector("#wind").innerHTML = data.wind.speed + "km/hr";
    document.querySelector(".max").innerHTML = Math.round(data.main.temp_max) + "°C";
    document.querySelector(".min").innerHTML = Math.round(data.main.temp_min) +"°C";
    document.querySelector("#degree").innerHTML = Math.round(data.main.feels_like)+"°C";
    document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
    document.querySelector("#comment").innerHTML = data.weather[0].description.toUpperCase();

    const weatherCondition = data.weather[0].main;
    const newIcon = getWeatherIcon(weatherCondition);
    weatherIcon.className = "weather-icom";
    weatherIcon.classList.add(...newIcon.split(" "));

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












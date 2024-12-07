"use strict";
const searchInput = document.querySelector("#city");
const submitButton = document.querySelector("#submit");
const showWeather = document.querySelector("#weather-card");
const baseUrl = "https://api.weatherapi.com/v1";
const key = "a4d1441153364590a3a120046240512";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function locationGranted(position) {
  console.log(position);
  getWeatherByCoords(position.latitude, position.longitude);
}

function locationDenied(error) {
  console.error(error);
  getWeather("cairo");
}

async function getUserLocation() {
  let permissionStatus = (
    await navigator.permissions.query({ name: "geolocation" })
  ).state;
  if (permissionStatus == "denied") {
    locationDenied("Permissions denied");
  } else {
    if (permissionStatus == "prompt") {
      locationDenied("Permissions not granted yet");
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationGranted({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          locationDenied(error.message);
        }
      );
    } else {
      locationDenied("Geolocation is not supported by this browser.");
    }
  }
}
async function getWeather(q) {
  try {
    const response = await fetch(
      `${baseUrl}/forecast.json?key=${key}&q=${q}&days=3`
    );
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
function getWeatherByCity(city) {
  getWeather(city);
}
function getWeatherByCoords(latitude, longitude) {
  getWeather(`${latitude},${longitude}`);
}

function renderData(data) {
  let date = new Date(data.forecast.forecastday[0].date);
  let dayOfWeek = daysOfWeek[date.getDay()];
  let dayOfMonth = date.getDate();
  let month = months[date.getMonth()];
  let city = data.location.name;
  let currentTemp = data.current.temp_c;
  let conditionIcon = data.current.condition.icon;
  let conditionText = data.current.condition.text;
  console.log(data);

  let htmlReplacedCode = `<div class="weather-conatiner col-12 col-lg-4">
            <div
              class="weather-header d-flex justify-content-between align-items-center p-2"
            >
              <p class="mb-0">${dayOfWeek}</p>
              <p class="mb-0">${dayOfMonth} ${month}</p>
            </div>
            <div class="weather-body p-4">
              <p class="mb-0 fs-3">${city}</p>
              <div class="d-flex flex-wrap align-items-center justify-content-between">
                <p class="mb-0 temp fw-bold text-white">${currentTemp} &#8451;</p>
                <img
                  src="https:${conditionIcon}"
                  alt=""
                  width="90"
                />
              </div>
              <div class="custom">${conditionText}</div>
            </div>
          </div>`;
  for (let i = 1; i < data.forecast.forecastday.length; i++) {
    date = new Date(data.forecast.forecastday[i].date);
    dayOfWeek = daysOfWeek[date.getDay()];
    conditionIcon = data.forecast.forecastday[i].day.condition.icon;
    conditionText = data.forecast.forecastday[i].day.condition.text;
    let minTemp = data.forecast.forecastday[i].day.mintemp_c;
    let maxTemp = data.forecast.forecastday[i].day.maxtemp_c;
    htmlReplacedCode += `<div class="weather-conatiner${
      i % 2 != 0 ? "-1" : ""
    } col-12 col-lg-4">
            <div
              class="weather-header d-flex justify-content-center align-items-center p-2"
            >
              <p class="mb-0">${dayOfWeek}</p>
            </div>
            <div class="weather-body p-4 text-center">
              <img
                src="https:${conditionIcon}"
                alt=""
                width="64"
              />
              <p class="mb-0 fs-3 fw-bold text-white">${maxTemp} &#8451;</p>
              <p class="">${minTemp} &#8451;</p>
              <p class="">${conditionText}</p>
            </div>
          </div>`;
  }
  showWeather.innerHTML = htmlReplacedCode;
}

getUserLocation();

searchInput.addEventListener("input", function () {
  if (this.value.length > 2) {
    getWeatherByCity(this.value);
  }
});

searchInput.addEventListener("input", function () {
  if (searchInput.value.length > 2) {
    getWeatherByCity(searchInput.value);
  }
});

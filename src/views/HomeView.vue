<template>
  <div class="weather-container">
    <h2 class="title">Weather Information</h2>
    <div class="input-section">
      <label for="location" class="label">Enter Location:</label>
      <input v-model="location" id="location" class="input" placeholder="City Name" />
      <button @click="fetchWeather" class="button">Get Weather</button>
    </div>

    <div v-if="weather" class="weather-details">
      <div class="main-info">
        <h3 class="location">{{ weather.name }}</h3>
        <p class="temperature">{{ weather.main.temp }}°C</p>
        <img :src="'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'" alt="Weather Icon"
          class="weather-icon" />
      </div>
      <div class="additional-info">
        <p class="description">{{ weather.weather[0].description }}</p>
        <p class="humidity">Humidity: {{ weather.main.humidity }}%</p>
        <p class="wind-speed">Wind Speed: {{ weather.wind.speed }} m/s</p>
        <p class="day-of-week">Day: {{ getDayOfWeek() }}</p>
        <p class="local-time">Local Time: {{ getLocalTime() }}</p>
      </div>
    </div>

    <!-- Hourly and Daily Forecasts -->
    <div v-if="hourlyForecast.length" class="forecast-container">
      <h3 class="forecast-title">Hourly Forecast</h3>
      <div class="forecast-hourly" v-for="forecast in hourlyForecast" :key="forecast.dt">
        <p>{{ getHour(forecast.dt_txt) }}: {{ forecast.main.temp }}°C, {{ forecast.weather[0].description }}</p>
      </div>
    </div>

    <div v-if="dailyForecast.length" class="forecast-container">
      <h3 class="forecast-title">Daily Forecast</h3>
      <div class="forecast-daily" v-for="forecast in dailyForecast" :key="forecast.dt">
        <p>{{ getDayOfWeek(forecast.dt_txt) }}: {{ forecast.main.temp }}°C, {{ forecast.weather[0].description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      weather: null,
      hourlyForecast: [],
      dailyForecast: [],
      location: 'Cape Town', // Default location
    };
  },
  methods: {
    async fetchWeather() {
      const apiKey = 'e945d7f71eb0e5e621a7dfcce2cb1a43'; // Your API key

      try {
        // Fetch current weather data with metric units
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.location}&units=metric&appid=${apiKey}`);
        this.weather = weatherResponse.data;

        // Fetch forecast data with metric units
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${this.location}&units=metric&appid=${apiKey}`);
        this.processForecastData(forecastResponse.data.list);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Optionally, handle errors or retry
      }
    },
    processForecastData(data) {
      this.hourlyForecast = data.slice(0, 8); // Get the first 8 entries for the next 24 hours (3-hour intervals)

      // Group data by day and take the first entry of each day for daily forecast
      const daily = {};
      data.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!daily[date]) {
          daily[date] = item;
        }
      });
      this.dailyForecast = Object.values(daily).slice(0, 5); // Get the first 5 days
    },
    getDayOfWeek(dateString) {
      const date = new Date(dateString);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return daysOfWeek[date.getDay()]; // Get day of the week
    },
    getHour(dateString) {
      const date = new Date(dateString);
      return date.getHours(); // Get hour from datetime
    },
    getLocalTime() {
      if (!this.weather) return '';

      // Get the current UTC time in seconds (Date.now() returns milliseconds)
      const currentUtcTimeInSeconds = Math.floor(Date.now() / 1000);

      // Calculate local time using timezone offset (timezone is in seconds)
      const localTimeInSeconds = currentUtcTimeInSeconds + this.weather.timezone;

      // Convert back to milliseconds and create a new Date object
      const localTime = new Date(localTimeInSeconds * 1000);

      // Format local time as HH:MM:SS
      return localTime.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  },
  mounted() {
    this.fetchWeather(); // Fetch weather data for default location on component mount
  }
};
</script>

<style scoped>
.weather-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(to right, #74ebd5, #acb6e5);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Arial', sans-serif;
}

.title {
  text-align: center;
  color: #004d40;
  font-weight: bold;
  font-size: 24px;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.label {
  margin-bottom: 8px;
  color: #004d40;
  font-size: 16px;
}

.input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #004d40;
  margin-bottom: 10px;
  font-size: 16px;
  width: 80%;
  max-width: 400px;
}

.button {
  padding: 10px 20px;
  background-color: #004d40;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  background-color: #00251a;
}

.weather-details {
  text-align: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.main-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.location {
  font-size: 28px;
  font-weight: bold;
  color: #004d40;
}

.temperature {
  font-size: 48px;
  font-weight: bold;
  color: #e65100;
  margin: 10px 0;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.description,
.humidity,
.wind-speed,
.day-of-week,
.local-time {
  font-size: 16px;
  color: #004d40;
}

.forecast-container {
  margin-top: 20px;
  padding: 20px;
  background: rgb(255, 255, 255);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.forecast-title {
  text-align: center;
  color: #004d40;
  font-weight: bold;
  font-size: 20px;
}

.forecast-hourly,
.forecast-daily {
  color: #004d40;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
}
</style>

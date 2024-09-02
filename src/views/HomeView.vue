<template>
  <div class="weather-container">
    <h2 class="title">Weather Information</h2>
    <div class="input-section">
      <label for="location" class="label">Enter Location:</label>
      <input v-model="location" id="location" class="input" placeholder="City Name" />
      <button @click="fetchWeather" class="button">Get Weather</button>
    </div>

    <div v-if="weather" class="weather-details">
      <p class="location">Location: {{ weather.name }}</p>
      <p class="temperature">Temperature: {{ weather.main.temp }} °C</p>
      <p class="humidity">Humidity: {{ weather.main.humidity }}%</p>
      <p class="wind-speed">Wind Speed: {{ weather.wind.speed }} m/s</p>
      <p class="day-of-week">Day: {{ getDayOfWeek() }}</p>
      <p class="local-time">Local Time: {{ getLocalTime() }}</p>
      <p class="description">Weather: {{ weather.weather[0].description }}</p>
      <img :src="'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'" alt="Weather Icon"
        class="weather-icon" />
    </div>

    <!-- Hourly and Daily Forecasts -->
    <div v-if="hourlyForecast.length" class="forecast-container">
      <h3 class="forecast-title">Hourly Forecast</h3>
      <div class="forecast-hourly" v-for="forecast in hourlyForecast" :key="forecast.dt">
        <p>{{ getHour(forecast.dt_txt) }}: {{ forecast.main.temp }} °C, {{ forecast.weather[0].description }}</p>
      </div>
    </div>

    <div v-if="dailyForecast.length" class="forecast-container">
      <h3 class="forecast-title">Daily Forecast</h3>
      <div class="forecast-daily" v-for="forecast in dailyForecast" :key="forecast.dt">
        <p>{{ getDayOfWeek(forecast.dt_txt) }}: {{ forecast.main.temp }} °C, {{ forecast.weather[0].description }}</p>
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
  border-radius: 8px;
  background: linear-gradient(to right, #e0f7fa, #b2ebf2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #00796b;
  font-family: 'Arial', sans-serif;
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
  font-family: 'Arial', sans-serif;
}

.input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #004d40;
  margin-bottom: 10px;
  font-size: 16px;
}

.button {
  padding: 10px 20px;
  background-color: #00796b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  background-color: #004d40;
}

.weather-details {
  text-align: center;
}

.location,
.temperature,
.humidity,
.wind-speed,
.day-of-week,
.local-time,
.description {
  color: #004d40;
  font-family: 'Arial', sans-serif;
}

.weather-icon {
  margin-top: 10px;
}

.forecast-container {
  margin-top: 20px;
}

.forecast-title {
  text-align: center;
  color: #00796b;
  font-family: 'Arial', sans-serif;
}

.forecast-hourly,
.forecast-daily {
  color: #004d40;
  font-family: 'Arial', sans-serif;
  text-align: center;
  margin-top: 10px;
}
</style>

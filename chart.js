const form = document.getElementById("weatherForm");
const resultDiv = document.getElementById("weatherResult");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const citiesInput = document.getElementById("cityInput").value;
  const cities = citiesInput.split(",").map((city) => city.trim());

  resultDiv.innerHTML = "";

  if (!cities || cities.length === 0 || cities.some((city) => !city)) {
    resultDiv.innerHTML =
      '<div class="alert alert-danger">Please enter at least one city name, separated by commas!</div>';
    return;
  }

  const apiKey = "eab996b63b1724316cf58782e7609777";

  try {
    const weatherPromises = cities.map(async (city) => {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`City not found: ${city}`);
      }
      return response.json();
    });

    const weatherData = await Promise.all(weatherPromises);

    weatherData.forEach((data) => {
      resultDiv.innerHTML += `
                <div class="card result-card p-3 mb-3">
                    <div class="card-body text-center">
                        <h5 class="card-title">${data.name}, ${data.sys.country} <i class="fas fa-map-marker-alt text-info"></i></h5>
                        <p class="mb-2"><i class="fas fa-temperature-high text-danger"></i> <strong>${data.main.temp}°C</strong></p>
                        <p class="mb-2"><i class="fas fa-cloud text-primary"></i> ${data.weather[0].description}</p>
                        <p class="mb-0"><i class="fas fa-tint text-info"></i> Humidity: ${data.main.humidity}%</p>
                    </div>
                </div>
            `;
    });
  } catch (error) {
    resultDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});

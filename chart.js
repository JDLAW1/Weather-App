const form = document.getElementById("weatherForm");
const resultDiv = document.getElementById("weatherResult");
let myChart;

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

    createOrUpdateChart(weatherData);
  } catch (error) {
    resultDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});

function createOrUpdateChart(weatherData) {
  if (!weatherData || weatherData.length === 0) {
    return;
  }

  const cityNames = weatherData.map((data) => data.name);
  const temperatures = weatherData.map((data) => data.main.temp);

  const canvas = document.getElementById("temperatureChart");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: cityNames,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatures,
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Temperature (°C)",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else {
    console.error(
      "El elemento canvas no se encontró. Revisa el HTML y los IDs."
    );
  }
}

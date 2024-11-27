const apikey = "a5fbff3787c808cbcd1607697466ba2e";

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    weatherReport(data);
                })
                .catch((error) => {
                    console.error("Error fetching location weather data:", error);
                });
        });
    }
});

function searchByCity() {
    const place = document.getElementById("input").value.trim();
    if (!place) {
        alert("Please enter a city name.");
        return;
    }

    const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;
    fetch(urlsearch)
        .then((res) => res.json())
        .then((data) => weatherReport(data))
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            alert("City not found.");
        });

    document.getElementById("input").value = "";
}

function weatherReport(data) {
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;
    fetch(forecastURL)
        .then((res) => res.json())
        .then((forecast) => {
            document.getElementById("city").innerText = `${data.name}, ${data.sys.country}`;
            document.getElementById("temperature").innerText = `${kelvinToCelsius(data.main.temp)} °C`;
            document.getElementById("clouds").innerText = data.weather[0].description;

            const icon = data.weather[0].icon;
            document.getElementById("img").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            hourForecast(forecast);
            dayForecast(forecast);
        })
        .catch((error) => {
            console.error("Error fetching forecast data:", error);
        });
}

function kelvinToCelsius(kelvin) {
    return Math.floor(kelvin - 273.15);
}

function hourForecast(forecast) {
    document.querySelector(".templist").innerHTML = "";
    forecast.list.slice(0, 5).forEach((entry) => {
        const hourR = document.createElement("div");
        hourR.classList.add("next");

        const time = document.createElement("p");
        time.classList.add("time");
        time.innerText = new Date(entry.dt * 1000).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const temp = document.createElement("p");
        temp.innerText = `${kelvinToCelsius(entry.main.temp_max)} °C / ${kelvinToCelsius(entry.main.temp_min)} °C`;

        const desc = document.createElement("p");
        desc.classList.add("desc");
        desc.innerText = entry.weather[0].description;

        hourR.appendChild(time);
        hourR.appendChild(temp);
        hourR.appendChild(desc);

        document.querySelector(".templist").appendChild(hourR);
    });
}

function dayForecast(forecast) {
    document.querySelector(".weekF").innerHTML = "";
    forecast.list.filter((_, index) => index % 8 === 0).forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("dayF");

        const date = document.createElement("p");
        date.classList.add("date");
        date.innerText = new Date(entry.dt * 1000).toDateString();

        const temp = document.createElement("p");
        temp.innerText = `${kelvinToCelsius(entry.main.temp_max)} °C / ${kelvinToCelsius(entry.main.temp_min)} °C`;

        const desc = document.createElement("p");
        desc.classList.add("desc");
        desc.innerText = entry.weather[0].description;

        div.appendChild(date);
        div.appendChild(temp);
        div.appendChild(desc);

        document.querySelector(".weekF").appendChild(div);
    });
}

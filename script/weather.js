(() => {
    let weatherObj = {};
    const key = config.API_KEY;
    const unsplashKey = config.UNSPLASH_KEY;
    let unit = " \u00B0C";
    let cityInput;
    let countryCode;
    let metric = true;
    let city;
    let country;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    document.getElementById("image").addEventListener("click", function () {
        document.getElementById("cityImage").style.display = "block";
    })

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById("cityImage").style.display = "none";
    })

    document.getElementById("graph").addEventListener("click", function () {
        document.getElementById("graphBox").style.display = "block";
    })

    document.getElementById("closing").addEventListener("click", function () {
        document.getElementById("graphBox").style.display = "none";
    })

    document.getElementById("celcius").addEventListener("click", function () {
        metric = true;
        unit = " \u00B0C";
        document.getElementById("fahrenheit").disabled = false;
        document.getElementById("celcius").disabled = true;
    })

    document.getElementById("fahrenheit").addEventListener("click", function () {
        metric = false;
        unit = " \u00B0F";
        document.getElementById("celcius").disabled = false;
        document.getElementById("fahrenheit").disabled = true;
    })

    document.getElementById("run").addEventListener("click", function () {
        checkInput();
        document.getElementById("image").disabled = true;
        document.getElementById("graph").disabled = true;
        document.getElementById("city").innerText = "";
        document.getElementById("weatherWeek").innerHTML = "";
        let units;
        if (metric == true) {
            units = "&units=metric";
        } else {
            units = "";
        }
        let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + countryCode + units + "&appid=" + key;
        let urlPicture = "https://api.unsplash.com/photos/random?query=" + cityInput + "&client_id=" + unsplashKey;
        fetchData(url, getOneCall);
        fetchData(urlPicture, getUnsplash)
        getGraph()

    })

    function getGraph() {
        setTimeout(function (){

        let ctx = document.getElementById('myChart').getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [weatherObj.dateNumber[0], weatherObj.dateNumber[1], weatherObj.dateNumber[2], weatherObj.dateNumber[3], weatherObj.dateNumber[4]],
                datasets: [{
                    label: 'average temperature',
                    data: [weatherObj.temp[0], weatherObj.temp[1], weatherObj.temp[2], weatherObj.temp[3], weatherObj.temp[4]],
                    borderWidth: 1,
                    fill: false,
                    borderColor: 'rgba(255, 0, 0, 1)'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
            console.log(temp)
        }, 1000)
        setTimeout(function (){
            document.getElementById("graph").disabled = false;
        }, 1000);
    }

    function fetchData(url, func) {
        fetch(url)
            .then(response => response.json())
            .then(data => func(data))
    }

    function getUnsplash(data) {
        let url = data.urls.full;
        document.getElementById("imageUrl").setAttribute("src", url);
        setTimeout(function () {
            document.getElementById("image").disabled = false;
        }, 1000)
    }

    function getOneCall(data) {
        if (data.message === 0) {
            city = data.city.name;
            country = data.city.country;
            let lat = data.city.coord.lat;
            let lon = data.city.coord.lon;
            let units;
            if (metric == true) {
                units = "&units=metric";
            } else {
                units = "";
            }
            let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + units + "&exclude=current,hourly,minutely&appid=" + key;
            fetchData(url, getClass);
        } else {
            alert("this country doesn't exist! \n check if you made a mistake");
        }
    }

    function getClass(data) {
        weatherObj = new weather(data)
        weatherObj.city = city;
        weatherObj.country = country;
        weatherObj.temp = getTemp(data, weatherObj);
        weatherObj.tempMin = getTempMin(data, weatherObj);
        weatherObj.tempMax = getTempMax(data, weatherObj);
        weatherObj.icon = getIcon(data, weatherObj);
        weatherObj.date = getDate(data, weatherObj);
        weatherObj.dateNumber = getNumberDate(data, weatherObj);
        printWeek(weatherObj);
    }

    function printWeek(array) {
        const weatherTarget = document.getElementById("weather");
        let header = document.getElementById("city");
        header.innerText = array.city + ", " + array.country;
        weatherTarget.insertBefore(header, weatherTarget.childNodes[0]);
        const weekTarget = document.getElementById("weatherWeek");

        for (let i = 0; i < array.temp.length; i++) {
            let card = document.createElement("div");
            card.classList.add("col-lg-2", "card");

            let image = document.createElement("img");
            image.src = "images/" + array.icon[i] + ".svg";
            image.classList.add("icon", "card-image-top");
            card.append(image);

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            card.append(cardBody);

            let cardHeader = document.createElement("h3");
            cardHeader.classList.add("card-header", "dateText");
            cardHeader.textContent = array.date[i];
            cardBody.append(cardHeader);

            let cardHeaderTwo = document.createElement("h3");
            cardHeaderTwo.classList.add("card-header", "dateNumber");
            cardHeaderTwo.textContent = array.dateNumber[i];
            cardBody.append(cardHeaderTwo);

            let tempAverage = document.createElement("p");
            tempAverage.classList.add("card-text", "averageTemp");
            tempAverage.textContent = "+- " + array.temp[i] + unit;
            cardBody.append(tempAverage);

            let tempMin = document.createElement("p");
            tempMin.classList.add("card-text");
            tempMin.textContent = array.tempMin[i];
            cardBody.append(tempMin);

            let tempMax = document.createElement("p");
            tempMax.classList.add("card-text");
            tempMax.textContent = array.tempMax[i];
            cardBody.append(tempMax);

            weekTarget.appendChild(card);
        }
    }

    function getTemp(data, array) {

        for (let i = 0; i < 5; i++) {
            let day = data.daily[i].temp.day;
            let evening = data.daily[i].temp.eve;
            let night = data.daily[i].temp.night;
            let morning = data.daily[i].temp.morn;
            let sumTemp = day + evening + night + morning;
            let average = Math.floor(sumTemp / 4);
            array.temp.push(average);
        }
        return array.temp;
    }

    function getTempMin(data, array) {
        for (let i = 0; i < 5; i++) {
            let tempMin = data.daily[i].temp.min;
            array.tempMin.push("- " + tempMin + unit);
        }
        return array.tempMin;
    }

    function getTempMax(data, array) {
        for (let i = 0; i < 5; i++) {
            let tempMax = data.daily[i].temp.max;
            array.tempMax.push("+ " + tempMax + unit);
        }
        return array.tempMax;
    }

    function getIcon(data, array) {
        for (let i = 0; i < 5; i++) {
            array.icon.push(data.daily[i].weather[0].icon);
        }
        return array.icon;
    }

    function getDate(data, array) {
        for (let i = 0; i < 5; i++) {
            let timestamp = data.daily[i].dt;
            let date = new Date(timestamp * 1000);
            let day = date.getDay();
            let dayNumber = date.getDate();
            let month = date.getMonth();
            array.date.push(days[day] + " " + dayNumber + " " + monthNames[month]);
        }
        return array.date;
    }

    function getNumberDate(data, array) {
        for (let i = 0; i < 5; i++) {
            let timestamp = data.daily[i].dt;
            let date = new Date(timestamp * 1000);
            let dayNumber = date.getDate();
            let month = date.getMonth();
            array.dateNumber.push(dayNumber + "/" + month);
        }
        return array.dateNumber;
    }

    function checkInput() {
        cityInput = document.getElementById("cityInput").value;
        cityInput = cityInput.replace(/[^a-zA-Z0-9 -]/g, "");
        cityInput = cityInput.replace(/[0-9]/g, "");
        cityInput = cityInput.toLowerCase();
        cityInput = cityInput.replace(" ", "%20");
        if (document.getElementById("countryCode") !== "") {
            countryCode = document.getElementById("countryCode").value;
            countryCode = countryCode.replace(/[^a-zA-Z0-9 -]/g, "");
            countryCode = countryCode.replace(/[0-9]/g, "");
            countryCode = countryCode.toUpperCase();
            countryCode = "," + countryCode;
        } else {
            countryCode = ""
        }
    }

})();
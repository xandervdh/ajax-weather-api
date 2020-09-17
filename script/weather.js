(() => {
    const key = config.API_KEY;
    const unsplashKey = config.UNSPLASH_KEY;
    let unit = " \u00B0C";
    let cityInput;
    let metric = true;
    let city;
    let country;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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
        document.getElementById("city").innerText = "";
        document.getElementById("weatherWeek").innerHTML = "";
        let units;
        if (metric == true) {
            units = "&units=metric";
        } else {
            units = "";
        }
        let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + units + "&appid=" + key;
        let urlPicture = "https://api.unsplash.com/photos/random?query=" + cityInput + "&client_id=" + unsplashKey;
        fetchData(url, getOneCall);
        fetchData(urlPicture, getUnsplash)
    })

    function fetchData(url, func) {
        fetch(url)
            .then(response => response.json())
            .then(data => func(data))
    }

    function getUnsplash(data){
        console.log(data);
        let target = document.getElementById("weather");
        let url = data.urls.full;
        console.log(url);
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
        console.log(data);
        let weatherObj = new weather(data)
        weatherObj.city = city;
        weatherObj.country = country;
        weatherObj.temp = getTemp(data, weatherObj);
        weatherObj.icon = getIcon(data, weatherObj);
        weatherObj.date = getDate(data, weatherObj);
        console.log(weatherObj)
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
            cardHeader.classList.add("card-header");
            cardHeader.textContent = array.date[i];
            cardBody.append(cardHeader);

            let text = document.createElement("p");
            text.classList.add("card-text", "averageTemp");
            text.textContent = array.temp[i];
            cardBody.append(text);

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
            let average = Math.floor(sumTemp/4);
            array.temp.push(average + unit);
        }
        return array.temp;
    }

    function getIcon(data, array) {
        for (let i = 0; i < 5; i++) {
            array.icon.push(data.daily[i].weather[0].icon);
        }
        return array.icon;
    }

    function getDate(data, array) {
        for (let i = 0; i < 5; i++){
            let timestamp = data.daily[i].dt;
            let date = new Date(timestamp * 1000);
            let day = date.getDay();
            let dayNumber = date.getDate();
            let month = date.getMonth();
            array.date.push(days[day] + " " + dayNumber + " " + monthNames[month]);
        }
        return array.date;
    }

    function checkInput() {
        cityInput = document.getElementById("cityinput").value;
        cityInput = cityInput.replace(/[^a-zA-Z0-9 -]/g, "");
        cityInput = cityInput.replace(/[0-9]/g, "");
        cityInput = cityInput.toLowerCase();
        cityInput = cityInput.replace(" ", "%20");
    }

})();
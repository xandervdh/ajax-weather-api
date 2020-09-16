(() => {
    const key = config.API_KEY;
    let cityInput;
    let metric = true;

    document.getElementById("celcius").addEventListener("click", function () {
        metric = true;
        document.getElementById("fahrenheit").disabled = false;
        document.getElementById("celcius").disabled = true;
    })

    document.getElementById("fahrenheit").addEventListener("click", function () {
        metric = false;
        document.getElementById("celcius").disabled = false;
        document.getElementById("fahrenheit").disabled = true;
    })

    document.getElementById("run").addEventListener("click", function () {
        checkInput();
        let units;
        if (metric == true){
            units = "&units=metric";
        }else {
            units = "";
        }
        let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + units + "&appid=";
        fetchData(url, getWeek);
    })

    function fetchData(url, func) {
        fetch(url + key)
            .then(response => response.json())
            .then(data => func(data))
    }

    function getWeek(data) {
        console.log(data);
        let weatherObj = new weather(data)
        weatherObj.temp = getTemp(data, weatherObj);
        console.log(weatherObj.temp);
        printWeek(weatherObj);
    }

    function printWeek(array) {
        const weekTarget = document.getElementById("weatherWeek");
        weekTarget.innerText = array.city;
        for (let i = 0; i < array.temp.length; i++){
            let element = document.createElement("p");
            element.textContent = array.temp[i];
            weekTarget.append(element);
        }
    }

    function getTemp(data, array) {
        for (let i = 0; i < 5; i++) {
            array.temp.push(data.list[i].main.temp);
        }
        return array.temp;
    }

    function checkInput() {
        cityInput = document.getElementById("cityinput").value;
    }

})();
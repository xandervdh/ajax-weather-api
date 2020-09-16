(()=>{

    let cityInput;

    document.getElementById("run").addEventListener("click", function (){
        checkInput();
        let url = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid="
        fetchData(url, getCoords);
    })

    function fetchData(url, func) {
        fetch(url + key)
            .then(response => response.json())
            .then (data => func(data))
    }

    function getCoords(data) {
        console.log(data);
        let lon = data.city.coord.lon;
        let lat = data.city.coord.lat;
        let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=";
        fetchData(url, getWeek);
    }

    function getWeek(data) {
        console.log(data);

    }

    function checkInput() {
        cityInput = document.getElementById("cityinput").value;
    }

})();
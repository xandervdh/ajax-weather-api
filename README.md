# ajax-weather-api
### What?
A weather app where you can see the weather for a city of your choice.

### Why?
This is a [challenge](README.md) for a cource I'm following

### How?

1. download or clone the repository
2. make a new file in the repository called "config.js"
3. make an account on [this](https://openweathermap.org) website and copy your api key
4. make an acount on [this](https://unsplash.com/) website and make a new app to get a key
5. copy this code and replace FIRST_KEY with your key from the first site and SECOND_KEY with the key from the socond site

                const config = {
                    API_KEY: "FIRST_KEY",
                    UNSPLASH_KEY: "SECOND_KEY"
                }
                
5. open the index.html in your browser and there you go

#### Updates

- got a key for the api and made shore it doesn't show in my code
- finished first fetch to get the data that needs to be shown
- struggled a bit with making a class and logging it in the console
- figured out that I need to use another name for the variable then the name of the class
- made a second fetch to get the weather for the next 7 days
- filled my class with everything I need
- figured out how to print to html
- started styling the page
- looked at the api to get the picture
- I am able to get the picture from the api
- finished styling, still have to see where I'm going to put the picture

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather_container");
const grantAccessContainer = document.querySelector(".grantLocation-container");
const searchFrom = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-infoContainer")



let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-Tab");
getFromSessionStorage();

function switchTab(clickedtab){
    if(clickedtab !=  currentTab){
     currentTab.classList.remove("current-Tab")
     currentTab = clickedtab;
     currentTab.classList.add("current-Tab")
    }

    if(!searchFrom.classList.contains('active')){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchFrom.classList.add("active");
    }
    else{
        searchFrom.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromSessionStorage();
    }
}

userTab.addEventListener('click', ()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-Coordinates');
    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(localCoordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
     grantAccessContainer.classList.remove("active");
     loadingScreen.classList.add('active');

     try{
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();

        loadingScreen.classList.remove('active');

        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
     }
     catch(err){
       loadingScreen.classList.remove('active')
       console.log("Failed");
     }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const wind = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]")

    cityName.innerText = weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`
    wind.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloud.innerText = weatherInfo?.clouds?.all;
}

 const grantAccessButton = document.querySelector("[data-grantAccess]");

function getLocation(){
    if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
         alert('Failed');
    }
}

function showPosition(position){
    const userCoordonates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-Coordinates", JSON.stringify(userCoordonates));
    fetchUserWeatherInfo(userCoordonates);
}
grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchFrom.addEventListener('submit', (e)=>{
     e.preventDefault();

     let cityName = searchInput.value;

     if(cityName === "")
     return;
    else
    fetchUserWeatherInfo(cityName);
});

async function fetchUserWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try{
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        alert("failed2")
    }
}
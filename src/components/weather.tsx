import { useEffect, useState } from "react";
import { BsFillSunFill, BsCloudDrizzleFill, BsFillCloudRainHeavyFill, BsSnow, BsFillCloudsFill } from 'react-icons/bs';
import { IoIosThunderstorm } from 'react-icons/io';
import './weather.css'

// definições de tipagem
type Main = {
    main: {}
    weather: []
}
type WeatherData = {
    temp: number;
    temp_max: number;
    temp_min: number;
}
type WeatherSky = {
    main: string;
    description: string;
}

export const Weather = () => {
    // variaveis para serem alteradas por funções assincronas
    const [tempWeather, setTempWeather] = useState<WeatherData>({} as WeatherData)
    const [loading, setLoading] = useState(true);
    const [weatherSky, setWeatherSky] = useState<WeatherSky>({} as WeatherSky)

    const APIkey: string = 'c87eb1ffe60cd42665bccd9a96110e57';
    const weatherAPIUrl = (latitude: number, longitude: number) => `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pt_br&appid=${APIkey}`;

    const weather = async (lat: number, long: number) => {

        const response = await fetch(weatherAPIUrl(lat, long));
        const data = await response.json() as Main;
        const dataMain = data.main as WeatherData;

        data.weather.forEach((data: Pick<WeatherSky, "main" | "description">) => {
            setWeatherSky({
                main: data.main,
                description: data.description
            })
        })
        // console.log(weatherSky)

        setTempWeather({
            temp: dataMain.temp,
            temp_max: dataMain.temp_max,
            temp_min: dataMain.temp_min
        })
        // console.log(data)
    }

    const getCurrentLocal = async () => {
        navigator.geolocation.getCurrentPosition(pos => {
            weather(pos.coords.latitude, pos.coords.longitude)
            // console.log(pos.coords)
            setLoading(false)
        })
    }

    useEffect(() => {
        getCurrentLocal()
    }, [loading])

    let temperatura = Math.round(tempWeather.temp - 273.15);
    let iconWeather;

    const groupWeatherConditions = {
        Clear: <BsFillSunFill/>,
        Thunderstorm: <IoIosThunderstorm/>,
        Drizzle: <BsCloudDrizzleFill/>,
        Rain: <BsFillCloudRainHeavyFill/>,
        Snow: <BsSnow/>,
        Clouds: <BsFillCloudsFill/>
    }

    // console.log(weatherSky.main)
    iconWeather = (groupWeatherConditions as any)[weatherSky.main];

    if (loading) {
        return <h1>Carregando...</h1>
    } else {
        if (typeof temperatura === "number") {
            return (
                <div>
                    <div className="weather-box">
                        <div className="icon-weather"> {iconWeather} </div>
                        <h1 className="weather"> {temperatura} </h1>
                        <span>ºC</span>
                    </div>
                    <div> {weatherSky.description} </div>
                </div>
            )
        } else {
            return <h1>Carregando...</h1>
        }
    }

    //retorno do elemento
}
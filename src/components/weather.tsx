import { useContext, useEffect, useState } from "react";

// definições de tipagem
type Main = {
    main: {}
}
type WeatherData = {
    temp: number;
    temp_max: number;
    temp_min: number;
}
type Pos = {
    lat: number;
    long: number;
}


export const Weather = () => {
    // variaveis para serem alteradas por funções assincronas
    const [tempWeather, setTempWeather] = useState<WeatherData>({} as WeatherData)
    const [position, setPosition] = useState<Pos>({} as Pos);
    
    navigator.geolocation.getCurrentPosition(position => {
        setPosition({
            lat: position.coords.latitude,
            long: position.coords.longitude
        })
    })
    // useEffect para lidar com efeitos nocivos ao código
    useEffect(() => {
        const weather = async () => {
            
            const APIkey: string = 'c87eb1ffe60cd42665bccd9a96110e57';
            let lat: number = position.lat;
            let lon: number = position.long;

            const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
            
            const response = await fetch(weatherAPIUrl);
            const data = await response.json() as Main;
            const dataMain  = data.main as WeatherData;
            
            setTempWeather({
                temp: dataMain.temp,
                temp_max: dataMain.temp_max,
                temp_min: dataMain.temp_min
            })
            console.log(data)
        }

        weather()

    }, [])
    //retorno do elemento
    return (
        <div>
            <h1>Temperatura: { Math.floor(tempWeather.temp -273.15) } </h1>
            <h3>Max: { Math.floor(tempWeather.temp_max -273.15) } </h3>
            <h3>Min: { Math.floor(tempWeather.temp_min -273.15) } </h3>
        </div>
    )
}
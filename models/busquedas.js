
const fs = require('fs');

require('dotenv').config()
const axios = require('axios');


class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerBD();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'proximity': 'ip',
            'access_token': process.env.MAPBOX_KEY,
        };
    }

    async buscarCiudad( ciudad = '' ) { 
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();

            return resp.data.features.map( lugar =>  ({ // ({}) retornar un objeto
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            // throw new Error(); // reventar la aplicacion
            console.log(error);
            return [];
        }
    }

    async buscarClimaCiudad( lat, lng) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'lat': lat,
                    'lon': lng,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    // 'lang': 'es',
                }
            });
            const resp = await instance.get();
            const info = resp.data;

            return ({
                desc: info.weather[0].description,
                temp: info.main.temp, 
                min: info.main.temp_min,
                max: info.main.temp_max,
                humedad: info.main.humidity,
                velocidadViento: info.wind.speed
            });
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    agregarHistorial( lugar = '' ) {
        if (this.historial.includes( lugar.toLocaleLowerCase())) { return; }
        this.historial = this.historial.splice(0,3); // para que se muestre solo los 4 primeros
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarBD();
    }

    guardarBD() {
        const payload = {
            historial: this.historial,
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerBD() {
        if ( !fs.existsSync(this.dbPath) ) return null;

        const dataBase = fs.readFileSync(this.dbPath, {encoding: 'utf8'});
        const dataParse = JSON.parse(dataBase);
        this.historial = dataParse.historial;
    }

}

module.exports = Busquedas;
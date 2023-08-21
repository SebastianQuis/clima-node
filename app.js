const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {

    const busquedas = new Busquedas();
    let opcion;

    do {
        
        opcion = await inquirerMenu();

        switch (opcion) {
            case 1:
                // todo: mensaje
                const input = await leerInput('Ingrese la ciudad a buscar o * para regresar');
                if (input === '*' ) {
                    continue;
                }

                // todo: buscar lugares
                const lugaresArray = await busquedas.buscarCiudad(input);
                
                // todo: seleccionar lugar, id.
                const idLugar = await listarLugares(lugaresArray);
                const lugarSeleccionado = lugaresArray.find( lugar => lugar.id === idLugar)
                if (lugarSeleccionado === undefined) continue;

                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                
                // todo: clima
                const climaLugar = await busquedas.buscarClimaCiudad(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // todo: mostrar resultados
                console.clear();
                console.log(`\nInformación de la ciudad`.blue);
                console.log('Ciudad     :', lugarSeleccionado.nombre);
                console.log('Descripción:', climaLugar.desc);
                console.log('Temperatura:', climaLugar.temp);
                console.log('Mínima     :', climaLugar.min);
                console.log('Máxima     :', climaLugar.max);
                console.log('Viento     :', climaLugar.velocidadViento);
                console.log('Lat        :', lugarSeleccionado.lat);
                console.log('Lng        :', lugarSeleccionado.lng);
            break;

            case 2:    
                // todo: ver historial
                if (busquedas.historial.length == 0) {
                    console.log('No hay historial registrado');
                }

                busquedas.historialCapitalizado.forEach( (lugar, index) => {
                    let i = `${index + 1}.`.blue;
                    console.log(`${i} ${lugar}`);
                });
            break;
        }

        await pausa();

    } while ( opcion !== 0 );

}

main();
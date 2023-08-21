require('colors');
const inquirer = require('inquirer');

const menuOpciones = [{
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [
        { value: 1, name: `${'1.'.blue} Buscar ciudad` },
        { value: 2, name: `${'2.'.blue} Ver historial` },
        { value: 0, name: `${'0.'.blue} Salir` },
    ],
}];

const inquirerMenu = async() => {
    console.clear();
    console.log('**********************************'.grey);
    console.log('         Clima servidor            '.blue);
    console.log('**********************************\n'.grey);

    const { opcion } = await inquirer.prompt(menuOpciones);
    return opcion; // retorna solo el value '1'
};

const pausa = async() => {
    const pregunta = [{
        type: 'input',
        name: 'pausa',
        message: `Presione ${'ENTER'.blue} para continuar:`,
    }]
    
    await inquirer.prompt(pregunta);
}

const leerInput = async ( message ) => { // presionar enter
    const pregunta = [{
        type: 'input',
        name: 'desc', // lo que el usuario escribe
        message,
        validate( value ) {
            if ( value.length === 0 ) {
                return 'Debe ingresar un valor valido';    
            }
            return true;
        }
    }];

    const { desc } = await inquirer.prompt(pregunta);
    return desc;
}

const buscarCiudad = async ( ciudad ) => {
    //TODO: api clima
}

const listarLugares = async ( lugares = [] ) => {
    const choices = lugares.map(( lugar, i ) => {
        let position = i + 1 ;
        return { 
            value: `${lugar.id}`, 
            name: `${(position + '.').blue } ${lugar.nombre}`
        };
    });

    choices.push({ // unshift
        value: '*',
        name: '*.'.grey + ' Cancelar',
    });
    
    const pregunta = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione el lugar:',
        choices
    }];

    const { id } = await inquirer.prompt(pregunta);
    return id;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    buscarCiudad,
    listarLugares
};


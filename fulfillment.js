'use strict';
const axios = require('axios');
const querystring = require('querystring');

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    
    var api_key = "XXXXXXXXXXXXXXXX
    var host = 'https://api.themoviedb.org';
    var language = "es-MX";
    var sort_by = "popularity.desc";
    var maxMovies = 10;
  

    /* ##################################################################################################### */
    /* ##################################################################################################### */
    /* ##################################################################################################### */


    const jsonGeneros = { "genres": [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }] };

    function getRandomWords(frases){
        try {
            console.log("Info: index.js | getRandomWords: fue ejecutado!");
            if (frases){
                return frases[Math.floor(Math.random() * frases.length)];
            }
        } catch (error) {
            console.log(`Error (getRandomWords): ${error}`);
        }
    }

    function getNameGenero(id) {
        try {
            console.log("Info: index.js | getNameGenero: fue ejecutado!");
            var nameGen = "";
            for (let index = 0; index < jsonGeneros.genres.length; index++) {
                if (jsonGeneros.genres[index].id == id) {
                    nameGen = jsonGeneros.genres[index].name;
                }
            }
            return nameGen;
        } catch (error) {
            console.log(`Error (getNameGenero): ${error}`);
        }
    }

    function getStringFecha(dateStr){
        try {
            console.log("Info: index.js | getStringFecha: fue ejecutado!");
            const meses = [
                "Enero", "Febrero", "Marzo",
                "Abril", "Mayo", "Junio", "Julio",
                "Agosto", "Septiembre", "Octubre",
                "Noviembre", "Diciembre"
            ];

            const date = new Date(dateStr);
            const dia = date.getDate();
            const mes = date.getMonth();
            const ano = date.getFullYear();

            return `${dia} de ${meses[mes]} del ${ano}`;
        } catch (error) {
            console.log(`Error (getStringFecha): ${error}`);
        }
    }


    function validParam(param){
        if ( typeof(param) !== "undefined" && param !== null && param !== '') {
            return false;
        }else{
            return true;
        }
    }

    function getRecomendationType(agent){
        try {
            console.log("Info: index.js | getRecomendationType: fue ejecutado!");
            var pelicula = agent.parameters.peliculas;
            var genero = agent.parameters.genero;
            var detalle = agent.parameters.detalle;
            var pelicula_peliculas = agent.parameters.pelicula_peliculas;
            
            console.log(agent.parameters);
            if (!validParam(agent.parameters.peliculas) && !validParam(agent.parameters.detalle)){
                return 5;
            }else{
                if (pelicula_peliculas == "Peliculas"){
                    if (genero == "Todos"){
                        return 1; //Recomienda varias peliculas de cualquier genero
                    }else if (genero !== '' && genero.length >= 1) {
                        return 2; //Recomienda varias peliculas de uno o mas generos
                    }
                }else{
                    if (genero == "Todos"){
                        return 3; //Recomienda una pelicula de cualquier genero
                    }else if (genero !== '' && genero.length >= 1) {
                        return 4; //Recomienda una pelicula de uno o mas generos
                    }
                }
            }
        } catch (error) {
            console.log(`Error (getRecomendationType): ${error}`);
        }
    }


    function getIdGenre(gen) {
        try {
            console.log("Info: index.js | getIdGenre: fue ejecutado!");
            var idGen = "";
            if (gen.length >= 1){
                for (let i = 0; i < gen.length; i++) {
                    for (let j = 0; j < jsonGeneros.genres.length; j++) {
                        if (jsonGeneros.genres[j].name == gen[i]) {
                            if (gen.length == 1){
                                idGen = jsonGeneros.genres[j].id;
                            }else{
                                idGen += jsonGeneros.genres[j].id + ",";
                            }
                            break;
                        }
                    }
                }
            }
            return idGen;
        } catch (error) {
            console.log(`Error (getIdGenre): ${error}`);
        }
    }






    function textRecommendMovies(data, type){
        try {
            console.log("Info: index.js | textRecommendMovies: fue ejecutado!");
            let output = {};

            if (data !== '') {

                if (type == 1 || type == 2){
                    if (data.total_results < maxMovies) {
                        maxMovies = data.total_results;
                    }
                    var text = getRandomWords(['Aqui hay ','Estas son ', 'Estas ', 'Top ', 'Te recomiendo estas ']);
                    var text1 = getRandomWords([' películas, con mayor votación segun mis registros: ',' películas exitosas: ', ' películas con muy buena crítica: ', ' películas que tienes q ver antes de morir:  ']);
                    output.text = text + maxMovies + text1;
                    //console.log(data);
                    for (let i = 0; i < maxMovies; i++) {
                        if (data.results[i].original_language == 'en' || data.results[i].original_language == 'sp') {
                            output.text += "\"" + data.results[i].title + "\"";
                            output.text += ".\n";
                        }
                    }
                } else if (type == 3 || type == 4) {

                    if (data.total_results >= 1){
                        var text = getRandomWords(['. Es una muy buena pelicula.','. Amo esa película.', '. La recomiendo a circuitos cerrados.', '. Es buenisima, la he visto mil veces.']);
                        output.text = 'Te recomiendo ver ' + data.results[0].title + text;
                    }else{
                        var text = getRandomWords(['No pude encontrar películas en ese genero.','Dificil, no logre encontrar en ese genero ninguna película.','No tuve exito.']);
                        output.text = text + ' Que tal si intentamos con otro?';
                        //AGREGAR CONTEXTO DE SALIDA Y NUEVO INTENT Q RECIBA ESE CONTEXTO Y UN NUEVO GENERO
                    }
                }
            }
            return output;

        } catch (error) {
            console.log(`Error (textRecommendMovies): ${error}`);
        }
    }


    function textMovieDetail(data){
        try {
            console.log("Info: index.js | getMovieDetails: fue ejecutado!");
            var detail = agent.parameters.detalle;
            var output = {};
            if (data){
                if (data.total_results >= 1){

                    switch (detail) {
                        case 'Año':
                            var fechaStr = getStringFecha(data.results[0].release_date);
                            output.text = data.results[0].title + ', se estrenó exactamente el ' + fechaStr;
                            break;
                        case 'Detalle':
                            if (data.results[0].overview !== ''){
                                var text = getRandomWords(['Te descríbo un resumen: ','Trata de lo siguiente: ', 'La película es así: ', 'Dice: '])
                                output.text = text + data.results[0].overview;
                            }else{
                                output.text = "No logré encontrar un resumen de esa película, pero se que se estrenó el " + data.results[0].release_date;
                            }
                            break;
                        case 'Genero':
                            var gen = '';       
                            for (let index = 0; index < data.results.genre_ids.length; index++) {
                                gen += getNameGenero(data.results.genre_ids[index]);
                                gen += ",\n";
                            }
                            output.text = data.results[0].title + getRandomWords([', esta categorizada como película de: ', '. genero: ']) + gen;
                            break;
                        default:
                            break;
                    }
                    return output;
                }else{
                    output.text = "Lo siento, no logré encontrar en mis registros la película " + pelicula + ". Que tal si probamos con otra?";
                    output.context = {
                        name: 'otra-pelicula',
                        lifespan: 1,
                        parameters:{tipo_detalle: detail}
                    };
                }
            }else{
                output.text = "Lo siento, no logré encontrar en mis registros la película " + pelicula + ". Que tal si probamos con otra?";
                output.context = {
                    name: 'otra-pelicula',
                    lifespan: 1,
                    parameters:{tipo_detalle: detail}
                };
            }
            return output;
        } catch (error) {
            console.log(`Error (getMovieDetails): ${error}`);
        }
    }



    function performRequest(url, type){
        try {
            console.log("Info: index.js | performRequest: fue ejecutado!");
            var detail = agent.parameters.detalle;

            return axios.get(url).then((result) => {
                //console.log(result.data);
                var jsonBody = result.data;
                var out;
                if (type < 5){
                    out = textRecommendMovies(jsonBody, type);
                }else{
                    out = textMovieDetail(jsonBody, detail, type);
                    agent.setContext(out.context);
                }
                agent.add(out.text);
            }).catch(function (error) {
                console.log(error);
            });
        } catch (error) {
            console.log(`Error (performRequest): ${error}`);
        }
    }


    function assembleRequest(type,data) {
        try {
            console.log("Info: index.js | assembleRequest: fue ejecutado!");
            // Setting URL and headers for request
            var url = "";
            var genre = agent.parameters.genero;
            var movie = agent.parameters.pelicula;

            var endpoint = "";
            data.api_key = api_key;
            data.language = language;
            data.sort_by = sort_by;

            if (type == 2 || type == 4){
                var gen = getIdGenre(genre);
                if (gen != ""){
                    data.with_genres = gen
                }
                endpoint = "/3/discover/movie";
            }else if(type == 5){
                data.query = movie;
                endpoint = "/3/search/movie";
            }
            return url = host + endpoint + "?" + querystring.stringify(data);

        } catch (error) {
            console.log(`Error (assembleRequest): ${error}`);
        }
    }
  
  
  
  
      function recomendarPeliculas(agent) {

        var tipo = getRecomendationType(agent);
        console.log(tipo);
        var requestObj = assembleRequest(tipo,{});
        console.log(requestObj);
        return performRequest(requestObj,tipo);
    }


    function detallePelicula(agent) {
        var tipo = getRecomendationType(agent);
        var requestObj = assembleRequest(tipo,{});
        return performRequest(requestObj,tipo);
    }
  
  

  
  
  /* ##################################################################################################### */
  /* ##################################################################################################### */
  /* ##################################################################################################### */
  

    

    let intentMap = new Map();
  
    intentMap.set('Recomendar peliculas', recomendarPeliculas);
    intentMap.set('detalle-pelicula', detallePelicula);
    intentMap.set('Otra pelicula', detallePelicula);
  
    agent.handleRequest(intentMap);
});

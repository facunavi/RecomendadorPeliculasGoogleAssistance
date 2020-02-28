// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const api_key = "c67cdda8a3b3d972816af03a7a23c4c9";
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
//const unirest = require("unirest");
const reqr = require('sync-request');
const MovieDB = require('moviedb')(api_key);
const https = require('https');
const querystring = require('querystring');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    const tmdbKey = 'api_key=c67cdda8a3b3d972816af03a7a23c4c9&language=es-MX';
    const url = 'https://api.themoviedb.org/3/';
    
    const tmdbHost = 'api.themoviedb.org';
    const api_key = "c67cdda8a3b3d972816af03a7a23c4c9";
    const language = "es-MX";
    //http://api.themoviedb.org/3/search/movie?api_key=APIKEY&query=MOVIENAME


    let jsonGeneros = { "genres": [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }] };
    //console.log(student); 

    function GetIdGenero(gen) {
        var idGen = "";
        for (let index = 0; index < jsonGeneros.genres.length; index++) {
            if (jsonGeneros.genres[index].name == gen) {
                idGen = jsonGeneros.genres[index].id;
            }
        }
        return idGen;
    }
    function GetNameGenero(id) {
        var nameGen = "";
        for (let index = 0; index < jsonGeneros.genres.length; index++) {
            if (jsonGeneros.genres[index].id == id) {
                nameGen = jsonGeneros.genres[index].name;
            }
        }
        return nameGen;
    }
    function GetRandomWords(frases){
        if (frases){
            return frases[Math.floor(Math.random() * frases.length)];
        }
    }

    function GetStringFecha(dateStr){
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
    }

    





    /*
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    */


    function recomendarPeliculas(agent) {
        const pelicula_peliculas = agent.parameters.pelicula_peliculas;
        const genero = agent.parameters.genero;

        if (pelicula_peliculas == 'Películas') {
            if (genero == "Todos"){

                var sort_by = "vote_count.desc";
                //var with_genres = "28";
    
                performRequest(tmdbHost,"/3/discover/movie", "GET", 
                {
                    language: language,
                    with_genres: with_genres,
                    api_key: api_key
                }, function(data) {
                    console.log('DATA:', data.results);
                    if (data !== '') {
                        let result = data.results;
                        var max = 10;
                        if (result.length < max) {
                            max = result.length;
                        }
                        var text = GetRandomWords(['Aqui hay ','Estas son ', 'Estas ', 'Top ', 'Te recomiendo estas ']);
                        var text1 = GetRandomWords([' películas, con mayor votación segun mis registros: ',' películas exitosas: ', ' películas con muy buena crítica: ', ' películas que tienes q ver antes de morir:  ']);
    
                        let output = text + max + text1;
                        for (let i = 0; i < max; i++) {
                            if (result[i].original_language == 'en' || result[i].original_language == 'sp') {
                                output += result[i].title;
                                output += ".\n";
                            }
                        }
                        agent.add(output);
                    }
                });

                
            }
            else if (genero !== '') {
                var idGenero = "";
                if (genero.length > 1){
                    for (let index = 0; index < genero.length; index++) {
                        idGenero += GetIdGenero(genero[index])+",";
                    }
                }else{
                    idGenero = GetIdGenero(genero);
                }
                
                var res = searchMovies('discover/movie?' + tmdbKey + '&sort_by=vote_count.desc&with_genres=' + idGenero);

                let result = res.results;

                var max = 10;
                if (result.length < max) {
                    max = result.length;
                }
                var text = GetRandomWords(['Aqui hay ','Estas son ', 'Estas ', 'Top ']);
                var text1 = GetRandomWords([' películas, con mayor votación segun mis registros: ',' películas exitosas: ', ' películas con muy buena crítica: ', ' películas que tienes q ver antes de morir:  ']);
                let output = text + max + text1;
                for (let i = 0; i < max; i++) {
                    if (result[i].original_language == 'en' || result[i].original_language == 'sp') {
                        output += result[i].title;
                        output += ".\n"
                    }
                }

                agent.add(output);
            } 
        } else {

            var idGenero = "";
            if (genero.length > 1){
                for (let index = 0; index < genero.length; index++) {
                    idGenero += GetIdGenero(genero[index])+",";
                }
            }else{
                idGenero = GetIdGenero(genero);
            }


            var jsonResp = performRequest(tmdbHost,"/3/movie/top_rated", "GET", 
                {
                    api_key: api_key,
                    language: language,
                    with_genres: idGenero,
                    page: "1",
                    sort_by: "vote_count.desc"
                }, function(data) {
                    console.log("Marca 0");
                    
                });

            if (jsonResp !== '') {
                console.log("Marca 1");
                let result = jsonResp.results;
                console.log("Marca 2");
                if (result.length >= 1){
                    console.log("Marca 3");
                    var text = GetRandomWords(['. Es una muy buena pelicula.','. Amo esa película.', '. La recomiendo a circuitos cerrados.', '. Es buenisima, la he visto mil veces.'])
                    let output = 'Te recomiendo ver ' + result[0].title + text;
                    console.log("Marca 4");
                    agent.add(output);
                    console.log("Marca 5");
                }else{
                    console.log("Marca 6");
                    var text = GetRandomWords(['No pude encontrar películas en ese genero.','Dificil, no logre encontrar en ese genero ninguna película.','No tuve exito.']);
                    agent.add(text + ' Que tal si intentamos con otro?');
                    console.log("Marca 7");
                    //AGREGAR CONTEXTO DE SALIDA Y NUEVO INTENT Q RECIBA ESE CONTEXTO Y UN NUEVO GENERO
                }
            }
        }

    }


    function detallePelicula(agent) {
        const pelicula = agent.parameters.peliculas;
        const detalle = agent.parameters.tipo_detalle;

        if (pelicula !== "" && detalle !== "") {
            var res = searchMovies('search/movie?' + tmdbKey + '&query=' + pelicula);
            //console.log(res);
            
            if (res){
                let result = res.results;
                if (result.length >= 1){
                    
                    let output = '';

                    switch (detalle) {
                        case 'Año':
                            var fechaStr = GetStringFecha(result[0].release_date);
                            output = result[0].title + ', se estrenó exactamente el ' + fechaStr;
                            break;
                        case 'Detalle':
                            if (result[0].overview !== ''){
                                var text = GetRandomWords(['Te descríbo un resumen: ','Trata de lo siguiente: ', 'La película es así: ', 'Dice: '])
                                output = text + result[0].overview;
                            }else{
                                output = "No logré encontrar un resumen de esa película, pero se que se estrenó el " + result[0].release_date;
                            }
                            break;
                        case 'Genero':
                            var gen = '';
                            for (let index = 0; index < result.genre_ids.length; index++) {
                                gen += GetNameGenero(result.genre_ids[index]);
                                gen += ",\n";
                            }
                            output = result[0].title + GetRandomWords([', esta categorizada como película de: ', '. genero: ']) + gen;
                            break;
                        default:
                            break;
                    }
                    agent.add(output);
                }else{
                agent.add('Lo siento, no logré encontrar en mis registros la película ' + pelicula + ". Que tal si probamos con otra?");
                agent.setContext({
                    name: 'otra-pelicula',
                    lifespan: 1,
                    parameters:{tipo_detalle: detalle}
                  });
                }
            }else{
                agent.add('Lo siento, no logré encontrar en mis registros la película ' + pelicula + ". Que tal si probamos con otra?");
                agent.setContext({
                    name: 'otra-pelicula',
                    lifespan: 1,
                    parameters:{tipo_detalle: detalle}
                  });

            }

        }
    }




    function performRequest(host, endpoint, method, data, success) {
        try{
            var responseObject;
            var dataString = JSON.stringify(data);
            var headers = {};
            
            if (method == 'GET') {
                endpoint += '?' + querystring.stringify(data);
            }
            else {
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': dataString.length
                };
            }
            var options = {
                host: host,
                path: endpoint,
                method: method,
                headers: headers
            };
        
            var req = https.request(options, function(res) {
                res.setEncoding('utf-8');
            
                var responseString = '';
            
                res.on('data', function(data) {
                    responseString += data;
                });
            
                res.on('end', function() {
                    //console.log(responseString);
                    responseObject = JSON.parse(responseString);
                    //success(responseObject);
                });
            });
        
            req.write(dataString);
            req.end();

            return responseObject;
        } catch (err) {
            console.log("Error: " + err.message);
        }
    }




    function searchMovies(qry) {
        try{
            var api_key = "c67cdda8a3b3d972816af03a7a23c4c9";
            var language = "es-MX";
            var sort_by = "vote_count.desc";
            var with_genres = "28";

            performRequest(tmdbHost,"/3/discover/movie", "GET", 
            {
                language: language,
                with_genres: with_genres,
                api_key: api_key,
                sort_by: sort_by
            }, function(data) {
                console.log('DATA:', data.results);
            });

        /*
            //console.log(url + qry);
            var res = reqr('GET', url + qry, {
                json: {},
            });
            var resJson = JSON.parse(res.getBody('utf8'));
            var output = '';
            console.log(resJson);
            if (resJson.results.length > 0) {
                //console.log(resJson.results)
                return resJson;
            } else {
                console.log("sin resultados");
            }
            */

        } catch (err) {
            console.log(err.message);
        }
    }


    let intentMap = new Map();
    //intentMap.set('Default Welcome Intent', welcome);
    //intentMap.set('Default Fallback Intent', fallback);
  
    intentMap.set('Recomendar peliculas', recomendarPeliculas);
    intentMap.set('detalle-pelicula', detallePelicula);
    intentMap.set('Otra pelicula', detallePelicula);
  
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});

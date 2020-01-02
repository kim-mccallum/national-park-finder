'use strict';

// NPS apiKey from https://www.nps.gov/subjects/developer/get-started.htm
const apiKey = 'dk3vuQY3nthQ9D3xHVBp6bqDdIdjeKx8YvU1Vfoz'

const searchURL = 'https://developer.nps.gov/api/v1/parks';

function displayResults(query, responseJson){
   
    //clear out for new HTML
    $('.error-message').empty();
    $('#results-list').empty();
    $('.state-results-header').empty();
    //Render states searched
    console.log(`Searching results for: ${query}`);
    $('.state-results-header').append(`Search results for: ${query}`);
    //get data array
    const resultArr = responseJson.data;
    for (let i=0; i<resultArr.length; i++){
        console.log(`name: ${responseJson.data[i].fullName}`)
        $('#results-list').append(
            `<li><h3><a href="${resultArr[i].url}" target="blank">${responseJson.data[i].fullName}</a></h3>
            <p>${resultArr[i].description}</p>
            </li>`
          )};
    //display the results section  
    $('#results').removeClass('hidden');
}

function formatQueryParams(params) {
    console.log("formatQueryParms ran");
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)

    // console.log(`Here are the query items joined: ${queryItems.join('&')}`)
    return queryItems.join('&');
}

//define params, query, search and fetch!
function getNationalParks(query, maxResults=10){
    // console.log(`Searching for these states: ${query}`);
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit:maxResults,
      };

      const queryString = formatQueryParams(params)
      const url = searchURL + '?' + queryString;
    
      console.log(url);
    
      fetch(url)
        .then(response => {
            if (response.ok) {
            return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson)
            console.log(responseJson.data.length)
            displayResults(query, responseJson)
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

//Get form values and run getNationalParks with values
function watchForm(){
    console.log("watchForm ran");
    $('form').submit(event=> {
        event.preventDefault();
        const searchStates = $('#js-search-states').val();
        const maxResults = $('#js-max-results').val();
        // console.log(`Search for: ${searchStates}, return a max of ${maxResults}`)
        getNationalParks(searchStates, maxResults)
    })
}

$(watchForm);
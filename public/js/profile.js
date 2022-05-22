
to_add = ""

function finishprocessPokeResp(data) {
    hp = data.stats.filter(function (obj) {
        return obj.stat.name == "hp"
    }).map((obj2) =>{
        return obj2.base_stat
    })

    attack = data.stats.filter(function (obj) {
        return obj.stat.name == "attack"
    }).map((obj2) =>{
        return obj2.base_stat
    })

    defense = data.stats.filter(function (obj) {
        return obj.stat.name == "defense"
    }).map((obj2) =>{
        return obj2.base_stat
    })

    specialAttack = data.stats.filter(function (obj) {
        return obj.stat.name == "special-attack"
    }).map((obj2) =>{
        return obj2.base_stat
    })

    specialDefense = data.stats.filter(function (obj) {
        return obj.stat.name == "special-defense"
    }).map((obj2) =>{
        return obj2.base_stat
    })

    speed = data.stats.filter(function (obj) {
        return obj.stat.name == "speed"
    }).map((obj2) =>{
        return obj2.base_stat
    })

    to_add +=`<div id="stats">
    <h4>Stats</h4>
    <div id="progressbars">
    <label for="hp">HP:</label>
    <progress id="hp" value="${hp}" max="255">${hp}/255</progress>
    ${hp}/255
    </div>
    <div id="progressbars">
    <label for="attack">Attack:</label>
    <progress id="attack" value="${attack}" max="255">${attack}/255</progress>
    ${attack}/255
    </div>
    <div id="progressbars">
    <label for="defense">Defense:</label>
    <progress id="defense" value="${defense}" max="255">${defense}/255</progress>
    ${defense}/255
    </div>
    <div id="progressbars">
    <label for="specialAttack">Special Attack:</label>
    <progress id="specialAttack" value="${specialAttack}" max="255">${specialAttack}/255</progress>
    ${specialAttack}/255
    </div>
    <div id="progressbars">
    <label for="specialDefense">Special Defense:</label>
    <progress id="specialDefense" value="${specialDefense}" max="255">${specialDefense}/255</progress>
    ${specialDefense}/255
    </div>
    <div id="progressbars">
    <label for="speed">Speed:</label>
    <progress id="speed" value="${speed}" max="255">${speed}/255</progress>
    ${speed}/255
    </div>
    </div>
    </div>`
}

function createHeading(data) {
    to_add += `<h3>#${id} ${data.name}</h3>`
}

function processPokeResp(data) {
    for (j = 0; j < data.genera.length; j++) {
        if (data.genera[j].language.name == "en") {
            to_add += `<p>${data.genera[j].genus}</p>`
        }
    }
    for (k = 0; k < data.flavor_text_entries.length; k++) {
        if (data.flavor_text_entries[k].language.name == "en" && data.flavor_text_entries[k].version.name == "shield") { // For gen 8 pokemon
            to_add += `<div class="flavour_text">
            <p>${data.flavor_text_entries[k].flavor_text}</p>
            </div>`
            break
        }
        else if (data.flavor_text_entries[k].language.name == "en" && data.flavor_text_entries[k].version.name == "alpha-sapphire") { // For other generations
            to_add += `<div class="flavour_text">
            <p>${data.flavor_text_entries[k].flavor_text}</p>
            </div>`
            break
        }
        else if (data.flavor_text_entries[k].language.name == "en" && data.flavor_text_entries[k].version.name == "ultra-moon") { // For gen 7 pokemon that didn't appear in gen 8
            to_add += `<div class="flavour_text">
            <p>${data.flavor_text_entries[k].flavor_text}</p>
            </div>`
            break
        }
    }
}

async function loadPokemonInformation() {
    id = $("#pokeid").text();
    idNum = parseInt(id);

    await $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${id}`,
        success: createHeading
    })

    await $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon-species/${id}`,
        success: processPokeResp
    })

    await $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${id}`,
        success: finishprocessPokeResp
    })
    $("#information").html(to_add)
    poke_name = $("h3").text();
    addData(poke_name);
}

function addData(name) {
    date = new Date()
    time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    $.ajax({
        url: "/timeline/insert",
        type: "put",
        data: {
            eventDescription: `User has clicked on ${name}'s profile.`,
            hits: 1,
            time: `At ${time}.`
        },
        success: ()=> console.log("Event added successfully.")
    })
}

function setup() {
    loadPokemonInformation();
}

$(document).ready(setup)
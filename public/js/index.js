to_add = ''
css_add = ''
pokemon_array = []

function verified(data) {
    console.log(data);
    if (data == true) {
        $.ajax({
            type: "get",
            url: "/checkUserType",
            success: (data) => {
                console.log(data.type)
                if (data == "admin") {
                    $("#profile").show()
                    $("#login").hide()
                    $("#game").show()
                    $("#signOut").show()
                    $("#admin").show()
                } else {
                    $("#profile").show()
                    $("#login").hide()
                    $("#game").show()
                    $("#signOut").show()
                    $("#admin").hide()
                }
            }
        })
    } else {
        $("#profile").hide()
        $("#login").show()
        $("#game").show()
        $("#signOut").hide()
        $("#admin").hide()
    }
}

function checkLogin() {
    $.ajax({
        type: "get",
        url: "/checkAuthentication",
        success: verified
    })
}

function registerClick(name) {
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
        success: () => console.log("Event added successfully.")
    })
}

function colourChooser(data) {
    type = []
    firstColour = ""
    secondColour = ""
    for (l = 0; l < data.types.length; l++) {
        type[l] = data.types[l].type.name
    }

    for (k = 0; k < type.length; k++) {
        if (type[k] == "normal") {
            if (k == 0) {
                firstColour = "wheat"
            }
            if (k == 1) {
                secondColour = "wheat"
            }
        }
        if (type[k] == "fighting") {
            if (k == 0) {
                firstColour = "maroon"
            }
            if (k == 1) {
                secondColour = "maroon"
            }
        }
        if (type[k] == "flying") {
            if (k == 0) {
                firstColour = "lightskyblue"
            }
            if (k == 1) {
                secondColour = "lightskyblue"
            }
        }
        if (type[k] == "poison") {
            if (k == 0) {
                firstColour = "darkviolet"
            }
            if (k == 1) {
                secondColour = "darkviolet"
            }
        }
        if (type[k] == "ground") {
            if (k == 0) {
                firstColour = "sandybrown"
            }
            if (k == 1) {
                secondColour = "sandybrown"
            }
        }
        if (type[k] == "rock") {
            if (k == 0) {
                firstColour = "darkgoldenrod"
            }
            if (k == 1) {
                secondColour = "darkgoldenrod"
            }
        }
        if (type[k] == "bug") {
            if (k == 0) {
                firstColour = "olive"
            }
            if (k == 1) {
                secondColour = "olive"
            }
        }
        if (type[k] == "ghost") {
            if (k == 0) {
                firstColour = "rebeccapurple"
            }
            if (k == 1) {
                secondColour = "rebeccapurple"
            }
        }
        if (type[k] == "steel") {
            if (k == 0) {
                firstColour = "dimgrey"
            }
            if (k == 1) {
                secondColour = "dimgrey"
            }
        }
        if (type[k] == "fire") {
            if (k == 0) {
                firstColour = "orange"
            }
            if (k == 1) {
                secondColour = "orange"
            }
        }
        if (type[k] == "water") {
            if (k == 0) {
                firstColour = "dodgerblue"
            }
            if (k == 1) {
                secondColour = "dodgerblue"
            }
        }
        if (type[k] == "grass") {
            if (k == 0) {
                firstColour = "forestgreen"
            }
            if (k == 1) {
                secondColour = "forestgreen"
            }
        }
        if (type[k] == "electric") {
            if (k == 0) {
                firstColour = "yellow"
            }
            if (k == 1) {
                secondColour = "yellow"
            }
        }
        if (type[k] == "psychic") {
            if (k == 0) {
                firstColour = "orchid"
            }
            if (k == 1) {
                secondColour = "orchid"
            }
        }
        if (type[k] == "ice") {
            if (k == 0) {
                firstColour = "cyan"
            }
            if (k == 1) {
                secondColour = "cyan"
            }
        }
        if (type[k] == "dragon") {
            if (k == 0) {
                firstColour = "darkviolet"
            }
            if (k == 1) {
                secondColour = "darkviolet"
            }
        }
        if (type[k] == "dark") {
            if (k == 0) {
                firstColour = "#705848"
            }
            if (k == 1) {
                secondColour = "#705848"
            }
        }
        if (type[k] == "fairy") {
            if (k == 0) {
                firstColour = "pink"
            }
            if (k == 1) {
                secondColour = "pink"
            }
        }
    }
    if (k == 1) {
        css_add = `"background-color: ${firstColour}"`
    }
    if (k == 2) {
        css_add = `"background-image: linear-gradient(${firstColour}, ${secondColour})"`
    }
}

function finishprocessPokeResp(data) {
    for (j = 0; j < data.genera.length; j++) {
        if (data.genera[j].language.name == "en") {
            to_add += `<p>
            ${data.genera[j].genus}
            </p>
            </div>`
        }
    }
}

function processPokeResp(data) {
    to_add += `<div class="image_container" style=${css_add}>
    <a href="/profile/${data.id}" id="pokemonImage">
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </a>
    <h4>${data.name}</h4>`
}

async function loadRandomPokemon() {
    for (i = 1; i <= 9; i++) {
        if (i % 3 == 1) {
            to_add += `<div class="images_group">`
        }

        x = Math.floor(Math.random() * 897) + 1
        pokemon_array[i] = x

        if (i > 1)
            for (m = 1; m < i - 1; m++) {
                if (x == pokemon_array[m]) {
                    x = Math.floor(Math.random() * 897) + 1
                    pokemon_array[i] = x
                }
            }

        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}`,
            success: colourChooser
        })

        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}`,
            success: processPokeResp
        })

        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon-species/${x}`,
            success: finishprocessPokeResp
        })

        if (i % 3 == 0) {
            to_add += `</div>`
        }
    }
    jQuery("main").html(to_add)
}

async function setup() {
    await loadRandomPokemon();
    await checkLogin();
}

jQuery(document).ready(setup)
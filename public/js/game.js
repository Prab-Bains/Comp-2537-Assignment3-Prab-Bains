firstCard = undefined
secondCard = undefined

firstCardHasBeenFlipped = false

pokemonPairs = {}
pokemon_array = []
to_add = ''
game_score = 0
timer = 100
columnSize = 0
rowSize = 0

function createEvent(data) {
    if (data == "success") {
        var date = new Date()
        time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        $.ajax({
            url: "/timeline/insert",
            type: "put",
            data: {
                eventDescription: `User has won the game on a ${columnSize} by ${rowSize} board.`,
                hits: 1,
                time: `At ${time}.`
            },
            success: () => {
                console.log("Event added successfully.")
            }
        })
    } else if (data == "failure") {
        var date = new Date()
        time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        $.ajax({
            url: "/timeline/insert",
            type: "put",
            data: {
                eventDescription: `User lost on a ${columnSize} by ${rowSize} board.`,
                hits: 1,
                time: `At ${time}.`
            },
            success: () => {
                console.log("Event added successfully.")
            }
        })
    }

}
async function createCards(data) {
    if (data == "incorrect information") {
        $("#error").remove()
        $("main").append("<p id='error'>Invalid game size.</p>")
    } else {
        boardSize = parseInt(data[0]) * parseInt(data[2])
        if (boardSize % 2 == 1) {
            $("#error").remove()
            $("main").append("<p id='error'>Please enter an even number of cards.</p>")
        } else {
            columnSize = parseInt(data[0])
            rowSize = parseInt(data[2])
            timer = 7 * rowSize + (7 * (rowSize - columnSize))
            for (i = 0; i < boardSize / 2; i++) {
                x = Math.floor(Math.random() * 897) + 1
                pokemon_array[i] = x
                if (i > 1)
                    for (m = 1; m < i - 1; m++) {
                        while (x == pokemon_array[m]) {
                            x = Math.floor(Math.random() * 897) + 1
                            pokemon_array[i] = x
                        }
                    }
                pokemonPairs[x] = 0
            }
            for (j = 0; j < boardSize; j++) {
                x = Math.floor(Math.random() * (boardSize / 2))
                while (pokemonPairs[pokemon_array[x]] == 2) {
                    x = Math.floor(Math.random() * (boardSize / 2))
                }
                if (j == 0) {
                    await $("main").html(`<div><h3 id="timer">Time Remaining: </h3></div><div id='game_grid'>`)
                }
                await $.ajax({
                    type: "get",
                    url: `https://pokeapi.co/api/v2/pokemon/${pokemon_array[x]}`,
                    success: (data) => {
                        $("#game_grid").append(`<div class="card">
                    <img id="img${j + 1}" class="front_face" src="${data.sprites.other["official-artwork"].front_default}" alt="">
                    <img class="back_face" src="../img/back.jpg" alt="">
                    </div>`)
                        pokemonPairs[pokemon_array[x]] += 1
                        $(".card").css("width", `calc(${100 / rowSize}% - 10px)`)
                        $(".card").css("height", `${100 / rowSize}%`)
                    }
                })
                if (j == boardSize - 1) {
                    await $("main").append("</div></div>")
                }
            }
            var timeEnds = new Date()
                timeEnds.setSeconds(timeEnds.getSeconds() + timer)
                var countdown = setInterval(function() {
                    var now = new Date().getTime()
                    distance = (timeEnds.getTime()) - now
                    seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    $("#timer").html(`Time Remaining: ${seconds}`)
                    if (distance <= 0) {
                        clearInterval(countdown)
                        $("body").off("click", ".card")
                        $("main").append("<div><h3>Game Over!</h3><button id='replay'>Play Again</button></div>")
                        createEvent("failure")
                    } else if (game_score == pokemon_array.length) {
                        clearInterval(countdown)
                    }
                }, 1000);
        }
    }
}

function getGameSize() {
    $.ajax({
        type: "post",
        data: ({
            gameSize: $("#gridSize").val()
        }),
        url: "/validateBoardSize",
        success: createCards
    })
}

function clickCards() {
    $(this).attr("id", "flip")

        if (!firstCardHasBeenFlipped) {
            // the first card
            firstCard = $(this).find(".front_face")[0]
            // console.log(firstCard);
            firstCardHasBeenFlipped = true
        } else {
            // this is the 2nd card
            secondCard = $(this).find(".front_face")[0]
            firstCardHasBeenFlipped = false
            console.log(firstCard, secondCard);
            // ccheck if we have match!
            if (
                $(`#${firstCard.id}`).attr("src") ==
                $(`#${secondCard.id}`).attr("src") &&
                $(`#${firstCard.id}`).attr("id") !=
                $(`#${secondCard.id}`).attr("id")
            ) {
                console.log("a match!");
                // update the game state
                game_score++
                // disable clicking events on these cards
                $("body").off("click", `.${$(`#${firstCard.id}`).parent()[0].class}`)
                $("body").off("click", `.${$(`#${secondCard.id}`).parent()[0].class}`)
                if (game_score == pokemon_array.length) {
                    $("main").append("<div><h3>You won!</h3><button id='replay'>Play Again</button></div>")
                    createEvent("success")
                }
            } else {
                console.log("not a match");
                // unflipping
                $("body").off("click", ".card")
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().removeAttr("id")
                    $(`#${secondCard.id}`).parent().removeAttr("id")
                    $("body").on("click", ".card", clickCards)
                }, 1000)
            }
        }
}

function setup() {
    $("#submit").click(getGameSize)
    $("body").on("click", ".card", function () {
        $(this).attr("id", "flip")

        if (!firstCardHasBeenFlipped) {
            // the first card
            firstCard = $(this).find(".front_face")[0]
            // console.log(firstCard);
            firstCardHasBeenFlipped = true
        } else {
            // this is the 2nd card
            secondCard = $(this).find(".front_face")[0]
            firstCardHasBeenFlipped = false
            console.log(firstCard, secondCard);
            // ccheck if we have match!
            if (
                $(`#${firstCard.id}`).attr("src") ==
                $(`#${secondCard.id}`).attr("src") &&
                $(`#${firstCard.id}`).attr("id") !=
                $(`#${secondCard.id}`).attr("id")
            ) {
                console.log("a match!");
                // update the game state
                game_score++
                // disable clicking events on these cards
                $("body").off("click", `.${$(`#${firstCard.id}`).parent()[0].class}`)
                $("body").off("click", `.${$(`#${secondCard.id}`).parent()[0].class}`)
                if (game_score == pokemon_array.length) {
                    $("main").append("<div><h3>You won!</h3><button id='replay'>Play Again</button></div>")
                }
            } else {
                console.log("not a match");
                // unflipping
                $("body").off("click", ".card")
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().removeAttr("id")
                    $(`#${secondCard.id}`).parent().removeAttr("id")
                    $("body").on("click", ".card", clickCards)
                }, 1000)
            }
        }
    })
    $("body").on("click", "#replay", () => {
        location.reload()
    })
}

$(document).ready(setup)
clicks = 0
username = ''

function addUser() {
    url = ''
    if ($("#type").val() == "user") {
        url = "/addAccount"
    } else if ($("#type").val() == "admin") {
        url = "/addAdmin"
    }
    $.ajax({
        type: "put",
        url: url,
        data: ({
            username: $("#username").val(),
            password: $("#password").val(),
            type: $("#type").val()
        }),
        success: () => {
            location.reload()
        }
    })
}

function displayAddProfile() {
    $(".profileEditor").remove()
    clicks = 0
    $('main').append(
        `<div class="profileEditor">
        <h4>Adding new user:</h4>
        <div id="form">
        <div id="usernameForm">
        <label for="username">Username: </label>
        <input type="text" name="username" id="username">
        </div>
        <div id="passwordForm">
        <label for="password">Password: </label>
        <input type="password" name="password" id="password">
        </div>
        <div id="typeSelect">
        <label for=type>Type of User: </label>
        <select name="type" id="type">
        <option value="default">Select an option</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        </select>
        </div>
        <input type="submit" class="submit">
        </div>
        </div>`
    )

}

function deleteUser() {
    id = $(this).attr("id")
    if (clicks == 0) {
        $(".profileEditor").append("<p id='confirm'>To confirm this action, press the delete button again.</p>")
        clicks++
    } else {
        $.ajax({
            type: "delete",
            url: `/deleteUser/${id}`,
            success (data) {
                if (data = "successfully deleted") {
                    clicks = 0
                    location.reload()
                } else {
                    $("#confirm").text("An error occurred.")
                }
            }
        })
    }
}


function submitNewPassword() {
    id = $(this).attr("id")
    $.ajax({
        type: "post",
        url: `/updatePassword/${id}`,
        data: {
            newPassword: $("#password").val()
        },
        success: (data) => {
            if (data == "updated successfully") {
                location.reload()
            } else {
                $(`.profileEditor`).append("<p>An error occurred.</p>")
            }
        }
    })
}

function submitNewUsername() {
    id = $(this).attr("id")
    $.ajax({
        type: "post",
        url: `/updateUsername/${id}`,
        data: {
            newUsername: $("#username").val()
        },
        success: (data) => {
            if (data == "updated successfully") {
                location.reload()
            } else {
                $(".profileEditor").append("<p>An error occurred.</p>")
            }
        }
    })
}


async function displayProfileEditor(){
    id = $(this).attr("id")
    $(`.profileEditor`).remove()
    clicks = 0
    await $.ajax({
        type: "get",
        url: `/findUser/${id}`,
        success: (data) => {
            username = data[0].username
        }
    })
    await $('main').append(
        `<div class="profileEditor" id="${id}">
        <h4>Editing ${username}'s profile:</h4>
        <div id="form">
        <div id="usernameForm">
        <label for="username">Username: </label>
        <input type="text" name="username" id="username">
        <input type="submit" id="${id}" class="usernameSubmit">
        </div>
        <div id="passwordForm">
        <label for="password">Password: </label>
        <input type="text" name="password" id="password">
        <input type="submit" id="${id}" class="passwordSubmit">
        </div>
        </div>
        <button class="delete" id="${id}">Delete User</button>
        </div>`
    )
}


function loadUsers() {
    $.ajax({
        type: "get",
        url: "/getAllUsers",
        success: (data) => {
            for (i = 0; i < data.length; i++) {
                $("main").append(
                    `<div class="userCard">
                    <h4>${data[i].username}</h4>
                    <p>Password: ${data[i].password} </p>
                    <br>
                    <button class="userBlock" id=${data[i]["_id"]}> Edit </button>
                    </div>`
                )
            }
        }
    })
}


function setup() {
    loadUsers()
    $("body").on("click", ".userBlock", displayProfileEditor)
    $("body").on("click", ".usernameSubmit", submitNewUsername)
    $("body").on("click", ".passwordSubmit", submitNewPassword)
    $("body").on("click", ".delete", deleteUser)
    $("body").on("click", "#addUser", displayAddProfile)
    $("body").on("click", ".submit", addUser)
}


$(document).ready(setup)
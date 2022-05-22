function hide_error_message() {
  $("#incorrect_information").hide()
}

function processResponse(data) {
  $("#incorrect_information").hide()
  console.log(data)
  if (data != "incorrect information") {
      location.href = "/"
  } else {
      $("#incorrect_information").show()
      setTimeout(hide_error_message, 3000)
  }
}

function setup() {
  $("#login").click(function() {
      $.ajax({
          type: "post",
          data: {
              username: $("#username").val(),
              password: $("#password").val()
          },
          url: "/verify",
          success: processResponse
      })
  })
}

$(document).ready(setup)
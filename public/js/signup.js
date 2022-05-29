function checkPasswords() {
  if ($("#password").val() == $("#retypePassword").val()) {
      $("#notMatching").remove();
  } else {
      $("#signupScreen").append('<p id="notMatching">The passwords do not match.</p>')
  }
}


function redirectToLoginPage(data) {
  $("#incorrect_information").remove()
  if (data != "incorrect information.") {
      location.href = "/login";
  } else {
      ("#signupScreen").append('<p id="incorrect_information">One or more information is incorrect.</p>')
  }
}

function addAnAccount() {
  $.ajax({
      type: "put",
      url: "/addAccount",
      data: {
          username: $("#username").val(),
          password: $("#password").val(),
          type: "user"
      },
      success: redirectToLoginPage
  })
}

function setup() {
  $("#signup").click(() => {
      addAnAccount();
  })
  $("#retypePassword").change(() => {
      checkPasswords();
  })
}

$(document).ready(setup)
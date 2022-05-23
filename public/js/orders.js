function displayOrders(data) {
  console.log(data)
  for(j = 0; j < data.length; j++) {
      $("main").append(`<div class="orderBlock">
      <img src="${data[j].cardImage}" id="cardPhotos">
      <div>
      <p>${data[j].name}</p>
      <p>${data[j].price}</p>
      </div>
      </div>`)
  }
}

function createOrders() {
  $.ajax({
      url: "/getPreviousOrders",
      type: "get",
      success: displayOrders
  })
}

function setup() {
  createOrders()
}

$(document).ready(setup)
function checkout() {
  $.ajax({
      type: "get",
      url: "/checkout",
      success: () => {
          alert("Successfully checked out items.");
          location.href = "/"
      }
  })
}


async function calculatePrice() {
  subtotal = 0
  await $.ajax({
      type: "get",
      url: "/getCartItems",
      success: (data) => {
          for (j = 0; j < data.length; j++) {
              subtotal += data[j].price
          }
      }
  })
  await $("main").append(`<div id="checkout">
  <p>Subtotal: $${subtotal}</p>
  <p>Tax: $${subtotal * 0.12}</p>
  <p>Total: $${subtotal + (subtotal * 0.12)}</p>
  <button id="order">Order Now</button>
  </div>`)
}


function removeCartItems() {
  x = $(this).attr("id")
  $.ajax({
      type: "get",
      url: `/cart/delete/${x}`,
      success: () => {
          $(`#${x}`).remove()
          $("#checkout").remove()
          calculatePrice()
      }
  })
}

function loadItems() {
  $.ajax({
      type: "get",
      url: "/getCartItems",
      success: (data) => {
          console.log(data);
          for (i = 0; i < data.length; i++) {
              $("main").append(`<div id=${data[i]["_id"]} class="cartBlock">
              <img src="${data[i].cardImage}">
              <div>
              <h3>${data[i].name}</h3>
              <p>${data[i].price}</p>
              <button id=${data[i]["_id"]} class="remove">Remove</button>
              </div>
              </div>`)
          }
      }
  })
}

function setup() {
  loadItems()
  $("body").on("click", ".remove", removeCartItems)
  calculatePrice()
  $("body").on("click", "#order", checkout)
}

$(document).ready(setup)
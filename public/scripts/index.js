const body = document.querySelector("body");

$("#card-maker").hide();
$("#all-cards").hide();
$("#card-standby").hide();
$("#card-image").hide();

$("#make-a-card").click(function () {
  body.style.backgroundColor = "orange";

  $("#main").slideUp();
  $("#card-maker").slideDown();
});

$("#view-all-cards").click(function () {
  body.style.backgroundColor = "red";

  $("#main").slideUp();
  $("#all-cards").slideDown();
});

$("#card-maker-back").click(function () {
  body.style.backgroundColor = "#ffcc00";

  $("#card-maker").slideUp();
  $("#main").slideDown();
});

$("#all-cards-back").click(function () {
  body.style.backgroundColor = "#ffcc00";

  $("#all-cards").slideUp();
  $("#main").slideDown();
});

$("#card-form").submit(function () {
  event.preventDefault();

  var bg_img = '';
  var bg_color = ''; 
  var cd_title = '';
  var cd_img = '';
  var cd_from = '';

  const background_image_link = document.getElementById("background-image-link").value;
  const background_color = document.getElementById("background-color").value;
  const card_title = document.getElementById("card-title").value;
  const card_front_image_link = document.getElementById("card-front-image-link").value;
  const card_from = document.getElementById("from").value;

  if (background_image_link === null || background_image_link === undefined || background_image_link === '') {
    bg_img = 'fuck';
  }

  else {
    bg_img = background_image_link;
  }

  if (card_front_image_link === null || card_front_image_link === undefined || card_front_image_link === '') {
    cd_img = 'fuck';
  }

  else {
    cd_img = card_front_image_link;
  }

  bg_color = background_color;
  cd_title = card_title;
  cd_from = card_from;

  $("#card-maker").slideUp();
  $("#card-standby").slideDown();

  fetch('/create_card', {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json',
    },
    body : JSON.stringify({
      background_img : bg_img,
      background_clr : bg_color,
      card_tle : cd_title,
      card_img : cd_img,
      card_frm : cd_from
    })
  })
  .then(response => response.text())
  .then(data => {
    console.log('Success:', data);

    $("#card-standby").slideUp();
    $("#card-image").slideDown();
    $("#card-image").slideUp();
    $("#all-cards").slideDown();

    document.getElementById('card_iframe').contentWindow.location.reload();
  })
  .catch((error) => {
    console.log(error);
  });
});
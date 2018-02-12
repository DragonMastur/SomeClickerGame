game = {
  clicks: 0,
  clicks_per_click: 1,
  bought: {
    more_clicks: 0
  },
  base_price: {
    more_clicks: 100
  },
  current_fusions: {
    fusion_1: 0,
    gem: 10
  },
  fusions: {
    fusion_1: {
      ingredients: {
        clicks: 0
      },
      temperature: 20,
      energy: 0,
      time: 0,
      name: "fusion_1"
    },
    gem: {
      ingredients: {
        clicks: 100
      },
      temperature: 120,
      energy: 200,
      time: 10,
      name: "gem"
    }
  }
};

update_fusions("current-fusions", null);

$(document).click(function(e){
  game.clicks += game.clicks_per_click;
  update("clicks");
});

$("button").click(function(e){
  if (e.target.id == "buy-more-clicks") {
    buy("more_clicks");
  } else if (e.target.id == "buy-") {
    buy("")
  } else if (e.target.id == "fusing-start") {
    start_fusing();
  }
});

$("input#fusing-clicks").change(function(e){
  update_fusions("controls", "energy");
  update_fusions("controls", "time");
});
$("input#fusing-temp").change(function(e){
  update_fusions("controls", "energy");
  update_fusions("controls", "time");
});

function update_fusions(where, ntype) {
  if (where == "controls") {
    if (ntype == "energy") {
      var clicks = $("input#fusing-clicks").val();
      var temp = Math.abs($("input#fusing-temp").val()-20)+0.5;
      var energy = parseInt(1/(0.005+Math.pow(Math.E, -(temp*clicks*0.05))));
      $("h4#fusing-energy-required").text(energy.toString() + " Clicks");
    } else if (ntype == "time") {
      var clicks = $("input#fusing-clicks").val();
      var temp = Math.abs($("input#fusing-temp").val()-20)+1;
      var time = parseInt(1/(0.1+Math.pow(Math.E, -(temp*clicks*0.2)))+0.005);
      $("h4#fusing-time-required").text(time.toString() + " Seconds");
    }
  } else if (where == "current-fusions") {
    $("ul#current-fusions").empty();
    for (var f in game.current_fusions) {
      var new_li = $("<li class=\"current-fusions-fusion\" />", {text: f + game.current_fusions[f].toString()});
      $("ul#current-fusions").append(new_li);
    }
  }
}

function start_fusing() {
  if ($("button#fusing-start").text() == "Fusing...") {
    return false;
  }
  var clicks = $("input#fusing-clicks").val();
  var temp = $("input#fusing-temp").val();
  var energy, time;
  var fusion = "";
  for (var f in game.fusions) {
    is_fusion = true;
    for (var ingredients in game.fusions[f].ingredients) {
      if (clicks != ingredients.clicks) {
        is_fusion = false;
        break;
      }
    }
    if (is_fusion == true) {
      energy = f.engery;
      time = f.time;
      fusion = f.name;
    }
  }
  if (fusion != "") {
    if (game.clicks >= clicks) {
      $("button#fusing-start").text("Fusing...");
      game.fusions.push(window.setTimeout( function(f){
        game.current_fusions[f] += 1;
        $("#button#fusing-start").text("Start Fusing");
      }), time, fusion);
    }
  } else {
    return false;
  }
}

function buy(ntype) {
  price = parseInt(game.base_price[ntype] * Math.pow(1.15, game.bought[ntype]));
  if (game.clicks >= price) {
    game.clicks -= price;
    game.bought[ntype] += 1;
    update(ntype);
  }
};

function update(ntype) {
  if (ntype == "clicks") {
    $("h3#clicks").text(game.clicks);
  } else if (ntype == "more_clicks") {
    game.clicks_per_click += 1
    $("button#buy-more-clicks").text("Buy More Clicks per Click for "+parseInt(game.base_price.more_clicks * Math.pow(1.15, game.bought.more_clicks)).toString()+"c")
  }
};

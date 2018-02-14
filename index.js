game = {
  clicks: 0,
  jules: 0,
  clicks_per_click: 1,
  jules_per_second: 10,
  max_jules: 1000000,
  bought: {
    more_clicks: 0,
    more_energy: 0
  },
  base_price: {
    more_clicks: 100,
    more_energy: 100
  },
  current_fusions: {
    Gem: 0
  },
  fusions: {
    Fusion_1: {
      ingredients: {
        clicks: 0
      },
      temperature: 20,
      energy: 0,
      time: 0,
      name: "Fusion_1"
    },
    Gem: {
      ingredients: {
        clicks: 100
      },
      temperature: 120,
      energy: 200,
      time: 10,
      name: "Gem"
    }
  },
  functions: {
    fusions: []
  }
};

currentGameData = window.localStorage.getItem("SomeClickerGameData");
if (currentGameData != null) {
  game = JSON.parse(currentGameData);
  update("all");
}
update_fusions("current-fusions", null);

$(document).click(function(e){
  game.clicks += game.clicks_per_click;
  update("clicks");
});

$("button").click(function(e){
  if (e.target.id == "buy-more-clicks") {
    buy("more_clicks");
  } else if (e.target.id == "buy-more-energy") {
    buy("more_energy")
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
      $("h4#fusing-energy-required").text(energy.toString() + " Jules");
    } else if (ntype == "time") {
      var clicks = $("input#fusing-clicks").val();
      var temp = Math.abs($("input#fusing-temp").val()-20)+1;
      var time = parseInt(1/(0.1+Math.pow(Math.E, -(temp*clicks*0.2)))+0.005);
      $("h4#fusing-time-required").text(time.toString() + " Seconds");
    }
  } else if (where == "current-fusions") {
    $("ul#current-fusions").empty();
    for (var f in game.current_fusions) {
      var new_li = $("<li class=\"current-fusions-fusion\" />").text(f + " - " + game.current_fusions[f].toString());
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
  var is_fusion = false;
  for (var f in game.fusions) {
    is_fusion = true;
    if (clicks != game.fusions[f].ingredients.clicks) {
      is_fusion = false;
    }
    if (temp != game.fusions[f].temperature) {
      is_fusion = false;
    }
    if (is_fusion == true) {
      energy = game.fusions[f].energy;
      time = game.fusions[f].time;
      fusion = game.fusions[f].name;
      break;
    }
  }
  if (fusion != "") {
    if (game.clicks >= clicks && game.jules >= energy) {
      $("button#fusing-start").text("Fusing...");
      game.clicks -= clicks;
      game.jules -= energy;
      game.functions.fusions.push(window.setTimeout(function(f) {
        game.current_fusions[f] += 1;
        $("button#fusing-start").text("Start Fusing");
        update_fusions("current-fusions", null);
      }, time*1000, fusion));
      return true;
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
  if (ntype == "all") {
    update("clicks");
    update("jules");
    update("more_clicks");
    update("more_energy");
  } else if (ntype == "clicks") {
    $("h3#clicks").text(game.clicks);
  } else if (ntype == "jules") {
    $("h3#jules").text(game.jules);
  } else if (ntype == "more_clicks") {
    game.clicks_per_click += 1 * game.bought.more_clicks;
    $("button#buy-more-clicks").text("Buy More Clicks per Click for "+parseInt(game.base_price.more_clicks * Math.pow(1.15, game.bought.more_clicks)).toString()+"c")
  } else if (ntype == "more_energy") {
    game.jules_per_second += 10 * game.bought.more_energy;
    $("button#buy-more-energy").text("Buy More Jules per Second for "+parseInt(game.base_price.more_energy * Math.pow(1.15, game.bought.more_energy)).toString()+"c")
  }
};

game.engeryIntervalID = window.setInterval(function(){
  game.jules += game.jules_per_second;
  if (game.jules > game.max_jules) {
    game.jules = game.max_jules;
  }
  update("jules");
}, 1000);

game.saveIntervalID = window.setInterval(function(){
  window.localStorage.setItem("SomeClickerGameData", JSON.stringify(game));
}, 60000);

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const domainRegex = /http(?:s?):\/\/.*?([^\.\/]+?\.[^\.]+?)(?:\/|$)/i /*from https://stackoverflow.com/questions/34818020/javascript-regex-url-extract-domain-only*/

//load the environment variables from .env
dotenv.config();

const youtube = require("./modules/youtube/youtube-api");
const spoonacular = require("./modules/spoonacular/spoonacular-api");

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//Hompage
app.get("/", async (request, response) => {
  response.render("index");
});

//Video Details
app.get("/video/:id", async (request, response) => {
  let id = request.params.id;

  //Getting video data from Youtube
  let videoData = await youtube.getVideoData(id);

  //Preparing data object for rendering webpage
  let completeData = {}
  completeData.videoURL = "http://www.youtube.com/embed/"+id;
  completeData.title = videoData.title;
  completeData.description = videoData.description;
  completeData.included = [];
  completeData.excluded = [];
  completeData.recipes = [];
  completeData.results = "";
  let included = request.query.included;
  let excluded = request.query.excluded;

  //If no ingredients defined in query, extract them from the youtube description
  if (included === undefined && excluded === undefined) {
    let recipeData = await spoonacular.getFoodFromDescription(completeData.description);
    recipeData.forEach(element => {
      if (element.tag === "ingredient") {
        completeData.included.push(encodeURI(element.annotation));
      }
    });
  }

  //If ingredients defined in query, use them to search new recipes
  else {
    let dish = (request.query.dish === undefined) ? videoData.title : request.query.dish;
    let recipeData;

    if (excluded === undefined) {
      recipeData = await spoonacular.getRecipeFromIngredients(dish, included, "");
      completeData.included = included.split(',');
    }
    else if (included === undefined) {
      recipeData = await spoonacular.getRecipeFromIngredients(dish, "", excluded);
      completeData.excluded = excluded.split(',');
    }
    else {
      recipeData = await spoonacular.getRecipeFromIngredients(dish, included, excluded);
      completeData.excluded = excluded.split(',');
      completeData.included = included.split(',');
    }

    console.log(recipeData);
    completeData.results = "Results: " 
    completeData.results += recipeData.length <= 3 ? recipeData.length : 3;
    recipeData.forEach(element => {
      let recipe = {};
      recipe.id = element.id;
      recipe.title = element.title;
      recipe.time = element.readyInMinutes;
      recipe.serving = element.servings;
      recipe.image = element.image;
      recipe.url = element.sourceUrl;
      if (domainRegex.test(element.sourceUrl)) {
        recipe.domain = element.sourceUrl.match(domainRegex)[1];
      }
      recipe.summary = element.summary;
      completeData.recipes.push(recipe);
    });
    

  }
  response.render("video", { data: completeData });
});


//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


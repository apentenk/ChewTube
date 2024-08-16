const spoonacular = "https://api.spoonacular.com/"

/*
 * Functions for Spoonacular API requests.
 */
async function getFoodFromDescription(description) {
  let reqUrl = `${spoonacular}food/detect?apiKey=${process.env.SPOONACULAR_CLIENT_ID}`;
  let response = await fetch(
    reqUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ text: description })
    }
  );
  let data = await response.json();
  return data.annotations; //return the JSON data from the response
}

async function getRecipeFromIngredients(dish, includeIngredients, excludeIngredients) {
  let queryString = ""

  if (includeIngredients !== "") {
    queryString += `&includeIngredients=${includeIngredients}`;
  }
  if (excludeIngredients !== "") {
    queryString += `&excludeIngredients=${excludeIngredients}`;
  }
  let reqUrl = `${spoonacular}recipes/complexSearch?apiKey=${process.env.SPOONACULAR_CLIENT_ID}&addRecipeInformation=true&query=${dish}${queryString}&number=3`
  let response = await fetch(
    reqUrl,
    {
      method: "GET"
    }
  );
  let data = await response.json();

  return data.results;
}

module.exports = {
  getFoodFromDescription,
  getRecipeFromIngredients
}
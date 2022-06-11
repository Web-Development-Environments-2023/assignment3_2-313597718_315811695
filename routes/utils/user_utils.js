const DButils = require("./DButils");

// make a specific recipe a favorite.
async function markAsFavorite(user_id, recipe_id) {
  let x = await DButils.execQuery(
    "SELECT recipeid as id FROM hw3.userfavrecpies"
  );
  let all = [];
  console.log(all)
  for (let i = 0; i < Object.keys(x).length; i++) {
    if (x[i].id == recipe_id) {
      return; // TODO: what to return? or maybe this is just enogh
    }
  }
  // if not exist -> insert to DB
  await DButils.execQuery(`insert into userfavrecpies values ('${user_id}',${recipe_id})`);
}

// returns all fav's recipes of the user
async function getFavoriteRecipes(user_id) {
  const recipes_id = await DButils.execQuery(`select recipeid from userfavrecpies where user_id='${user_id}'`);
  return recipes_id;
}

// create new recipe
async function createRecipe(user_id, recpiesDetials) {
  console.log(recpiesDetials);
  let x = await DButils.execQuery(
    "SELECT MAX(recpieid) as id FROM hw3.userrecipes"
  );
  let maxid = x[0].id;
  maxid++;
  await DButils.execQuery(
    `INSERT INTO userrecipes VALUES ('${user_id}','${maxid}','${recpiesDetials.title}',
        '${recpiesDetials.readyInMinutes}', '${recpiesDetials.image}' , '${recpiesDetials.aggregateLikes}' , 
        '${recpiesDetials.vegan}' , '${recpiesDetials.vegetarian}' , '${recpiesDetials.glutenFree}' , 
        '${recpiesDetials.ingredients}', '${recpiesDetials.instructions}', '${recpiesDetials.numOfDishes}')`
  );

}

/** 
*create new family recipe 
* TODO: DELETE this. no need at all. 
*/
async function createFamilyRecipe(user_id, recpiesDetials) {
  console.log(recpiesDetials);
  let x = await DButils.execQuery(
    "SELECT MAX(recipid) as id FROM hw3.userfamilyrecipes"
  );
  let maxid = x[0].id;
  maxid++;
  await DButils.execQuery(
    `INSERT INTO userfamilyrecipes VALUES ('${user_id}','${maxid}','${recpiesDetials.title}', '${recpiesDetials.owner}', 
      '${recpiesDetials.whentomake}' , '${recpiesDetials.ingredients}' , '${recpiesDetials.instructions}' , '${recpiesDetials.image}')`
  );
  console.log("success insert to family rec.")
}

// remove recipe from the user's fav' list
async function removeRecipe(user_id, Rid) {
  // get from DB all of the user favorits.
  console.log("in removeRecipe !")//SELECT recipeId FROM userfavrecpies

  const recpiesIds = await DButils.execQuery(`SELECT recipeid FROM userfavrecpies where user_id='${user_id}'`).then((recpies_id) => {
    if (recpies_id.find((x) => x.recipeid === Rid)) {
      let result = DButils.execQuery(`DELETE FROM userfavrecpies where user_id ='${user_id}' AND recipeid='${Rid}'`);
    }
  });
  return recpiesIds;
}

// returns all the created recipes by this user id
async function getMyrecipes(user_id) {
  const recipes_id = await DButils.execQuery(`select * from userrecipes where user_id='${user_id}'`);
  return recipes_id;
}

// returns all the created recipes by this user id
async function addSeen(user_id, recipe_id) {
  await DButils.execQuery(`INSERT INTO hw3.lastseen VALUES('${user_id}','${recipe_id}',NOW()) ON DUPLICATE KEY UPDATE date=NOW()`);
  //`insert into lastseen values ('${username}','${recipe_id}',NOW()) ON DUPLICATE KEY UPDATE time=NOW()`
}

// checks if the user watched the full recipe with this id
async function checkSeen(user_id, recipe_id) {
  console.log("in check seen");
  const ans = await DButils.execQuery(`SELECT * FROM hw3.lastseen WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'`);
  console.log(ans)  //`insert into lastseen values ('${username}','${recipe_id}',NOW()) ON DUPLICATE KEY UPDATE time=NOW()`
  return ans;
}


exports.markAsFavorite = markAsFavorite;
exports.createRecipe = createRecipe;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.removeRecipe = removeRecipe;
exports.createFamilyRecipe = createFamilyRecipe;
exports.getMyrecipes = getMyrecipes;
exports.addSeen = addSeen;
exports.checkSeen = checkSeen;
document.addEventListener(
  'DOMContentLoaded',
  function () {
    init();
  },
  false
);

function init() {
  var query = new URLSearchParams(window.location.search);
  switch (query.get('page')) {
    case 'recipe':
      if (query.has('uuid')) {
        showRecipe(query.get('uuid'));
      } else {
        showList();
      }
      return;

    // case 'create':
    //   showRecipeForm();
    //   return;

    default:
      showList();
      return;
  }
}

function showList() {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var title = document.createElement('h1');
  title.innerText = 'Recipe Listing';
  app.append(title);

  // var create = document.createElement('button');
  // create.classList.add('btn');
  // create.innerText = 'Create a Recipe';
  // create.addEventListener('click', function () {
  //   var query = new URLSearchParams(window.location.search);
  //   query.set('page', 'create');
  //   query.delete('uuid');
  //   window.location.search = query.toString();
  //   showRecipeForm();
  // });
  // app.append(create);

  ajax_api('http://localhost:3001/recipes', function (recipes) {
    if (recipes) {
      app.append(formatList(recipes));
    } else {
      var noRecipes = document.createElement('h2');
      noRecipes.innerText = 'There are no recipes at this moment. Check back later.';
      app.append(noRecipes);
    }
  });
}

function formatList(recipes) {
  var list = document.createElement('ul');
  list.classList.add('recipe-list');

  recipes.forEach(function (value, index) {
    var item = document.createElement('li');
    item.addEventListener('click', function () {
      var uuid = this.dataset.uuid;
      var query = new URLSearchParams(window.location.search);
      query.set('page', 'recipe');
      query.set('uuid', uuid);
      window.location.search = query.toString();
      showRecipe(uuid);
    });
    item.dataset.uuid = value.uuid;
    item.classList.add('recipe');

    var image = document.createElement('img');
    image.src = value.images.medium;
    image.classList.add('recipe-img');
    item.append(image);

    var itemInfo = document.createElement('div');
    itemInfo.classList.add('recipe-info');

    var titleLine = document.createElement('div');
    titleLine.classList.add('recipe-titleLine');

    var title = document.createElement('h2');
    title.classList.add('recipe-title');
    title.innerText = value.title;
    titleLine.append(title);

    var servings = document.createElement('span');
    servings.classList.add('recipe-titleLine-secondary');
    servings.innerHTML = `Servings <br/> ${value.servings}`;
    titleLine.append(servings);

    var prepTime = document.createElement('span');
    prepTime.classList.add('recipe-titleLine-secondary');
    prepTime.innerHTML = `Prep <br/> ${value.prepTime} min`;
    titleLine.append(prepTime);

    var cookTime = document.createElement('span');
    cookTime.classList.add('recipe-titleLine-secondary');
    cookTime.innerHTML = `Cook <br/> ${value.cookTime} min`;
    titleLine.append(cookTime);

    itemInfo.append(titleLine);

    var description = document.createElement('p');
    description.classList.add('recipe-description');
    description.innerText = value.description;
    itemInfo.append(description);

    item.append(itemInfo);

    list.append(item);
  });

  return list;
}

function showRecipe(uuid) {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var title = document.createElement('h1');
  title.innerText = 'Recipe Listing';
  app.append(title);

  ajax_api('http://localhost:3001/specials', function (specials) {
    ajax_api('http://localhost:3001/recipes', function (recipes) {
      var recipe = recipes.find(function (value) {
        return value.uuid == uuid;
      });

      var page = document.createElement('div');
      page.classList.add('recipe-page');

      var image = document.createElement('img');
      image.src = recipe.images.full;
      image.classList.add('recipe-img');
      page.append(image);

      var titleLine = document.createElement('div');
      titleLine.classList.add('recipe-titleLine');

      var title = document.createElement('h2');
      title.classList.add('recipe-title');
      title.innerText = recipe.title;
      titleLine.append(title);

      var servings = document.createElement('span');
      servings.classList.add('recipe-titleLine-secondary');
      servings.innerHTML = `Servings <br/> ${recipe.servings}`;
      titleLine.append(servings);

      var prepTime = document.createElement('span');
      prepTime.classList.add('recipe-titleLine-secondary');
      prepTime.innerHTML = `Prep <br/> ${recipe.prepTime} min`;
      titleLine.append(prepTime);

      var cookTime = document.createElement('span');
      cookTime.classList.add('recipe-titleLine-secondary');
      cookTime.innerHTML = `Cook <br/> ${recipe.cookTime} min`;
      titleLine.append(cookTime);

      page.append(titleLine);

      var description = document.createElement('p');
      description.classList.add('recipe-description');
      description.innerText = recipe.description;
      page.append(description);

      var ingredientsTitle = document.createElement('h3');
      ingredientsTitle.innerText = 'Ingredients';
      page.append(ingredientsTitle);

      var ingredients = document.createElement('ul');

      recipe.ingredients.forEach(function (value, index) {
        var item = document.createElement('li');
        item.innerText = `${value.amount ?? ''} ${value.measurement ?? ''} ${value.name}`;

        var special = specials.find(function (special) {
          return special.ingredientId == value.uuid;
        });
        if (special) {
          var subList = document.createElement('ul');
          var itemSpecial = document.createElement('li');
          itemSpecial.innerText = `${special.title} - ${special.type} - ${special.text}`;
          subList.append(itemSpecial);
          item.append(subList);
        }

        ingredients.append(item);
      });

      page.append(ingredients);

      var directionsTitle = document.createElement('h3');
      directionsTitle.innerText = 'Directions';
      page.append(directionsTitle);

      var directions = document.createElement('ol');

      recipe.directions.forEach(function (value, index) {
        var item = document.createElement('li');
        item.innerText = `${value.instructions} ${value.optional ? '(optional)' : ''}`;

        directions.append(item);
      });

      page.append(directions);

      var buttons = document.createElement('div');

      var backButton = document.createElement('button');
      backButton.classList.add('btn');
      backButton.innerText = 'Back to Listing';
      backButton.addEventListener('click', function () {
        var query = new URLSearchParams(window.location.search);
        query.delete('page');
        query.delete('uuid');
        window.location.search = query.toString();
        showList();
      });
      buttons.append(backButton);

      // var update = document.createElement('button');
      // update.innerText = 'Edit this Recipe';
      // update.classList.add('btn');
      // update.addEventListener('click', function () {
      //   showRecipeForm();
      // });
      // buttons.append(update);

      page.append(buttons);

      app.append(page);
    });
  });
}

function showRecipeForm(uuid) {
  var app = document.getElementById('app');
  app.innerHTML = '';

  var title = document.createElement('h1');
  title.innerText = 'Recipe Listing';
  app.append(title);

  var page = document.createElement('div');
  page.classList.add('recipe-form-page');

  var title = document.createElement('input');
  title.placeholder = 'Title';

  var description = document.createElement('textarea');
  description.placeholder = 'Description';

  var servings = document.createElement('input');
  servings.placeholder = 'Servings';

  var prepTime = document.createElement('input');
  prepTime.placeholder = 'Prep Time';

  var cookTime = document.createElement('input');
  cookTime.placeholder = 'Cook Time';

  var ingredients = document.createElement('input');

  var directions = document.createElement('input');

  ajax_api('http://localhost:3001/recipes', function (recipes) {
    var recipe = recipes.find(function (value) {
      return value.uuid == uuid;
    });

    if (recipe) {
    }

    page.append(title);
    page.append(description);
    page.append(servings);
    page.append(prepTime);
    page.append(cookTime);

    var buttons = document.createElement('div');

    var backButton = document.createElement('button');
    backButton.classList.add('btn');
    backButton.innerText = 'Cancel';
    backButton.addEventListener('click', function () {
      var query = new URLSearchParams(window.location.search);
      query.delete('uuid');
      query.delete('page');
      window.location.search = query.toString();
      showList();
    });
    buttons.append(backButton);

    var update = document.createElement('button');
    update.innerText = 'Save';
    update.classList.add('btn');
    update.addEventListener('click', function () {});
    buttons.append(update);

    page.append(buttons);

    app.append(page);
  });
}

function ajax_api(endpoint, callback, method = 'GET', async = true) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.response), this);
    }
  };
  xhttp.open(method, endpoint, async);
  xhttp.send();
}

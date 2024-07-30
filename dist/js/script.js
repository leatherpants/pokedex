const root = document.querySelector("html");

//* POKEMON DATA
const fetchUrl = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const nameView = document.getElementById("pokemon-name");
const idView = document.getElementById("pokemon-id");
const mainView = document.querySelector(".main");
const imgView = document.getElementById("sprite");

searchButton.addEventListener("click", e => {
  e.preventDefault();
  const input = searchInput.value;
  if (input === '') return;
  getPokemon(input);
})

async function getPokemon(nameOrId) {
  const response = await fetch(fetchUrl + nameOrId);
  const pokemonData = await response.json();
  const { name, id, height, weight, sprites: { front_default: img }, types: types_data, stats: stats_data } = pokemonData;
  const types = types_data.map(type_data => type_data.type.name)
  const stats = stats_data.map(stat_data => ({
    name: stat_data.stat.name,
    value: stat_data.base_stat
  }));

}









//* TOGGLE 
const USER_PREFERED_COLOR_SCHEME = "USER_PREFERED_COLOR_SCHEME";

const light = document.getElementById("light");
const dark = document.getElementById("dark");
const mediaQuery = matchMedia("(prefers-color-scheme: dark)");

// 1 on load
const userPreferedColorScheme = localStorage.getItem(USER_PREFERED_COLOR_SCHEME);
if (userPreferedColorScheme) {
  setColorScheme(userPreferedColorScheme);
}

// 2 on change color scheme
mediaQuery.addEventListener("change", e => {
  if (mediaQuery.matches) {
    setColorScheme("dark");
  } else {
    setColorScheme("light");
  }
})

//3 on toggle
const radioArr = [dark, light];
radioArr.forEach(radio => {
  radio.addEventListener("click", e => {
    const scheme = e.target.id;
    setColorScheme(scheme);
    editLocalStorage(scheme);
  })
})


function setColorScheme(scheme) {
  // 1 change scheme
  // 2 set toggle state
  if (scheme === "dark") {
    root.classList.add("dark");
    dark.checked = true;
  } else {
    root.classList.remove("dark");
    light.checked = true;
  }
}

function editLocalStorage(userColorScheme) {
  const systemColorScheme = mediaQuery.matches ? "dark" : "light";
  if (systemColorScheme === userColorScheme) {
    localStorage.removeItem(USER_PREFERED_COLOR_SCHEME);
  } else {
    localStorage.setItem(USER_PREFERED_COLOR_SCHEME, userColorScheme);
  }
}
const root = document.documentElement;

//* POKEMON DATA
const fetchUrl = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const nameView = document.getElementById("pokemon-name");
const idView = document.getElementById("pokemon-id");
const mainView = document.querySelector(".main");
const typesView = document.querySelector(".hero__types");
const dataView = document.querySelector("section.data");
const heroSectionView = document.querySelector("section.hero");
const imgContainerView = document.querySelector(".hero__img-container");

searchButton.addEventListener("click", async e => {
  e.preventDefault();
  const input = searchInput.value.toLowerCase();
  if (input === '') return;
  await getPokemon(input);
})

async function getPokemon(nameOrId) {
  try {
    const data = await fetchData(nameOrId);
    const pokemon = extractPokemonData(data);
    updateUI(pokemon);
  } catch (error) {
    alert("Pokémon not found");
  }
}

async function fetchData(nameOrId) {
  const response = await fetch(fetchUrl + nameOrId);
  if (!response.ok) { // 404 NOT FOUND
    throw new Error("Status Error.");
  } else {
    return await response.json();
  }
}

function extractPokemonData(data) {
  const { name, id, height, weight, sprites: { front_default: img }, types: types_data, stats: stats_data } = data;
  const types = types_data.map(type_data => type_data.type.name)
  const stats = stats_data.map(stat_data => ({
    name: stat_data.stat.name,
    value: stat_data.base_stat
  }));
  stats.unshift({ name: "height", value: height });
  stats.unshift({ name: "weight", value: weight });
  return {
    name,
    id,
    img,
    types,
    stats
  };
}

function updateUI(pokemon) {
  nameView.textContent = pokemon.name;
  idView.textContent = '#' + pokemon.id;
  setTypesView(pokemon.types);
  setDataView(pokemon.stats);
  setMainBackground(pokemon.types[0]);
  const imgView = getImgView(pokemon.img, pokemon.name);
  setPokemonImg(imgView);
}

function setTypesView(types) {
  typesView.innerHTML = types.map(type =>
    `<p class="hero__type hero__type--${type}">${type}</p>`)
    .join('');
}

function setDataView(stats) {
  dataView.innerHTML = stats.map(stat =>
    `
      <div class="data__card">
      <h3 class="data__title">${stat.name.replace("special-", "sp. ")}</h3>
          <p id="${stat.name}" class="data__value">${stat.value}</p>
        </div>
        `
  ).join('');
}

function setMainBackground(type) {
  root.style.setProperty("--type", `var(--${type})`);
}

function getImgView(src, alt) {
  const imgView = new Image()
  imgView.id = "sprite";
  imgView.className = "hero__img";
  imgView.src = src;
  imgView.alt = alt;
  imgView.width = 100;
  imgView.height = 100;
  return imgView;
}

function setPokemonImg(imgView) {
  imgContainerView.style.height = "auto";
  imgContainerView.innerHTML = "";
  imgContainerView.appendChild(imgView);
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
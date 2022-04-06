const poke_container = document.getElementById("poke_container");
const search_container = document.getElementById("search_container");
const modalContainer = document.getElementById('modal-container');

const pokemons_number = 150;
const colors = {
	fire: '#FDDFDF',
	grass: '#DEFDE0',
	electric: '#FCF7DE',
	water: '#DEF3FD',
	ground: '#f4e7da',
	rock: '#d5d5d4',
	fairy: '#fceaff',
	poison: '#98d7a5',
	bug: '#f8d5a3',
	dragon: '#97b3e6',
	psychic: '#eaeda1',
	flying: '#F5F5F5',
	fighting: '#E6E0D4',
	normal: '#F5F5F5'
};

const fetchPokemons = async () => {
	for (let i = 1; i <= pokemons_number; i++) {
		await getPokemon(i);
	}
};

const getPokemon = async (id, search = false) => {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	createPokemonCard(pokemon, search, id);
};

function createPokemonCard(pokemon, search = false, id) {
	const pokemonEl = document.createElement('div');
    search === true ? pokemonEl.classList.add('pokemon', 'pokemon-found') : pokemonEl.classList.add('pokemon');
	const poke_types = pokemon.types.map(type => type.type.name);
	const name = pokemon.name;
    const typeSpans =  poke_types.map(type =>`<p class="type"> ${type} </p> `).join(' ');
	const pokeInnerHTML = `
        <div id="${ search === true ? 'pokemon-found' : 'pokemon'}" class="${poke_types[0]}-color" onclick="onHandleSelected(${pokemon.id})">
            <div id="${pokemon.id}" class="img-container">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg" alt="${name}" />
            </div>
            <div class="info">
                <span class="number">#${pokemon.id
                                .toString()
                                .padStart(3, '0')}</span>
                <h3 class="name">${name}</h3>
                <small class="type-container"> <span class="types"> <p>Type: </p>  ${typeSpans} </span> </small>
            </div>
        </div>
    `;

	pokemonEl.innerHTML = pokeInnerHTML;
    const container =  search === true ? search_container : poke_container; 
	container.appendChild(pokemonEl);
}

fetchPokemons();

const searchPokemon = async (event) => {
    event.preventDefault();
    const {value} = event.target.pokemon;
    await getPokemon(value, true);
    poke_container.style.display = 'none';
};


const displayAll = (event) => {
    location.reload();
}
const printData = async () => {
	const url = `https://pokeapi.co/api/v2/pokemon/${1}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	const moves = pokemon.moves;
	console.log(pokemon);
	let movesList = []

	for (let index = 0; index < 4; index++) {
		movesList.push(`<p>${moves[index].move.name}</p>`);
	}
	console.log('list -> ', movesList.join(''));
}

printData();


const onHandleSelected = async (idSelected) => {
    console.log(idSelected);
	const url = `https://pokeapi.co/api/v2/pokemon/${idSelected}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	const {id, moves, sprites, name} = pokemon;
	console.log(pokemon);
	let movesList = [];
	for (let index = 0; index < 6; index++) {
		movesList.push(`<p class="moves-item">${moves[index].move.name}</p>`);
	};
	createPokemonModal(name, sprites.front_default, movesList);
    
}
const createPokemonModal = (name, image, movesList) => {
	const modalElement = document.createElement("div");
	const modalInfo = `
		<div class="modal">
			<h1>${name}-moves</h1>
			<div class="modal-info">
				<img src="${image}" />
				<div class="moves">
					${movesList.join(' ')}
				</div>
			</div>
			<button id="close" class="modal-btn" onClick="onHandleClose()">Close</button>
		</div>
	`;
	modalElement.innerHTML = modalInfo;
	modalContainer.appendChild(modalElement);
	modalContainer.style.display = "flex";
	poke_container.style.display = "none";
}

const onHandleClose = () => {
    location.reload();
};

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

const getPokemonImage = (id) => (
	`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
);

const createPokemonCard = async (pokemon, search = false, id) => {
	const pokemonEl = document.createElement('div');
	const poke_types = pokemon.types.map(type => type.type.name);
	const name = pokemon.name;
	const typeSpans = poke_types.map(type => `<p class="type"> ${type} </p> `).join(' ');
	const image = await getPokemonImage(id);
	pokemonEl.classList.add('pokemon', `${poke_types[0]}-color`);
	pokemonEl.addEventListener('click', () => onHandleSelected(pokemon.id));
	const pokeInnerHTML = `
        <div id="${pokemon.id}" class="img-container">
            <img src="${image}" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">
				#${pokemon.id.toString().padStart(3, '0')}
			</span>
            <h3 class="name">${name}</h3>
            <small class="type-container"> <span class="types"> <p>Type: </p>  ${typeSpans} </span> </small>
        </div>

    `;

	pokemonEl.innerHTML = pokeInnerHTML;
	const container = search === true ? search_container : poke_container;
	container.appendChild(pokemonEl);
}

const searchPokemon = async (event) => {
	event.preventDefault();
	const { value } = event.target.pokemon;
	createPokemonModal(value);
};

const onHandleSelected = async (idSelected) => {
	createPokemonModal(idSelected);
}
const createPokemonModal = async (idSelected) => {
	const url = `https://pokeapi.co/api/v2/pokemon/${idSelected}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	const { id, moves, name, types } = pokemon;
	const type = types[0].type.name;
	const image = getPokemonImage(id)
	console.log(pokemon);
	let movesList = [];
	const source = moves.length <= 6 ? moves : moves.slice(0, 5);
	movesList = source.map(({ move }) => {
		return `<p class="moves-item">${move.name}</p>`
	});
	const modalInfo = `
		<style>
			#modal-container {
				width: 100%;
				display: flex;
				justify-content: center;
			}
		</style>
		<div class="modal ${type}-color animate__animated animate__rotateIn">
			<h1>${name}-moves</h1>
			<div class="modal-info">
			<div class="modal-img">
				<img src="${image}" alt="${name}" />
			</div>
				<div class="moves">
					${movesList.join(' ')}
				</div>
			</div>
			<button id="close" class="modal-btn" onClick="onHandleClose()">Close</button>
		</div>
	`;
	modalContainer.innerHTML = modalInfo;
	poke_container.style.display = "none";
}

const onHandleClose = () => {
	location.reload();
};
const displayAll = (event) => {
	location.reload();
}
fetchPokemons();

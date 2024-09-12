const searchButton = document.getElementById("search-button");
const overlay = document.getElementById("modal-overlay");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const movieListContainer = document.getElementById("movie-list");

//let movieList = [];
let movieList = JSON.parse(localStorage.getItem("movieList")) ?? [];
//"?? []"" diz basicamente que se não tiver nenhuma lista no localStorage
//ele usa o cara da direita, no caso uma lista vazia;
//para a página já abrir com o valor mais recente da lista;

const key = "b728e014";

async function searchButtonClickHandler() {
  try{
    let url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}
  `;
  //fetch faz a requisição;
  //await vai esperar a requisição ser feita e o async na function é só para o await funcionar;
  const response = await fetch(url);
  //transforma em json para pegar só os dados necessários
  const data = await response.json();
  console.log(data);
  if(data.Error){
    throw new Error("Filme não encontrado");
  }
  createModal(data);
  overlay.classList.add("open");    
  } catch(error){
    notie.alert({ type: "error" ,text: error.message });
  }
}

function movieNameParameterGenerator(){
  if(movieName.value === ""){
    throw new Error("O nome do filme deve ser informado")
  }
  return movieName.value
    .split(" ")
    .join("+")
}

function movieYearParameterGenerator(){
  if(movieYear.value === ""){
    return "";
  }
  if(Number.isNaN(Number(movieYear.value))){
    throw new Error("Ano do filme inválido")
  }
  return `&y=${movieYear.value}`
}

function addToList(movieObject){
  movieList.push(movieObject);
}
//movieList.push é um método para adicionar elementos;

//verificando se o filme já está na lista;
function isMovieAlreadyOnList(id){
  function  doesThisIdBelongToThisMovie(movieObject){
    return movieObject.imdbID === id;
  }
  return Boolean(movieList.find(doesThisIdBelongToThisMovie));
  //vai retornar como bool pois eu só quero saber se é true or false(está na lista ou não);
}

function updateUI(movieObject){
  movieListContainer.innerHTML += `<article id="movie-card-${movieObject.imdbID}">
  <img src="${movieObject.Poster}" alt="Poster de ${movieObject.Title}">
  <button class="remove-button" onclick="{removeFilmFromList('${movieObject.imdbID}')}"><i class="bi bi-trash"></i>Remover</button>
</article>`;
  //innerHTML é o código HTML que existe no interior do elemento;
  //"67" atribuindo uma função para o botão de remover a partir do onclick=""
  //lembrando que quando eu passei o atributo da função, eu o coloquei entre aspas simples
  //pois já usei aspas duplas na parte externa e para transformar em uma string;
}

function removeFilmFromList(id){
  notie.confirm({
    text: "Deseja remover o filme de sua lista?",
    submitText: "Sim",
    cancelText: "Não",
    position: "top",
    submitCallback: function removeMovie(){
      movieList = movieList.filter((movie) => movie.imdbID !== id);
      //.filter vai basicamente filtrar os elementos de um array de acordo com uma condição;
      //a função está pegando cada filme, e se o id do mesmo for diferente do fornecido ele passa;
      document.getElementById(`movie-card-${id}`).remove()
      //depois de tirar da memória ele tira da página também(visualmente falando);
      updateLocalStorage();
    }
  });
}

function updateLocalStorage(){
  localStorage.setItem("movieList", JSON.stringify(movieList));
}
//Local Storage = Espécie de banco de dados para guardas as informações do navegador, no nosso caso do projeto;
//localStorage.setItem("key", value) vai guardar a nossa lista de filmes dentro do navegador;
//JSON.stringify(movieList) para transformar o objeto em lista de uma forma que dê para ler;

for(const movieInfo of movieList){
  updateUI(movieInfo);
}

searchButton.addEventListener("click", searchButtonClickHandler);

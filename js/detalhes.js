const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const media = params.get('media');

// Ao carregar a pagina executa as funções de buscar os dados
document.addEventListener("DOMContentLoaded", async () => {
    //bsucar filmes
    getMovie();
    toggleLoading();
});

async function getMovie() {
    let movie;
    await fetch(`https://api.themoviedb.org/3/${media}/${id}?language=pt-BR`, options)
        .then(res => res.json())
        .then(res => movie = res)
        .catch(err => console.error(err));
    //console.log(movie);

    //Poster
    document.querySelector('.poster').src = movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'img/no-poster.png';

    //Detalhes do filme
    let detalhes = document.getElementById('detalhes');
    detalhes.innerHTML = `
                <h1 class="fs-1 text-danger">${movie.title ?? movie.name}</h1>
                <h4 class="mb-4 fw-bold">Titulo Original: ${movie.original_title ?? movie.original_name}</h4>
                <p class='mb-3'>Data de Estreia: ${formatDate(movie.release_date ?? movie.last_air_date)}</p>
                <p class='mb-3'>País de Origem: ${movie.origin_country}</p>
                <p class='mb-3'>Popularidade: ${movie.popularity.toFixed()}</p>
                <p class='mb-3'>Status: ${movie.status}</p>
                <p class='mb-3'>${movie.overview}</p>`;
    movie.genres.forEach(genre => {
        detalhes.innerHTML += `<button class="btn btn-lg btn-outline-danger me-2">${genre.name}</button>`
    });

    //Trailer
    let trailer;
    await fetch(`https://api.themoviedb.org/3/${media}/${id}/videos?language=pt-BR`, options)
        .then(res => res.json())
        .then(res => trailer = res.results)
        .catch(err => console.error(err));
    //console.log(trailer);

    let trailerCountainer = document.querySelector('#trailer');
    if (trailer.length > 0) {
        let carousel = document.querySelector('.carousel-inner');
        carousel.innerHTML = '';
        for (let i = 0; i < trailer.length; i++) {
            carousel.innerHTML +=
                `<div class="carousel-item ${i == 0 ? 'active' : ''}">
            <iframe class='rounded-5 d-block' w-100 width="100%" height="500" src="https://www.youtube.com/embed/${trailer[i].key}"></iframe>
            <div class="carousel-caption d-none d-md-block">
                <h5 class="mb-0>${trailer[i].name} - Publicado em : ${formatDate(trailer[i].published_at)}</h5>
            </div>
        </div>`
        }
    } else {
        trailerCountainer.style.display = 'none';
    }

    // Elenco
    let cast = [];
    await fetch(`https://api.themoviedb.org/3/${media}/${id}/credits?language=pt-br`, options)
        .then(res => res.json())
        .then(res => cast = res.cast)
        .catch(err => console.error(err));
    //console.log(cast);

    let castCountainer = document.querySelector('#elenco');
    if (cast.length > 0) {

        castCountainer.innerHTML = '';
        for (let i = 0; i < cast.length; i++) {
            let image = cast[i].profile_path ? `https://image.tmdb.org/t/p/original/${cast[i].profile_path}` : 'img/no-photo-cast.png';
            castCountainer.innerHTML +=
                `<div class="col-lg-4 col-sm-6">
                    <div class="row">
                        <div class="col-sm-6 col-md-4 col-lg-3 mb-3">
                            <a href="pessoa.html?id=${cast[i].id}" class="text-decoration-none text-white">
                                <div class='img-countainer'>
                                    <div class="elenco-img" src="${image}" style="background-image: url('${image}');"></div>
                                </div>
                            </a>
                        </div>
                        <div class="col-sm-6 col-md-8 col-lg-9 mb-3">
                            <a href="pessoa.html?id=${cast.id}" class="text-decoration-none text-white">
                                <h4 class="mb-1">${cast[i].original_name}</h4>
                            </a>
                            <a href="pessoa.html?id=${cast.id}" class="text-decoration-none text-white">
                                <p class="mb-1">${cast[i].character}</p>
                            </a>
                        </div>
                    </div>
                </div>`

        }
    } else {
        castCountainer.parentElement.style.display = 'none';
    }
}
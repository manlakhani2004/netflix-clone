const api_key = "58ec962460523c41b91c7b1d160d9ba8";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgpath = "https://image.tmdb.org/t/p/original";

const apipath = {
    //all category
    fetchallpath: `${apiEndPoint}/genre/movie/list?api_key=${api_key}`,
    //all movie by category
    fetchallmovie: (id) => `${apiEndPoint}/discover/movie?api_key=${api_key}&with_genres=${id}`,
    //trending movie
    fetchTranding: `${apiEndPoint}/trending/all/day?api_key=${api_key}`,
    //search youtube api
    searchonyoutubeapi: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyCv_WcTX4TYv7bdTkjqPDNXHmv_I8Efr2A`
}

window.addEventListener('load', function () {
    console.log('run');
    getAllMovieCategory();
    fetchTrandingmovies();
    // getAllmovies();

})

async function fetchTrandingmovies() {
    await fetch(apipath.fetchTranding)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            console.log(data.results);
            let randomIndex = 1;
            let trdmovie = data.results;
            
            let NoTitleMovieFilter = trdmovie.filter((movie)=>{
                return movie.title
            })
            setInterval(() => {
                randomIndex = Math.floor(Math.random() * NoTitleMovieFilter.length);
                buildtrandingbanner(NoTitleMovieFilter[randomIndex]);
            }, 4000);
        })

        .catch((error)=>
        {
            console.log(error);
        })
}

function buildtrandingbanner(trdmovie) {
    console.log(trdmovie);
    let bannersection = document.querySelector('.banner-section');
    bannersection.innerHTML = "";
    bannersection.style.backgroundImage = `url('${imgpath}${trdmovie.backdrop_path}')`;

    let div = document.createElement('div');

    div.innerHTML = `
    <h1 class="movie-title">${trdmovie.title}</h1>
    <p class="tranding-details">Trending in The Movie | Released on ${trdmovie.release_date}</p>
    <p class="movie-details">${trdmovie.overview && trdmovie.overview.length > 200 ? trdmovie.overview.slice(0, 200).trim() + '...' : trdmovie.overview}</p>

    <div class="action-btn ">
    <button onclick = "searchmovieTailer('${trdmovie.title}')"   class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
            <path
                d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                fill="currentColor" ></path>
        </svg> &nbsp;&nbsp; Play</button>

    <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                fill="currentColor"></path>
        </svg> &nbsp;&nbsp; More Info</button>

    </div>`;

    div.className = "banner-content";
    bannersection.append(div);


}



//get all movie category
async function getAllMovieCategory() {

    await fetch(apipath.fetchallpath)
        .then(res => res.json())
        .then(res => {
            // console.table(res.genres);
            let categories = res.genres;

            if (Array.isArray(categories) && categories.length) {
                categories.forEach((category => {
                    fetchdMovieSelection(apipath.fetchallmovie(category.id), category.name);
                }))

            }
        })
        .catch(error => console.log(error))

}

//  all movie by category
async function fetchdMovieSelection(fetchUrl, category) {
    // console.log(movies,category);
       await fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results);
            let movies = res.results;
            // console.log(movies);
            if (Array.isArray(movies) && movies.length) {
                BuildMoviesSection(movies, category);
            }
        })
}


function BuildMoviesSection(movie_list, cate_name) {

    let movie_cont = document.querySelector('.movie-container');
    // console.log(movie_list,cate_name);

    const imgmoviebanner = movie_list.map((item) => {
        return `<img class="movie-item" src="${imgpath}${item.backdrop_path}" onclick = "searchmovieTailer('${item.title}')" width="300" alt=""> <br>`
    }).join('');
    // console.log(imgmoviebanner);

    const moviesectionHTML = `
    <h1 class="movie-category">${cate_name}<span>Explore All</span></h1>
        <div class="movie-row">
             ${imgmoviebanner}
        </div>
    `;

    // console.log(moviesectionHTML);
    let mydiv = document.createElement('div');
    mydiv.className = 'movie-section';
    mydiv.innerHTML = moviesectionHTML;

    // append child in container 
    movie_cont.append(mydiv);
}


function searchmovieTailer(moviename) {
    fetch(apipath.searchonyoutubeapi(moviename))
        .then(res => res.json())
        .then(res => {
            console.log(res.items[0]);
            // let tailer_info = res.items[0];
            let tailer_link = `https://www.youtube.com/watch?v=${res.items[0].id.videoId}`;
            window.open(tailer_link, '_blank');
        })
}

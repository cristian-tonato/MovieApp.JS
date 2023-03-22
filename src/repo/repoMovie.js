import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import YouTube from "react-youtube";
import styles from "./repo.module.css";
function RepoMovie() {
    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = "7ddf0d9b45b1b0b4d3291fd49e59699a";
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

    // endpoint para las imagenes
    const URL_IMAGE = "https://image.tmdb.org/t/p/original";

    // variables de estado
    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState("");

    const [trailer, setTrailer] = useState(null);
    const [movie, setMovie] = useState({ title: "Loading Movies" });
    const [playing, setPlaying] = useState(false);

    // funcion para realizar la peticion get a la api
    const fetchMovies = async (searchKey) => {
        const type = searchKey ? "search" : "discover";
        const {
            data: { results },
        } = await axios.get(`${API_URL}/${type}/movie`, {
            params: {
                api_key: API_KEY,
                query: searchKey,
            },
        });

        setMovies(results);
        setMovie(results[0]);

        if (results.length) {
            await fetchMovie(results[0].id);
        }
    };

    // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${API_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos",
            },
        });

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(
                (vid) => vid.name === "Official Trailer"
            );
            setTrailer(trailer ? trailer : data.videos.results[0]);
        }
        //return data
        setMovie(data);
    };

    const selectMovie = async (movie) => {
        fetchMovie(movie.id);

        setMovie(movie);
        window.scrollTo(0, 0);
    };

    // funcion para buscar peliculas
    const searchMovies = (e) => {
        e.preventDefault();
        fetchMovies(searchKey);
    };

    useEffect(() => {
        fetchMovies();
    }, []);
    //paginacion
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios
            .get(
                `https://api.themoviedb.org/3/movie/550?api_key=7ddf0d9b45b1b0b4d3291fd49e59699a&page=${currentPage}`
            )
            .then((response) => setData(response.data))
            .catch((error) => console.error(error));
    }, [currentPage]);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    // return (
    //     <div>
    //         <button onClick={prevPage} disabled={currentPage === 1}>
    //             Prev
    //         </button>
    //         <button onClick={nextPage}>Next</button>

    //         {/* render the data... */}
    //     </div>
    // );

    return (
        <div>
            {/* <div className={styles.container_search}>
                <form className={styles.search} onSubmit={searchMovies}>
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="search"
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <button className={styles.search_button} type="submit">
                        Search
                    </button>
                </form>
            </div> */}
            <div>
                <h1 className={styles.thriller_title}>{movie.title}</h1>
            </div>

            <div>
                <main>
                    {movie ? (
                        <div
                            className={styles.thriller}
                            style={{
                                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                            }}
                        >
                            {playing ? (
                                <>
                                    <YouTube
                                        videoId={trailer.key}
                                        className={styles.thriller_reproductor}
                                        containerClassName={
                                            "youtube-container amru"
                                        }
                                        opts={{
                                            width: "100%",
                                            height: "100%",
                                            playerVars: {
                                                autoplay: 1,
                                                controls: 0,
                                                cc_load_policy: 0,
                                                fs: 0,
                                                iv_load_policy: 0,
                                                modestbranding: 0,
                                                rel: 0,
                                                showinfo: 0,
                                            },
                                        }}
                                    />
                                    <button
                                        onClick={() => setPlaying(false)}
                                        className={styles.button}
                                    >
                                        Close
                                    </button>
                                </>
                            ) : (
                                <div
                                    className={styles.container_imgReproductor}
                                >
                                    {/* <h1 className={styles.thriller_title}>
                                        {movie.title}
                                    </h1>{" "}
                                    <h1 className={styles.thriller_title}>
                                        {movie.title}
                                    </h1> */}
                                    <div className="">
                                        {trailer ? (
                                            <button
                                                className={styles.button}
                                                onClick={() => setPlaying(true)}
                                                type="button"
                                            >
                                                Play Trailer
                                            </button>
                                        ) : (
                                            "Sorry, no trailer available"
                                        )}

                                        <p className={styles.thriller_overview}>
                                            {movie.overview}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </main>
            </div>
            <div className={styles.container_search}>
                <form className={styles.search} onSubmit={searchMovies}>
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="search"
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <button className={styles.search_button} type="submit">
                        Search
                    </button>
                </form>
            </div>

            <div className={styles.container_poster}>
                <div className={styles.poster}>
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className={styles.poster_item}
                            onClick={() => selectMovie(movie)}
                        >
                            <h4 className={styles.poster_title}>
                                {movie.title}
                            </h4>
                            <img
                                className={styles.poster_path}
                                src={`${URL_IMAGE + movie.poster_path}`}
                                alt=""
                                height={600}
                                width="100%"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.pages}>
                <button
                    className={styles.button}
                    onClick={prevPage}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <button className={styles.button} onClick={nextPage}>
                    Next
                </button>

                {/* render the data... */}
            </div>
        </div>
    );
}

export default RepoMovie;

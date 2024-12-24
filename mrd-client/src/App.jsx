import React, { useState } from "react";
import Result from "./Result";

const App = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [songData, setSongData] = useState([]);
  const [option, setOption] = useState("select");
  const [genreOption, setGenreOption] = useState()


  function validateInput(event) {
    var regex = /^\d*\.?\d*$/;
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
    }
  }

  const fetchGenre = (genre) => {
    setLoading(true);
    setFormSubmitted(true)
    fetch("http://localhost:8000/genre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genre),
    })
      .then((response) => response.json())
      .then((genreData) => {
        setSongData(genreData);
        setLoading(false);
      });
  };

  function validateInputNegative(event) {
    var regex = /^-?\d*\.?\d*$/;
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(
        /[^0-9.-]|-(?=.*-)|\.(?=.*\.)/g,
        ""
      );
    }
  }

  const fetchData = (songName) => {
    setLoading(true);
    fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_name: songName }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((sData) => {
            setSongData(sData);
            console.log(sData);
            setLoading(false);
          });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const songName = formData.get("songName");
    setFormSubmitted(true);
    fetchData(songName);
  };

  const fetchDataByValue = async (data) => {
    setLoading(true);
    fetch("http://localhost:8000/recommend_by_values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((sData) => {
            setSongData(sData);
            console.log(sData);
            setLoading(false);
          });
      });
  };

  const handleValueSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const allFormData = {};
    const formData = new FormData(event.target);

    for (const [key, value] of formData.entries()) {
      allFormData[key] = value;
    }
    fetchDataByValue(allFormData);
  };

  const handleGenreSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const genre_name = formData.get('genreOption')
    fetchGenre(genre_name)

  }

  const handleSelectChange = (event) => {
    setOption(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenreOption(event.target.value)
  }

  const renderContent = () => {
    switch (option) {
      case "song":
        return (
          <div className="w-full flex items-center justify-center h-[5rem]">
            <form
              onSubmit={handleSubmit}
              action=""
              method="post"
              className="w-full flex max-sm:flex-col items-center justify-center"
            >
              <input
                type="text"
                name="songName"
                className={`input max-sm:mb-3 input-bordered max-sm:input-md border-2 max-sm:border-1 tracking-wider text-primary focus:outline-none input-primary w-full rounded-xl placeholder:text-primary`}
                placeholder="Enter a song name to get the similar music"
                minLength={3}
                required
              />
              <button
                type="submit"
                className={`btn max-sm:w-full btn-primary rounded-2xl sm:ml-3`}
              >
                Search
              </button>
            </form>
          </div>
        );
      case "value":
        return (
          <div className="collapse bg-base-200 hover:outline hover:outline-1 hover:outline-primary mb-2">
            <input type="checkbox" />
            <div className="collapse-title">
              Click to Show/Hide Query Values
            </div>
            <div className="collapse-content">
              <form
                className="grid gap-3 grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                action=""
                method="post"
                onSubmit={handleValueSubmit}
              >
                <input
                  type="number"
                  required
                  name="danceability"
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  onInput={validateInput}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Danceability (0.0 to 1.0)"
                />
                <input
                  type="number"
                  required
                  name="energy"
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  onInput={validateInput}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Energy (0.0 to 1.0)"
                />
                <input
                  type="number"
                  required
                  name="loudness"
                  min={-49.5}
                  max={4.5}
                  step={0.001}
                  onInput={validateInputNegative}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Loudness(dB) (-49.5 to 4.5)"
                />
                <input
                  type="number"
                  required
                  name="speechiness"
                  onInput={validateInput}
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Speechiness (0.0 to 1.0)"
                />
                <input
                  type="number"
                  required
                  name="acousticness"
                  onInput={validateInput}
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Acousticness (0.0 to 1.0)"
                />
                <input
                  type="number"
                  required
                  name="instrumentalness"
                  onInput={validateInput}
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Instrumentalness (0.0 to 1.0)"
                />
                <input
                  type="number"
                  required
                  name="liveness"
                  onInput={validateInput}
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Liveness (0.0 to 1.0)"
                />
                <input
                  type="number"
                  required
                  name="valence"
                  onInput={validateInput}
                  min={0.000}
                  max={1.000}
                  step={0.001}
                  className="input input-sm focus:outline-1 max-sm:text-xs input-primary text-primary placeholder:text-primary"
                  placeholder="Valence (0.0 to 1.0)"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-outline btn-secondary btn-sm"
                >
                  Reset
                </button>
              </form>
            </div>
          </div>
        );
      case "genre":
        const genres = ['acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
        'anime', 'black-metal', 'bluegrass', 'blues', 'brazil',
        'breakbeat', 'british', 'cantopop', 'chicago-house', 'children',
        'chill', 'classical', 'club', 'comedy', 'country', 'dance',
        'dancehall', 'death-metal', 'deep-house', 'detroit-techno',
        'disco', 'disney', 'drum-and-bass', 'dub', 'dubstep', 'edm',
        'electro', 'electronic', 'emo', 'folk', 'forro', 'french', 'funk',
        'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove',
        'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle',
        'heavy-metal', 'hip-hop', 'honky-tonk', 'house', 'idm', 'indian',
        'indie-pop', 'indie', 'industrial', 'iranian', 'j-dance', 'j-idol',
        'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino',
        'malay', 'mandopop', 'metal', 'metalcore', 'minimal-techno', 'mpb',
        'new-age', 'opera', 'pagode', 'party', 'piano', 'pop-film', 'pop',
        'power-pop', 'progressive-house', 'psych-rock', 'punk-rock',
        'punk', 'r-n-b', 'reggae', 'reggaeton', 'rock-n-roll', 'rock',
        'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo',
        'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'soul',
        'spanish', 'study', 'swedish', 'synth-pop', 'tango', 'techno',
        'trance', 'trip-hop', 'turkish', 'world-music']
        return (
          <div className="w-full mb-3">
            <form
              onSubmit={handleGenreSubmit}
              className="flex gap-4"
              action=""
              method="post"
            >
              <select
                value={genreOption}
                onChange={handleGenreChange}
                className="select select-primary w-full"
                name="genreOption"
              >
                <option disabled defaultValue={true}>
                  --select--
                </option>
                {genres.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary " type="submit">
                Search
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <div
      className={
        "w-screen dark:bg-black h-screen flex flex-col px-[5rem] max-sm:px-[1rem]"
      }
    >
      <h1
        className={` my-4 max-sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-secondary from-10% to-primary to-50% ${
          formSubmitted ? "mb-[0rem]" : ""
        } w-full text-4xl text-primary font-bold tracking-wider`}
      >
        Music Recommendation System
      </h1>
      <>
        <div className="flex w-full gap-3">
          <select
            value={option}
            onChange={handleSelectChange}
            className="select select-primary w-[12rem] my-2"
          >
            <option disabled defaultValue={true} value="select">
              --Select--
            </option>
            <option value="song">Based on Song</option>
            <option value="value">Based on Values</option>
            <option value="genre">Based on Genre</option>
          </select>
          <div className="w-full h-full flex items-center">
          <h1 className="text-ellipsis font-medium">This System is capable to recommend songs by their <span className="text-secondary">name</span> or <span className="text-secondary">music properties</span> (values)</h1>
          </div>
        </div>
        <div className={`w-full flex items-center justify-center`}>
          {renderContent()}
        </div>
        {formSubmitted && (
          <div
            className={`w-full overflow-y-scroll p-2 h-full ${
              isLoading ? "animate-pulse" : ""
            } rounded-xl bg-slate-800`}
          >
            {songData.map((song, index) => (
              <Result key={index} {...song} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default App;

import routes from "../routes";
import movieData from "../data/movieData.json";

export const home = (req, res) => {
  //console.log(req);
  res.render("home");
};

export const getMovieListByState = (req, res) => {
  console.log(req.query.state);
  const selectState = req.query.state;
  console.log(selectState);
  console.log(movieData["대한민국"][`${selectState}`]);
  const data = {
    state: selectState,
    movieList: movieData["대한민국"][`${selectState}`],
  };

  res.send(data);
};

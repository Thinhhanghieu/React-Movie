import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import tmdbApi, { category, movieType, tvType } from "../../api/tmdbApi";
import Button, { OutlineButton } from "../button/Button";
import MovieCard from "../movie-card/MovieCard";
import Input from "../input/Input";
import "./movie-grid.scss";

const MovieGrid = props => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [toltalPage, setToltalPage] = useState(0);
  const { keyword } = useParams();
  console.log(keyword);
  useEffect(() => {
    const getList = async () => {
      let response = null;
      if (keyword === undefined) {
        const params = {};
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMoviesList(movieType.upcoming, {
              params,
            });
            break;
          default:
            response = await tmdbApi.getTvList(tvType.popular, { params });
        }
      } else {
        const params = {
          query: keyword,
        };
        response = await tmdbApi.search(props.category, { params });
      }
      setItems(response.results);
      setToltalPage(response.total_pages);
    };
    getList();
  }, [props.category, keyword]);

  const loadmore = async () => {
    let response = null;
    if (keyword === undefined) {
      const params = { page: page + 1 };
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(movieType.upcoming, {
            params,
          });
          break;
        default:
          response = await tmdbApi.getTvList(tvType.popular, { params });
      }
    } else {
      const params = {
        page: page + 1,
        query: keyword,
      };
      response = await tmdbApi.search(props.category, { params });
    }
    console.log(response);
    setItems([...items, ...response.results]);
    console.log(...response.results);
    setPage(page + 1);
  };
  return (
    <>
      <div className="section mb-3">
        <MovieSearch category={props.category} keyword={keyword}></MovieSearch>
      </div>
      <div className="movie-grid">
        {items.map((item, i) => (
          <MovieCard category={props.category} item={item} key={i} />
        ))}
      </div>
      {page < toltalPage ? (
        <div className="movie-grid__loadmore">
          <OutlineButton className="small" onClick={loadmore}>
            Load more
          </OutlineButton>
        </div>
      ) : null}
    </>
  );
};

const MovieSearch = props => {
  const history = useHistory();
  const [keyword, setKeyword] = useState(props.keyword ? props.keyword : "");
  console.log(props);
  const goToSearch = useCallback(() => {
    if (keyword.trim().length > 0) {
      history.push(`${category[props.category]}/search/${keyword}`);
    }
  }, [keyword, props.category, history]);

  useEffect(() => {
    const enterEvent = e => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [keyword, goToSearch]);
  return (
    <div className="movie-search">
      <Input
        type="text"
        placeholder="Enter keyword "
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      ></Input>
      <Button className="small" onClick={goToSearch}>
        Search
      </Button>
    </div>
  );
};

export default MovieGrid;

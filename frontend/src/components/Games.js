import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, ListItem } from "@material-ui/core";
import { loadGames } from "../actions/gameActions";
import { Link } from "react-router-dom";

const Games = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadGames());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const games = useSelector((state) => state.games.games);
  return games.length ? (
    <List>
      {games.map((game) => {
        return (
          <ListItem key={game.id}>
            <Link to={`/game/${game.id}`}>{game.name}</Link>
          </ListItem>
        );
      })}
    </List>
  ) : (
    <div>No games yet, create a new one</div>
  );
};

export default Games;

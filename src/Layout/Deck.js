// Deck	/decks/:deckId	Shows all of the information about a specified deck with options to edit or add cards to the deck, navigate to the study screen, or delete the deck
import React, { useEffect, useState } from "react";
import { useParams, useRouteMatch, Link, useHistory } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api";

export default function Deck() {
  const [deck, setDeck] = useState({
    id: -1,
    name: "error2",
    description: "error2",
    cards: [],
  });
  const { url } = useRouteMatch();
  const { deckId } = useParams();
  const parsedDeckId = parseInt(deckId);
  const history = useHistory();

  const fetchDeck = () => readDeck(parsedDeckId).then((data) => setDeck(data));

  const handleDeleteDeckButton = (id) => {
    if (
      window.confirm("Delete this deck?\n\nYou will not be able to recover it.")
    ) {
      deleteDeck(id).then(() => history.push("/"));
    }
  };

  const handleDeleteCardButton = (id) => {
    if (
      window.confirm("Delete this card?\n\nYou will not be able to recover it.")
    ) {
      deleteCard(id).then(fetchDeck);
    }
  };

  useEffect(fetchDeck, []);

  return (
    <div className="deck">
      <h3>{`${deck.name}`}</h3>
      <p>{`${deck.description}`}</p>
      <div className="button-row">
        <Link to={`${url}/edit`} className="btn btn-secondary">
          📝 Edit
        </Link>
        <Link to={`${url}/study`} className="btn btn-primary mx-2">
          📖 Study
        </Link>
        <Link to={`${url}/cards/new`} className="btn btn-primary">
          ✚ Add Cards
        </Link>
        <button
          onClick={() => handleDeleteDeckButton(parsedDeckId)}
          className="btn btn-danger float-right"
        >
          🗑️ Delete
        </button>
      </div>
      <h2 className="mt-4">Cards</h2>
      {deck.cards.map((card, index) => (
        <div className="card" key={index}>
          <div className="row">
            <div className="col-6">
              <div className="left-column m-2">{card.front}</div>
            </div>
            <div className="col-6">
              <div className="right-column m-2">{card.back}</div>
              <button
                onClick={() => handleDeleteCardButton(card.id)}
                className="btn btn-danger float-right m-2"
              >
                🗑️ Delete
              </button>

              <Link
                to={`${url}/cards/${card.id}/edit`}
                className="btn btn-secondary float-right my-2"
              >
                📝 Edit
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

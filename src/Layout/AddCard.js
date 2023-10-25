// Add Card	/decks/:deckId/cards/new	Allows the user to add a new card to an existing deck

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck, createCard } from "../utils/api";

const AddCard = () => {
  const [deckName, setDeckName] = useState("");
  const [frontSide, setFrontSide] = useState("");
  const [backSide, setBackSide] = useState("");
  const { deckId } = useParams();
  const parsedDeckId = parseInt(deckId);

  useEffect(
    () => readDeck(parsedDeckId).then((deck) => setDeckName(deck.name)),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCard = {
      front: frontSide,
      back: backSide,
    };
    createCard(parsedDeckId, newCard);

    setFrontSide("");
    setBackSide("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{`${deckName}: Add Card`}</h2>
      <h5>Front</h5>
      <textarea
        value={frontSide}
        onChange={(e) => setFrontSide(e.target.value)}
        placeholder="Front side of card"
        style={{ width: "100%" }}
      />
      <h5 className="mt-2">Back</h5>
      <textarea
        value={backSide}
        onChange={(e) => setBackSide(e.target.value)}
        placeholder="Back side of card"
        style={{ width: "100%" }}
      />
      <div className="mt-2">
        <Link to={`/decks/${deckId}`} className="btn btn-secondary">
          Done
        </Link>
        <button type="submit" className="btn btn-primary mx-2">
          Save
        </button>
      </div>
    </form>
  );
};

export default AddCard;

// Edit Card	/decks/:deckId/cards/:cardId/edit	Allows the user to modify information on an existing card
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { readCard, updateCard } from "../utils/api";

export default function EditCard() {
  const [frontSide, setFrontSide] = useState("");
  const [backSide, setBackSide] = useState("");
  const { cardId, deckId } = useParams();
  const parsedCardId = parseInt(cardId);
  const parsedDeckId = parseInt(deckId);
  const history = useHistory();

  useEffect(() => {
    readCard(parsedCardId).then((card) => {
      setFrontSide(card.front);
      setBackSide(card.back);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCard = {
      id: parsedCardId,
      front: frontSide,
      back: backSide,
      deckId: parsedDeckId,
    };
    updateCard(newCard).then(() => {
      setFrontSide("");
      setBackSide("");

      history.push(`/decks/${parsedDeckId}`);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Card</h2>
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
        <Link
          to={`/decks/${deckId}`}
          type="cancel"
          className="btn btn-secondary"
        >
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary mx-2">
          Submit
        </button>
      </div>
    </form>
  );
}

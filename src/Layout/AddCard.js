// Add Card	/decks/:deckId/cards/new	Allows the user to add a new card to an existing deck

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck, createCard } from "../utils/api";
import CardForm from "./CardForm";

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
    <CardForm
      handleSubmit={handleSubmit}
      heading={`${deckName}: Add Card`}
      frontSide={frontSide}
      setFrontSide={setFrontSide}
      backSide={backSide}
      setBackSide={setBackSide}
      deckId={deckId}
    />
  );
};

export default AddCard;

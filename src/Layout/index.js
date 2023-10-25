import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useParams,
} from "react-router-dom";
import { listDecks, createDeck, readDeck } from "../utils/api";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home";
import Study from "./Study";
import CreateDeck from "./CreateDeck";
import Deck from "./Deck";
import EditDeck from "./EditDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";
import Breadcrumb from "./Breadcrumb";

function Layout() {
  const { path } = useRouteMatch();
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const location = useLocation();
  const { deckId } = useParams();
  const parsedDeckId = parseInt(deckId);

  // Breadcrumbs
  useEffect(() => {
    // readDeck(parsedDeckId).then((deck) => {
    const path = location.pathname;
    const pathParts = path.split("/").filter((part) => part !== "");

    // Initialize breadcrumb trail with "Home" for the root route
    let breadcrumbTrail = [{ url: "/", label: " 🏠 Home" }];

    // Create an array of breadcrumb objects based on the route
    let cardId;

    if (pathParts.length > 0) {
      breadcrumbTrail = breadcrumbTrail.concat(
        pathParts.map((part, index) => {
          // Customize breadcrumb labels based on the route
          let label = part;

          part = !isNaN(parseInt(part)) ? "id" : part;
          const id = parseInt(part);
          // const deck = readDeck(id);

          switch (part) {
            case "decks":
            case "cards":
              return undefined;
            case "new":
              label = "Add Card";
              break;
            case "id":
              if (index === 1) {
                label = "deck.name";
              } else if (index === 3) {
                cardId = part;
                return undefined;
              }
              break;
            case "study":
              label = "Study";
              break;
            case "edit":
              label = index === 4 ? `Edit Card ${cardId}` : "Edit";
              break;
            default:
              label = "WHO DUN THIS?";
              break;
          }
          return {
            url: `/${pathParts.slice(0, index + 1).join("/")}`,
            label,
          };
        })
      );
    }

    setBreadcrumbs(breadcrumbTrail);
    // });
  }, [location.pathname]);

  const handleCreateDeck = (deck) => {
    createDeck(deck).then((deckWithId) => setDecks([...decks, deckWithId]));
    setDecks([...decks, deck]);
  };

  const handleDeleteDeck = (id) => {
    setDecks(decks.filter((deck) => deck.id !== id));
    setCards(cards.filter((card) => card.deckId !== id));
  };

  const handleEditDeck = (newDeck) => {
    const updatedDecks = decks.map((deck) =>
      deck.id === newDeck.id ? newDeck : deck
    );
    setDecks(updatedDecks);
  };

  const handleCreateCard = (card) => {
    setCards([...cards, card]);
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleEditCard = (newCard) => {
    const updatedCards = cards.map((card) =>
      card.id === newCard.id ? newCard : card
    );
    setCards(updatedCards);
  };

  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Switch>
          <Route exact path={`${path}`}>
            <Home />
          </Route>
          <Route path={`${path}decks/new`}>
            <CreateDeck />
          </Route>
          <Route path={`${path}decks/:deckId/study`}>
            <Study />
          </Route>
          <Route path={`${path}decks/:deckId/edit`}>
            <EditDeck />
          </Route>
          <Route path={`${path}decks/:deckId/cards/:cardId/edit`}>
            <EditCard />
          </Route>
          <Route path={`${path}decks/:deckId/cards/new`}>
            <AddCard />
          </Route>
          <Route path={`${path}decks/:deckId`}>
            <Deck />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default Layout;

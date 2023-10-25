import React, { useState, useEffect } from "react";
import { Switch, Route, useRouteMatch, useLocation } from "react-router-dom";
import { readDeck } from "../utils/api";
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
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const location = useLocation();

  // Breadcrumbs
  useEffect(() => {
    const buildBreadcrumbs = async () => {
      const path = location.pathname;
      const pathParts = path.split("/").filter((part) => part !== "");

      let breadcrumbTrail = [{ url: "/", label: " 🏠 Home" }];

      let cardId;
      if (pathParts.length > 0) {
        breadcrumbTrail = breadcrumbTrail.concat(
          await Promise.all(
            pathParts.map(async (part, index) => {
              let label = part;
              const id = parseInt(part);
              part = !isNaN(id) ? "id" : part;
              let deck;
              if (id && index === 1) {
                try {
                  deck = await readDeck(id);
                } catch (e) {
                  console.log(e);
                }
              }

              switch (part) {
                case "decks":
                case "cards":
                  return undefined;
                case "new":
                  if (index === 1) {
                    label = "Create Deck";
                  } else {
                    label = "Add Card";
                  }
                  break;
                case "id":
                  if (index === 1) {
                    label = deck.name;
                  } else if (index === 3) {
                    cardId = id;
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
          )
        );
      }

      setBreadcrumbs(breadcrumbTrail);
    };

    buildBreadcrumbs();
  }, [location.pathname]);

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

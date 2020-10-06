import { Card } from "../../../components/type";

export const gameTestData = {
  playerCards: [
    Card.defuse,
    Card.common1,
    Card.common1,
    Card.common2,
    Card.common2,
    Card.common2,
    Card.common3,
    Card.common4,
    Card.common5,
    Card.attack,
    Card.favor,
    Card.nope,
    Card.seeTheFuture,
    Card.shuffle,
    Card.skip,
  ],
  seeTheFutureCards: [Card.attack, Card.defuse, Card.nope],
  latestUsedCard: Card.defuse,
  users: [
    { name: "Player 2", numberOfCards: 5 },
    { name: "Player 3", numberOfCards: 7 },
    { name: "Player 4", numberOfCards: 2 },
    { name: "Player 5", numberOfCards: 2 },
  ],
};

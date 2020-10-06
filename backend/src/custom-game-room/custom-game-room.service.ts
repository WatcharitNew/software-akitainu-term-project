import { Injectable } from '@nestjs/common';
import { NewUserJoinCustomRoomDto, Card } from './custom-game-room.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from 'src/entities/user.entity';

const mockUsers = { '1': 'test1', '2': 'test2', '3': 'test3' };

@Injectable()
export class CustomGameRoomService {
  // constructor(
  //   @InjectRepository(User)
  //   private readonly userRepository: Repository<User>,
  // ) {}

  listRoom = {};
  cardName = {
    explodingPuppy: 'ExplodingPuppy', // Die if not have defuse
    defuse: 'defuse', // Use to prevent exploding puppy
    nope: 'nope', // Use to stop any action except explodingPuppy and defuse
    attack: 'attack', // Force next player to play 2 turns, can stack e.g. 4, 6, 8, ... turns
    skip: 'skip', // Immediately end your turn without drawing a card
    favor: 'favor', // Force any other player to give you 1 card from their hand
    seeTheFuture: 'seeTheFuture', // Privately view the top 3 cards from the Draw Pile
    common1: 'Common1',
    common2: 'Common2',
    common3: 'Common3',
    common4: 'Common4',
    common5: 'Common5',
  };

  allCards = {
    explodingPuppy: 4,
    defuse: 6,
    nope: 5,
    attack: 4,
    skip: 4,
    favor: 4,
    shuffle: 4,
    seeTheFuture: 5,
    common1: 4,
    common2: 4,
    common3: 4,
    common4: 4,
    common5: 4,
  };

  deck = [];

  async createCustomRoom(userId: string) {
    // const roomId = (Math.random() * 999999).toString().substr(-6);
    const roomId = "100001";
    this.listRoom[roomId] = {};
    const usersId: string[] = [userId];
    this.listRoom[roomId]['usersId'] = usersId;

    console.log('[AllCustomRooms] :\t', this.listRoom);
    return roomId;
  }

  async getJoinedUserName(userId: string) {
    return mockUsers[userId];
  }

  async joinCustomRoom(newUserJoinRoom: NewUserJoinCustomRoomDto) {
    const { userId, roomId } = newUserJoinRoom;
    this.listRoom[roomId]['usersId'].push(userId);

    const usersName = [];

    await this.listRoom[roomId]['usersId'].map(async userId =>
      usersName.push(await this.getJoinedUserName(userId)),
    );

    console.log('usersName: ', usersName);

    const allUsersTnRoom = {
      usersId: this.listRoom[roomId]['usersId'],
      usersName,
    };

    console.log('[AllCustomRooms] :\t', this.listRoom);
    return allUsersTnRoom;
  }

  async shuffle(array: string[]) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async initializeDeck(roomId: string) {
    const userNumber = this.listRoom[roomId]['usersId'].length;

    this.allCards = {
      explodingPuppy: userNumber - 1,
      defuse: 0,
      nope: 5,
      attack: 4,
      skip: 4,
      favor: 4,
      shuffle: 4,
      seeTheFuture: 5,
      common1: 4,
      common2: 4,
      common3: 4,
      common4: 4,
      common5: 4,
    };
    let deck = [];
    for (const cardType in this.allCards) {
      deck.push(...Array(this.allCards[cardType]).fill(Card[cardType]));
    }

    deck = await this.shuffle(deck);
    console.log('after deck: ', deck);

    this.listRoom[roomId]['usersCard'] = {};
    for (let j = 0; j < userNumber; j++) {
      this.listRoom[roomId]['usersCard'][j] = [];
      for (let i = 0; i < 7; i++) {
        this.listRoom[roomId]['usersCard'][j].push(deck[userNumber * i + j]);
      }
      this.listRoom[roomId]['usersCard'][j].push('defuse');
    }

    this.listRoom[roomId]['nextUserIndex'] = 0;
    this.listRoom[roomId]['nextTurnLeft'] = 1;

    deck = deck.slice(userNumber * 7);

    deck.push(...Array(userNumber === 5 ? 1 : 2).fill('defuse'));
    deck = await this.shuffle(deck);
    this.listRoom[roomId]['deck'] = deck;

    const newGame = {
      roomId,
      leftCardNumber: deck.length,
      usersId: this.listRoom[roomId]['usersId'],
      usersCard: this.listRoom[roomId]['usersCard'],
    };

    console.log('newGame: ', newGame);

    return newGame;
  }

  async drawCard(userId: string, roomId: string) {
    const usersId = this.listRoom[roomId]['usersId'];
    let nextUserIndex = this.listRoom[roomId]['nextUserIndex'];
    const card = this.listRoom[roomId]['deck'].shift();
    const leftCardNumber = this.listRoom[roomId]['deck'].length;
    let nextTurnLeft = this.listRoom[roomId]['nextTurnLeft'] - 1;

    nextUserIndex =
      nextTurnLeft === 0 ? (nextUserIndex + 1) % usersId.length : nextUserIndex;
    nextTurnLeft = nextTurnLeft === 0 ? 1 : nextTurnLeft;
    this.listRoom[roomId]['nextUserIndex'] = nextUserIndex;
    this.listRoom[roomId]['nextTurnLeft'] = nextTurnLeft;

    const newCard = {
      userId,
      roomId,
      card,
      leftCardNumber,
      nextUserId: usersId[nextUserIndex],
      nextTurnLeft: nextTurnLeft,
    };
    return newCard;
  }

  async useCard(userId: string, roomId: string, card: string, cardIdx: number) {
    const newCardUse = {
      userId,
      roomId,
      card,
      cardIdx,
      nextUserId: this.listRoom[roomId]['usersId'][
        this.listRoom[roomId]['nextUserIndex']
      ],
      nextTurnLeft: this.listRoom[roomId]['nextTurnLeft'],
    };
    return newCardUse;
  }

  async seeTheFuture(userId: string, roomId: string) {
    const cards = this.listRoom[roomId]['deck'].slice(0, 3);
    const newSeeTheFuture = {
      userId,
      roomId,
      cards,
    };
    return newSeeTheFuture;
  }
}
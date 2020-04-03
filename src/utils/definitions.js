import { nanoid } from 'nanoid'

const localStorageKey = '_scrum-poker-online-userName'

/**
 * Crea un objeto para guardar en localStorage
 * @param userName {String}
 * @returns {{createdAt: number, userName: String, userId: String, updatedAt: number}}
 */
const createUserModel = (userName) => {
  const now = Date.now()

  return {
    id: nanoid(20),
    name: userName,
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Modelo para crear una sala con un usuario
 * @param room {Object}
 * @param user {Object}
 * @returns {{mode: String, createdAt: Number, name: String, users: [*], updatedAt: Number}}
 */
const createRoomModel = (room, user) => {
  const now = Date.now()
  return {
    name: room.name,
    mode: room.mode,
    users: [user],
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Nombres de los posibles Set de cartas
 * @type {{fibonacci: string, decimal: string}}
 */
const cardSetNames = {
  fibonacci: 'fibonacci',
  decimal: 'decimal'
}

/**
 * Posibles formatos de cartas
 * @type {{fibonacci: {values: (number|string)[], name: string}, decimal: {values: number[], name: string}}}
 */
const cardSets = {
  fibonacci: {
    name: cardSetNames.fibonacci,
    values: [1, 2, 3, 5, 8, 13, 20, 40, 100, '?']
  },
  decimal: {
    name: cardSetNames.decimal,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
}

const currentCardSet = (cardSet) => {
  return cardSets[cardSet]
}

export {
  localStorageKey,
  createUserModel,
  createRoomModel,
  cardSets,
  currentCardSet
}

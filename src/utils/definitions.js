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
    userId: nanoid(20),
    userName: userName,
    createdAt: now,
    updatedAt: now
  }
}

/**
 * Modelo para crear una sala con un usuario
 * @param roomName {String}
 * @param userName {String}
 * @param mode {String} Nombre del modo
 * @returns {{createdAt: number, users: ([]|*[]), roomName: String, updatedAt: number}}
 */
const createRoomModel = ({ roomName, userName, mode }) => {
  const now = Date.now()
  return {
    roomName,
    mode,
    users: createUserModel(userName),
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

export {
  localStorageKey,
  createUserModel,
  createRoomModel,
  cardSets
}

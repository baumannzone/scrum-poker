import names from '@/utils/names'
const name1 = names.names1
const name2 = names.names2

const capFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const generateName = () => {
  const n1 = name1[getRandomInt(0, name1.length + 1)]
  const n2 = name2[getRandomInt(0, name2.length + 1)]
  return capFirst(n1) + ' ' + capFirst(n2)
}

export default {
  methods: {
    generateName () {
      return generateName()
    }
  }
}

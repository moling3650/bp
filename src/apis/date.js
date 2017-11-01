const getLocaleDateJSON = (date) => {
  date = date ? (new Date(date)) : (new Date())
  const timeOffset = date.getTimezoneOffset() * -60000
  return new Date(date.getTime() + timeOffset).toJSON()
}

export default getLocaleDateJSON

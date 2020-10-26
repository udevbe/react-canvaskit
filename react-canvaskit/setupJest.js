// adds the 'fetchMock' global variable and rewires 'fetch' global to call 'fetchMock' instead of the real implementation
const fs = require('fs')

require('jest-fetch-mock').enableMocks()

// const canvaskitWasm = fs.readFileSync('./test/resources/canvaskit.wasm')
const robotoFont = fs.readFileSync('./test/resources/Roboto-Regular.ttf')
const notoColor = fs.readFileSync('./test/resources/NotoColorEmoji.ttf')

fetchMock.mockResponse(async req => {
  if (req.url.endsWith('/Roboto-Regular.ttf')) {
    return new Response(robotoFont)
  } else if (req.url.endsWith('/NotoColorEmoji.ttf')) {
    return new Response(notoColor)
  } else {
    throw new Error('Unmocked url.')
  }
})

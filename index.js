const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('<p>hello test</p>')
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

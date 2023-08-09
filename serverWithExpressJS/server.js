import express from 'express'
import fs from 'fs'

const app = express();

const port = 8000;

const tourJason = fs.readFileSync('./tour.json', 'utf-8')
const parsedJson = JSON.parse(tourJason);
// console.log(parsedJson);

app.get('/api/v1/tour', (req, res) => {
    res.status(200).json({
        status: 'success',
        result: parsedJson.data.length,
        data: parsedJson
    })
})
app.get('/api/v1/tour/:id', (req, res) => {
    // console.log(req.params)
    const reqParamIdInNumber = +(req.params.id)
    // console.log(reqParamIdInNumber, '==>> reqParamIdInNumber')
    // console.log(typeof reqParamIdInNumber, '==>>type of reqParamIdInNumber')
    if (reqParamIdInNumber > parsedJson.data.length) {
       return res.status(404).send(`Data not found`)
    }

    const idFillteredData = parsedJson?.data?.find(tour => tour.id == reqParamIdInNumber)
    console.log(idFillteredData)
    res.status(200).json({
        status: 'success',
        data: idFillteredData
    })


})

app.listen(port, () => {
    console.log(`listening to the server at port number: ${port}`)
})
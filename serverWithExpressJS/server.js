import express, { json } from 'express'
import fs from 'fs'

const app = express();

const port = 8000;

const tourJason = fs.readFileSync('./tour.json', 'utf-8')
const parsedJson = JSON.parse(tourJason);
// console.log(parsedJson);

app.use(express.json())

app.get('/api/v1/tour', (req, res) => {
    res.status(200).json({
        status: 'success',
        result: parsedJson.data.length,
        data: parsedJson
    })
})
app.get('/api/v1/tour/:id', (req, res) => {
    const reqParamIdInNumber = +(req.params.id)
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
app.post('/api/v1/tour', (req, res) => {
   console.log(parsedJson.data.length, '==>> data length')
   console.log(req.body);
    if (!req.body.destinationName || !req.body.country || !req.body.price || !req.body.tourCapacity || !req.body.departure || !req.body.arrival || !req.body.transport){
        res.status(400).json({
            status: 'failed',
            data: 'missing fields'
        })
    } else{
        const dataToStoreInDb = {
            id: parsedJson.data.length + 1,
            ...req.body
        }

        parsedJson.data.push(dataToStoreInDb)

        fs.writeFile('./tour.json', JSON.stringify(parsedJson), ()=>{
            res.status(200).json({
                status: 'success',
                data: "Data added successfully"
            })
        })
    }

})
app.delete('/api/v1/tour/:id', (req, res) => {
    // console.log('delete api working')
    const fillterData = parsedJson.data.filter((tour)=> tour.id != +(req.params.id))
    // console.log(fillterData)
    parsedJson.data = fillterData
    fs.writeFile('./tour.json', JSON.stringify(parsedJson), () => {
        res.status(200).json({
            status: 'success',
            data: "Data deleted successfully"
        })
    })

})
app.put('/api/v1/tour/:id', (req, res) => {
//    console.log("put api working");
    const reqParamIdInNumber = +(req.params.id)
    
    let indexNumber;
    parsedJson.data.forEach((tour, idx)=>{
        if(tour.id == reqParamIdInNumber){
            indexNumber = idx
        }
    })
    // console.log(indexNumber, '==> indexNumber')
    parsedJson.data.splice(indexNumber, 1, req.body)
    // console.log(parsedJson.data)
    fs.writeFile('./tour.json', JSON.stringify(parsedJson), () => {
        res.status(200).json({
            status: 'success',
            data: "Data updated successfully"
        })
    })

})


app.listen(port, () => {
    console.log(`listening to the server at port number: ${port}`)
})
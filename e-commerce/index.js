import express from 'express'
import bootstrap from './src/bootstrap.js'
import dotenv from 'dotenv'
import createInvoice from './src/utils/createPdf.js'
const app = express()
dotenv.config()
const port = +process.env.PORT
bootstrap( app, express)

// const invoice = {
//   shipping: {
//     name: "Ahmed Hesham",
//     address: "3 Fareed simaka",
//     city: "Cairo",
//     state: "EA",
//     country: "EG",
//     postal_code: 94110
//   },
//   items: [
//     {
//       item: "Course",
//       description: "Back-end (node.js)",
//       quantity: 1,
//       amount: 6000
//     },
//     {
//       item: "Course",
//       description: "Front-end(php)",
//       quantity: 1,
//       amount: 2000
//     }
//   ],
//   subtotal: 8000,
//   paid: 0,
//   invoice_nr: 1234
// };

// createInvoice(invoice, "invoice.pdf");


app.listen(port,() => console.log(`Example app listing on port ${port}!`))
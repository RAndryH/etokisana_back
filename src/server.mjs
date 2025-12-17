import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import userRouter from './routers/user.router';
import productRouter from './routers/product.router';
import siteRouter from './routers/site.router';
import categoryRouter from './routers/category.router';
import { dbConnect } from './configs/database.config';
dbConnect();


const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended : true}));

app.use(cors({
    // credentials:true,
    // origin:["http://localhost:4200"]
}));

app.use("/api/users", userRouter);
app.use("/api/product",productRouter)
app.use("/api/site", siteRouter);
app.use("/api/category", categoryRouter);
// app.use("/api/bon-sorties", bonSortiesRouter);

const port = 443;
app.listen(port, () =>{
    // console.log("Website served on http://ids-gescom.onrender.com:" + port);
    console.log("Website served on http://localhost:" + port);
})
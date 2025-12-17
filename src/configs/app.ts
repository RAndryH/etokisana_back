import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRouter from "../routers/user.router";
import siteRouter from "../routers/site.router";
import productRouter from "../routers/product.router";
import categoryRouter from "../routers/category.router";
import notificationRouter from "../routers/notification.router";
import { LIMIT, PORT_DEV } from '../Utils/constant/constant';

class Server {
    private app = express();

    constructor() {
        this.appUse();
    }

    private appUse() {
        this.app.use(express.json({ limit: `${LIMIT}` }));
        this.app.use(express.urlencoded({ limit: `${LIMIT}`, extended: true }));
        this.app.use(cors());
        this.app.use(fileUpload());
        this.app.use('/uploads', express.static('uploads'));

        this.app.use("/api/users", userRouter);
        this.app.use("/api/site", siteRouter)
        this.app.use("/api/product", productRouter);
        //this.app.use("/api/depotItem", depotItemRouter);
        this.app.use("/api/category", categoryRouter);
        //this.app.use("/api/transaction", transactionRouter);
        this.app.use("/api/notification", notificationRouter);
    }

    public bootstrap() {
        return this.app.listen(PORT_DEV, () => {
            console.log(`Server lisning on port ${PORT_DEV}`);
        })
    }
}

export default new Server();
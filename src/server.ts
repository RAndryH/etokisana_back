import "dotenv/config";
import DB  from './configs/database.config';
import Server from './configs/app';

DB.connectDB()
Server.bootstrap()
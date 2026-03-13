import  express  from "express";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import router from "./routes/authRoutes";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./core/AppSwagger.json";

const app = express();

app.use(express.json());

// app.get('/',(req,res)=>{
//     res.send("Local Event Finder API running...");
// });

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth",router)

const PORT = ENV.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
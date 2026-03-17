import  express  from "express";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import  adminRoutes from "./routes/adminRoutes";
import  eventRoutes from "./routes/eventRoutes";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./core/AppSwagger.json";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

// app.get('/',(req,res)=>{
//     res.send("Local Event Finder API running...");
// });

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth",authRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/events",eventRoutes);


const PORT = ENV.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
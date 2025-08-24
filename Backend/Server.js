const express = require("express");
const connectDB = require("./Config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const companyRoutes = require("./Routes/CompanyRoutes");

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/companies", companyRoutes);

app.get("/", (req, res) => {
  res.send("Server is awake!");
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

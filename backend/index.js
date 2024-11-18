import express from "express";
import connectToMongoDBAtlas from "./connect.js";
import APIRouter from "./Routes/form.js";
import cors from 'cors';

const PORT = 5000;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/SubmitData',APIRouter);

app.post("/SubmitData", (req, res) => {
  res.json({ message: "Data received successfully" });
});

try {
  connectToMongoDBAtlas(
    "mongodb+srv://kartiksharma55109:ykwpuDHNZrXErf3Q@cluster0.ko9yu.mongodb.net/APIForm?retryWrites=true&w=majority&appName=Cluster0"
  );
  app.listen(PORT, () => {
    console.log(`Server is running at PORT : ${PORT}`);
  });
  
} catch (err) {
  console.log(err);
}

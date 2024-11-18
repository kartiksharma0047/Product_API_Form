import express from "express";
import generateAPI from "../Controllers/form.js";

const APIRouter=express.Router();

APIRouter.post('/',generateAPI);

export default APIRouter;

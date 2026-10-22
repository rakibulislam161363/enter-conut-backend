import {type Request, type Response } from "express"

export const notFound = (req: Request, res: Response)=>{
    res.status(200).json({
        message: "Route was not found",
        path: req.originalUrl
    })
}
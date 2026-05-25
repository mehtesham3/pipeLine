import express from "express";
import addUniqueId from "../middelware/uniqueId.js";
import generateTxt from "../controllers/txtGenerateSetup.js";
import logger from "../config/logging.js";
import "dotenv/config"
import prisma from "../config/postgresConn.js";

const txtRouter = express.Router();

txtRouter.post("/generate", addUniqueId, generateTxt);

txtRouter.get('/content/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const post = await prisma.blogPost.findUnique({ where: { id: requestId } });
        if (!post) return res.status(404).json({ error: 'Not found' });
        res.status(200).json({ message: "Data fetched successfully", data: post });
    } catch (error) {
        logger.error('Failed to fetch data', { error });
        return res.status(500).json({ message: "Failed to fetch data" });
    }
});

txtRouter.get('/seeAll', async (req, res) => {
    try {
        const findAll = await prisma.blogPost.findMany({
            select: {
                id: true,
                topic: true,
                provider: true,
                status: true,
                requestId: true,
                createdAt: true,
                updatedAt: true
            }
        })
        if (!findAll) return res.status(404).json({ error: "No Data Found" })
        return res.status(200).json({ message: "Data fetched successfully", data: findAll });
    } catch (error) {
        logger.error('Failed to fetch data', { error, error: error.message });
        return res.status(500).json({ message: "Failed to fetch data", error: error.message });
    }
})

export default txtRouter;
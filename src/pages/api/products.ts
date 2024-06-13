import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongoose';
import Product, { IProduct } from '../../models/Product';
import OpenAI from "openai";

const openai = new OpenAI();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { productId, content } = req.body;

        const tagsOutput = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Based on the following content, return a set of tags of max 5 tags separated with a coma. Content: 
            ${content}` }]
        });

        const tags = tagsOutput.choices[0].message.content?.replaceAll(' ', '').split(',');

        try {
            const newProduct = new Product({ productId, content, tags });
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error saving product' });
        }
    } else {
        res.status(405).json({ error: 'Method now allowed' })
    }
}

export default handler;
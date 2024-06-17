import connectToDatabase from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export const runtime = 'edge';

const openai = new OpenAI();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await connectToDatabase();
        const { prompt } = req.body

        const tagsFromPrompt = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user", content: `Based on the following content, return a set of tags of max 5 tags separated with a coma. Content: 
        ${prompt}`
            }]
        });

        const tagsArray = tagsFromPrompt.choices[0].message.content?.replaceAll(' ', '').split(',') || [];

        let products = await Product.find({
            tags: { $in: tagsArray },
        }, 'productId -_id');

        if (products && products.length !== 0) {
            products = products.map(x => x.productId)
        }

        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user", content: `
        DOCUMENT:
        ${products}

        QUESTION:
        ${prompt}

        INSTRUCTIONS:
        Answer the users QUESTION and add related products ids from the DOCUMENT if possible
        ` },
            ],
            stream: true,
        });


        for await (const chunk of stream) {
            res.write(chunk.choices[0]?.delta?.content || '')
        }
        res.end()
    } catch (e) {
        res.status(500).json({ message: "Unexpected server error" })
    }
}
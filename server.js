import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(
    cors({
        origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
        method: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const message = req.body.message;
    const payloadData = {
        contents: [
            {
                parts: [
                    {
                        text: message
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyBxtC5zaj3nP0HPL9lmu9t3Foh0qFAJpnY', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'credentials': true
            },
            body: JSON.stringify(payloadData),
        });

        const data = await response.json();
        const formattedResponse = data?.candidates[0]?.content?.parts[0]?.text;
        res.json({ response: formattedResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

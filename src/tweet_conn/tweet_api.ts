import express, { Request, Response } from 'express';
import { constructRelationTree } from './main';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the API' });
});

// Example route with params
app.get('/user/:name', async (req: Request, res: Response) => {
    const { name } = req.params;
    // add name validation here...
    try {
        const relationTree = await constructRelationTree({ target_user: name, no_recurse: false },)
        res.status(200).json({
            status: 'ok!',
            message: relationTree
        });
        return
    } catch (err: Error) {
        console.log(`[!]Error! \n ${err}`)
        res.status(500).json({
            status: 'error',
            message: 'Server error, stack trace generated'
        })
        return
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
import express, { Request, Response } from 'express';
import { constructRelationTree } from './main';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
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
    } catch (err) {
        console.log(`[!]Error! \n ${err}`)
        res.status(500).json({
            status: 'server error',
            message: err
        })
        return
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import routes from './routes';
app.use('/api', routes);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`✅ Database connection established`);
});

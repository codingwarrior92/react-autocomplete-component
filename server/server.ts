import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

interface Option {
  id: number;
  value: string;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock data
const options: Option[] = [
  { id: 1, value: 'Apple' },
  { id: 2, value: 'Banana' },
  { id: 3, value: 'Cherry' },
  { id: 4, value: 'Grape' },
  { id: 5, value: 'Lemon' },
  { id: 6, value: 'Orange' },
  { id: 7, value: 'Peach' },
  { id: 8, value: 'Strawberry' },
  { id: 9, value: 'Watermelon' },
];

// API endpoint to fetch options
app.get('/options', (req: Request, res: Response<Option[]>) => {
  res.json(options);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

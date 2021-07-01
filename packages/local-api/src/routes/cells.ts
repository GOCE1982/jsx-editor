import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res, next) => {
    // Read the file
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(result));
    } catch (err) {
      // if an error is thrown, see if it says file doesn't exist
      if (err.code === 'ENOENT') {
        // create a file and add default cells
        let defaultCells = [
          {
            content:
              '# JSX Editor n\
              This is an interactive coding environment in which you can write Javascript, see it executed, and write comprehensive documentation and markdown. n\
              - Click any text cell (including this one) to edit it n\
              - The code in each code editor is all joined together in one file. If you define a variable in code cell #1 you can refer to it in any following cell n\
              - *You can show any React component, string, number, or anything else by calling the `show` function. This is a function that is built into the environment. Call show multiple times to show multiple values* n\
              - Re-order or delete cells using the buttons on the top right corner n\
              - Add new cells by hovering on the divider between each cell n\
              All of your changes are saved to a file you opened your JSX Editor with. If you run `npx jsx-editor serve test.js`, all of the text and code cells will be saved to the `test.js` file.',
            type: 'text',
            id: 'j1b5k',
          },
          {
            content:
              "import { useState } from 'react'; n\
n\
              const Counter = () => { n\
                const [count, setCount] = useState(0) n\
                return ( n\
                  <div> n\
                    <button onClick={() => setCount(count + 1)}>Click</button> n\
                    <h3>Count: {count}</h3> n\
                  </div> n\
                ) n\
              }; n\
n\
              // Display any variable or React Component by calling `show` n\
              show(<Counter />) n\
            ",
            type: 'code',
            id: 'kkgj1',
          },
          {
            content:
              'const App = () => { n\
                return ( n\
                  <div> n\
                    <h2>Hi from the JSX Editor</h2> n\
                    <i>Counter component will be rendered below</i> n\
                    <hr/> n\
                    { n\
                      /* Counter was declared in a previous cell and can be referenced here */ n\
                    }\
                    <Counter /> n\
                  </div> n\
                ) n\
              } n\
              n\
              show(<App />) n\
            ',
            type: 'code',
            id: 'jsb4k',
          },
        ];
        await fs.writeFile(fullPath, JSON.stringify(defaultCells), 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res, next) => {
    // Take the list of cells from the req obj
    // Serialize
    const { cells }: { cells: Cell[] } = req.body;
    // Write the cells int the file
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
    res.send({ status: 'ok' });
  });

  return router;
};

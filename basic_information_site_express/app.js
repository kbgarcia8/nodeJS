import { fileURLToPath } from 'url';
import express from 'express';
import {dirname} from 'path';
import path from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/* Line 7 and 8 pinpoints the directory where the current code comes from  */

const paths = ['/about', '/contact-me']

app.get(/.*/, (request, response) => { // /.*/ represents wildcard/regex for path
    const pathname = request.path;
    if (pathname === '/') {
        response.sendFile(path.join(__dirname + "/index.html"))
    } else if (paths.includes(pathname)) {
        response.sendFile(path.join(__dirname + `${pathname}.html`))
    } else {
        response.sendFile(path.join(__dirname + `/404.html`))
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
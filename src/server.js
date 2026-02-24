import { createApp } from "./app.js";
import { env } from "./config/env.js";


const app = createApp();


app.listen(env.PORT, () => {
    console.log(`Server running (${env.NODE_ENV}) at http://localhost:${env.PORT}`);
});
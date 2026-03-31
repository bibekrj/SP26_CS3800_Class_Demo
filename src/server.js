import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initDB } from "./models/index.js";


const app = createApp();


app.listen(env.PORT, async () => {
    await initDB();
    console.log(`Server running (${env.NODE_ENV}) at https://localhost:${env.PORT}`);
});
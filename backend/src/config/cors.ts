import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        // console.log(origin);
        const whiteList = [process.env.FRONTEND_URL];

        if(process.argv[2] === '--api') {
            whiteList.push(undefined);
        }

        if (whiteList.includes(origin)) {
            // console.log("Conexion permitida");
            callback(null, true);
            
        } else {
            // console.log("Conexion denegada");
            callback(new Error("No permitido por CORS"));            
        }
    }
}

import winston from "winston";

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        // winston.format.timestamp(),
        winston.format.json(),
    ),
    // defaultMeta: { service: "ai-pipeline" },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log', }),
        new winston.transports.File({ filename: 'logs/queue.log', level: 'queue', format: winston.format.json() }),
        new winston.transports.File({
            filename: "logs/http.log", level: "http", format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, message }) => `${timestamp} ${message}`)
            )
        }),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    ],
});

export default logger;
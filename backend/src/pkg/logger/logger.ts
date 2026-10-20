

const getTimestamp = (): string => {
  return new Date().toISOString();
};


export const logger = {

  info: (message: string) => {
    console.log(`[INFO] ${getTimestamp()} ${message}`);
  },

  warn: (message: string) => {
    console.warn(`[WARN] ${getTimestamp()} ${message}`);
  },

  error: (message: string, error?:Error) => {
    console.error(`[ERROR] ${getTimestamp()} ${message}`);
    if(error) {
        console.error(error.stack);
    }
  },

  debug: (message: string) => {
    console.debug(`[DEBUG] ${getTimestamp()} ${message}`);
  },
  
};
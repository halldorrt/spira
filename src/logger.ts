let maxApi: any;
try {
  maxApi = require('max-api');
} catch {}

export const logger = {
  log(...messages: any[]) {
    try {
      if (maxApi) {
        messages?.forEach((message) => {
          if (message instanceof Error) maxApi.post(message.message, message.stack);
          else maxApi.post(message);
        });
      }
      messages?.forEach((message) => console.log(message));
    } catch {}
  },
};

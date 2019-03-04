export const TIMEOUT_TIMEOUT_MIDDLEWARE = 15000;
export const TimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(201, {
            'Content-Type': 'application/json'
          });

        }
        res.write(space);
        // Wait another 15 seconds
        waitAndSend();
      }
    }, TIMEOUT_TIMEOUT_MIDDLEWARE);
  };
  waitAndSend();
  next();
};
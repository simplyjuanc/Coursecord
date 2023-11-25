import { Request, Response } from 'express';

async function addHelpRequest(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

//I'm not really sure about these controllers and routes either
//It really depends on the websocket implementation. 
//We can figure that out later

export default { addHelpRequest };

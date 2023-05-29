import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/signup`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    const result = await response.json();

    if (!result.error) {
      res.status(response.status).json(result);
    } else {
      const errorMessage =
        typeof result.message === 'string' ? result.message : result.message[0];
      res
        .status(response.status)
        .json({ error: result.error, message: errorMessage });
    }
  } catch (e) {
    console.log('Error on registration', e);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: 'Error 500' });
  }
}

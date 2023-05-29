import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.cookies.GamelyAuthToken;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `${accessToken}`,
      }
    });
    const result = await response.json();

    if (!result.error && response.status < 300) {
      res.status(response.status).json(result);
    } else if (response.status === 401) {
      res
        .status(response.status)
        .json({ error: result.error, message: 'Unauthorized', statusCode: 401 });
    } else {
      const errorMessage =
        typeof result.message === 'string'
          ? result.message
          : result.message[0];
      res
        .status(response.status)
        .json({ error: result.error, message: errorMessage });
    }
  } catch (e) {
    console.log('Error on managing user', e);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: 'Error 500' });
  }
}
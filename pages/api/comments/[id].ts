import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.cookies.GamelyAuthToken;
  const id = req.query.id;
  try {
    const response = await fetch(`${process.env.API_URL}/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'DELETE'
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
    console.log('Error on comment delete', e);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: 'Error 500' });
  }
}

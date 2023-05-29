import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const gameId = req.query.id;
    const accessToken = req.cookies.GamelyAuthToken;
    try {
      const response = await fetch(`${process.env.API_URL}/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      const result = await response.json();

      if (!result.error && response.status < 300) {
        res.status(200).json({ message: result.message });
      } else {
        const errorMessage =
          typeof result.message === 'string'
            ? result.message
            : result.message[0];
        res.status(response.status).json({
          error: result.error || `Error ${response.status}`,
          message: errorMessage,
        });
      }
    } catch (e) {
      console.log('Error on game delete', e);
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: 'Error 500' });
    }
  }
}

import { NextApiRequest, NextApiResponse } from 'next';

export const getGameById = async (
  accessToken: string | undefined | null,
  id: string
) => {
  let game = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    const result = await res.json();

    if (!result.error && result.data) {
      game = result.data;
    }
  } catch (e) {
    console.log('Error while querying game by id', e);
  }

  return game;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.cookies.GamelyAuthToken;

  try {
    const response = await fetch(`${process.env.API_URL}/games`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    const result = await response.json();

    if (!result?.error && result?.data) {
      // const games = result.data.map((game: any) => {
      //   return {
      //     ...game,
      //     // genres: game.genres.map((genre: any) => genre.genre),
      //     // platforms: game.platforms.map((plt: any) => plt.platform),
      //   };
      // });

      res.status(200).json({ data: result.data ?? [] });
    } else {
      const errorMessage =
        typeof result.message === 'string' ? result.message : result.message[0];
      res.status(response.status).json({
        data: [],
        error: result.error || `Error ${response.status}`,
        message: errorMessage,
      });
    }
  } catch (e) {
    console.log('Error while fetching games', e);
    res
      .status(500)
      .json({ data: [], message: 'Internal Server Error', error: 'Error 500' });
  }
}

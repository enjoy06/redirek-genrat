// pages/api/short/is.gd.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import qs from 'querystring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url, shorturl, opt } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    const payload = qs.stringify({
      url,
      shorturl, // optional
      opt: opt ?? '0', // default to 0
      format: 'html', // get HTML response instead of JSON
    });

    const response = await axios.post('https://is.gd/create.php', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;

    if (data.errorcode) {
      return res.status(400).json({ message: data.errormessage });
    }

    return res.status(200).json({ shortUrl: data.shorturl });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Shortening failed',
      error: error.message || 'Unknown error',
    });
  }
}

import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: Request) {
  const { prompt, style } = await request.json();
  
  try {
    const fullPrompt = `${prompt}, ${getStylePrompt(style)}, 4k resolution, desktop wallpaper`;
    
    const formData = new FormData();
    formData.append('prompt', fullPrompt);
    formData.append('output_format', 'jpeg');

    const response = await axios.postForm(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      formData,
      {
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: 'image/*'
        },
        responseType: 'arraybuffer'
      }
    );

    return new NextResponse(Buffer.from(response.data), {
      headers: { 'Content-Type': 'image/jpeg' }
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

function getStylePrompt(style: string): string {
  const styles: Record<string, string> = {
    pixel: '8-bit pixel art style',
    cyberpunk: 'cyberpunk neon lighting',
    shinkai: 'Makoto Shinkai anime style'
  };
  return styles[style] || '';
}
"use client"; // 添加客户端指令
import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cyberpunk');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">
            输入桌面描述
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
            placeholder="例如：星空下的灯塔"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">
            选择风格
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
          >
            <option value="pixel">像素风</option>
            <option value="cyberpunk">赛博朋克</option>
            <option value="shinkai">新海诚风格</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? '生成中...' : '生成桌面'}
        </button>

        {generatedImage && (
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-4">生成结果</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <Image
                src={generatedImage}
                alt="生成的桌面图片"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

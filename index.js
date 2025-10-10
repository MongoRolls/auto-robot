const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const https = require("https");
const { env } = require("process");

// 获取Unsplash API配置
const UNSPLASH_API_CONFIG = {
    accessKey: env.UNSPLASH_ACCESS_KEY,
    searchEndpoint: 'https://api.unsplash.com/search/photos',
    perPage: 30,
    coverImageFolder: 'pictures',
    imageWidth: 1200,
    imageHeight: 630,
    cropMode: 'entropy',
    query: 'landscape'
};

// 下载图片函数
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
      const filePath = path.join(UNSPLASH_API_CONFIG.coverImageFolder, filename);
      const fileStream = fs.createWriteStream(filePath);

      https
          .get(url, (response) => {
              if (response.statusCode !== 200) {
                  reject(new Error(`下载失败，HTTP状态码: ${response.statusCode}`));
                  return;
              }

              response.pipe(fileStream);

              fileStream.on('finish', () => {
                  fileStream.close();
                  resolve();
              });
          })
          .on('error', (error) => {
              reject(error);
          });

      fileStream.on('error', (error) => {
          reject(error);
      });
  });
}

// 获取Unsplash图片并保存
async function fetchAndSaveCoverImage(postId, query = 'technology') {

  try {
      // 生成随机页码 (1-10)
      const randomPage = Math.floor(Math.random() * 10) + 1;
      // 构建API请求URL，添加随机页码和排序方式
      const sortOptions = ['relevant', 'latest'];
      const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

      const url = `${UNSPLASH_API_CONFIG.searchEndpoint}?query=${encodeURIComponent(UNSPLASH_API_CONFIG.query)}&per_page=${UNSPLASH_API_CONFIG.perPage}&page=${randomPage}&order_by=${randomSort}&orientation=landscape`;

      // 发送API请求
      const response = await fetch(url, {
          headers: {
              Authorization: `Client-ID ${UNSPLASH_API_CONFIG.accessKey}`
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
          throw new Error('未找到图片');
      }

      // 随机选择一张图片
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const rawImageUrl = data.results[randomIndex].urls.raw;

      // 构建带尺寸和裁剪参数的URL
      const imageUrl = `${rawImageUrl}&w=${UNSPLASH_API_CONFIG.imageWidth}&h=${UNSPLASH_API_CONFIG.imageHeight}&fit=crop&crop=${UNSPLASH_API_CONFIG.cropMode}`;

      // 下载并保存图片
      await downloadImage(imageUrl, `${new Date().getTime()}.jpg`);

  } catch (error) {
      console.error('获取Unsplash图片时出错:', error);
      return ''; // 出错时返回空字符串
  }
}

fetchAndSaveCoverImage();
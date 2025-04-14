const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

// 获取Unsplash API密钥
const accessKey = process.env.UNSPLASH_ACCESS_KEY || "YOUR_UNSPLASH_ACCESS_KEY";

// 设置Unsplash API请求地址（获取随机自然风景图片）
const url = `https://api.unsplash.com/photos/random?query=nature,landscape&orientation=landscape`;
const dirPath = path.resolve(__dirname, "pictures");

// 获取当前日期
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
const date = `${year}-${month}-${day}`;

// 请求Unsplash随机图片
fetch(url, {
  headers: {
    Authorization: `Client-ID ${accessKey}`
  }
})
  .then(res => res.json())
  .then(data => {
    // 下载图片
    return fetch(data.urls.regular);
  })
  .then(res => {
    const dest = fs.createWriteStream(`${dirPath}/${date}.png`);
    res.body.pipe(dest);
  })
  .catch(err => console.error("下载风景图片失败:", err));
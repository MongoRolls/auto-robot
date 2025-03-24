const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const id = (~~(Math.random() * 100000)).toString(); // 获取小于10w的数字
const url = `https://robohash.org/${id}`;
const dirPath = path.resolve(__dirname, "pictures");

// 修复日期格式，确保使用当前正确的年份而不是2025年
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
const date = `${year}-${month}-${day}`;

// 使用node-fetch替代request
fetch(url)
  .then(res => {
    const dest = fs.createWriteStream(`${dirPath}/${date}.png`);
    res.body.pipe(dest);
  })
  .catch(err => console.error("下载机器人图片失败:", err));
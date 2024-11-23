const express = require('express');
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const parser = new Parser();
const port = 3000;

// 提供静态文件
app.use(express.static('public'));

// 读取RSS配置
app.get('/api/feeds', (req, res) => {
    const rssConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'rss_feeds.json'), 'utf8'));
    res.json(rssConfig);
});

// 获取特定RSS源的内容
app.get('/api/feed/:id', async (req, res) => {
    try {
        const rssConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'rss_feeds.json'), 'utf8'));
        const feed = rssConfig.feeds.find(f => f.id === req.params.id);
        
        if (!feed) {
            return res.status(404).json({ error: 'Feed not found' });
        }

        const feedContent = await parser.parseURL(feed.url);
        res.json(feedContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
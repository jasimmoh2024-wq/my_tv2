const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// دالة ذكية لتحليل ملف M3U وتحويله إلى مصفوفة محمية
function parseM3U() {
    const filePath = path.join(__dirname, 'channels.m3u');
    if (!fs.existsSync(filePath)) return {};
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const channels = {};
    let currentChannel = {};
    let idCounter = 1;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const nameMatch = line.split(',')[1];
            currentChannel = {
                name: nameMatch ? nameMatch.trim() : `قناة ${idCounter}`,
                logo: logoMatch ? logoMatch[1] : ''
            };
        } else if (line.startsWith('http')) {
            channels[idCounter] = {
                name: currentChannel.name,
                logo: currentChannel.logo,
                url: line
            };
            idCounter++;
        }
    });
    return channels;
}

app.get('/channel/info-all', (req, res) => {
    const channels = parseM3U();
    const safeChannels = {};
    Object.keys(channels).forEach(id => {
        safeChannels[id] = { name: channels[id].name, logo: channels[id].logo };
    });
    res.json(safeChannels);
});

app.get('/live/:id', (req, res) => {
    let channelId = req.params.id;
    if (channelId.endsWith('.ts')) channelId = channelId.replace('.ts', '');

    const channels = parseM3U();
    const channel = channels[channelId];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    const targetUrl = `${channel.url}?output=ts`;
    const parsedUrl = new URL(targetUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
            'Connection': 'keep-alive'
        }
    };

    const proxyReq = http.get(options, (proxyRes) => {
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Cache-Control', 'no-cache');
        proxyRes.pipe(res);
    });

    proxyReq.on('error', () => { if (!res.headersSent) res.status(500).send('خطأ اتصال'); });
    req.on('close', () => proxyReq.destroy());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

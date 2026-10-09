const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// دالة لقراءة الروابط من الملف الخارجي ديناميكياً عند كل طلب
function getChannelUrl(channelId) {
    try {
        const filePath = path.join(__dirname, 'channels.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const channels = JSON.parse(fileData);
        return channels[channelId] || null;
    } catch (error) {
        console.error("خطأ في قراءة ملف القنوات:", error);
        return null;
    }
}

// السيرفر الوسيط الديناميكي
app.use('/stream/:channelId', (req, res, next) => {
    const channelId = req.params.channelId;
    const targetUrl = getChannelUrl(channelId);

    if (!targetUrl) {
        return res.status(404).send('القناة غير موجودة أو الرابط غير صحيح');
    }

    // إنشاء البروكسي وتوجيهه للرابط المحدد
    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => '', // مسح المسار الداخلي لتوجيه الطلب للرابط مباشرة
        onProxyReq: (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

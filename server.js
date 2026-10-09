const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل CORS بالكامل مع السماح بجميع الترويسات
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Range', 'User-Agent']
}));

// تقديم ملفات الموقع تلقائياً
app.use(express.static(path.join(__dirname)));

function getChannelUrl(channelId) {
    try {
        const filePath = path.join(__dirname, 'channels.json');
        if (!fs.existsSync(filePath)) return null;
        const fileData = fs.readFileSync(filePath, 'utf8');
        const channels = JSON.parse(fileData);
        const channel = channels.find(c => c.id === channelId);
        return channel ? channel.url : null;
    } catch (error) {
        console.error("خطأ في قراءة ملف القنوات:", error);
        return null;
    }
}

app.use('/stream/:channelId', (req, res, next) => {
    const channelId = req.params.channelId;
    const targetUrl = getChannelUrl(channelId);

    if (!targetUrl) {
        return res.status(404).send('القناة غير موجودة');
    }

    // استخراج الدومين الأساسي فقط للسيرفر المستهدف بدون مسار القناة
    const urlObj = new URL(targetUrl);
    const targetOrigin = `${urlObj.protocol}//${urlObj.host}`;

    createProxyMiddleware({
        target: targetOrigin,
        changeOrigin: true,
        secure: false, // لتجاوز مشاكل شهادات الـ SSL غير الصالحة في بعض سيرفرات IPTV
        pathRewrite: (path, req) => {
            // توجيه الطلب إلى المسار الكامل الحقيقي للقناة بالكامل
            return urlObj.pathname + urlObj.search;
        },
        onProxyReq: (proxyReq) => {
            // تزوير الترويسات لتبدو تماماً كأنها قادمة من تطبيق Xtream أو مشغل حقيقي
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            proxyReq.setHeader('Referer', targetOrigin);
            proxyReq.setHeader('Origin', targetOrigin);
        },
        onProxyRes: (proxyRes) => {
            // إجبار المتصفح على قراءة البث كفيديو وتفعيل ترويسات CORS المباشرة
            proxyRes.headers['content-type'] = 'video/mp2t';
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
        },
        onError: (err, req, res) => {
            console.error("خطأ في جلب البث:", err.message);
            if (!res.headersSent) {
                res.status(500).send('فشل الاتصال بمصدر البث');
            }
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`السيرفر يعمل الآن على المنفذ: ${PORT}`);
});

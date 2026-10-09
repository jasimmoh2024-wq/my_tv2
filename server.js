const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// تفعيل كورس (CORS) للسماح لصفحة الـ HTML بالوصول للبث دون قيود
app.use(cors());

// تقديم صفحة الـ HTML (index.html) تلقائياً عند فتح رابط السيرفر الأساسي
app.use(express.static(path.join(__dirname)));

// دالة لقراءة مصفوفة القنوات من ملف الـ JSON الخارجي ديناميكياً
function getChannelUrl(channelId) {
    try {
        const filePath = path.join(__dirname, 'channels.json');
        if (!fs.existsSync(filePath)) {
            console.error("ملف channels.json غير موجود في المجلد الرئيسي!");
            return null;
        }
        const fileData = fs.readFileSync(filePath, 'utf8');
        const channels = JSON.parse(fileData);
        
        // البحث عن القناة بواسطة الـ ID
        const channel = channels.find(c => c.id === channelId);
        return channel ? channel.url : null;
    } catch (error) {
        console.error("حدث خطأ أثناء قراءة مصفوفة القنوات:", error);
        return null;
    }
}

// السيرفر الوسيط (البروكسي) لتمرير البث وتخطي الحماية
app.use('/stream/:channelId', (req, res, next) => {
    const channelId = req.params.channelId;
    const targetUrl = getChannelUrl(channelId);

    // التحقق من وجود القناة
    if (!targetUrl) {
        return res.status(404).send('عذراً، هذه القناة غير موجودة أو الرابط غير صحيح.');
    }

    // تشغيل البروكسي وتوجيه الطلب للسيرفر الأصلي
    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => '', // إزالة مسار السيرفر المحلي وتمرير الطلب مباشرة
        onProxyReq: (proxyReq) => {
            // تزوير الـ User-Agent ليبدو الاتصال كأنه قادم من متصفح عادي وليس سيرفر وسيط
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        },
        onProxyRes: (proxyRes) => {
            // إجبار المتصفح على استقبال البيانات كبث فيديو مباشر حتى لو كانت روابطك بدون امتداد
            proxyRes.headers['content-type'] = 'video/mp2t';
            
            // التأكد من تفعيل الكورس في الترويسات العائدة أيضاً لضمان استقرار المشغل
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        },
        onError: (err, req, res) => {
            console.error("خطأ في الاتصال بسيرفر IPTV الأساسي:", err.message);
            res.status(500).send('فشل السيرفر الوسيط في الاتصال بمصدر البث.');
        }
    })(req, res, next);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`السيرفر يعمل الآن بنجاح على المنفذ: ${PORT}`);
});

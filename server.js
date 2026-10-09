const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// تفعيل CORS الشامل لمنع أي حظر للشبكة مع تطبيق الـ APK والتطبيقات الخارجية
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// ⚠️ قاعدة بيانات القنوات الحقيقية الخاصة بك
// استبدل الروابط التجريبية (http://xtream-server.com...) بروابط اشتراكك الحقيقية لكي تعمل القنوات
const channels = {
  "1": {
    "name": "beIN Sports 1 ",
    "logo": "https://lo1.in/bss/bsS1.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677012"
  },
  "2": {
    "name": "beIN Sports 2",
    "logo": "https://lo1.in/bss/bsS2.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677013"
  },
  "3": {
    "name": "beIN Sports 3",
    "logo": "https://lo1.in/bss/bs3.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677014"
  },
  "4": {
    "name": "beIN Sports 4",
    "logo": "https://lo1.in/bss/bs4.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677015"
  },
  "5": {
    "name": "beIN Sports 5",
    "logo": "https://lo1.in/bein/beinn5.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677016"
  },
  "6": {
    "name": "beIN Sports 6",
    "logo": "https://lo1.in/bein/beinn6.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677017"
  },
  "7": {
    "name": "beIN Sports 7",
    "logo": "https://lo1.in/bss/BEIN SPORTS 07.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677018"
  },
  "8": {
    "name": "beIN Sports 8",
    "logo": "https://lo1.in/bss/bss8.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/677019"
  },
  "9": {
    "name": "Alwan Sport 1",
    "logo": "https://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649689"
  },
  "10": {
    "name": "Alwan Sport 2",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649690"
  },
  "11": {
    "name": "Alwan Sport 3",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649691"
  },
  "12": {
    "name": "Alwan Sport 4",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649692"
  },
  "13": {
    "name": "Alwan Sport 5",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649693"
  },
  "14": {
    "name": "Alwan Sport 6",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649694"
  },
  "15": {
    "name": "Alwan Sport 7",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649695"
  },
  "16": {
    "name": "Alwan Sport 8",
    "logo": "http://lo1.in/fwc/ALWANS.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/649696"
  },
  "17": {
    "name": "BEIN MOVIES 1",
    "logo": "https://lo1.in/beinn/beinm1pre0.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/427"
  },
  "18": {
    "name": "BEIN MOVIES 2",
    "logo": "https://lo1.in/beinn/beinm2act0.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/428"
  },
  "19": {
    "name": "BEIN MOVIES 3",
    "logo": "https://lo1.in/beinn/bm3.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/429"
  },
  "20": {
    "name": "BEIN MOVIES 4",
    "logo": "https://lo1.in/beinn/beinm4famm.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/430"
  },
  "21": {
    "name": "BEIN SERIES 1",
    "logo": "https://lo1.in/beinn/beinser100.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/431"
  },
  "22": {
    "name": "BEIN SERIES 2",
    "logo": "https://lo1.in/beinn/beinser20.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/432"
  },
  "23": {
    "name": "BEIN DRAMA",
    "logo": "https://lo1.in/FCB/beinet.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/433"
  },
  "24": {
    "name": "ViVo OSCAR",
    "logo": "https://static.vecteezy.com/system/resources/previews/054/650/800/non_2x/vivo-logo-rounded-vivo-logo-free-png.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/192835"
  },
  "25": {
    "name": "ViVo CLUB",
    "logo": "https://static.vecteezy.com/system/resources/previews/054/650/800/non_2x/vivo-logo-rounded-vivo-logo-free-png.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/192834"
  },
  "26": {
    "name": "ViVo SHOWTIME",
    "logo": "https://static.vecteezy.com/system/resources/previews/054/650/800/non_2x/vivo-logo-rounded-vivo-logo-free-png.png",
    "url": "http>//tyqw.site:2052/10675785266958/99039021857485/192836"
  },
  "27": {
    "name": "ViVo PLUS",
    "logo": "https://static.vecteezy.com/system/resources/previews/054/650/800/non_2x/vivo-logo-rounded-vivo-logo-free-png.png",
    "url": "http://tyqw.site:2052/10675785266958/99039021857485/192837"
    }
};

// مسار جلب البيانات بصيغة JSON القياسية المستقرة جداً على Render
app.get('/channel/info-all', (req, res) => {
    res.json(channels); 
});

// مسار معالجة وحقن البث المباشر وتخطي حظر سيرفرات Xtream
app.get('/channel/stream/:id', async (req, res) => {
    const channel = channels[req.params.id];
    if (!channel) return res.status(404).send('القناة غير موجودة');

    try {
        const response = await axios({
            method: 'get',
            url: channel.url,
            responseType: 'stream',
            timeout: 20000, 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; LivePlayer) ExoPlayerLib/2.18.1',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        });

        const contentType = response.headers['content-type'] || 'video/mp2t';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }

        response.data.pipe(res);

    } catch (error) {
        console.error("خطأ البث المباشر:", error.message);
        if (!res.headersSent) {
            res.status(500).send('تعذر جلب البث، تأكد من صحة روابط القنوات.');
        }
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Server is Live and Running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

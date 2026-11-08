// server.js - Render هو الموزع، مو Redirect
const express = require('express');
const app = express();
app.set('trust proxy', true);

// حط هنا قنواتك المفتوحة فقط - الي عندك حق بثها
const CHANNELS = [
 {"name":"1 - bein sport 1","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/4011"},
  {"name":"2 - bein sport 2","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/16"},
  {"name":"3 - bein sport 3","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953587"},
  {"name":"4 - bein sport 4","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953586"},
  {"name":"5 - bein sport 5","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953585"},
  {"name":"6 - bein sport 6","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953584"},
  {"name":"7 - bein sport 7","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953583"},
  {"name":"8 - bein sport 8","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/953582"},
  {"name":"9 - ALWAN SPORT 1","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276543"},
  {"name":"10 - ALWAN SPORT 2","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276542"},
  {"name":"11 - ALWAN SPORT 3","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276541"},
  {"name":"12 - ALWAN SPORT 4","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276540"},
  {"name":"13 - ALWAN SPORT 5","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276539"},
  {"name":"14 - ALWAN SPORT 6","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276538"},
  {"name":"15 - ALWAN SPORT 7","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276537"},
  {"name":"16 - ALWAN SPORT 8","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1276536"},
  {"name":"17 - STARZPLAY SPORTS 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/67376"},
  {"name":"18 - STARZPLAY SPORTS 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/67378"},
  {"name":"19 - Thamanya Sport 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/646086"},
  {"name":"20 - Thamanya Sport 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/646087"},
  {"name":"21 - Alwan Aflam 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/649714"},
  {"name":"22 - Alwan Aflam 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/649715"},
  {"name":"23 - Alwan Aflam 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/649716"},
  {"name":"24 - Alwan Aflam 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/649717"},
  {"name":"25 - ALWAN TURKEY","url":"http://tyqw.site:2052/10675785266958/99039021857485/649718"},
  {"name":"26 - Alwan Documentary","url":"http://tyqw.site:2052/10675785266958/99039021857485/649719"},
  {"name":"27 - ALWAN ATFAL","url":"http://tyqw.site:2052/10675785266958/99039021857485/649720"},
  {"name":"28 - ALWAN MOSALSALAT","url":"http://tyqw.site:2052/10675785266958/99039021857485/649721"},
  {"name":"29 - ALWAN MOSALSALAT +","url":"http://tyqw.site:2052/10675785266958/99039021857485/649725"},
  {"name":"30 - ALWAN ANIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/649726"},
  {"name":"31 - BEIN MOVIES 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/427"},
  {"name":"32 - BEIN MOVIES 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/428"},
  {"name":"33 - BEIN MOVIES 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/429"},
  {"name":"34 - BEIN MOVIES 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/430"},
  {"name":"35 - BEIN SERIES 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/431"},
  {"name":"36 - BEIN SERIES 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/432"},
  {"name":"37 - BEIN DRAMA","url":"http://tyqw.site:2052/10675785266958/99039021857485/433"},
  {"name":"38 - vivo OSCAR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192835"},
  {"name":"39 - vivo CLUB","url":"http://tyqw.site:2052/10675785266958/99039021857485/192834"},
  {"name":"40 - vivo CINEMA 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192833"},
  {"name":"41 - vivo CINEMA 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192832"},
  {"name":"42 - vivo SHOWTIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/192836"},
  {"name":"43 - vivo PLUS","url":"http://tyqw.site:2052/10675785266958/99039021857485/192837"},
  {"name":"44 - vivo SHOWTIME 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192836"},
  {"name":"45 - vivo MOVIES","url":"http://tyqw.site:2052/10675785266958/99039021857485/192838"},
  {"name":"46 - vivo SENTRAL","url":"http://tyqw.site:2052/10675785266958/99039021857485/192839"},
  {"name":"47 - vivo WAR TIME","url":"http://tyqw.site:2052/10675785266958/99039021857485/192840"},
  {"name":"48 - signal Comedy","url":"http://tyqw.site:2052/10675785266958/99039021857485/192634"},
  {"name":"49 - signal ACTION","url":"http://tyqw.site:2052/10675785266958/99039021857485/192633"},
  {"name":"50 - signal Cinema","url":"http://tyqw.site:2052/10675785266958/99039021857485/192635"},
  {"name":"51 - signal AFLAM","url":"http://tyqw.site:2052/10675785266958/99039021857485/192636"},
  {"name":"52 - signal CLASSIC","url":"http://tyqw.site:2052/10675785266958/99039021857485/192637"},
  {"name":"53 - signal 90s AR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192638"},
  {"name":"54 - signal VOX","url":"http://tyqw.site:2052/10675785266958/99039021857485/192639"},
  {"name":"55 - signal GOLD","url":"http://tyqw.site:2052/10675785266958/99039021857485/192640"},
  {"name":"56 - signal ANIME AR","url":"http://tyqw.site:2052/10675785266958/99039021857485/192642"},
  {"name":"57 - SHAHID ACTION 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192749"},
  {"name":"58 - SHAHID ANIME 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/192746"},
  {"name":"59 - SHAHID ANIME 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192745"},
  {"name":"60 - SHAHID Comedy","url":"http://tyqw.site:2052/10675785266958/99039021857485/192739"},
  {"name":"61 - SHAHID ACTION 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/192739"},
  {"name":"62 - SHAHID MARVEL","url":"http://tyqw.site:2052/10675785266958/99039021857485/192740"},
  {"name":"63 - SHAHID ASIAN","url":"http://tyqw.site:2052/10675785266958/99039021857485/192742"},
  {"name":"64 - SHAHID BOLLYWOOD","url":"http://tyqw.site:2052/10675785266958/99039021857485/192743"},
  {"name":"65 - ACTION MOVIES","url":"http://jbfgrjbn.fhkadvnp.com:80/7901885855/7610043061/1396793"},
  {"name":"66 - SHAHID FILMS 1","url":"https://shd-amg-fast.edgenextcdn.net/tx001/playlist.m3u8"},
  {"name":"67 - SHAHID FILMS 2","url":"https://shd-amg-fast.edgenextcdn.net/tx007/playlist.m3u8"},
  {"name":"68 - SHAHID 1","url":"https://shd-amg-fast.edgenextcdn.net/tx017/playlist.m3u8"},
  {"name":"69 - SHAHID 2","url":"https://shd-amg-fast.edgenextcdn.net/tx015/playlist.m3u8"},
  {"name":"70 - SHAHID 3","url":"https://shd-amg-fast.edgenextcdn.net/tx014/playlist.m3u8"},
  {"name":"71 - SHAHID 4","url":"https://shd-amg-fast.edgenextcdn.net/tx010/playlist.m3u8"},
  {"name":"72 - SHAHID 5","url":"https://shd-amg-fast.edgenextcdn.net/tx013/playlist.m3u8"},
  {"name":"73 - SHAHID 6","url":"https://shd-amg-fast.edgenextcdn.net/tx003/playlist.m3u8"},
  {"name":"74 - SHAHID 7","url":"https://shd-amg-fast.edgenextcdn.net/tx005/playlist.m3u8"},
  {"name":"75 - SHAHID 8","url":"https://shd-amg-fast.edgenextcdn.net/tx008/playlist.m3u8"},
  {"name":"76 - SHAHID 9","url":"https://shd-amg-fast.edgenextcdn.net/tx009/playlist.m3u8"},
  {"name":"77 - THRILLER Movies","url":"https://shd-amg-fast.edgenextcdn.net/tx011/playlist.m3u8"},
  {"name":"78 - WILD","url":"http://tyqw.site:2052/10675785266958/99039021857485/625061"},
  {"name":"79 - travelXP","url":"http://stream.mcquack.net/451/index.m3u8"},
  {"name":"80 - trave","url":"http://tyqw.site:2052/10675785266958/99039021857485/625063"},
  {"name":"81 - Asharq Documentary 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/625069"},
  {"name":"82 - Animal Planet","url":"http://tyqw.site:2052/10675785266958/99039021857485/625075"},
  {"name":"83 - H HISORY","url":"http://tyqw.site:2052/10675785266958/99039021857485/625076"},
  {"name":"84 - Discovery","url":"http://tyqw.site:2052/10675785266958/99039021857485/625080"},
  {"name":"85 - Asharq Documentary 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/625067"},
  {"name":"86 - Al Jazeera Documents","url":"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},
  {"name":"87 - Kids Music 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193350"},
  {"name":"88 - Kids Music 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193347"},
  {"name":"89 - Kids Music 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/193346"},
  {"name":"90 - Kids Music 4","url":"http://tyqw.site:2052/10675785266958/99039021857485/193348"},
  {"name":"91 - TOM And jerry 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193324"},
  {"name":"92 - TOM And jerry 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193323"},
  {"name":"93 - TOM And jerry 3","url":"http://tyqw.site:2052/10675785266958/99039021857485/193321"},
  {"name":"94 - Nickelodeon 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/151195"},
  {"name":"95 - Nickelodeon 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/151192"},
  {"name":"96 - pink panther 1","url":"http://tyqw.site:2052/10675785266958/99039021857485/193316"},
  {"name":"97 - pink panther 2","url":"http://tyqw.site:2052/10675785266958/99039021857485/193317"},
  {"name":"98 - test","url":"http://tyqw.site:2052/10675785266958/99039021857485/677084"}
];

// هيدر ثابت واحد - السيرفر الاصلي يشوف بس Render
const UPSTREAM_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': '*/*',
  'Connection': 'keep-alive',
};

// 1. قائمة القنوات للمشاهد - المشاهد ياخذ رابط Render فقط
app.get('/playlist.m3u8', (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`;
  let m3u = "#EXTM3U\n";
  CHANNELS.forEach((c, i) => {
    m3u += `#EXTINF:-1 tvg-name="${c.name}",${c.name}\n${base}/live/${i}\n`;
  });
  res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(m3u);
});

// 2. التوزيع الرئيسي - Render يجيب ويوزع
app.get('/live/:id', async (req, res) => {
  const ch = CHANNELS[parseInt(req.params.id)];
  if (!ch) return res.status(404).send("Not found");

  try {
    const upstream = await fetch(ch.url, { headers: UPSTREAM_HEADERS });
    if (!upstream.ok) return res.status(502).send("Upstream error");

    const contentType = upstream.headers.get('content-type') || '';

    // اذا كان m3u8، نعيد كتابة الروابط الداخلية لتمر عبر Render
    if (contentType.includes('mpegURL') || ch.url.includes('.m3u8')) {
      let text = await upstream.text();
      const baseUrl = ch.url.substring(0, ch.url.lastIndexOf('/') + 1);
      const myBase = `${req.protocol}://${req.get('host')}`;

      // نبدل كل مقطع .ts او .m3u8 ليرجع لـ Render
      text = text.split('\n').map(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return line;
        // رابط كامل
        if (line.startsWith('http')) {
          return `${myBase}/proxy?u=${encodeURIComponent(line)}`;
        }
        // رابط نسبي
        return `${myBase}/proxy?u=${encodeURIComponent(baseUrl + line)}`;
      }).join('\n');

      res.setHeader('Content-Type', 'application/x-mpegURL');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(text);
    }

    // اذا كان فيديو .ts مباشرة، نمرره بدون تحميل كامل
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    // pipe - بدون ما نحفظ الملف
    const reader = upstream.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.writableEnded) res.write(Buffer.from(value));
      }
      res.end();
    };
    pump().catch(() => res.end());
    req.on('close', () => { try { reader.cancel(); } catch(e){} });

  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(502).send("Proxy error");
  }
});

// 3. بروكسي للمقاطع الداخلية .ts / .m3u8
app.get('/proxy', async (req, res) => {
  const target = req.query.u;
  if (!target) return res.status(400).send("No url");
  try {
    const upstream = await fetch(target, { headers: UPSTREAM_HEADERS });
    if (!upstream.ok) return res.status(502).send("Upstream error");
    const ct = upstream.headers.get('content-type') || 'video/MP2T';
    // اذا رجع m3u8 ثاني، نعيد كتابته هم
    if (ct.includes('mpegURL')) {
      let text = await upstream.text();
      const baseUrl = target.substring(0, target.lastIndexOf('/') + 1);
      const myBase = `${req.protocol}://${req.get('host')}`;
      text = text.split('\n').map(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return line;
        if (line.startsWith('http')) return `${myBase}/proxy?u=${encodeURIComponent(line)}`;
        return `${myBase}/proxy?u=${encodeURIComponent(baseUrl + line)}`;
      }).join('\n');
      res.setHeader('Content-Type', 'application/x-mpegURL');
      return res.send(text);
    }
    res.setHeader('Content-Type', ct);
    res.setHeader('Access-Control-Allow-Origin', '*');
    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!res.writableEnded) res.write(Buffer.from(value));
    }
    res.end();
  } catch (e) {
    if (!res.headersSent) res.status(502).send("Proxy error");
  }
});

app.get('/', (req, res) => res.send("Open TV - Render Proxy Online"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SUPABASE_URL = process.env.SUPABASE_URL || "https://djrljivwmwywammiuixr.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "sb_publishable_pHEayYHNNS-sPM4-sepq0A_jvpdgaUi";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===== قنواتك هنا =====
const CHANNELS = [
 {"name":"1 - bein sport 1","logo":"https://lo1.in/bss/bsS1.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677003"},
  {"name":"2 - bein sport 2","logo":"https://lo1.in/bss/bsS2.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677004"},
  {"name":"3 - bein sport 3","logo":"https://lo1.in/bss/bs3.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677005"},
  {"name":"4 - bein sport 4","logo":"https://lo1.in/bss/bs4.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677006"},
  {"name":"5 - bein sport 5","logo":"https://lo1.in/bein/beinn5.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677007"},
  {"name":"6 - bein sport 6","logo":"https://lo1.in/bein/beinn6.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677008"},
  {"name":"7 - bein sport 7","logo":"https://lo1.in/bss/BEIN SPORTS 07.png","url":"http://tyqw.site:2052/10675785266958/99039021857485/677009"},
  {"name":"8 - bein sport 8","logo":"https://lo1.in/bss/bss8.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/677010.m3u8"},
  {"name":"9 - ALWAN SPORT 1","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649689.m3u8"},
  {"name":"10 - ALWAN SPORT 2","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649690.m3u8"},
  {"name":"11 - ALWAN SPORT 3","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649691.m3u8"},
  {"name":"12 - ALWAN SPORT 4","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649692.m3u8"},
  {"name":"13 - ALWAN SPORT 5","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649693.m3u8"},
  {"name":"14 - ALWAN SPORT 6","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649694.m3u8"},
  {"name":"15 - ALWAN SPORT 7","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649695.m3u8"},
  {"name":"16 - ALWAN SPORT 8","logo":"https://lo1.in/fwc/ALWANS.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649696.m3u8"},
  {"name":"17 - STARZPLAY SPORTS 1","logo":"https://lo1.in/stplay1/adp1.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/67376.m3u8"},
  {"name":"18 - STARZPLAY SPORTS 2","logo":"https://lo1.in/stplay1/sadh2.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/67378.m3u8"},
  {"name":"19 - Thamanya Sport 1","logo":"https://images.seeklogo.com/logo-png/51/1/thmanyah-logo-png_seeklogo-518881.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/646086.m3u8"},
  {"name":"20 - Thamanya Sport 2","logo":"https://images.seeklogo.com/logo-png/51/1/thmanyah-logo-png_seeklogo-518881.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/646087.m3u8"},
  {"name":"21 - Alwan Aflam 1","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649714.m3u8"},
  {"name":"22 - Alwan Aflam 2","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649715.m3u8"},
  {"name":"23 - Alwan Aflam 3","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649716.m3u8"},
  {"name":"24 - Alwan Aflam 4","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649717.m3u8"},
  {"name":"25 - ALWAN TURKEY","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649718.m3u8"},
  {"name":"26 - Alwan Documentary","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649719.m3u8"},
  {"name":"27 - ALWAN ATFAL","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649720.m3u8"},
  {"name":"28 - ALWAN MOSALSALAT","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649721.m3u8"},
  {"name":"29 - ALWAN MOSALSALAT +","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649725.m3u8"},
  {"name":"30 - ALWAN ANIME","logo":"https://lo1.in/fwc/ALWAN.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/649726.m3u8"},
  {"name":"31 - BEIN MOVIES 1","logo":"https://lo1.in/beinn/beinm1pre0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/427.m3u8"},
  {"name":"32 - BEIN MOVIES 2","logo":"https://lo1.in/beinn/beinm2act0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/428.m3u8"},
  {"name":"33 - BEIN MOVIES 3","logo":"https://lo1.in/beinn/bm3.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/429.m3u8"},
  {"name":"34 - BEIN MOVIES 4","logo":"https://lo1.in/beinn/beinm4famm.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/430.m3u8"},
  {"name":"35 - BEIN SERIES 1","logo":"https://lo1.in/beinn/beinser100.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/431.m3u8"},
  {"name":"36 - BEIN SERIES 2","logo":"https://lo1.in/beinn/beinser20.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/432.m3u8"},
  {"name":"37 - BEIN DRAMA","logo":"https://lo1.in/beinn/beindra0.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/433.m3u8"},
  {"name":"38 - vivo OSCAR","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192835.m3u8"},
  {"name":"39 - vivo CLUB","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192834.m3u8"},
  {"name":"40 - vivo CINEMA 1","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192833.m3u8"},
  {"name":"41 - vivo CINEMA 2","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192832.m3u8"},
  {"name":"42 - vivo SHOWTIME","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192836.m3u8"},
  {"name":"43 - vivo PLUS","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192837.m3u8"},
  {"name":"44 - vivo SHOWTIME 2","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192836.m3u8"},
  {"name":"45 - vivo MOVIES","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192838.m3u8"},
  {"name":"46 - vivo SENTRAL","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192839.m3u8"},
  {"name":"47 - vivo WAR TIME","logo":"https://eliraqi.com.eg/images/thumbs/0012497_vivo_420.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192840.m3u8"},
  {"name":"48 - signal Comedy","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192634.m3u8"},
  {"name":"49 - signal ACTION","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192633.m3u8"},
  {"name":"50 - signal Cinema","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192635.m3u8"},
  {"name":"51 - signal AFLAM","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192636.m3u8"},
  {"name":"52 - signal CLASSIC","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192637.m3u8"},
  {"name":"53 - signal 90s AR","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192638.m3u8"},
  {"name":"54 - signal VOX","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192639.m3u8"},
  {"name":"55 - signal GOLD","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192640.m3u8"},
  {"name":"56 - signal ANIME AR","logo":"https://images.seeklogo.com/logo-png/12/2/signal-logo-png_seeklogo-126441.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192642.m3u8"},
  {"name":"57 - SHAHID ACTION 1","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192749.m3u8"},
  {"name":"58 - SHAHID ANIME 1","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192746.m3u8"},
  {"name":"59 - SHAHID ANIME 2","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192745.m3u8"},
  {"name":"60 - SHAHID Comedy","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192739.m3u8"},
  {"name":"61 - SHAHID ACTION 2","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192739.m3u8"},
  {"name":"62 - SHAHID MARVEL","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192740.m3u8"},
  {"name":"63 - SHAHID ASIAN","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192742.m3u8"},
  {"name":"64 - SHAHID BOLLYWOOD","logo":"https://lo1.in/fwc/shahid.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/192743.m3u8"},
  {"name":"65 - ACTION MOVIES","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCnyZPaaBaB1owfAyrhVdObsfr8PwJdrzJDKTKMLXB5ps3xDqti7Q2Cqh&s=10","url":"http://jbfgrjbn.fhkadvnp.com:80/live/7901885855/7610043061/1396793.m3u8"},
  {"name":"66 - SHAHID FILMS 1","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx001/playlist.m3u8"},
  {"name":"67 - SHAHID FILMS 2","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx007/playlist.m3u8"},
  {"name":"68 - SHAHID 1","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx017/playlist.m3u8"},
  {"name":"69 - SHAHID 2","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx015/playlist.m3u8"},
  {"name":"70 - SHAHID 3","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx014/playlist.m3u8"},
  {"name":"71 - SHAHID 4","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx010/playlist.m3u8"},
  {"name":"72 - SHAHID 5","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx013/playlist.m3u8"},
  {"name":"73 - SHAHID 6","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx003/playlist.m3u8"},
  {"name":"74 - SHAHID 7","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx005/playlist.m3u8"},
  {"name":"75 - SHAHID 8","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx008/playlist.m3u8"},
  {"name":"76 - SHAHID 9","logo":"https://lo1.in/fwc/shahid.png","url":"https://shd-amg-fast.edgenextcdn.net/tx009/playlist.m3u8"},
  {"name":"77 - THRILLER Movies","logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCnyZPaaBaB1owfAyrhVdObsfr8PwJdrzJDKTKMLXB5ps3xDqti7Q2Cqh&s=10","url":"https://shd-amg-fast.edgenextcdn.net/tx011/playlist.m3u8"},
  {"name":"78 - WILD","logo":"https://lo1.in/FCB/osnngp.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625061.m3u8"},
  {"name":"79 - travelXP","logo":"https://images.seeklogo.com/logo-png/63/1/travelxp-logo-png_seeklogo-632248.png","url":"http://stream.mcquack.net/451/index.m3u8"},
  {"name":"80 - trave","logo":"https://images.seeklogo.com/logo-png/32/1/travel-channel-logo-png_seeklogo-326359.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625063.m3u8"},
  {"name":"81 - Asharq Documentary 1","logo":"https://tlfaz.com/wp-content/uploads/2023/03/Asharq-Documentary.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625069.m3u8"},
  {"name":"82 - Animal Planet","logo":"https://lo1.in/ger/ANIMAL PLANET.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625075.m3u8"},
  {"name":"83 - H HISORY","logo":"https://logos-world.net/wp-content/uploads/2023/07/History-Logo.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625076.m3u8"},
  {"name":"84 - Discovery","logo":"https://logos-world.net/wp-content/uploads/2022/01/Discovery-Channel-Logo-2009.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625080.m3u8"},
  {"name":"85 - Asharq Documentary 1","logo":"https://tlfaz.com/wp-content/uploads/2023/03/Asharq-Documentary.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/625067.m3u8"},
  {"name":"86 - Al Jazeera Documents","logo":"https://i1.sndcdn.com/avatars-epnszgJqJz87Hupm-SB4uiw-t1080x1080.jpg","url":"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},
  {"name":"87 - Kids Music 1","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193350.m3u8"},
  {"name":"88 - Kids Music 2","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193347.m3u8"},
  {"name":"89 - Kids Music 3","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193346.m3u8"},
  {"name":"90 - Kids Music 4","logo":"https://www.shutterstock.com/image-photo/create-cartoon-logo-my-kid-260nw-2799354323.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193348.m3u8"},
  {"name":"91 - TOM And jerry 1","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193324.m3u8"},
  {"name":"92 - TOM And jerry 2","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193323.m3u8"},
  {"name":"93 - TOM And jerry 3","logo":"https://i.pinimg.com/originals/4f/cb/c8/4fcbc802581380b68951ad455b3e7208.png","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193321.m3u8"},
  {"name":"94 - Nickelodeon 1","logo":"https://m.eyeofriyadh.com/news_images/2015/11/630659467.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/151195.m3u8"},
  {"name":"95 - Nickelodeon 2","logo":"https://m.eyeofriyadh.com/news_images/2015/11/630659467.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/151192.m3u8"},
  {"name":"96 - pink panther 1","logo":"https://elyafgroup.com/cdn/shop/products/PINK-PANTHER_1080x.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193316.m3u8"},
  {"name":"97 - pink panther 2","logo":"https://elyafgroup.com/cdn/shop/products/PINK-PANTHER_1080x.jpg","url":"http://tyqw.site:2052/live/10675785266958/99039021857485/193317.m3u8"}
];

// ===== فحص المشترك من Supabase =====
async function getSubscriber(code) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}&select=*`, { headers });
  const data = await r.json();
  return data[0];
}

// ===== رابط القنوات للمشترك =====
app.get('/playlist', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(403).send("No code");
  const sub = await getSubscriber(code);
  if (!sub) return res.status(403).send("Code not found");
  if (!sub.active) return res.status(403).send("Account disabled");
  if (sub.expiry && new Date(sub.expiry) < new Date()) return res.status(403).send("Expired - انتهى اشتراكك");

  let m3u = "#EXTM3U\n";
  CHANNELS.forEach(c => {
    m3u += `#EXTINF:-1,${c.name}\n${c.url}\n`;
  });
  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.send(m3u);
});

// ===== لوحة الادمن =====
app.get('/admin', (req, res) => {
  res.send(`
  <!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة تحكم</title>
  <style>body{font-family:sans-serif;background:#111;color:#fff;padding:15px}input,select,button{padding:10px;margin:5px 0;width:100%;border-radius:8px;border:none}button{background:#e11d48;color:#fff;font-weight:bold}table{width:100%;background:#222;border-collapse:collapse;margin-top:15px}td,th{padding:8px;border:1px solid #333;text-align:center;font-size:13px}.card{background:#222;padding:12px;border-radius:10px;margin-bottom:10px}</style></head>
  <body><h2>📺 لوحة تحكم المشتركين</h2>
  <div class="card">
  <input id="pass" type="password" placeholder="كلمة سر الادمن - admin123">
  <input id="name" placeholder="اسم المشترك">
  <input id="code" placeholder="كود المشترك">
  <input id="expiry" type="date">
  <button onclick="addSub()">+ اضافة مشترك</button>
  </div>
  <div class="card"><input id="search" placeholder="بحث بالاسم او الكود..." oninput="load()"></div>
  <button onclick="exportCSV()">📥 تصدير اكسل CSV</button>
  <div id="list"></div>
  <script>
  async function load(){
    const pass=document.getElementById('pass').value;
    const q=document.getElementById('search').value||'';
    const r=await fetch('/api/subs?pass='+pass+'&q='+encodeURIComponent(q));
    const data=await r.json();
    let h='<table><tr><th>الاسم</th><th>الكود</th><th>انتهاء</th><th>حالة</th><th>اجراء</th></tr>';
    data.forEach(s=>{
      h+=\`<tr><td>\${s.name}</td><td>\${s.code}</td><td>\${s.expiry||''}</td><td>\${s.active?'✅ فعال':'⛔ موقوف'}</td><td><button onclick="renew('\${s.code}',30)">+30 يوم</button><button onclick="renew('\${s.code}',90)">+90</button><button onclick="toggle('\${s.code}',\${!s.active})">ايقاف/تشغيل</button><button onclick="delSub('\${s.code}')">حذف</button></td></tr>\`;
    });
    document.getElementById('list').innerHTML=h+'</table>';
  }
  async function addSub(){
    const pass=document.getElementById('pass').value;
    const body={name:document.getElementById('name').value,code:document.getElementById('code').value,expiry:document.getElementById('expiry').value,pass};
    await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    alert('تمت الاضافة'); load();
  }
  async function renew(code,days){
    const pass=document.getElementById('pass').value;
    await fetch('/api/renew',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,days,pass})});
    load();
  }
  async function toggle(code,active){
    const pass=document.getElementById('pass').value;
    await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active,pass})});
    load();
  }
  async function delSub(code){
    if(!confirm('متأكد حذف؟'))return;
    const pass=document.getElementById('pass').value;
    await fetch('/api/subs?pass='+pass+'&code='+code,{method:'DELETE'});
    load();
  }
  function exportCSV(){ const pass=document.getElementById('pass').value; window.open('/api/export?pass='+pass); }
  </script></body></html>`);
});

// ===== API =====
app.get('/api/subs', async (req, res) => {
  if (req.query.pass !== ADMIN_PASS) return res.status(401).json([]);
  let url = `${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc&limit=1000`;
  if (req.query.q) url += `&or=(name.ilike.*${encodeURIComponent(req.query.q)}*,code.ilike.*${encodeURIComponent(req.query.q)}*)`;
  const r = await fetch(url, { headers });
  res.json(await r.json());
});

app.post('/api/subs', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, { method: 'POST', headers, body: JSON.stringify({ name: req.body.name, code: req.body.code, expiry: req.body.expiry || null, active: true }) });
  res.json(await r.json());
});

app.post('/api/renew', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  const sub = await getSubscriber(req.body.code);
  if (!sub) return res.status(404).send("not found");
  let base = sub.expiry && new Date(sub.expiry) > new Date() ? new Date(sub.expiry) : new Date();
  base.setDate(base.getDate() + parseInt(req.body.days));
  const expiry = base.toISOString().split('T')[0];
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ expiry, active: true }) });
  res.json({ ok: true, expiry });
});

app.post('/api/toggle', async (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ active: req.body.active }) });
  res.json({ ok: true });
});

app.delete('/api/subs', async (req, res) => {
  if (req.query.pass !== ADMIN_PASS) return res.status(401).send("no");
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.query.code}`, { method: 'DELETE', headers });
  res.json({ ok: true });
});

app.get('/api/export', async (req, res) => {
  if (req.query.pass !== ADMIN_PASS) return res.status(401).send("no");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, { headers });
  const data = await r.json();
  let csv = "name,code,active,expiry\n";
  data.forEach(s => csv += `"${s.name}","${s.code}",${s.active},${s.expiry}\n`);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
});

app.get('/', (req, res) => res.send("TV Server - Supabase OK"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));

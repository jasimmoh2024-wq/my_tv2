// server.js - لوحة مشتركين + Render هو الموزع - للقنوات المفتوحة فقط
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
const ADMIN_PASS = process.env.ADMIN_PASS || "change-me";

const headers = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

// ===== هنا حط قنواتك المفتوحة فقط =====
// لازم يكون عندك اذن ببثها
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

const UPSTREAM_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': '*/*',
  'Connection': 'keep-alive',
};

const subCache = new Map();

function parseCookies(req){
  const c = {};
  (req.headers.cookie || '').split(';').forEach(p=>{
    const i = p.indexOf('=');
    if(i>-1) c[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1).trim());
  });
  return c;
}
function isAdmin(req){
  const cookies = parseCookies(req);
  return cookies.admin_auth === Buffer.from(ADMIN_PASS).toString('base64');
}
function requireAdmin(req,res,next){
  if(isAdmin(req)) return next();
  return res.redirect('/login');
}

// ===== تسجيل دخول الادمن =====
app.get('/login', (req, res) => {
  if(isAdmin(req)) return res.redirect('/admin');
  res.send(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>دخول الموزع</title><style>body{font-family:'Segoe UI',Tahoma,sans-serif;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}.box{background:#fff;width:100%;max-width:360px;padding:28px;border-radius:18px;text-align:center}input{width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:12px;font-size:16px;margin-bottom:12px;box-sizing:border-box}button{width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer}</style></head><body><div class="box"><h2>دخول الموزع</h2><form method="POST" action="/login"><input type="password" name="pass" placeholder="الباسورد" required autofocus><label><input type="checkbox" name="remember" checked> ابقى داخل 30 يوم</label><button>دخول</button></form>${req.query.err ? '<p style="color:red">باسورد غلط</p>' : ''}</div></body></html>`);
});
app.post('/login', (req, res) => {
  if(req.body.pass === ADMIN_PASS){
    const token = Buffer.from(ADMIN_PASS).toString('base64');
    const maxAge = req.body.remember === 'on' ? `; Max-Age=${30*24*60*60}` : '';
    res.setHeader('Set-Cookie', `admin_auth=${token}; Path=/; HttpOnly; SameSite=Lax${maxAge}`);
    return res.redirect('/admin');
  }
  res.redirect('/login?err=1');
});
app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.redirect('/login');
});

// ===== فحص المشترك من Supabase =====
async function getSubscriber(code) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}&select=*`, { headers });
  const data = await r.json();
  return data[0];
}
async function checkDevice(req, code, macParam, skipLock){
  const sub = await getSubscriber(code);
  if(!sub) return { ok:false, msg:"Code not found" };
  if(!sub.active) return { ok:false, msg:"الاشتراك موقوف" };
  if(sub.expiry && new Date(sub.expiry) < new Date()) return { ok:false, msg:"انتهى اشتراكك" };
  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  const mac = (macParam || '').toString().trim().toUpperCase();
  const now = new Date().toISOString();
  const lastSeen = sub.last_seen ? new Date(sub.last_seen).getTime() : 0;
  const diffMin = (Date.now() - lastSeen) / 60000;
  if(skipLock){
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    return { ok:true, sub };
  }
  if(!mac){
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    return { ok:true, sub };
  }
  const fingerprint = crypto.createHash('md5').update(mac).digest('hex');
  if(sub.device_id){
    if(sub.device_id !== fingerprint && diffMin < 2){
      return { ok:false, msg:"هذا الاشتراك يعمل على جهاز اخر - انتظر دقيقتين", sub };
    }
    if(sub.device_id !== fingerprint && diffMin >= 2){
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: mac, device_ip: ip, last_seen: now }) });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ last_seen: now, device_ip: ip }) });
    }
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${code}`, { method: 'PATCH', headers, body: JSON.stringify({ device_id: fingerprint, mac_address: mac || null, device_ip: ip, last_seen: now }) });
  }
  return { ok:true, sub };
}

// ===== قائمة القنوات - المشاهد ياخذ رابط Render فقط =====
async function sendPlaylist(req, res){
  const code = req.query.code;
  if (!code) return res.status(403).send("No code");
  const check = await checkDevice(req, code, req.query.mac || '', true);
  if(!check.ok) return res.status(403).send(check.msg);
  const base = `${req.protocol}://${req.get('host')}`;
  let m3u = "#EXTM3U\n";
  CHANNELS.forEach((c,i) => {
    m3u += `#EXTINF:-1 tvg-name="${c.name}",${c.name}\n${base}/live/${code}/${i}\n`;
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/x-mpegURL; charset=utf-8');
  res.send(m3u);
}
app.get('/playlist', sendPlaylist);
app.get('/playlist.m3u8', sendPlaylist);
app.get('/playlist.m3u', sendPlaylist);

// ===== Xtream - للرسيفر =====
app.get('/player_api.php', async (req, res) => {
  const username = req.query.username || '';
  const password = req.query.password || '';
  const action = req.query.action || '';
  if(!username || password !== username) return res.json({ user_info:{ auth:0, status:"Banned" }, server_info:{} });
  const isList = action === 'get_live_categories' || action === 'get_live_streams';
  const check = await checkDevice(req, username, req.query.mac || '', isList);
  if(!check.ok) return res.json({ user_info:{ auth:0, status:"Banned", message: check.msg }, server_info:{} });
  const sub = check.sub;
  const host = req.get('host');
  const proto = req.protocol;
  if(action === 'get_live_categories') return res.json([{ category_id:"1", category_name:"Live", parent_id:0 }]);
  if(action === 'get_live_streams'){
    return res.json(CHANNELS.map((c,i)=>({
      num: i+1, name: c.name, stream_type:"live", stream_id: i+1,
      stream_icon:"", category_id:"1",
      direct_source: `${proto}://${host}/live/${username}/${i}.ts`,
    })));
  }
  const exp = sub.expiry ? Math.floor(new Date(sub.expiry).getTime()/1000) : Math.floor(Date.now()/1000)+365*24*3600;
  return res.json({
    user_info:{ username, password, auth:1, status:"Active", exp_date:String(exp), is_trial:"0", active_cons:"1", max_connections:"1", allowed_output_formats:["m3u8","ts"] },
    server_info:{ url: host, port:"443", https_port:"443", server_protocol:"https", timezone:"Asia/Baghdad", timestamp_now: Math.floor(Date.now()/1000) }
  });
});

// ===== التوزيع الرئيسي - Render يجيب ويوزع، مو Redirect =====
app.get('/live/:code/:id', async (req, res) => {
  const { code, id } = req.params;
  const cached = subCache.get(code);
  if(!cached || Date.now() - cached.time > 15*60*1000){
    const check = await checkDevice(req, code, req.query.mac || '', true);
    if(!check.ok) return res.status(403).send(check.msg);
    subCache.set(code, { time: Date.now() });
  }
  const idx = parseInt(id.replace('.ts','').replace('.m3u8',''));
  const ch = CHANNELS[idx];
  if(!ch) return res.status(404).send("Channel not found");

  try {
    const upstream = await fetch(ch.url, { headers: UPSTREAM_HEADERS });
    if(!upstream.ok) return res.status(502).send("Upstream error");
    const ct = upstream.headers.get('content-type') || '';
    // اذا m3u8 نعيد كتابة الروابط لتمر عبر Render
    if(ct.includes('mpegURL') || ch.url.includes('.m3u8')){
      let text = await upstream.text();
      const baseUrl = ch.url.substring(0, ch.url.lastIndexOf('/') + 1);
      const myBase = `${req.protocol}://${req.get('host')}`;
      text = text.split('\n').map(line => {
        line = line.trim();
        if(!line || line.startsWith('#')) return line;
        if(line.startsWith('http')) return `${myBase}/proxy/${code}?u=${encodeURIComponent(line)}`;
        return `${myBase}/proxy/${code}?u=${encodeURIComponent(baseUrl + line)}`;
      }).join('\n');
      res.setHeader('Content-Type', 'application/x-mpegURL');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(text);
    }
    // فيديو مباشر
    res.setHeader('Content-Type', ct);
    res.setHeader('Access-Control-Allow-Origin', '*');
    const reader = upstream.body.getReader();
    req.on('close', ()=>{ try{reader.cancel()}catch(e){} });
    while(true){
      const {done, value} = await reader.read();
      if(done) break;
      if(!res.writableEnded) res.write(Buffer.from(value));
    }
    res.end();
  } catch(e){
    if(!res.headersSent) res.status(502).send("Proxy error");
  }
});

// ===== بروكسي المقاطع الداخلية =====
app.get('/proxy/:code', async (req, res) => {
  const target = req.query.u;
  if(!target) return res.status(400).send("No url");
  // فحص سريع من الكاش، ما نفحص Supabase كل مقطع
  const cached = subCache.get(req.params.code);
  if(!cached || Date.now() - cached.time > 15*60*1000){
    const check = await checkDevice(req, req.params.code, '', true);
    if(!check.ok) return res.status(403).send(check.msg);
    subCache.set(req.params.code, { time: Date.now() });
  }
  try{
    const upstream = await fetch(target, { headers: UPSTREAM_HEADERS });
    if(!upstream.ok) return res.status(502).send("Upstream error");
    const ct = upstream.headers.get('content-type') || 'video/MP2T';
    if(ct.includes('mpegURL')){
      let text = await upstream.text();
      const baseUrl = target.substring(0, target.lastIndexOf('/') + 1);
      const myBase = `${req.protocol}://${req.get('host')}`;
      text = text.split('\n').map(line=>{
        line=line.trim();
        if(!line || line.startsWith('#')) return line;
        if(line.startsWith('http')) return `${myBase}/proxy/${req.params.code}?u=${encodeURIComponent(line)}`;
        return `${myBase}/proxy/${req.params.code}?u=${encodeURIComponent(baseUrl + line)}`;
      }).join('\n');
      res.setHeader('Content-Type','application/x-mpegURL');
      return res.send(text);
    }
    res.setHeader('Content-Type', ct);
    res.setHeader('Access-Control-Allow-Origin','*');
    const reader = upstream.body.getReader();
    while(true){
      const {done, value} = await reader.read();
      if(done) break;
      if(!res.writableEnded) res.write(Buffer.from(value));
    }
    res.end();
  }catch(e){ if(!res.headersSent) res.status(502).send("Proxy error"); }
});

// ===== لوحة الادمن - نفس لوحتك القديمة =====
app.get('/admin', requireAdmin, (req, res) => {
  res.send(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة تحكم</title><style>*{box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f1f5f9;margin:0;padding:20px}.wrap{max-width:1000px;margin:auto}.header{background:#fff;padding:18px;border-radius:16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.card{background:#fff;padding:16px;border-radius:16px;margin-bottom:14px}input{padding:8px 10px;width:100%;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.btn{padding:10px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;width:100%}.btn-add{background:#2563eb;color:#fff}.btn-small{width:auto;padding:6px 10px;font-size:12px;border-radius:8px;margin:2px;border:none;cursor:pointer;font-weight:bold}.btn-green{background:#dcfce7;color:#166534}.btn-red{background:#fee2e2;color:#991b1b}.btn-gray{background:#f1f5f9}.btn-orange{background:#fef3c7;color:#92400e}.btn-blue{background:#dbeafe;color:#1e40af}table{width:100%;background:#fff;border-collapse:collapse;border-radius:16px;overflow:hidden}th{background:#f8fafc;padding:10px;font-size:12px}td{padding:10px;border-top:1px solid #f1f5f9;text-align:center;font-size:12px}</style></head><body><div class="wrap"><div class="header"><h2>لوحة تحكم المشتركين - Render موزع</h2><a href="/logout" style="background:#fee2e2;color:#991b1b;padding:8px 14px;border-radius:10px;text-decoration:none;font-weight:bold">خروج</a></div><div class="card"><h3>اضافة مشترك جديد</h3><div class="grid"><div><label>اسم المشترك</label><input id="name" placeholder=" "></div><div><label>كود المشترك</label><input id="code" placeholder=" "></div><div><label>MAC (اختياري)</label><input id="mac" placeholder="اتركه فارغ"></div><div><label>تاريخ الانتهاء</label><input id="expiry" type="date"></div></div><button class="btn btn-add" onclick="addSub()">+ اضافة مشترك</button></div><div class="card"><input id="search" placeholder="ابحث بالاسم او الكود..." oninput="load()"></div><div id="list"></div></div><script>async function load(){const q=document.getElementById('search').value||'';const r=await fetch('/api/subs?q='+encodeURIComponent(q));if(r.status===401){location.href='/login';return;}const data=await r.json();if(!data.length){document.getElementById('list').innerHTML='<div class="card" style="text-align:center">لا يوجد مشتركين</div>';return;}let h='<table><tr><th>الاسم / الكود</th><th>MAC</th><th>الانتهاء</th><th>حالة</th><th>اجراء</th></tr>';data.forEach(s=>{h+=\`<tr><td><b>\${s.name}</b><br>\${s.code}<br><button class="btn-small btn-blue" onclick="copyLink('\${s.code}')">نسخ رابط VLC</button><br><button class="btn-small btn-orange" onclick="copyXtream('\${s.code}')">نسخ Xtream</button></td><td>\${s.mac_address||'-'}<br><button class="btn-small btn-blue" onclick="saveMac('\${s.code}')">حفظ MAC</button></td><td><input type="date" id="date-\${s.code}" value="\${s.expiry||''}"><br><button class="btn-small btn-green" onclick="saveDate('\${s.code}')">حفظ</button></td><td>\${s.active?'فعال':'موقوف'}</td><td><button class="btn-small btn-orange" onclick="resetDevice('\${s.code}')">فك ربط</button><br><button class="btn-small btn-gray" onclick="toggle('\${s.code}',\${!s.active})">ايقاف/تشغيل</button><button class="btn-small btn-red" onclick="delSub('\${s.code}')">حذف</button></td></tr>\`});document.getElementById('list').innerHTML=h+'</table>';}function copyLink(code){const base=location.origin+'/playlist?code='+code;navigator.clipboard.writeText(base);alert('تم نسخ:\\n'+base);}function copyXtream(code){const txt='Server: '+location.origin+'\\nUsername: '+code+'\\nPassword: '+code;navigator.clipboard.writeText(txt);alert('تم نسخ:\\n\\n'+txt);}async function addSub(){const body={name:document.getElementById('name').value,code:document.getElementById('code').value,mac_address:document.getElementById('mac').value.toUpperCase(),expiry:document.getElementById('expiry').value};if(!body.name||!body.code) return alert('اكتب الاسم والكود');const r=await fetch('/api/subs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json();if(!r.ok||j.error) return alert('فشل: '+JSON.stringify(j));alert('تمت الاضافة');load();}async function saveDate(code){const expiry=document.getElementById('date-'+code).value;await fetch('/api/update-date',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,expiry})});alert('تم');load();}async function saveMac(code){const mac=prompt('MAC الجديد');if(mac===null) return;await fetch('/api/update-mac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,mac_address:mac.toUpperCase()})});load();}async function toggle(code,active){await fetch('/api/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,active})});load();}async function resetDevice(code){await fetch('/api/reset-device',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});alert('تم فك الربط');load();}async function delSub(code){if(!confirm('متأكد؟'))return;await fetch('/api/subs?code='+code,{method:'DELETE'});load();}load();</script></body></html>`);
});

// ===== API لوحة الادمن =====
app.get('/api/subs', requireAdmin, async (req, res) => {
  let url = `${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc&limit=1000`;
  if (req.query.q) url += `&or=(name.ilike.*${encodeURIComponent(req.query.q)}*,code.ilike.*${encodeURIComponent(req.query.q)}*)`;
  const r = await fetch(url, { headers });
  res.json(await r.json());
});
app.post('/api/subs', requireAdmin, async (req, res) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, { method: 'POST', headers, body: JSON.stringify({ name: req.body.name, code: req.body.code, mac_address: req.body.mac_address || null, expiry: req.body.expiry || null, active: true }) });
  const j = await r.json();
  if(!r.ok) return res.status(r.status).json(j);
  res.json(j);
});
app.post('/api/update-date', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ expiry: req.body.expiry }) });
  res.json({ ok: true });
});
app.post('/api/update-mac', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: req.body.mac_address || null }) });
  res.json({ ok: true });
});
app.post('/api/toggle', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ active: req.body.active }) });
  res.json({ ok: true });
});
app.post('/api/reset-device', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.body.code}`, { method: 'PATCH', headers, body: JSON.stringify({ mac_address: null, device_id: null, device_ip: null, last_seen: null }) });
  res.json({ ok: true });
});
app.delete('/api/subs', requireAdmin, async (req, res) => {
  await fetch(`${SUPABASE_URL}/rest/v1/subscribers?code=eq.${req.query.code}`, { method: 'DELETE', headers });
  res.json({ ok: true });
});

app.get('/', (req, res) => res.send("Open TV - Render Proxy Online"));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Running " + PORT));

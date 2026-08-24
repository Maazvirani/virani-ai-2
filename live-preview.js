(()=>{
 const PANEL_ID='vwLivePreview';
 function esc(s){return s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
 window.openLivePreview=async function(projectId,userId){
  const sb=window.supabase.createClient('https://hfczfnaaqwsmvgahiygc.supabase.co','sb_publishable_AfyF3k8-uEzorkoYC98D-Q_QRlgkuvS');
  const r=await sb.from('project_files').select('path,content').eq('project_id',projectId).eq('user_id',userId).order('path');
  const files=r.data||[];let html=files.find(f=>f.path.toLowerCase().endsWith('.html'))?.content||'';if(!html){html='<!doctype html><html><body style="font-family:system-ui;padding:24px"><h2>Virani Preview</h2><p>No HTML file found in this project.</p></body></html>'}
  const css=files.filter(f=>f.path.toLowerCase().endsWith('.css')).map(f=>`<style>${f.content}</style>`).join('');
  const js=files.filter(f=>f.path.toLowerCase().endsWith('.js')).map(f=>`<script>${f.content}\\n<\\/script>`).join('');
  const doc=html.replace('</head>',css+'</head>').replace('</body>',js+'</body>');
  let p=document.getElementById(PANEL_ID);if(!p){p=document.createElement('div');p.id=PANEL_ID;p.style='position:fixed;inset:30px;background:#fff;z-index:9999;border-radius:12px;box-shadow:0 20px 80px #0008;overflow:hidden';p.innerHTML='<div style="height:42px;background:#171a1f;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font:13px system-ui"><b>Live Preview</b><button id="vwLpClose" style="background:#0f1114;color:#fff;border:1px solid #303640;border-radius:7px;padding:5px 9px">Close</button></div><iframe style="width:100%;height:calc(100% - 42px);border:0;background:#fff"></iframe>';document.body.appendChild(p);document.getElementById('vwLpClose').onclick=()=>p.remove()}
  p.querySelector('iframe').srcdoc=doc;
 }
})();

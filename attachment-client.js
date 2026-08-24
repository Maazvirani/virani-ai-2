(()=>{
 const SUPA_URL='https://hfczfnaaqwsmvgahiygc.supabase.co';
 const SUPA_KEY='sb_publishable_AfyF3k8-uEzorkoYC98D-Q_QRlgkuvS';
 const UPLOAD=SUPA_URL+'/functions/v1/virani-files', BRAIN=SUPA_URL+'/functions/v1/virani-gemini';
 const fileInput=document.getElementById('viraniFileInput'), attach=document.getElementById('attachButton'), label=document.getElementById('viraniFileLabel'), input=document.getElementById('messageInput'), send=document.getElementById('sendButton'), messages=document.getElementById('messages'), thinking=document.getElementById('typing');
 if(!fileInput||!attach||!input||!send)return;
 const sb=window.supabase.createClient(SUPA_URL,SUPA_KEY);
 let selected=null;
 attach.onclick=(e)=>{e.preventDefault();e.stopPropagation();fileInput.click()};
 fileInput.onchange=()=>{selected=fileInput.files?.[0]||null;if(label){label.textContent=selected?selected.name:'';label.style.display=selected?'inline-block':'none'}};
 function addAssistant(text){const row=document.createElement('div');row.className='message-row assistant';const b=document.createElement('div');b.className='bubble';b.textContent=text;row.appendChild(b);messages?.appendChild(row);if(messages)messages.scrollTop=messages.scrollHeight}
 async function upload(file,token){const fd=new FormData();fd.append('file',file,file.name);const r=await fetch(UPLOAD,{method:'POST',headers:{Authorization:'Bearer '+token},body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error||'File upload failed');return d.file.id}
 async function analyze(fileId,token,message){const r=await fetch(BRAIN,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({message:message||'Analyze this attached file. Describe what it contains and the most important information.',file_id:fileId})});const d=await r.json();if(!r.ok)throw new Error(d.error||'File analysis failed');return d.reply}
 send.addEventListener('click',async e=>{
   if(!selected)return;
   e.preventDefault();e.stopImmediatePropagation();send.disabled=true;if(thinking)thinking.style.display='block';
   try{
     const session=(await sb.auth.getSession()).data.session;
     if(!session)throw new Error('Please sign in again.');
     const question=input.value.trim()||'Analyze this attached file and tell me the most important points.';
     input.value='';
     const id=await upload(selected,session.access_token);
     const reply=await analyze(id,session.access_token,question);
     addAssistant(reply);
     selected=null;fileInput.value='';if(label)label.style.display='none';
   }catch(err){addAssistant('I could not analyze that file: '+(err.message||'Please try again.'))}
   finally{if(thinking)thinking.style.display='none';send.disabled=false;input.focus()}
 },true);
})();

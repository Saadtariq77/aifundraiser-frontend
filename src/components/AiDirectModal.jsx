import ReactMarkdown from 'react-markdown'
import { Brain, X, Copy, Target, Calendar, ShieldAlert, Sparkles } from 'lucide-react'

export default function AiDirectModal({ open, onClose, data, loading, country }){
  if(!open) return null
  const conf = data?.confidence
  const color = conf==='HIGH' ? '#065F46' : conf==='LOW' ? '#64748B' : '#92400E'
  const bg = conf==='HIGH' ? '#E6F4F1' : conf==='LOW' ? '#F1F5F9' : '#FFFBEB'

  const copy = ()=>{ if(data?.reasoning) navigator.clipboard.writeText(data.reasoning) }

  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(124,45,18,0.55)', backdropFilter:'blur(6px)', display:'grid', placeItems:'center', padding:20, zIndex:60}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%', maxWidth:880, background:'white', borderRadius:18, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.35)', maxHeight:'90vh', display:'flex', flexDirection:'column', animation:'slideDown 0.25s ease'}}>
        
        <div style={{background:'linear-gradient(135deg, #431407 0%, #9A3412 50%, #EA580C 100%)', padding:'16px 18px', color:'white', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <div style={{background:'white', padding:9, borderRadius:10}}><Brain size={18} color="#9A3412"/></div>
            <div>
              <div style={{fontWeight:800, fontSize:13, letterSpacing:0.3, display:'flex', gap:6, alignItems:'center'}}>DIRECT AI DECISION <span style={{fontWeight:600, fontSize:10, background:'rgba(255,255,255,0.2)', padding:'2px 7px', borderRadius:10, border:'1px solid rgba(255,255,255,0.3)'}}>RAW → GEMINI</span></div>
              <div style={{fontSize:11, opacity:0.95}}>Scoped to <b>{country?.toUpperCase()}</b> • Gemini is reading the data...</div>
            </div>
          </div>
          <div style={{display:'flex', gap:8}}>
            {data && <button onClick={copy} style={{background:'rgba(255,255,255,0.15)', border:'none', color:'white', padding:'8px 10px', borderRadius:8, cursor:'pointer'}}><Copy size={14}/></button>}
            <button onClick={onClose} style={{background:'rgba(255,255,255,0.15)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer'}}><X size={16}/></button>
          </div>
        </div>

        {loading ? (
          <div style={{padding:24}}>
            <div style={{height:14, background:'#FEEBC8', borderRadius:6, marginBottom:10, animation:'pulse 1s infinite'}}></div>
            <div style={{height:14, background:'#FFEDD5', borderRadius:6, width:'75%', marginBottom:10, animation:'pulse 1s infinite'}}></div>
            <div style={{height:14, background:'#FEF3C7', borderRadius:6, width:'55%', animation:'pulse 1s infinite'}}></div>
            <div style={{marginTop:14, fontSize:12, color:'#9A3412', display:'flex', gap:6, alignItems:'center'}}><Sparkles size={14}/> Gemini analyzing <b>{country}</b> raw signals...</div>
          </div>
        ) : !data ? (
          <div style={{padding:30, textAlign:'center', color:'#6B7D7A', fontSize:13}}>No data</div>
        ) : (
          <>
            <div style={{display:'flex', gap:12, padding:'14px 18px', background:bg, borderBottom:'1px solid #FDE68A', alignItems:'center', flexWrap:'wrap'}}>
              <div style={{flex:1, minWidth:220}}>
                <div style={{fontSize:11, color:'#6B7D7A', fontWeight:700}}>RECOMMENDED CAMPAIGN</div>
                <div style={{fontWeight:800, fontSize:16, color:'#7C2D12', marginTop:2}}>{data.campaignTitle || 'Campaign'}</div>
                <div style={{fontSize:12, color:'#334155', marginTop:2}}>{data.recommendedCountry?.toUpperCase()} • {data.recommendedCategory} • <b>{data.launchWindow}</b></div>
              </div>
              <span style={{background: color, color:'white', padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:800}}>{data.confidence || 'MEDIUM'}</span>
            </div>

            <div style={{overflow:'auto', padding:'16px 18px', display:'grid', gridTemplateColumns:'1fr 260px', gap:16}}>
              <div style={{background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:14}}>
                <div style={{fontWeight:700, fontSize:11, color:'#9A3412', display:'flex', gap:6, alignItems:'center', marginBottom:6}}><ShieldAlert size={13}/> AI REASONING — FOR {country?.toUpperCase()} ONLY</div>
                <div style={{fontSize:13, lineHeight:1.6, whiteSpace:'pre-wrap'}}>
                  <ReactMarkdown components={{
                    p: ({children}) => <p style={{margin:'6px 0'}}>{children}</p>,
                    li: ({children}) => <li style={{marginBottom:4}}>{children}</li>,
                    strong: ({children}) => <strong style={{color:'#7C2D12'}}>{children}</strong>
                  }}>{data.reasoning || ''}</ReactMarkdown>
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                <div style={{background:'#F8F9F6', border:'1px solid #E6ECEA', borderRadius:12, padding:12}}>
                  <div style={{fontWeight:700, fontSize:11, display:'flex', gap:6}}><Calendar size={13}/> Launch Window</div>
                  <div style={{fontSize:12, marginTop:4, fontWeight:700, color}}>{data.launchWindow==='NOW'?'➤ Launch NOW': data.launchWindow==='NEXT_2_WEEKS'?'➤ Next 2 Weeks':'➤ Next Month'}</div>
                  <div style={{fontSize:11, color:'#6B7D7A'}}>For {country} only</div>
                </div>
                <div style={{background:'white', border:'1px solid #E6ECEA', borderRadius:12, padding:12}}>
                  <div style={{fontWeight:700, fontSize:11, display:'flex', gap:6}}><Target size={13}/> Evidence</div>
                  <ul style={{margin:'6px 0 0 16px', padding:0, fontSize:11, lineHeight:1.6, color:'#334155'}}>
                    {(data.evidence||[]).slice(0,5).map((e,i)=><li key={i}>{e}</li>)}
                    {(!data.evidence || data.evidence.length===0) && <li style={{color:'#6B7D7A'}}>See reasoning</li>}
                  </ul>
                </div>
              </div>
            </div>
            <div style={{padding:'8px 16px', background:'#FFF7ED', borderTop:'1px solid #FDE68A', fontSize:10, color:'#9A3412'}}>⚠️ Direct mode is experimental — not deterministic. Filtered to <b>{country}</b> • Compare with scored ranking above.</div>
          </>
        )}
      </div>
      <style>{`@keyframes slideDown{from{opacity:0; transform:translateY(-8px)} to{opacity:1; transform:translateY(0)}} @keyframes pulse{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}`}</style>
    </div>
  )
}
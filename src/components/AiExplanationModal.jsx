import ReactMarkdown from 'react-markdown'
import { Sparkles, Target, Calendar, ShieldAlert, Lightbulb, X, Copy } from 'lucide-react'
import ScoreGauge from './ScoreGauge'

export default function AiExplanationModal({ selected, aiText, aiLoading, onClose }){
  if(!selected) return null
  const score = selected.totalScore
  const color = score>=70?'#0B5145': score>=50?'#92400E':'#64748B'
  const bg = score>=70?'#E6F4F1': score>=50?'#FFFBEB':'#F1F5F9'
  const label = score>=70?'LAUNCH NOW': score>=50?'WATCH - NEXT 2 WEEKS':'LOW OPPORTUNITY'

  const copy = ()=> navigator.clipboard.writeText(aiText)

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(8,51,44,0.55)',backdropFilter:'blur(6px)',display:'grid',placeItems:'center',padding:20,zIndex:50,animation:'fadeIn 0.2s'}}>
      <div onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:900,background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.25)',maxHeight:'90vh',display:'flex',flexDirection:'column'}}>
        
        {/* HEADER */}
        <div style={{background:'linear-gradient(135deg, #08332C 0%, #0B5145 50%, #147A67 100%)',padding:'20px 24px',color:'white',display:'flex',justifyContent:'space-between'}}>
          <div style={{display:'flex',gap:14,alignItems:'center'}}>
            <div style={{background:'white',padding:10,borderRadius:12}}><Sparkles color='#0B5145' size={20}/></div>
            <div>
              <div style={{fontWeight:800,fontSize:15,letterSpacing:0.3}}>AI RECOMMENDATION INTELLIGENCE</div>
              <div style={{fontSize:12,opacity:0.9}}>Gemini Flash Latest • Deterministic Score + AI Reasoning</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:36,height:36,borderRadius:10,cursor:'pointer'}}><X size={18}/></button>
        </div>

        {/* SCORE BAR */}
        <div style={{display:'flex',gap:16,padding:'16px 24px',background:bg,borderBottom:'1px solid #E6ECEA',alignItems:'center'}}>
          <ScoreGauge score={score}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:'#6B7D7A',fontWeight:600}}>{selected.category} • {selected.country.toUpperCase()}</div>
            <div style={{fontWeight:800,fontSize:18,color}}>{score.toFixed(1)}/100 — {label}</div>
            <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
              {Object.entries(selected.breakdown||{}).map(([k,v])=>(
                <span key={k} style={{background:'white',border:'1px solid #E6ECEA',padding:'5px 10px',borderRadius:20,fontSize:11}}>
                  {k.replace('_',' ')} <b style={{color}}>{v}</b>
                </span>
              ))}
              <span style={{background: selected.confidence==='HIGH'?'#065F46':'#FEF3C7',color:selected.confidence==='HIGH'?'white':'#92400E',padding:'5px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>{selected.confidence} CONFIDENCE</span>
            </div>
          </div>
          <button onClick={copy} style={{background:'white',border:'1px solid #E6ECEA',padding:'8px 12px',borderRadius:10,cursor:'pointer',display:'flex',gap:6,alignItems:'center',fontSize:12}}><Copy size={14}/> Copy</button>
        </div>

        <div style={{overflow:'auto',padding:'20px 24px',display:'grid',gridTemplateColumns:'1fr 280px',gap:20}}>
          {/* MARKDOWN CONTENT */}
          <div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
              <Lightbulb size={16} color='#C9A227'/> <span style={{fontWeight:700,color:'#0B5145',fontSize:13}}>WHY THIS SCORE — AI EXPLANATION</span>
            </div>
            <div style={{background:'#F8F9F6',border:'1px solid #E6ECEA',borderRadius:14,padding:18,minHeight:260}}>
              {aiLoading ? (
                <div>
                  <div style={{height:14,background:'#E6ECEA',borderRadius:6,marginBottom:10,animation:'pulse 1s infinite'}}></div>
                  <div style={{height:14,background:'#E6ECEA',borderRadius:6,width:'80%',marginBottom:10,animation:'pulse 1s infinite'}}></div>
                  <div style={{height:14,background:'#E6ECEA',borderRadius:6,width:'60%',animation:'pulse 1s infinite'}}></div>
                  <div style={{marginTop:14,fontSize:12,color:'#6B7D7A'}}>Generating explanation via Gemini Flash Latest...</div>
                </div>
              ) : (
                <div style={{fontSize:13.5,lineHeight:1.7,color:'#1A2E2A'}} className="markdown">
                  <ReactMarkdown
                    components={{
                      h3: ({children}) => <h3 style={{color:'#0B5145',margin:'14px 0 8px',fontSize:14,display:'flex',gap:6,alignItems:'center',borderBottom:'1px solid #E6ECEA',paddingBottom:6}}>{children}</h3>,
                      strong: ({children}) => <strong style={{color:'#08332C'}}>{children}</strong>,
                      li: ({children}) => <li style={{marginBottom:6,marginLeft:4}}>{children}</li>,
                      p: ({children}) => <p style={{margin:'8px 0'}}>{children}</p>
                    }}
                  >
                    {aiText}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div style={{marginTop:10,fontSize:11,color:'#6B7D7A',background:'#FFFBEB',border:'1px dashed #F59E0B',padding:'8px 10px',borderRadius:8}}>
              <b>ℹ️ AI does not calculate the score.</b> Score is deterministic: <code>SUM(signal*weight)</code>. AI only explains evidence.
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="card" style={{padding:14,background:'#F8F9F6'}}>
              <div style={{fontWeight:700,fontSize:12,display:'flex',gap:6,alignItems:'center'}}><Target size={14} color='#0B5145'/> Breakdown Visual</div>
              <div style={{marginTop:10}}>
                {Object.entries(selected.breakdown||{}).map(([k,v])=>(
                  <div key={k} style={{marginBottom:8}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}><span>{k}</span><b>{v}</b></div>
                    <div style={{height:6,background:'#E6ECEA',borderRadius:10,overflow:'hidden',marginTop:4}}><div style={{width:`${v}%`,height:'100%',background: v>70?'#0B5145': v>40?'#EAB308':'#94A3B8'}}/></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{padding:14,background:'#FFFBEB',border:'1px solid #FDE68A'}}>
              <div style={{fontWeight:700,fontSize:12,display:'flex',gap:6}}><Calendar size={14} color='#92400E'/> Suggested Timeline</div>
              <div style={{fontSize:12,marginTop:6,lineHeight:1.6}}>
                {score>=70?<span style={{color:'#065F46',fontWeight:700}}>➤ Launch NOW</span>: score>=50?<span style={{color:'#92400E',fontWeight:700}}>➤ Next 2 Weeks</span>:<span>➤ Next Month</span>}
                <div style={{color:'#6B7D7A'}}>Urgency based on search spike + news velocity.</div>
              </div>
            </div>
            <div className="card" style={{padding:14}}>
              <div style={{fontWeight:700,fontSize:12,display:'flex',gap:6}}><ShieldAlert size={14}/> Evidence</div>
              <ul style={{margin:'8px 0 0 16px',padding:0,fontSize:11,lineHeight:1.6,color:'#334155'}}>
                {(selected.evidenceBundle?.evidences||[]).slice(0,5).map((e,i)=><li key={i} style={{marginBottom:4}}>{e}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes pulse{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}} .markdown ul{margin:6px 0 6px 18px}`}</style>
    </div>
  )
}
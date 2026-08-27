import ScoreGauge from './ScoreGauge'
export default function OpportunityCard({item, onExplain}){
  const badge = item.confidence==='HIGH'?'badge-high': item.confidence==='MEDIUM'?'badge-medium':'badge-low'
  const evidence = item.evidenceBundle?.evidences || []
  return (
    <div className="card" style={{borderLeft:`5px solid ${item.totalScore>=70?'#0B5145': item.totalScore>=50?'#EAB308':'#CBD5E1'}`}}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div><div style={{fontWeight:700}}>{item.category} • {item.country.toUpperCase()}</div>
        <div className={badge} style={{display:'inline-block',padding:'4px 10px',borderRadius:20,fontSize:11,marginTop:6}}>{item.confidence} • {evidence.length} SIGNALS</div></div>
        <ScoreGauge score={item.totalScore}/>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
        {Object.entries(item.breakdown||{}).map(([k,v])=><span key={k} style={{background:'#F8F9F6',border:'1px solid #E6ECEA',padding:'6px 10px',borderRadius:10,fontSize:12}}>{k}: <b>{v}</b></span>)}
      </div>
      <div style={{background:'#FFFBEB',border:'1px dashed #F59E0B',borderRadius:10,padding:12,marginTop:12,fontSize:13}}>
        <b style={{color:'#92400E'}}>Top Evidence:</b> {evidence.slice(0,2).join(' • ')}
      </div>
      <button className="btn-primary" onClick={()=>onExplain(item)} style={{width:'100%',marginTop:14}}>✨ AI Explain — Why this score?</button>
    </div>
  )
}
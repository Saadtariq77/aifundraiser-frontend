export default function ScoreGauge({score}){
  const pct = Math.min(100, Math.max(0,score))
  const color = pct>=70?'#0B5145': pct>=50?'#D97706':'#94A3B8'
  const stroke = 2*Math.PI*54 * pct/100
  return (
    <div style={{position:'relative',width:120,height:120}}>
      <svg width="120" height="120"><circle cx="60" cy="60" r="54" stroke="#E6ECEA" strokeWidth="10" fill="none"/>
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${stroke} 339`} transform="rotate(-90 60 60)"/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',textAlign:'center'}}>
        <div><div style={{fontSize:28,fontWeight:800,color}}>{score.toFixed(1)}</div><div style={{fontSize:10,color:'#6B7D7A'}}>OPPORTUNITY</div></div>
      </div>
    </div>
  )
}
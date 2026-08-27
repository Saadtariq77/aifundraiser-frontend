import { Sparkles, HeartHandshake } from 'lucide-react'
export default function Header(){
 return (
  <div className="header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <div style={{display:'flex',gap:14,alignItems:'center'}}>
      <div style={{background:'white',padding:'10px',borderRadius:12}}><HeartHandshake color='#0B5145'/></div>
      <div>
        <div style={{fontWeight:800,letterSpacing:0.5,fontSize:18}}>BAITUSSALAM <span style={{fontWeight:400,opacity:0.9}}>| NOIP</span></div>
        <div style={{fontSize:12,opacity:0.85}}>NGO Opportunity Intelligence Platform — AI-Powered Fundraising Decision Support</div>
      </div>
    </div>
    <div style={{display:'flex',gap:8,alignItems:'center',background:'rgba(255,255,255,0.15)',padding:'8px 14px',borderRadius:20}}>
      <Sparkles size={16}/> <span style={{fontSize:13}}>Gemini Flash Latest</span>
    </div>
  </div>
 )
}
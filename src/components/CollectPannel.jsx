import { useEffect, useState } from 'react'
import { getOptions, collect, collectBatch, refresh } from '../services/api'

export default function CollectPanel({ onDone }){
  const [countries,setCountries]=useState([])
  const [categories,setCategories]=useState([])
  const [country,setCountry]=useState('pakistan')
  const [code,setCode]=useState('PK')
  const [category,setCategory]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    getOptions().then(d=>{
      setCountries(d.countries); setCategories(d.categories)
      if(d.categories.length) setCategory(d.categories[0])
      if(d.countries.length){ setCountry(d.countries[0].name); setCode(d.countries[0].code)}
    }).catch(()=>{})
  },[])

  const onCountryChange = (e)=>{
    const v=e.target.value; setCountry(v)
    const found=countries.find(c=>c.name===v); if(found) setCode(found.code)
  }

  const handleSingle = async()=>{
    setLoading(true)
    await collect(country, code, category)
    await refresh(); await onDone(); setLoading(false)
  }
  const handleAll = async()=>{
    if(!confirm(`Collect for ALL ${countries.length} countries x ${categories.length} categories = ${countries.length*categories.length} API batches? This takes ~30 sec`)) return
    setLoading(true)
    const items=[]; countries.forEach(c=> categories.forEach(cat=> items.push({country:c.name,countryCode:c.code,category:cat})))
    await collectBatch(items); await refresh(); await onDone(); setLoading(false)
  }

  return (
    <div className="card" style={{borderLeft:'5px solid #C9A227', background:'linear-gradient(135deg, white 0%, #FFFBEB 100%)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><b style={{color:'#0B5145'}}>📡 Data Collection Control</b><div style={{fontSize:12,color:'#6B7D7A'}}>Choose country & category → collect live signals → generate score</div></div>
        <span style={{fontSize:11,background:'#0B5145',color:'white',padding:'6px 10px',borderRadius:20}}>{countries.length} Countries • {categories.length} Categories</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 120px 1fr auto',gap:12,marginTop:16,alignItems:'end'}}>
        <div><label style={{fontSize:12,fontWeight:600}}>Country</label>
          <select value={country} onChange={onCountryChange} style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid #E6ECEA',marginTop:4}}>
            {countries.map(c=> <option key={c.code} value={c.name}>{c.name.toUpperCase()} ({c.code})</option>)}
          </select>
        </div>
        <div><label style={{fontSize:12,fontWeight:600}}>Code</label>
          <input value={code} onChange={e=>setCode(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid #E6ECEA',marginTop:4}}/>
        </div>
        <div><label style={{fontSize:12,fontWeight:600}}>Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid #E6ECEA',marginTop:4}}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={handleSingle} disabled={loading} style={{height:42}}>{loading?'Collecting...':'Collect & Score'}</button>
      </div>
      <div style={{display:'flex',gap:10,marginTop:12}}>
        <button className="btn-gold" onClick={handleAll} disabled={loading} style={{flex:1}}>⚡ Collect ALL Countries × Categories</button>
        <div style={{fontSize:11,color:'#92400E',background:'#FFFBEB',border:'1px dashed #F59E0B',padding:'8px 12px',borderRadius:10}}></div>
      </div>
    </div>
  )
}
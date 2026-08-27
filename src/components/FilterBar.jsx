import { useEffect, useState } from 'react'
import { Search, FilterX } from 'lucide-react'
import { getOptions } from '../services/api'

export default function FilterBar({ onSearch }){
  const [countries,setCountries]=useState([])
  const [categories,setCategories]=useState([])
  const [country,setCountry]=useState('ALL')
  const [category,setCategory]=useState('ALL')

  useEffect(()=>{ getOptions().then(d=>{ setCountries(d.countries||[]); setCategories(d.categories||[]) }).catch(()=>{}) },[])

  return (
    <div className="card" style={{display:'flex',gap:12,alignItems:'end',flexWrap:'wrap',borderLeft:'5px solid #0B5145'}}>
      <div style={{flex:1, minWidth:160}}>
        <label style={{fontSize:11,fontWeight:700,color:'#6B7D7A'}}>COUNTRY</label>
        <select value={country} onChange={e=>setCountry(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid #E6ECEA',marginTop:4}}>
          <option value="ALL">All Countries</option>
          {countries.map(c=> <option key={c.code} value={c.name}>{c.name.toUpperCase()} ({c.code})</option>)}
        </select>
      </div>
      <div style={{flex:1, minWidth:160}}>
        <label style={{fontSize:11,fontWeight:700,color:'#6B7D7A'}}>CAMPAIGN / CATEGORY</label>
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:10,border:'1px solid #E6ECEA',marginTop:4}}>
          <option value="ALL">All Campaigns</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button className="btn-primary" onClick={()=>onSearch(country, category)} style={{display:'flex',gap:6,alignItems:'center',height:42}}><Search size={14}/> Search</button>
      <button onClick={()=>{ setCountry('ALL'); setCategory('ALL'); onSearch('ALL','ALL')}} style={{height:42,padding:'0 14px',borderRadius:10,border:'1px solid #E6ECEA',background:'white',cursor:'pointer',display:'flex',gap:6,alignItems:'center'}}><FilterX size={14}/> Clear</button>
    </div>
  )
}
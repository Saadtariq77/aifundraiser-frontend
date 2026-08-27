import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain, Sparkles } from 'lucide-react'
import axios from 'axios'
import Header from '../components/Header'
import OpportunityCard from '../components/OpportunityCard'
import SignalRadar from '../components/SignalRadar'
import CollectPanel from '../components/CollectPannel'
import FilterBar from '../components/FilterBar'
import AiExplanationModal from '../components/AiExplanationModal'
import AiDirectModal from '../components/AiDirectModal'
import Pagination from '../components/Pagination'
import { getFiltered, explain, getOptions } from '../services/api'

export default function Dashboard(){
  const [data,setData]=useState([])
  const [page,setPage]=useState(0)
  const [totalPages,setTotalPages]=useState(0)
  const [totalElements,setTotalElements]=useState(0)
  const size = 6
  const [filters,setFilters]=useState({country:'ALL', category:'ALL'})
  const [countries,setCountries]=useState([])
  const [categories,setCategories]=useState([])
  const [aiCountry,setAiCountry]=useState('pakistan')
  const [aiText,setAiText]=useState('')
  const [selected,setSelected]=useState(null)
  const [aiLoading,setAiLoading]=useState(false)
  const [direct,setDirect]=useState(null)
  const [directOpen,setDirectOpen]=useState(false)
  const [directLoading,setDirectLoading]=useState(false)

  useEffect(()=>{
    getOptions().then(d=>{
      setCountries(d.countries||[])
      setCategories(d.categories||[])
      if(d.countries?.length) setAiCountry(d.countries[0].name)
    }).catch(()=>{})
  },[])

  const load = async()=>{
    const c = filters.country==='ALL'? null : filters.country
    const cat = filters.category==='ALL'? null : filters.category
    try{
      const res = await getFiltered(c, cat, page, size)
      if(Array.isArray(res)){
        const total = res.length
        const sliced = res.slice(page*size, page*size+size)
        setData(sliced)
        setTotalPages(Math.ceil(total/size) || 1)
        setTotalElements(total)
      } else {
        setData(res.content || [])
        setTotalPages(res.totalPages || 0)
        setTotalElements(res.totalElements || 0)
      }
    }catch(e){ setData([]) }
  }
  useEffect(()=>{ load() },[filters, page])

  const handleSearch = (country, category)=>{
    setFilters({country, category})
    setPage(0)
  }

  const handleExplain = async(item)=>{
    setSelected(item); setAiLoading(true); setAiText('')
    try{ const r=await explain(item.id); setAiText(r.explanation || r.text || r) }catch(e){
      setAiText('### AI Unavailable\n\n**Evidence:**\n- ' + (item.evidenceBundle?.evidences||[]).join('\n- ').slice(0,800))
    }
    setAiLoading(false)
  }

  const askDirect = async()=>{
    setDirect(null)
    setDirectOpen(true)
    setDirectLoading(true)
    try{
      const res = await axios.post(`http://localhost:8081/api/public/v1/ai-decision/direct?country=${aiCountry}`)
      setDirect(res.data)
    }catch(e){
      setDirect({ campaignTitle:'AI Error', reasoning: e.response?.data?.message || e.message, recommendedCountry: aiCountry, recommendedCategory:'-', launchWindow:'-', confidence:'MEDIUM', evidence:[] })
    }
    setDirectLoading(false)
  }

  const barData = data.map(d=>({name:`${d.country}-${d.category.slice(0,3)}`,score:d.totalScore}))

  return (
    <div>
      <Header/>
      <div style={{padding:'24px',maxWidth:1300,margin:'0 auto',display:'flex',flexDirection:'column',gap:20}}>
        
        <CollectPanel onDone={()=>{ setPage(0); setTimeout(load,500) }} />
        <FilterBar onSearch={handleSearch} />

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {[
            {l:'Top Opportunity',v: data[0]?`${data[0].totalScore.toFixed(1)}/100`: '--',s: data[0]?`${data[0].country} • ${data[0].category}`:'No data yet'},
            {l:'Total Results',v: `${totalElements}`,s: `Page ${page+1} of ${totalPages || 1}`},
            {l:'Data Sources Live',v:'5/5',s:'SERP, GoogleNews, NASA, Weather, WorldBank'},
            {l:'Model',v:'Deterministic',s:'AI only explains, never scores'},
          ].map(c=><div key={c.l} className="card" style={{padding:16}}><div style={{fontSize:11,color:'#6B7D7A'}}>{c.l}</div><div style={{fontSize:22,fontWeight:800,marginTop:4}}>{c.v}</div><div style={{fontSize:12,color:'#6B7D7A'}}>{c.s}</div></div>)}
        </div>

        {/* DIRECT AI - WITH COUNTRY FILTER */}
        <div className="card" style={{padding:'12px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, background:'linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%)', border:'1px solid #FDE68A', borderLeft:'4px solid #EA580C'}}>
          <div style={{display:'flex', gap:12, alignItems:'center', minWidth:0}}>
            <div style={{background:'#EA580C', padding:9, borderRadius:10, flexShrink:0}}><Brain size={16} color="white"/></div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:800, fontSize:13, color:'#9A3412', display:'flex', gap:6, alignItems:'center', flexWrap:'wrap'}}>Direct AI Decision <span style={{fontWeight:600, fontSize:10, background:'#EA580C', color:'white', padding:'2px 7px', borderRadius:10}}>RAW → GEMINI</span></div>
              <div style={{fontSize:11, color:'#6B7D7A'}}>Pick a country — AI will suggest ONE campaign for that country only</div>
            </div>
          </div>
          <div style={{display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
            <select value={aiCountry} onChange={e=>setAiCountry(e.target.value)} style={{padding:'8px 12px', borderRadius:10, border:'1px solid #FDBA74', fontSize:12, fontWeight:700, minWidth:150, background:'white'}}>
              {countries.map(c=> <option key={c.code} value={c.name}>{c.name.toUpperCase()} ({c.code})</option>)}
            </select>
            <button onClick={askDirect} disabled={directLoading} style={{height:36, padding:'0 16px', borderRadius:10, border:'none', background: directLoading ? '#FDBA74' : '#EA580C', color:'white', fontWeight:700, fontSize:12, cursor: directLoading?'not-allowed':'pointer', display:'flex', gap:6, alignItems:'center'}}>
              {directLoading ? 'Analyzing...' : <><Sparkles size={13}/> Ask AI Direct</>}
            </button>
          </div>
        </div>

        <div className="grid-top">
          <div className="card">
            <h3 style={{marginTop:0}}>Top Opportunities Ranking - Page {page+1}</h3>
            <div style={{height:280}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" domain={[0,100]} stroke="#6B7D7A"/>
                  <YAxis dataKey="name" type="category" width={110} tick={{fontSize:12}}/>
                  <Tooltip/>
                  <Bar dataKey="score" fill="#0B5145" radius={[0,10,10,0]} barSize={22}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3 style={{marginTop:0}}>Signal Health — {selected?.country || data[0]?.country || 'Pakistan'}</h3>
            <SignalRadar breakdown={selected?.breakdown || data[0]?.breakdown}/>
            <div style={{fontSize:12,color:'#6B7D7A',textAlign:'center'}}>5 Signals • Weights: Search 30% • Disaster 25% • News 20% • Weather 15% • Poverty 10%</div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {data.length===0 ? (
            <div className="card" style={{gridColumn:'1/-1',textAlign:'center',padding:40}}>
              <b>No results.</b><br/>Check backend on 8081 or click Collect Panel above.
            </div>
          ) : (
            data.map(item=><OpportunityCard key={item.id} item={item} onExplain={handleExplain}/>)
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={size} onPageChange={setPage} />
        <div style={{textAlign:'center',fontSize:12,color:'#6B7D7A',padding:20}}>Baitussalam NOIP — 6 per page • 70+ Launch NOW • 50-69 Watch</div>
      </div>

      <AiExplanationModal selected={selected} aiText={aiText} aiLoading={aiLoading} onClose={()=>setSelected(null)} />
      <AiDirectModal open={directOpen} onClose={()=>setDirectOpen(false)} data={direct} loading={directLoading} country={aiCountry} />
    </div>
  )
}
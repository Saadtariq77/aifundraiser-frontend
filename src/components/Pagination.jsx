import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ page, totalPages, totalElements, size, onPageChange }){
  if(!totalPages || totalPages <= 1) return null
  const start = page*size + 1
  const end = Math.min((page+1)*size, totalElements)
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'white',border:'1px solid #E6ECEA',padding:'12px 16px',borderRadius:12,marginTop:8}}>
      <div style={{fontSize:12,color:'#6B7D7A'}}>Showing <b>{start}-{end}</b> of <b>{totalElements}</b></div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button disabled={page===0} onClick={()=>onPageChange(page-1)} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #E6ECEA',background: page===0?'#F1F5F9':'white',cursor: page===0?'not-allowed':'pointer',display:'flex',gap:4,alignItems:'center'}}><ChevronLeft size={14}/> Prev</button>
        <span style={{fontSize:13,fontWeight:700,background:'#0B5145',color:'white',padding:'6px 12px',borderRadius:8}}>Page {page+1} of {totalPages}</span>
        <button disabled={page+1 >= totalPages} onClick={()=>onPageChange(page+1)} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #E6ECEA',background: page+1>=totalPages?'#F1F5F9':'white',cursor: page+1>=totalPages?'not-allowed':'pointer',display:'flex',gap:4,alignItems:'center'}}>Next <ChevronRight size={14}/></button>
      </div>
    </div>
  )
}
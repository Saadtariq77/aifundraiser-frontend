import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
export default function SignalRadar({breakdown}){
  const data = Object.entries(breakdown || {}).map(([k,v])=>({signal:k.replace('_',' '),value:v}))
  return (
    <div style={{height:260}}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#E6ECEA"/>
          <PolarAngleAxis dataKey="signal" tick={{fontSize:11, fill:'#6B7D7A'}}/>
          <Radar dataKey="value" stroke="#0B5145" fill="#0B5145" fillOpacity={0.25}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
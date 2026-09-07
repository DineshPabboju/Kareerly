import { useEffect, useState } from 'react';
import fetchData from './api/api'

const App = () => {
  const [data, setData] = useState(null);

  useEffect(()=> {
    const loadData = async () => {
      try{
        const result = await fetchData();
        // const response = result.json;
        console.log(result)
        setData(result)
      }
      catch(error){
        console.log(error)
      }
    };
    loadData();
  }, [])
  return (
    
    <div>Hello {data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
  )
}

export default App
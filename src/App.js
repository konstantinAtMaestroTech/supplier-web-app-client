import './App.css';
import React, { useEffect, useState } from 'react';

import WebsiteHeader from './components/WebsiteHeader';
import OrderInfo from './components/OrderInfo';
import ProductionTable from './components/ProductionTable';
import AssemblyTable from './components/AssemblyTable';
import TableSelector from './components/TableSelector';
import axios from 'axios';

function App() {

  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedURN, setSelectedURN] = useState('');
  const [tableSelected, setTableSelected] = useState(false);

  console.log(selectedProfile);

  useEffect(() => {
    const url = 'http://localhost:3001/getData/producers';
    let isMounted = true;
    const fetchData = async () => {
      try{
        const response = await axios.get(url);
        if (isMounted) setProfiles(response.data.data.map(profile => profile.ProducerName));

      }catch (error){
        console.error('Failed to fetch data', error);
      }};

    fetchData();

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="App">
      <WebsiteHeader value={profiles} setProfile={setSelectedProfile} selectedProfile={selectedProfile} setProject={setSelectedProject} setURN={setSelectedURN} />
      <OrderInfo />
      <TableSelector value={tableSelected} setTableSelected={setTableSelected} />
      {tableSelected === 'Production Order' ? (
        <ProductionTable selectedProject={selectedProject} selectedProfile={selectedProfile} selectedURN={selectedURN} />
      ) : (
        <AssemblyTable selectedProject={selectedProject} selectedProfile={selectedProfile} selectedURN={selectedURN} />
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios to fetch data
import Modal from './Modals/ViewerModal.js'; // Importing modal component

export default function ProductionTable({ selectedProject, selectedProfile, selectedURN}) {

  function technologySorter (data) {
    const groupedByTechnology = data.reduce((groups, item) => {
      const group = (groups[item.Technology] || []);
      group.push(item);
      groups[item.Technology] = group;
      return groups;
    }, {});
    return groupedByTechnology;
  }

  function productionIDsorter (data) {
    const productionID = data.reduce((id, item) => {
      const productionID = (id[item.ProductionID] || []);
      productionID.push(item);
      id[item.ProductionID] = productionID;
      return id;
    }, {});
    return productionID;
  }
  
  const [tableData, setTableData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUniqueID, setSelectedUniqueID] = useState([]);
  const url = 'https://supplier-web-app.maestrotest.info/getData/elements';

  const showModal = () => {
    setShow(true);
  };
  
  const hideModal = () => {
    setShow(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProfile || !selectedProject) return;
      console.log('Fetching data for', selectedProfile, selectedProject);
      console.log('Project in request is :', selectedProject); /// Ne rabotaet
      try{
        const response = await axios.get(url, {headers: {'SelectedSupplier': selectedProfile, 'SelectedProject': selectedProject}});
        let elements = response.data.data.map(elements => elements); // !!!!!!!!!
        setTableData(elements);
      }catch (error){
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, [selectedProfile, selectedProject]);


  return (
    <div className="Table">
      <table>
        <tr>
          <th className="TableHeadGroup">Technology</th>
          <th className="TableHeadComponentID">Component ID <span style={{ fontSize: '8px' }}>(click on the component to visualise it)</span></th>
          <th className="TableHeadQTY">QTY</th>
          <th className="TableHeadWeight">Weight (KG)</th>
          <th className="TableHeadFile">Product file </th>
        </tr>
        {Object.keys(technologySorter(tableData)).map(Technology => (
          <React.Fragment key={Technology}>
            <tr>
              <td className="TableTechnology" colSpan = '5' style={{ textAlign: 'left', border: '2px solid #000', padding: '5px' }} >{Technology}<a href={Technology} style={{ fontSize: '9px', display: 'block'}}>batch product file</a></td>
            </tr>
            {Object.keys(productionIDsorter(technologySorter(tableData)[Technology])).map((ID, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="TableGroup" ></td>
                  <td className="TableComponentID"><a href={ID} onClick={(e) => {
                                      e.preventDefault();
                                      showModal();
                                      let uniqueIDs = [];
                                      productionIDsorter(technologySorter(tableData)[Technology])[ID].map(item => uniqueIDs.push(item.UniqueID));
                                      setSelectedUniqueID(uniqueIDs);
                                    }}>{ID}</a></td>
                  <td className="TableQTY">{productionIDsorter(technologySorter(tableData)[Technology])[ID].length}</td>  {/* This is terribly bad. To solve the problem initial query should be changed */}
                  <td className="TableWeight">{productionIDsorter(technologySorter(tableData)[Technology])[ID][0].Weight}</td>
                  <td className="TableFile"><a href={'lol'}>{'item.MProjectID'}</a></td>
                </tr>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </table>
      <Modal show={show} handleClose={hideModal} urn={selectedURN} uniqueID={selectedUniqueID}>
      </Modal>
    </div>
  );
}

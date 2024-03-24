import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios to fetch data
import Modal from './Modals/ViewerModal.js'; // Importing modal component

export default function ProductionTable({ selectedProject, selectedProfile, selectedURN }) {
  
  const [tableData, setTableData] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedUniqueID, setSelectedUniqueID] = useState([]);
  const url = 'https://server-web-app.maestrotest.info/getData/elements';

  const showModal = () => {
    setShow(true);
  };
  
  const hideModal = () => {
    setShow(false);
  };

  function AssemblyIDSorter (data) {
    const groupedByAssemblyID = data.reduce((groups, item) => {
      const group = (groups[item.AssemblyID] || []);
      group.push(item);
      groups[item.AssemblyID] = group;
      return groups;
    }, {});
    //console.log(groupedByAssemblyID);
    return groupedByAssemblyID;
  }

  function AssemblyGroupSorter (data) {
    const groupedByAssemblyGroup = data.reduce((groups, item) => {
      const group = (groups[item.AssemblyGroupID] || []);
      group.push(item);
      groups[item.AssemblyGroupID] = group;
      return groups;
    }, {});
    //console.log(groupedByAssemblyGroup);
    return groupedByAssemblyGroup;
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

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProfile || !selectedProject) return;
      console.log('Fetching data for', selectedProfile, selectedProject);
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
          <th className="TableHeadGroup">Component <span style={{ fontSize: '8px', display: 'flex', justifyContent: 'center' }}>(click on the component to visualise it)</span></th>
          <th className="TableHeadComponentID">Subcomponent ID </th>
          <th className="TableHeadQTY">QTY</th>
          <th className="TableHeadWeight">Weight (KG)</th>
          <th className="TableHeadFile">Assembly file </th>
          <th className="TableHeadLabel">Label</th>
        </tr>
        {Object.keys(AssemblyGroupSorter(tableData)).map(Groups => (
            <React.Fragment key={Groups}>
                <tr>
                    <td className="TableGroups" colSpan = '6' style={{ textAlign: 'left', border: '2px solid #000', padding: '5px' }} >{Groups}<a href={Groups} style={{ fontSize: '9px', display: 'block'}} onClick={(e) => {
                                      e.preventDefault();
                                      showModal();
                                      let uniqueIDs = [];
                                      AssemblyGroupSorter(tableData)[Groups].map(item => uniqueIDs.push(item.UniqueID));
                                      setSelectedUniqueID(uniqueIDs);
                                    }}>Group visualization</a></td>
                </tr>
                {Object.keys(AssemblyIDSorter(AssemblyGroupSorter(tableData)[Groups])).map(AssemblyID => (
                    Object.keys(productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])).map((ProductionID, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            {
                                index === 0 ? 
                                <td className="TableComponent" rowSpan = {Object.keys(productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])).length}><a href={AssemblyID} onClick={(e) => {
                                      e.preventDefault();
                                      showModal();
                                      let uniqueIDs = [];
                                      Object.keys(productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])).forEach(key => {productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])[key].map(item => uniqueIDs.push(item.UniqueID))});
                                      setSelectedUniqueID(uniqueIDs);
                                }}>{AssemblyID}</a>
                                </td>
                                : null
                            }
                            <td className="TableSubComponentID">{ProductionID}</td>
                            <td className="TableQTY">{productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])[ProductionID].length}</td>  {/* This is terribly bad. Initial queries and data sorting should be changed */}
                            <td className="TableWeight">{productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])[ProductionID][0].Weight}</td>
                            {
                                index === 0 ? 
                                <td className="TableFile" rowSpan = {Object.keys(productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])).length} ><a href={'lol'}>{'Assembly file'}</a></td>
                                : null
                            }
                            {
                                index === 0 ? 
                                <td className="TableLabel" rowSpan = {Object.keys(productionIDsorter(AssemblyIDSorter(tableData)[AssemblyID])).length} ><a href={AssemblyID} onClick={(e) => {
                                  e.preventDefault();
                                  fetch(`https://server-web-app.maestrotest.info/files/${selectedProject}/AssemblyFiles/QRCodes/${AssemblyID}.png`)
                                    .then(response => response.blob()) // Create a Blob from the response
                                    .then(blob => {
                                      // Create a new object URL for the blob
                                      const url = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      // The file name of the downloaded file
                                      link.setAttribute('download', `${AssemblyID}.png`);
                                      // Programmatically click the link to trigger the download
                                      document.body.appendChild(link);
                                      link.click();
                                      // Remove the link when done
                                      document.body.removeChild(link);
                                    })
                                    .catch(error => console.error(error));
                            }}>{'Label'}</a></td>
                                : null
                            }
                        </tr>
                    </React.Fragment>
                ))))}
            </React.Fragment>
        ))}
        
      </table>
      <Modal show={show} handleClose={hideModal} urn={selectedURN} uniqueID={selectedUniqueID}>
      </Modal>
    </div>
  );
}
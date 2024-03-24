import React, { useEffect } from 'react';
import axios from 'axios';
import './ViewerModal.css'; // Importing modal styles

const Modal = ({ handleClose, show, urn, uniqueID }) => {

    useEffect(() => {

        const url = 'http://13.60.18.89:8080/assemblyID';

        const fetchData = async () => {
            try{
            const response = await axios.post(url, {
                UniqueIDsArray: uniqueID
            });
            console.log(response.data);
            }catch (error){
            console.error('Failed to fetch data', error);
            }
        };
    
        fetchData();

    }, [uniqueID]);
    
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    const viewerUrl = 'http://13.60.18.89:8080/#' + urn;

    return (
    <div className={showHideClassName}>
        <section className="modal-main">
        <iframe src={viewerUrl} title="Viewer" style={{width: '100%', height: '50vh'}}></iframe>
        <button onClick={handleClose}>Close</button>
        </section>
    </div>
    );
};

export default Modal;
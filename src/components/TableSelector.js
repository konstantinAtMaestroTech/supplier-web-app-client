export default function TableSelector({value, setTableSelected}) {

    const handleSelect = (state) => {
        setTableSelected(state);  
    };

    return (
        <div className="TableSelector">
          <button 
            className={`btn ${value === 'Production Order' ? 'selected' : ''}`} 
            onClick={() => handleSelect('Production Order')}
          >
            Production Order
          </button>
          <button 
            className={`btn ${value === 'Assembly Order' ? 'selected' : ''}`} 
            onClick={() => handleSelect('Assembly Order')}
          >
            Assembly Order
          </button>
        </div>
    );
  }

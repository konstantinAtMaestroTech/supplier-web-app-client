export default function OrderInfo() {
  return (
    <div className="OrderInfo">
      <Info1 />
      <Info2 />
      <Info3 />
    </div>
  );
}

function Info1 () {
  return (
    <div className="Info1">
      <div className='OrderReference'>Order Reference
        <span className='OrderReferenceValue'> 1234567890</span>
      </div>
      <div className='OrderName'>Order Name
        <span className='OrderNameValue'> Order Name</span>
      </div>
    </div>
  );
}

function Info2 () {
  return (
    <div className="Info2">
      <div className='ContractSignedOn'>Contract Signed On
        <span className='ContractSignedOnValue'> 01 February 2024</span>
      </div>
      <div className='DeliveryDate'>Delivery Date
        <span className='DeliveryDateValue'> 31 February 2024</span>
      </div>
      <div className='ContractValue'>Contract Value
        <span className='ContractValueValue'> EUR 120,000</span>
      </div>
    </div>
  );
}

function Info3 () {
  return (
    <div className="Info3">
      <a href="https://fonts.googleapis.com/icon?family=Material+Icons">Download Contract Copy PDF</a>
      <a href="https://fonts.googleapis.com/icon?family=Material+Icons">Download Delivery Schedule PDF</a>
    </div>
  );
}


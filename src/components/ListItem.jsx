import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";

const ListItem = (props) => {
  const [value, setValue] = useState(props.value || 0);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (newValue > 0) {
      props.onItemSelected(
        props.item,
        newValue,
        newValue * parseFloat(props.price)
      );
    } else {
      props.onItemDeselected(props.item);
    }
  };

  return (
    <div className="item">
      <div className="textPart">
        <h6>{props.item}</h6>
        <h6 className="price">{props.price}</h6>
      </div>

      <div className="card flex justify-content-center">
        <div className="number">
          <InputNumber
            value={value}
            onValueChange={(e) => handleValueChange(e.value)}
            showButtons
            min={0}
            buttonLayout="vertical"
            style={{ width: "3em" }}
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
          />
        </div>
      </div>
    </div>
  );
};

export default ListItem;

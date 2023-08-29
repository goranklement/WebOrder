import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import NavigationItem from "./NavigationItem";
import { database } from "./FirebaseConfig";
import { ref, set } from "firebase/database";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../main.css";

export default function FloatLabelDemo() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [tableNumber, setTableNumber] = useState(0);

  const restaurants = [
    { name: "Karaka", code: "NY" },
    { name: "Oliva", code: "RM" },
    // ...other restaurant options
  ];

  const menuData = {
    Karaka: ["Pizza", "Cold", "BBQ"],
    Oliva: ["Pizza", "Hot", "Cold", "Pasta"],
    // ...other menu data
  };

  const handleReturn = () => {
    setSelectedRestaurant(null);
  };

  const handleCheckboxChange = (category) => {
    setSelectedCheckboxes((prevSelected) => ({
      ...prevSelected,
      [category]: !prevSelected[category],
    }));
  };

  const handleSaveCheckboxes = async () => {
    console.log(selectedCheckboxes);
    const meal = selectedCheckboxes;

    set(ref(database, "Orders/" + selectedRestaurant.name), {
      number: tableNumber,
      order: Object.keys(selectedCheckboxes)
        .filter((k) => selectedCheckboxes[k])
        .toString(),
      time: Date.now(),
      isTaken: "0",
    });
  };

  useEffect(() => {
    console.log(selectedCheckboxes); // Log the selectedCheckboxes in useEffect
  }, [selectedCheckboxes]);

  const renderTabs = () => {
    const categories = menuData[selectedRestaurant?.name] || [];

    if (categories.length === 0) {
      return <p>No menu categories available.</p>;
    } else {
      return categories.map((category, index) => (
        <NavigationItem
          key={index}
          category={category}
          handleCheckboxChange={handleCheckboxChange}
          name={selectedRestaurant?.name}
          selectedCheckboxes={selectedCheckboxes} // Pass the prop here
        />
      ));
    }
  };
  return (
    <div className="whole">
      {selectedRestaurant === null ? (
        <span className="p-float-label">
          <Dropdown
            inputId="dd-restaurant"
            value={selectedRestaurant}
            onChange={(e) => {
              setSelectedRestaurant(e.value);
            }}
            options={restaurants}
            optionLabel="name"
            className="w-full md:w-14rem"
          />
          <label className="label" htmlFor="dd-restaurant">
            Select a restaurant
          </label>
        </span>
      ) : (
        <>
          <h1>{selectedRestaurant?.name} menu</h1>
          <div className="pickItems">{renderTabs(selectedCheckboxes)}</div>

          <Button
            className="returnBtn"
            label="Return"
            icon="pi pi-backward"
            iconPos="right"
            onClick={handleReturn}
          />
          <Button
            className="saveBtn"
            label="Save Checkboxes"
            onClick={handleSaveCheckboxes}
          />
          <div className="card flex flex-wrap gap-3 p-fluid">
            <div className="flex-auto">
              <label htmlFor="integeronly" className="font-bold block mb-2">
                Table number:
              </label>
              <InputNumber
                inputStyle={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  textAlign: "center",
                }}
                className="inputNumber"
                inputId="integeronly"
                value={tableNumber}
                min="0"
                max="99"
                onValueChange={(e) => setTableNumber(e.value)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

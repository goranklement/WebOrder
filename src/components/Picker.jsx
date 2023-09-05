import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import MenuCategory from "./MenuCategory";
import { database } from "./FirebaseConfig";
import { ref, set } from "firebase/database";
import { InputNumber } from "primereact/inputnumber";
import { Fieldset } from "primereact/fieldset";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useRef } from "react";
import "../main.css";

import { Toast } from "primereact/toast";

export default function Picker() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [childStates, setChildStates] = useState(["", "", "", ""]);
  const [childPriceStates, setChildPriceStates] = useState(["", "", "", ""]);
  const [tableNumber, setTableNumber] = useState("");
  const [wholeAmount, setWholeAmount] = useState(0);
  const toast = useRef(null);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 7000,
    });
  };

  useEffect(() => {
    const sum = childPriceStates.reduce((accumulator, currentValue) => {
      const num = parseFloat(currentValue);
      return !isNaN(num) ? accumulator + num : accumulator;
    }, 0);
    setWholeAmount(sum.toFixed(2));
    if (childStates.some((state) => state !== "")) {
      const childStatesWithCommas = childStates
        .filter((state) => state !== "")
        .join(", ");
      showSuccess(childStatesWithCommas + " TOTAL: " + sum.toFixed(2));
    }
  }, [childStates]);

  const showWarn = (message) => {
    toast.current.show({
      severity: "warn",
      summary: "Warning",
      detail: message,
      life: 3000,
    });
  };

  const restaurants = [{ name: "Karaka" }];

  const menuData = {
    Karaka: ["Pizza", "Cold", "BBQ", "Pasta"],
    Oliva: ["Pizza", "Hot", "Cold", "Pasta"],
    Exclusive: ["Hot", "Cold"],
    SportHouse: ["Pizza", "Cold", "Pasta"],
    Hedonist: ["Hot", "Cold"],
  };

  const handleReturn = () => {
    setSelectedRestaurant("");
  };

  const updateChildState = (index, newState) => {
    const updatedChildPrices = [...childStates];
    updatedChildPrices[index] = newState;
    setChildStates(updatedChildPrices);
  };
  const updateChildPrice = (index, sum) => {
    const updatedChildPrices = [...childPriceStates];
    updatedChildPrices[index] = sum;
    setChildPriceStates(updatedChildPrices);
  };

  const handleCheckboxChange = (category) => {
    setSelectedCheckboxes((prevSelected) => ({
      ...prevSelected,
      [category]: !prevSelected[category],
    }));
  };

  const handleSaveCheckboxes = async () => {
    const filteredChildStates = childStates.filter((state) => state !== "");
    if (selectedCheckboxes !== {}) {
      set(
        ref(database, "Orders/" + selectedRestaurant.name + "/" + tableNumber),
        {
          number: tableNumber,
          order: filteredChildStates.toString(),
          time: Date.now(),
          isTaken: "0",
        }
      );
      showSuccess("Your order is sent!");
    } else {
      showWarn("Your order is empty!");
    }
  };

  const renderTabs = () => {
    const categories = menuData[selectedRestaurant?.name] || [];

    if (categories.length === 0) {
      return <p>No menu categories available.</p>;
    } else {
      return categories.map((category, index) => (
        <MenuCategory
          key={index}
          index={index}
          category={category}
          name={selectedRestaurant?.name}
          onUpdateState={updateChildState}
          onUpdatePrice={updateChildPrice}
        />
      ));
    }
  };
  return (
    <div className="whole">
      <Toast ref={toast} />
      {selectedRestaurant === "" ? (
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
            label="Send order!"
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
                min="1"
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

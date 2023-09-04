import { doc, getDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import ListItem from "./ListItem";
import { useEffect, useState } from "react";
import { useRef } from "react";

import { Toast } from "primereact/toast";

const MenuCategory = (props) => {
  const [menuData, setMenuData] = useState(null);
  const [menuPrice, setMenuPrice] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const toast = useRef(null);

  const [selectedItems, setSelectedItems] = useState({});

  const handleItemSelected = (item, value) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [item]: value,
    }));
  };

  useEffect(() => {
    updateState();
  }, [selectedItems]);
  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };
  const updateState = () => {
    props.onUpdateState(props.index, getSelectedItemsString());
  };

  const handleItemDeselected = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = { ...prevSelectedItems };
      delete updatedSelectedItems[item];
      return updatedSelectedItems;
    });
  };
  const getSelectedItemsString = () => {
    const selectedItemsArray = Object.entries(selectedItems)
      .filter(([item, quantity]) => quantity > 0)
      .map(([item, quantity]) => `${item} (${quantity})`);
    return selectedItemsArray.join(", ");
  };

  useEffect(() => {
    getMenu();
    getPrice();
  }, []);

  const getMenu = async () => {
    const docRef = doc(db, "Menus", props.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMenuData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const getPrice = async () => {
    const docRef = doc(db, "Menus", props.name + "P");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMenuPrice(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    console.log(selectedItems);
  };

  const showItems = () => {
    const items = menuData[props.category];
    const price = menuPrice[props.category];

    if (items && items.length > 0) {
      return items.map((item, index) => (
        <ListItem
          key={index}
          item={item}
          onItemSelected={handleItemSelected}
          onItemDeselected={handleItemDeselected}
          price={price[index]}
          value={selectedItems[item] || 0}
        />
      ));
    } else {
      return <p>No items available</p>;
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <>
        <div onClick={toggleVisibility} className="menuPicker">
          <h5>{props.category}</h5>
          <img
            className="menuImages"
            src={require(`../assets/${props.category}.png`)}
            alt={props.category}
          />
        </div>
        {isVisible && menuData != null ? showItems(selectedItems) : null}
      </>
    </>
  );
};

export default MenuCategory;

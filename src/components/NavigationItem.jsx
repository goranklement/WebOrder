import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";

const NavigationItem = (props) => {
  const [menuData, setMenuData] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const docRef = doc(db, "Menus", props.name);

  const getMenus = async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setMenuData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const handleCheckboxChange = (category) => {
    props.handleCheckboxChange(category); // Call the function from props
  };

  const showMenu = async () => {
    if (!isClicked) {
      setIsClicked(true);
      await getMenus();
    } else {
      setIsClicked(false);
    }
  };

  return (
    <>
      <div onClick={showMenu} className="navItem">
        <img
          src={require(`../assets/${props.category}.png`)}
          alt="Slika"
          width={70}
          height={70}
        />
        <h3>{props.category}</h3>
      </div>
      <div>
        {isClicked &&
          menuData &&
          menuData[props.category].map((category) => (
            <div key={category}>
              <Checkbox
                value={category}
                onChange={() => handleCheckboxChange(category)}
                checked={
                  props.selectedCheckboxes && props.selectedCheckboxes[category]
                } // Use props.selectedCheckboxes
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
      </div>
    </>
  );
};

export default NavigationItem;

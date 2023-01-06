import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";
import { getAnalytics } from "https://cdn.skypack.dev/@firebase/analytics";
import { initializeApp } from "https://cdn.skypack.dev/@firebase/app";
import { getFirestore } from "https://cdn.skypack.dev/@firebase/firestore";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, deleteField  } from "https://cdn.skypack.dev/@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvZ8UoCgaDEp6bnF0D-Dkflr5pKkR6_CA",
    authDomain: "kylegroceries.firebaseapp.com",
    projectId: "kylegroceries",
    storageBucket: "kylegroceries.appspot.com",
    messagingSenderId: "105564361862",
    appId: "1:105564361862:web:34a8e1a4334cd4f557ad07",
    measurementId: "G-7GSJCTGWKD"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

const toDoList = new ToDoList();

// Launch app
document.addEventListener("readystatechange",(event)=>{
    if (event.target.readyState === "complete") {
        initApp();
    }
});


const initApp = () => {
    toDoList.clearList();
    // Add listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event)=> {
        event.preventDefault();
        processSubmission();
    });

    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", (event) => {
        const list = toDoList.getList();
        if (list.length){
            const confirmed = confirm("Clear entire list?");
            if (confirmed){
                removeAllFromFirestore(toDoList.getList());
            }
        }
    });
    // Procedural
    // Load list
    loadListObject();
};

const removeAllFromFirestore = async (list) => {
    console.log("Removing all items");
    var i = 0;
    while (i<list.length) {
        const ref = doc(db, "groceries", list[i]._id);
        // Remove the 'capital' field from the document
        deleteDoc(ref);
        i+=1;
    }
    setTimeout(()=> {
        clearListDisplay();
    }, 250);
};

const loadListObject = async () => {
    const querySnapshot = await getDocs(collection(db, "groceries"));
    querySnapshot.forEach((doc) => {
        const itemObj = doc.data();
        const newToDoItem = createNewItem(doc.id, itemObj.item, itemObj.type);
        toDoList.addItemToList(newToDoItem);
        clearListDisplay();
        renderList();
    });
};

const refreshPage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
    console.log("Refreshed");
};

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = toDoList.getList();
    list.forEach((item) => {
        buildListItem(item);
    });
};

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getItem();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) =>{

        const ref = doc(db, "groceries", checkbox.id);
        // Remove the 'capital' field from the document
        deleteDoc(ref);

        // Remove from local list
        toDoList.removeItemFromList(checkbox.id);
        console.log("Removed document ", checkbox.id);

        setTimeout(()=> {
            clearListDisplay();
            renderList();
        }, 1000);
    });
};

const updateFireStore = async (toDoItem) => {
    try {
        console.log("type",toDoItem._type);
        console.log("item",toDoItem._item);
        const docRef = await addDoc(collection(db, "groceries"), {
            type: "Food",
            item: toDoItem._item
        });
        console.log("Document written with ID: ", docRef.id);
        toDoItem._id = docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
      }
};

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
};

const setFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
};

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if (!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    updateFireStore(toDoItem);
    refreshPage();
};

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
};

const calcNextItemId = () => {
    return "Food";
};

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
};



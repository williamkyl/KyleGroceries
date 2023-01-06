import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";
import { getAnalytics } from "https://cdn.skypack.dev/@firebase/analytics";
import { initializeApp } from "https://cdn.skypack.dev/@firebase/app";
import { getFirestore } from "https://cdn.skypack.dev/@firebase/firestore";
import { collection, addDoc, getDocs } from "https://cdn.skypack.dev/@firebase/firestore";

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
                //toDoList.clearList();
                //TODO remove stuff
                //updatePersistentData(toDoList.getList());
                refreshPage();
            }
        }
    });
    // Procedural
    // Load list
    loadListObject();
};

const loadListObject = async () => {
    const querySnapshot = await getDocs(collection(db, "groceries"));
    querySnapshot.forEach((doc) => {
        const itemObj = JSON.parse(doc.data().item);
        console.log(itemObj._id);
        console.log(itemObj._item);
        const newToDoItem = createNewItem(itemObj._id,itemObj._item);
        toDoList.addItemToList(newToDoItem);
        refreshPage();
    });
}

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
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click", (event) =>{
        //toDoList.removeItemFromList(checkbox.id);
        // TODO: remove from data
        //updatePersistentData(toDoList.getList());
        //setTimeout(()=> {
        //    refreshPage();
        //}, 1000);
    });
};

const updateFireStore = async (toDoItem) => {
    try {
        const docRef = await addDoc(collection(db, "groceries"), {
          Category: "Food",
          item: JSON.stringify(toDoItem)
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

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
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length >0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
};

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
} 



export default class ToDoItem {
    constructor() {
        this._id = null;
        this._type = null;
        this._item = null;
    }

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
    }

    getId(id) {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    getItem() {
        return this._item;
    }

    setItem(item) {
        this._item = item;
    }
}
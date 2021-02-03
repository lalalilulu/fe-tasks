/**
 * @description error codes
 * @type {string}
 */
const INDEX_ERROR = 'List index out of range';
const INDEX_IS_NOT_INTEGER = 'Provided index/es must be integer';
const ARRAY_IS_NOT_PROVIDED = 'Array for transformation is not provided';
const NOT_ARRAY = 'Provided object is not an array';
const EMPTY_ARRAY = 'Empty array is provided';
const NOT_NUMERIC_VALUE = 'List with not numeric values cannot be sorted';
const INCORRECT_RANGE = 'Invalid arguments: fromIndex > toIndex';

class LinkedList {
    constructor() {
        this.size = 0;
        this.head = null;
        this.tail = null;
    }

    /**
     * Append the item to the specified position if it is provided, otherwise append the item to the end of this list
     * @param  {any} value
     * @param  {number} index
     * @return {void}
     */
    add(value, index = this.size) {
        const node = createNode(value);
        if(!Number.isInteger(index)) {
            throw new Error(INDEX_IS_NOT_INTEGER);
        } else if (index < 0 || index > this.size) {
            throw new Error(INDEX_ERROR);
        } else {
            let current = this.head;
            let counter = 1;
            if (index === 0) {
                if (!this.head) {
                    this.head = node;
                    this.tail = node;
                } else {
                    this.head.prev = node;
                    node.next = this.head;
                    this.head = node;
                }
            } else {
                while (current) {
                    current = current.next;
                    if (counter === index) {
                        if(!current) {
                            node.prev = this.tail;
                            this.tail.next = node;
                            this.tail = node;
                        } else {
                            node.prev = current.prev;
                            current.prev.next = node;
                            node.next = current;
                            current.prev = node;
                        }
                    }
                    counter++;
                }
            }
            this.size++;
        }
    }

    /**
     * Remove the item at the specified position in this list
     * Shift any subsequent elements to the left
     * Return the item's value that was removed from the list
     * @param  {number} index
     * @return {any}
     */
    removeByIndex(index) {
        if(!Number.isInteger(index)) {
            throw new Error(INDEX_IS_NOT_INTEGER);
        }
        if (index < 0 || index >= this.size) {
            throw new Error(INDEX_ERROR);
        }
        let result;
        //list contains exactly one item
        if(this.size === 1) {
            result = this.head.value;
            this.head = null;
            this.tail = null;
            this.size--;
            return;
        }
        let current = this.head;
        let counter = 1;
        if(index === 0) {
            result = this.head.value;
            this.head = this.head.next;
            this.head.prev = null;
        } else {
            while(current) {
                current = current.next
                if (current === this.tail) {
                    result = this.tail.value;
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                } else if(counter === index) {
                    result = current.value;
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                    break;
                }
                counter++;
            }
        }
        this.size--;
        return result;
    }

    /**
     * Remove a single instance of the specified item from this list, if it is present (optional operation)
     * @param  {any} value
     * @return {void}
     */
    removeByValue(value) {
        let current = this.head;
        while(current) {
            if(current.value === value) {
                if(current === this.head && current === this.tail) {
                    this.head = null;
                    this.tail = null;
                } else if (current === this.head) {
                    this.head = this.head.next
                    this.head.prev = null
                } else if (current === this.tail) {
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                } else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                this.size--;
                return;
            }
            current = current.next;
        }
    }

    /**
     * Replace an item from the specified position to a new one in this list
     * @param  {number} currentIndex
     * @param  {number} newIndex
     * @return {LinkedList}
     */
    replace(currentIndex, newIndex) {
        if(!Number.isInteger(currentIndex) || !Number.isInteger(newIndex)) {
            throw new Error(INDEX_IS_NOT_INTEGER);
        }
        if(currentIndex < 0 || newIndex < 0) {
            throw new Error(INDEX_ERROR);
        }
        if(currentIndex >= this.size || newIndex >= this.size) {
            throw new Error(INDEX_ERROR);
        }
        const replacedValue = this.removeByIndex(currentIndex);
        this.add(replacedValue, newIndex);
        return this;
    }

    /**
     * Return the item's value at the specified position in this list
     * @param  {number} index
     * @return {any}
     */
    getByIndex(index) {
        if(!Number.isInteger(index)) {
            throw new Error(INDEX_IS_NOT_INTEGER);
        }
        if (index < 0 || index >= this.size) {
            throw new Error(INDEX_ERROR);
        } else {
            let current = this.head;
            let counter = 0;
            while(current) {
                if(index === counter) {
                    return current;
                }
                current = current.next;
                counter++;
            }
        }
    }

    /**
     * Return a view of this list between the specified fromIndex, inclusive, and toIndex, inclusive
     * @param  {number} fromIndex
     * @param  {number} toIndex
     * @return {LinkedList}
     */
    subList(fromIndex, toIndex = this.size-1) {
        if(!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
            throw new Error(INDEX_IS_NOT_INTEGER);
        }
        if (fromIndex < 0 || toIndex >= this.size) {
            throw new Error(INDEX_ERROR);
        }
        if(fromIndex > toIndex) {
            throw new Error(INCORRECT_RANGE);
        }
        if (this.isEmpty()) {
            return new LinkedList();
        }
        let current = this.head;
        let counter = 0;
        const indexArray = range(fromIndex, toIndex);
        const resultList = new LinkedList();
        while (current) {
            if (indexArray.includes(counter)) {
                resultList.add(current.value);
            }
            current = current.next;
            counter++;
        }
        return resultList;
    }

    /**
     * Return an array containing all of the elements in this list in proper sequence
     * @return {Array}
     */
    toArray() {
        const resultArray = [];
        let current = this.head;
        while(current) {
            resultArray.push(current.value);
            current = current.next;
        }
        return resultArray;
    }

    /**
     * Return a list from the specified array
     * @param {Array} array
     * @return {LinkedList}
     */
    static fillFromArray(array) {
        if(array === undefined) {
            throw new Error(ARRAY_IS_NOT_PROVIDED);
        }
        if(!Array.isArray(array)) {
            throw new Error(NOT_ARRAY);
        }
        if(array.length === 0) {
            throw new Error(EMPTY_ARRAY);
        }
        const list = new LinkedList();
        array.forEach(item => list.add(item));
        return list;
    }

    /**
     * Sort this list in the ascending order
     * @return {LinkedList}
     */
    sort() {
        const arrayFromList = this.toArray();
        arrayFromList.forEach(item => {if(isNaN(item)) throw new Error(NOT_NUMERIC_VALUE)});
        return LinkedList.fillFromArray(bubbleSort(arrayFromList));
    }

    /**
     * Reverse the order of the elements in the list
     * Return a new head
     * @return {object}
     */
    reverse() {
        let node = this.head,
            prev,
            tmp;

        while (node) {
            // save next before we overwrite node.next!
            tmp = node.next;

            // reverse pointer
            node.next = prev;

            // step forward in the list
            prev = node;
            node = tmp;
        }

        return prev;
    }

    /**
     * Return a string representation of the object
     * @return {string}
     */
    toString() {
        return this.toArray().join(", ");
    }

    /**
     * Return true if this list contains no elements
     * @return {boolean}
     */
    isEmpty() {
        return this.size === 0;
    }
}

/**
 * Create a new node, which contains value and a link to the next node
 * @param  {any} value
 * @return {object}
 */
const createNode = function (value) {
    return {
        value,
        next: null,
        prev: null,
    };
};

const range = (start, stop) => Array(Math.ceil(stop+1 - start)).fill(start).map((x, y) => x + y);

const bubbleSort = function(array) {
    let swapped = true;
    while (swapped) {
        swapped = false;
        for (let i = 0; i < array.length-1; i++) {
            if(array[i] > array[i+1]) {
                swap(array, i, i+1);
                swapped = true;
            }
        }
    }
    return array;
}

const swap = function(array, i, j) {
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
}

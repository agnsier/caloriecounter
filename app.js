//Storage Controller
const StorageCtrl = (function () {
});

//Item Controller
const ItemCtrl = (function () {
    //Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    //Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Fish Burger', calories: 1200},
            // {id: 1, name: 'Banana', calories: 90},
            // {id: 2, name: 'Sandwich', calories: 400},
            // {id: 3, name: 'Juice', calories: 120}
        ],
        currentItem: null,
        totalCalories: 0
    };
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            //Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (ID) {
            let found = null;
            //Loop through item
            data.items.forEach(function (item) {
                if (item.id === ID){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
          return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //Loop through items
            data.items.forEach(function (item) {
                total += item.calories;
            });

            // Set total calories in data structure
            data.totalCalories = total;

            //Return total
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();


//UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        deleteBtn: '.delete-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',

    };

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fas fa-edit edit-item" style="color:Blue"></i>
        </a>
         </li>`;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem: function (item) {
            //Show the lost
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
        <strong>${item.name}: </strong> 
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fas fa-edit edit-item"></i>
        </a>`;

            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function () {
          document.querySelector(UISelectors.itemNameInput).value = '';
          document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function () {
          document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
          document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
          UICtrl.showEditState();
          },
        hideList: function () {
          document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState : function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState : function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();


//App Controller
const App = (function (ItemCtrl, UICtrl) {
    //Load event listeners
    const loadEventListeners = function () {

        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
    };
    //Add item submit
    const itemAddSubmit = function (e) {
        //Get form input from UI controller
        const input = UICtrl.getItemInput();

        //Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {

            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add Item to UI list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Clear inputs
            UICtrl.clearInput();
        }
        e.preventDefault();
    };

    //Update item
    const itemUpdateSubmit = function (e) {
        if(e.target.classList.contains('edit-item')){

            //Get list item id(item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            //Break into an array
            const listIdArr = listId.split('-');

            //Get actual ID
            const ID = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(ID);
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add Item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault();
    };

    return {
        init: function () {
            // Set initial state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items here
            if (items.length ===0){
                UICtrl.hideList();
            } else{

            //Populate list with items
            UICtrl.populateItemList(items);
            }

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

//Initialize App
App.init();
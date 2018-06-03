//Storage Controller
const StorageCtrl = (function () {});

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
            {id: 0, name: 'Fish Burger', calories: 1200},
            {id: 1, name: 'Banana', calories: 90},
            {id: 2, name: 'Sandwich', calories: 400},
            {id: 3, name: 'Juice', calories: 120}
        ],
        currentItem: null,
        totalCalories: 0
    };
    return {
        getItems: function () {
            return data.items;
        },
        logData: function () {
            return data;
        }
    }
})();


//UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list'
    };

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fas fa-edit" style="color:Blue"></i>
        </a>
      </li>`;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;

        }
    }
})();


//App Controller
const App = (function (ItemCtrl, UICtrl) {

    return {
        init: function () {
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            //Populate list with items
            UICtrl.populateItemList(items);
        }
    }
})(ItemCtrl, UICtrl);

//Initialize App
App.init();
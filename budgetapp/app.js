  /* ----------------------------------------------------------------

   Budget Controller Module - Handles the calculation of expenses and income values.
   contains constructor functions, creates objects for these inc/exp values.
   returns various functions that give access to these objects for mutation.

  ------------------------------------------------------------------*/
  var budgetController = ( function() {

    var Expense = function(id, desc, val) {
      this.id = id;
      this.desc = desc;
      this.val = val;
    };
    var Income = function(id, desc, val) {
      this.id = id;
      this.desc = desc;
      this.val = val;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        budgetData.items[type].forEach(function(cur) {
            sum += cur.val;
        });
        budgetData.totals[type] = sum;
    };
    var budgetData = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
          exp: 0,
          inc: 0
        },
        totalBudget: 0,
        percent: -1
    };

  return {

    addItems: function(type, desc, val) {
      var newItem, theID;

        if (budgetData.items[type].length > 0) {
          theID = budgetData.items[type][budgetData.items[type].length - 1].id + 1;
        } else {
            theID = 0;
        }

        if (type === 'exp') {
          newItem = new Expense(theID, desc, val);
        } else if (type === 'inc') {
          newItem = new Income(theID, desc, val);
        } else {
          console.log("Error: income/expense type error.");
        }

      budgetData.items[type].push(newItem);
      return newItem;
    },
    calculateBudget: function() {
      calculateTotal('exp');
      calculateTotal('inc');
      budgetData.totalBudget = budgetData.totals.inc - budgetData.totals.exp;
      if (budgetData.totals.inc > 0) {
        budgetData.percent = Math.round(budgetData.totals.exp / budgetData.totals.inc * 100);
      } else {
        budgetData.percent = -1;
      }
    },
    deleteItem: function(type, id) {
      var items, index;

      items = budgetData.items[type].map(function(i){
        return i.id;
      });

      index = items.indexOf(id);

      if (index !== -1) {
        budgetData.items[type].splice(index, 1)
      }

    },
    getBudget: function() {
      return {
        budget: budgetData.totalBudget,
        totalInc: budgetData.totals.inc,
        totalExp: budgetData.totals.exp,
        percentage: budgetData.percent
      };
    },
    testing: function() {
      console.log(budgetData);
    }

  };

  })();

  /* ----------------------------------------------------------------

   Interface Controller Module - gets the HTML element classes and returns them
   for targeting by functions. varous functions mutate the UI, E.G
   adding and removing information from the budget controller, like expenses etc.

  ------------------------------------------------------------------*/

  var interfaceController = ( function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDesc: '.add__description',
      inputValue:'.add__value',
      inputBtn: '.add__btn',
      incomeCont: '.income__list',
      expensesCont: '.expenses__list',
      budgetValue: '.budget__value',
      container: '.container'
    };

    return {

      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value,
          desc: document.querySelector(DOMstrings.inputDesc).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
      },
      addItemToDOM: function(obj, type) {
        var htmlInjection, newHTML, element;
        if (type === 'inc'){
          element = DOMstrings.incomeCont;
          htmlInjection = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp'){
          element = DOMstrings.expensesCont
          htmlInjection = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        newHTML = htmlInjection.replace('%id%', obj.id);
        newHTML = newHTML.replace('%desc%', obj.desc);
        newHTML = newHTML.replace('%value%', obj.val);
        document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
      },
      deleteItem: function(theItemID) {
        var tbd = document.getElementById(theItemID);
        tbd.parentNode.removeChild(tbd);
      },
      clearFields: function() {
        var inputFields = document.querySelectorAll(DOMstrings.inputDesc + ", " + DOMstrings.inputValue);
        var inputFieldsArray = Array.prototype.slice.call(inputFields);
        inputFieldsArray.forEach((current, index, array) => {
          current.value = "";
        });
        inputFieldsArray[0].focus();
      },
      getDOMstrings: function() {
        return DOMstrings;
      }

    };

  })();

  /* ----------------------------------------------------------------

   Controller Module - The controller ties the budget, and UI functions
   the controller function is triggered on page load, and on events such as
   add/remove items -> triggers UI functions etc.

  ------------------------------------------------------------------*/

  var controller = ( function() {

    var setupEvents = function() {
        var DOMs = interfaceController.getDOMstrings();
        document.querySelector(DOMs.inputBtn).addEventListener('click', controllerAddItem);
        document.addEventListener('keypress', (e) => {
          if (e.keyCode === 13 || e.which === 13) {
            controllerAddItem();
          }
        });
        document.querySelector(DOMs.container).addEventListener('click', controllerDeleteItem);
    };
    var updateBudget = function() {
      budgetController.calculateBudget();
      var budget = budgetController.getBudget();
    };
    var controllerAddItem = function() {
      var strings, newi, atd;
      strings = interfaceController.getInput();
      if (strings.desc !== "" && !isNaN(strings.value) && strings.value > 0 ) {
        newi = budgetController.addItems(strings.type, strings.desc, strings.value);
        interfaceController.addItemToDOM(newi, strings.type);
        interfaceController.clearFields();
        updateBudget();
      }
    };
    var controllerDeleteItem = function(e) {
      var item, splitID, type, id;
      itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
      if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        id = parseInt(splitID[1]);

        budgetController.deleteItem(type, id);
        interfaceController.deleteItem(itemID);
        updateBudget();
      }
    };

    return {

      init: function() {
        setupEvents();
        console.log("Application has started");
      }

    };

  })(budgetController, interfaceController);

controller.init(); // initialise (start) the application, sets everything to 0.

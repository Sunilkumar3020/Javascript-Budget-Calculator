//'use strict';

//BUDGET CONTROLLER

var budgetController = (function () {
    // Create Expenses Objects
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    // Calculate percentage objects through prototype
    
    Expense.prototype.calcPercentage = function(totalIncome){
      
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/ totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
        
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        
        data.totals[type] = sum;
    };
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            
            // create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            
            // create new items base on 'inc' or 'exp' type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if ( type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // push it into data structure
            data.allItems[type].push(newItem);
            
            // return the new element
            return newItem;
        },
        
        
        deleteItem: function(type, id){
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
               return current.id; 
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function(){
            // calculate total income and expense
                calculateTotal('inc');
                calculateTotal('exp');
            
            // calculate the Budget: income - expense
                data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);    
            }else{
                data.percentage = -1;
            }
            
        },
        
        calculatePercentage: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
              return cur.getPercentage();
            });
            return allPerc;
        },
        
        getBudget: function(){
            
            return {
                
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentages: data.percentage
                
                
            }
        },
        
        testing: function(){
            console.log(data);
        }
    }
    
})();










//UI CONTROLLER 

var UIController = (function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:  '.containers',
        expensePercLable: '.item__percentage'
        
    };
    
    return {
        getInput: function(){
            
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        
        addListItem: function(obj, type){
            
            //create HTML string with placeholder text
            var html, newHTML, element;
            
            if(type === 'inc'){
                
                element = DOMStrings.incomeContainer;
                
              html =  '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-trash-alt"></i></button></div></div></div>';
                
            }else if(type === 'exp'){
                
                element = DOMStrings.expenseContainer;
                
              html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="right"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-trash-alt"></i></button></div></div></div>';
                
            }
            
            //replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            
            
            //insert the HTML into DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
            
        },
        
        deleteListItems: function(selectID){
            var el = document.getElementById(selectID);
                el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
           var fields, fieldArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            fieldArr = Array.prototype.slice.call(fields);
            
            fieldArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            fieldArr[0].focus();
            
        },
        
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            
            if(obj.percentages > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentages + '%';
            }
            else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },
        
        displayPercentages: function(percentages){
            var fieldsList = document.querySelectorAll(DOMStrings.expensePercLable);

             var nodeListForEach = function(list, callback){
                
                for (var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };
            
            nodeListForEach(fieldsList, function(current, index){
                
//                current.textContent = percentages[index] + '%';
                
                if(percentages[index] > 0){
                        current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '--';
                }
            });
            
           
            
        },
        
        // return DOM Strings for other modules
        getDOMStrings: function(){
          return DOMStrings;  
        }
        
    };
    
    
})();




//CONTROLLER


var controller = (function(budgetCtlr, UICtlr){
    
    var setEventListener = function(){
        var DOM = UICtlr.getDOMStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
                }
            });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        
        }
    
    var updateBudget = function(){
        
        // calculate Budget
        budgetCtlr.calculateBudget();
        
        // return budget
        
        var budget = budgetCtlr.getBudget();
        
        // insert budget into UI 
        
        UICtlr.displayBudget(budget);
        
    };
    
    var updatePercentage = function(){
        
        // Calculate Percentage
        budgetCtlr.calculatePercentage();
        
        // Read percentages from budget controller
        var percentages = budgetCtlr.getPercentages();
        
        // Update the UI with new Percentages
        
        console.log(percentages);
        UICtlr.displayPercentages(percentages); 
        
    };
    
    var ctrlAddItem = function(){
        var input, newItem;
        // get the field input data
        input = UICtlr.getInput();
        
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        // add new items to budget controller data structure
        newItem = budgetCtlr.addItem(input.type, input.description, input.value);
        
        
        //
        UICtlr.addListItem(newItem, input.type);
        
        // clear fields
        UICtlr.clearFields();
            
        }
        // calculate and update budget
        updateBudget();
        
        //calculate and update budget
        updatePercentage();        
    }
    
    var ctrlDeleteItem = function(event){
        var itemID,splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            budgetCtlr.deleteItem(type, ID); 
            
            UICtlr.deleteListItems(itemID);
            
            // Update Budget after deleting items
            updateBudget();
            
            // update percentage after deleting items
            
            updatePercentage();
        }
    };
    
    
    return {
        init: function(){
            UICtlr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentages: -1
            });
            
            setEventListener();
        }
    }
    
    
    
    
})(budgetController, UIController);



controller.init();















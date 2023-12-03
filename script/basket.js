Array.prototype.remove = function (value) {
    let index = this.indexOf(value);
    if (index !== -1) {
        this.splice(index, 1);
    }
}

function b(str) {
    return str ? `basket__${str}` : 'basket';
}

function item_b(str) {
    return str ? `item__${str}` : 'item';
}

let basket = document.querySelector('#' + b());
let container = basket.querySelector('.items');
let basketButton = document.querySelector('.basket_button');
let closeButton = document.querySelector('.close');
let total = basket.querySelector('.' + b('total'));
let sortAscButton = basket.querySelector('.' + b('sort-asc'));
let sortDescButton = basket.querySelector('.' + b('sort-desc'));

let purchaseButton = basket.querySelector('.purchase');

let products = document.querySelectorAll('.product');
let buyButtons = document.querySelectorAll(".buy_button");


// localStorage.setItem('items', '');
let items = [];
if (localStorage.getItem('items') !== undefined) {

    let itemsInfo = localStorage.getItem('items');

    if (itemsInfo != '') {
        itemsInfo = itemsInfo.split(';');
        itemsInfo.forEach((itemInfo) => {   
            let [title, price, quantity] = itemInfo.split(',');
            addItem(title, price, quantity);
        })
    }
}
else {
    localStorage.setItem('items', '');
}


function setLocalStorage() {
    let itemsInfo = '';
    items.forEach((item) => {
        itemsInfo += getItemInfo(item) + ';';
    });
    localStorage.items = itemsInfo.slice(0, -1);
}
function getItemInfo(item) {
    let itemInfo = item?.querySelector('.' + item_b('info'));
    return [itemInfo?.querySelector('.' + item_b('title')).textContent, itemInfo?.querySelector('.' + item_b('price')).textContent, getItemQuantity(item)];
}
function getItemQuantity(item) {
    return item?.querySelector('.' + item_b('controls')).querySelector('.' + item_b('quantity') + '-current').textContent;
}


basketButton.addEventListener('click', (event) => {
    event.preventDefault();
    
    setTimeout(() => {
        basket.style.display = 'block';
    }, 0);
    setTimeout(() => {
        basket.style.right = '0';
    }, 10);

    updateTotal();
});

closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    setTimeout(() => {
        basket.style.right = '-100%';
    }, 0);
    setTimeout(() => {
        basket.style.display = 'block';
    }, 200);
});

for (let button of buyButtons) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
    
        let product = this.parentElement;
        showSuccessMsg();

        title = product.querySelector('.title').textContent;

        price = product.querySelector('.price').textContent;
        
        addItem(title, price);
        updateTotal();
    });
}

purchaseButton.addEventListener("click", function(event) {
    event.preventDefault();
    alert('Успешно! Принята оплата на сумму ' + `${updateTotal()} руб.`)
})

sortAscButton.addEventListener('click', () => {
    setItems([...items.sort((item1, item2) => getItemPrice(item1) - getItemPrice(item2))]);
});

sortDescButton.addEventListener('click', () => {
    setItems([...items.sort((item1, item2) => getItemPrice(item2) - getItemPrice(item1))]);
});


function showSuccessMsg() {
    let message = document.createElement('p');
    message.textContent = "Товар добавлен в корзину!"
    message.className = 'message';
    
    setTimeout(() => {
        message.style.transform = 'translateY(-20px)';
        message.style.opacity = '1';
    }, 0);
    setTimeout(() => {
        message.style.transition = "all 1s";
        message.style.transform = 'translateY(-30px)';
    }, 600);
    setTimeout(() => {
        message.style.transform = 'translateY(-50px)';
        message.style.opacity = '0';
    }, 900);

    let catalog = document.querySelector('#catalog');
    catalog.insertBefore(message, catalog.firstElementChild);
}


function setItems(newItems) {
    for (const item of [...items]) {
        removeItem(item);
    }

    for (let item of newItems) {
        container.insertBefore(item, container.firstElementChild.nextElementSibling);
        items.push(item);
    }
    setLocalStorage();
    updateTotal();
}

function removeItem(item) {
    items.remove(item);
    setLocalStorage();
    item.remove();
}

function addItem(title, price, quantity = 1) {

    if (title.includes('Маска ')) {
        title = title.slice('Маска '.length);
    }
    

    let found = items.find((item) => {
        let [itemTitle, ...rest] = getItemInfo(item);
        return itemTitle == title;
    });



    if (found) {
        changeItemQuantity(found, +1);
    }
    else {
        let item = document.createElement('div');
        item.className = item_b();
        container.insertBefore(item, container.firstElementChild.nextElementSibling);
    
        let itemInfo = document.createElement('div');
        itemInfo.className = item_b('info');
        itemInfo.innerHTML = 
            `<span class=${item_b('title')}>${title}</span>` +
            `<span class=${item_b('price')}>${price}</span>`;
        item.appendChild(itemInfo);
    
        let controls = document.createElement('div');
        controls.className = item_b('controls');
        item.appendChild(controls);
    
        let current = document.createElement('span');
        current.className = item_b('quantity') + '-current';
        current.textContent = quantity;
        controls.appendChild(current);
    
        let changeQuantity = document.createElement('div');
        changeQuantity.className = item_b('change-quantity');
        controls.appendChild(changeQuantity);
    
        let add = document.createElement('button');
        add.className = item_b('change-quantity') + '-add';
        let up = document.createElement('i');
        up.className = 'fa-solid fa-arrow-up ';
        add.appendChild(up);
        changeQuantity.appendChild(add);
    
        add.addEventListener('click', () => changeItemQuantity(item, +1));
    
        let sub = document.createElement('button');
        sub.className = item_b('change-quantity') + '-sub';
        let down = document.createElement('i');
        down.className = 'fa-solid fa-arrow-down';
        sub.appendChild(down);
        changeQuantity.appendChild(sub);
    
        sub.addEventListener('click', () => {
            if (parseInt(current.textContent) > 1) {
                changeItemQuantity(item, -1);
            }
        });
    
        let deleteButton = document.createElement('button');
        deleteButton.className = item_b('delete-button');
        let del = document.createElement('i');
        del.className = 'fa-solid fa-minus';
        deleteButton.appendChild(del);
        controls.appendChild(deleteButton);
    
        deleteButton.addEventListener('click', () => {
            removeItem(item);
            updateTotal();
        });

        items.push(item);
    }
    setLocalStorage();
}

function changeItemQuantity(item, delta) {
    let current = item.querySelector('.' + item_b('quantity') + '-current');
    current.textContent = parseInt(current.textContent) + delta;

    updateTotal();
    setLocalStorage();
}

function getItemPrice(item) {
    let price = item.querySelector('.' + item_b('price'));
    return parseFloat(price.textContent.slice(0, -5));
}

function updateTotal() {
    let sum = 0;
    for (let child of basket.querySelectorAll('.' + item_b())) {
        let quantity = parseInt(child.querySelector('.' + item_b('quantity') + '-current').textContent);
        let price = getItemPrice(child);

        sum += quantity * price;
    }
    total.textContent = `Общая сумма: ${sum}`;

    return sum;
}

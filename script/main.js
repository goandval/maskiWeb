let goods = document.querySelectorAll(".product");

let IDs = {}
// localStorage.setItem('IDs', '');
if (localStorage.getItem('IDs')) {

    let idsInfo = localStorage.getItem('IDs');

    if (idsInfo != '') {
        idsInfo = idsInfo.split(';');
        idsInfo.forEach((idInfo) => {   
            let [id, rest] = idInfo.split('->');
            let [imgPath, title, price] = rest.split(',');
            IDs[id] = [imgPath, title, price];
        });
    }
}
else {
    localStorage.setItem('IDs', '');
}
function setLocalStorageIds() {
    let idsInfo = '';
    for (let id in IDs) {
        idsInfo += id + '->' + IDs[id] + ';';
    }
    localStorage.setItem('IDs', idsInfo.slice(0, -1));
}


for (let product of goods) {
    product = product.querySelector(".content");
    product.addEventListener("click", function(event) {
        if (!event.target.classList.contains('buy_button')) {
            openProductPage(product);
        }
    });
}

function openProductPage(product) {
    let imgPath = product.querySelector("img").src;
    let id = imgPath.split('/').at(-1).split('.').at(0);

    let title = product.querySelector('.title').textContent;
    let price = product.querySelector('.price').textContent;

    IDs[id] = [imgPath, title, price];
    setLocalStorageIds();

    location.href = `./product.html?${id}`;
}

let [page, id] = location.href.split('?');
page = page.split('/').at(-1);

if (page == 'product.html') {
    let [imgPath, title, price] = IDs[id];

    let productInfo = document.querySelector("#product-info");
    productInfo.querySelector('.title').textContent = 'Маска ' + title;
    productInfo.querySelector('.price').textContent = price;
    productInfo.querySelector('#product_img').src = imgPath;
}

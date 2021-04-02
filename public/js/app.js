const shopNow = document.querySelector('.banner-btn');
const productsDiv = document.querySelector('.products-center');
const prodArray = new Array();
const iconCart = document.querySelector('.fas.fa-cart-plus');
let addBag = '';

const cartOverlay = document.querySelector('.cart-overlay');
const cartDiv = document.querySelector('.cart');
const closeSpan = document.querySelector('.fas.fa-window-close');
const cartQty = document.querySelector('.cart-items');
const cartItems = document.querySelector('.cart-content');
const cartClear = document.querySelector('.clear-cart');
const cartUp = document.querySelector('.fas.fa-chevron-up');


class product{
    constructor(id, img, title, price, cart = 0){
        this.id = id;
        this.img = img;
        this.title = title;
        this.price = price;
        this.cart = cart;
    }
}

const getProducts = async () => {
    let list = await fetch('products.json');
    let data = list.json();
    return data;
}

const showProducts = products => {
    products.forEach(e =>{
        productsDiv.innerHTML += `
            <article class="product">
                <div class="img-container">
                    <img src="${e.img}" alt="${e.title}" class="product-img">
                    <button class="bag-btn" data-id="${e.id}">
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${e.title}</h3>
                <h4>${e.price}</h4>
            </article>`
    })
}

getProducts()
    .then(data => { 
        data.items.forEach(e =>{
            prodArray[e.sys.id] = new product(e.sys.id, e.fields.image.fields.file.url, e.fields.title, e.fields.price);
        })

        showProducts(prodArray);

        const localStorageCart = localStorage.getItem('cart');
        if(localStorageCart){
            const preCart = localStorageCart.split('|');
            //console.log(preCart)
            let splitItem;
            preCart.forEach(preItem => {
                splitItem = preItem.split(':')
                //console.log(splitItem[0], splitItem[1])
                myCart.add(splitItem[0]);
                prodArray[splitItem[0]].cart = splitItem[1]
            })
            myCart.updateLocalStorage()
        }

     })
    .catch(err => { console.log(err); })

class cart {
    constructor(){
        this.items = new Array();
        this.total = 0;
    }
    display(){
        this.calcTotal();
        let html = '';
        this.items.forEach(e=>{
            html += `
                    <div class="cart-item" data-id="${prodArray[e].id}">
                        <img src="${prodArray[e].img}" alt="${prodArray[e].title}">
                        <div>
                            <h4>${prodArray[e].title}</h4>
                            <h5>${prodArray[e].price}</h5>
                            <span class="remove-item">remove</span>
                        </div>
                        <div>
                            <i class="fas fa-chevron-up"></i>
                            <p class="item-amount">${prodArray[e].cart}</p>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
            `;
        })
        cartItems.innerHTML = html;
        document.querySelector('.cart-total').innerHTML = this.total;
        //console.log(myCart)
        this.updateLocalStorage();
    }
    show(){
        this.display();
        cartDiv.style.transform = 'translateX(0)';
        cartOverlay.style.visibility = 'visible';
    }
    close(){
        cartOverlay.style.visibility = 'hidden';
        cartDiv.style.transform = 'translateX(100%)';        
    }
    add(product){
        this.items.push(product);
        prodArray[product].cart = 1;
        addBag = document.querySelector('button.bag-btn[data-id="'+product+'"]');
        addBag.innerHTML = `<i class="fas fa-shopping-cart"></i>in cart`;
        this.qty();
        this.display();
    }
    remove(productId){
        this.items = this.items.filter(element => element != productId )
        this.qty();
        this.display();
        addBag = document.querySelector('button.bag-btn[data-id="'+productId+'"]');
        addBag.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
        prodArray[productId].cart = 0;
    }
    qty(){        
        cartQty.innerText = this.items.length;
    }
    calcTotal(){
        this.total = 0;
        this.items.forEach(e=>{
            this.total += prodArray[e].price * prodArray[e].cart;
        })
        this.total = Math.round(this.total * 100) / 100;
    }
    clear(){
        this.items.forEach(e=>{
            prodArray[e].cart = 0;
            addBag = document.querySelector('button.bag-btn[data-id="'+e+'"]');
            addBag.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
        })
        this.items = new Array();
        this.qty();
        this.display();
    }
    increment(productId){
        console.log(productId);
        prodArray[productId].cart++;
        this.display();
    }
    decrement(productId){
        console.log(productId);
        prodArray[productId].cart--;
        if(prodArray[productId].cart <= 0){
            this.remove(productId);
        }
        this.display();
    }
    updateLocalStorage(){
        let myStorage = '';
        this.items.forEach(e=>{
            myStorage += (myStorage == '' ? '' : '|') + prodArray[e].id + ':' + prodArray[e].cart;
        })
        //console.log(myStorage);
        localStorage.setItem('cart', myStorage)
    }
}

let myCart = new cart();

iconCart.addEventListener('click', () => {
    myCart.show();
})

closeSpan.addEventListener('click', () => {
    myCart.close();
})

productsDiv.addEventListener('click', e => {
    if(e.target.nodeName == 'BUTTON' && e.target.className == 'bag-btn'){
        let productId = e.target.getAttribute('data-id');
        let verify = myCart.items.filter(e => e == productId);
        if(verify.length == 0){
            myCart.add(productId);
        }
        myCart.show();
    }
})

cartItems.addEventListener('click', e => {
    //console.log(e);
    if(e.target.nodeName == 'SPAN' && e.target.className == 'remove-item'){
        let productId = e.target.parentElement.parentElement.getAttribute('data-id');
        myCart.remove(productId);
    }
    if(e.target.nodeName == 'I' && e.target.className == 'fas fa-chevron-up'){
        let productId = e.target.parentElement.parentElement.getAttribute('data-id');
        myCart.increment(productId);
    }
    if(e.target.nodeName == 'I' && e.target.className == 'fas fa-chevron-down'){
        let productId = e.target.parentElement.parentElement.getAttribute('data-id');
        myCart.decrement(productId);
    }
})

cartClear.addEventListener('click', e=>{
    myCart.clear();
})

shopNow.addEventListener('click', e=>{
    scrollTo(0,1000);
})

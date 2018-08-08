for (let x = 0; x < document.getElementsByClassName("product-row").length; x++) {
    document.getElementsByClassName("product-row")[x].addEventListener("click", ()=>{
        for (let y = 0; y < document.getElementsByClassName("product-row").length; y++) {
            if (document.getElementsByClassName("product-row")[y] !== document.getElementsByClassName("product-row")[x]) {
                document.getElementsByClassName("product-row")[y].style.height = "10%";
                document.getElementsByClassName("product-row")[y].children[0].style.fontSize = "120%";
                document.getElementsByClassName("product-row")[y].children[0].style.left = "10px";
                document.getElementsByClassName("product-row")[y].classList.add("hovering");
                document.getElementsByClassName("product-row")[y].classList.remove("non-hovering");   
                for (let z = 1; z < document.getElementsByClassName("product-row")[y].children.length; z++) {
                    document.getElementsByClassName("product-row")[y].children[z].style.visibility = "hidden";
                }
  
            }
            else {
                document.getElementsByClassName("product-row")[y].style.height = "70%"; 
                document.getElementsByClassName("product-row")[y].children[0].style.fontSize = "200%";
                document.getElementsByClassName("product-row")[y].children[0].style.left = "80px";
                document.getElementsByClassName("product-row")[y].classList.remove("hovering");
                document.getElementsByClassName("product-row")[y].classList.add("non-hovering");
                

                for (let z = 1; z < document.getElementsByClassName("product-row")[y].children.length; z++) {
                    document.getElementsByClassName("product-row")[y].children[z].style.visibility = "initial";
                }
            }
        } 
    });
}


for (let x = 0; x < document.getElementsByClassName("itemHolder").length; x++) {
    document.getElementsByClassName("itemHolder")[x].children[3].addEventListener("click", ()=>{
        if (document.getElementsByClassName("itemHolder")[x].children[4].value.length > 0) {
            let itemClone = document.getElementsByClassName("itemHolder")[x].cloneNode(true);
            itemClone.children[3].innerText = "remove";
            itemClone.children[3].addEventListener("click", ()=>{
                itemClone.parentElement.removeChild(itemClone);
                document.getElementById("cartCount").innerText = `current cart [${document.getElementById("cart-row").children.length-1}]`;
                updateCartRemove();
                let totalPrice = 0;
                for (let x = 1; x < document.getElementById("cart-row").children.length; x++) {
                    let cartItemPrice = parseInt(document.getElementById("cart-row").children[x].children[2].innerHTML.replace("$", ""));
                    let cartItemQuantity = document.getElementById("cart-row").children[x].children[4].value;
                    let newTot = cartItemPrice * cartItemQuantity;
                    totalPrice += newTot;
        
                }
                document.getElementById("cartButtonText").innerText = `purchase cart $${totalPrice}`;
            });
            itemClone.children[4].disabled = true;
            document.getElementById("cart-row").appendChild(itemClone);
            document.getElementById("cartCount").innerText = `current cart [${document.getElementById("cart-row").children.length-1}]`;
            updateCartAdd();

            let totalPrice = 0;
            for (let x = 1; x < document.getElementById("cart-row").children.length; x++) {
                let cartItemPrice = parseInt(document.getElementById("cart-row").children[x].children[2].innerHTML.replace("$", ""));
                let cartItemQuantity = document.getElementById("cart-row").children[x].children[4].value;
                let newTot = cartItemPrice * cartItemQuantity;
                totalPrice += newTot;
    
            }
            document.getElementById("cartButtonText").innerText = `purchase cart $${totalPrice}`;
        }
    });
}

let updateCartAdd = () => {
    let http = new XMLHttpRequest();
    http.open("POST", "/update_cart", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    let params = "";
    let sep = "";
    for (let x = 1; x < document.getElementById("cart-row").children.length; x++) {
        if (x !== document.getElementById("cart-row").children.length-1) {
            sep = "|";
        }
        else {
            sep = "";
        }
        params += document.getElementById("cart-row").children[x].children[4].id + " " + document.getElementById("cart-row").children[x].children[4].value + sep;

    }
    params += "|" + document.getElementById("logout").innerHTML.split(" ")[1];
    http.send(params);
}


let updateCartRemove = () => {
    let http = new XMLHttpRequest();
    http.open("POST", "/update_cart", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    let params = "";
    let sep = "";
    if (document.getElementById("cart-row").children.length === 1) {
        http.send(params);
        return;
    }
    for (let x = 1; x < document.getElementById("cart-row").children.length; x++) {
        if (x !== document.getElementById("cart-row").children.length-1) {
            sep = "|";
        }
        else {
            sep = "";
        }
        params += document.getElementById("cart-row").children[x].children[4].id + " " + document.getElementById("cart-row").children[x].children[4].value + sep;

    }
    params += "|" + document.getElementById("logout").innerHTML.split(" ")[1];
    http.send(params);


    
}

if (document.getElementById("feed").innerText !== "n/a" && document.getElementById("feed").innerText !== "") {
    let filteredCart = [];
    
    let unfiltered = document.getElementById("feed").innerText.replace("[", "").replace("]", "").split(",");
    /*unfiltered.forEach(strAr, ()=>{
        let pair = {"item": strAr[0], "quantity": strAr[1]};
        filteredCart.push(pair);
    });*/

    for (let z = 0; z < unfiltered.length; z++) {
        unfiltered[z] = unfiltered[z].slice(1, unfiltered[z].length-1);
        let mini = unfiltered[z].replace(/"/g, "").split(" ");
        let pair = {};
        pair["item"] = mini[0];
        pair["quantity"] = mini[1];
        filteredCart.push(pair);

    }

    console.log(filteredCart);
    let cartItems = [];
    for (let a = 0; a < document.getElementsByClassName("itemHolder").length; a++) {
        for (let b = 0; b < filteredCart.length; b++) {
            if (document.getElementsByClassName("itemHolder")[a].children[4].id === filteredCart[b]["item"]) {
                let itemText = document.getElementsByClassName("itemHolder")[a].children[0].innerHTML;
                let pastItem = document.createElement("h5");
                pastItem.innerText = itemText;
                pastItem.style.color = "black";
                document.getElementById("lastCart").appendChild(pastItem);
                cartItems.push(itemText);
            }
        }    
    }
    console.log(cartItems);
    document.getElementById("lastCartCap").innerText = `previous cart: [${cartItems.length}]`
}

document.getElementById("leave").addEventListener("click", ()=>{
    updateCartRemove();
    window.location = "/login";
});

document.getElementById("cartButton").addEventListener("click", ()=>{
    if (document.getElementById("cartButtonText").innerHTML.split(" ").length > 2) {
        let order = [];
        for (let x = 1; x < document.getElementById("cart-row").children.length; x++) {
            order.push(x + ". " + document.getElementById("cart-row").children[x].children[0].innerHTML + " " + document.getElementById("cart-row").children[x].children[2].innerHTML + " x " + document.getElementById("cart-row").children[x].children[4].value);
        }
        order.push("<br><br>Total: " + document.getElementById("cartButtonText").innerHTML.split(" ")[2]);
        

        let custName =  document.getElementById("custName").innerHTML.split(" ").splice(1).join(" ").toUpperCase();
        let custEmail =  document.getElementById("logout").innerHTML.split(" ").splice(1);
        let template_params = {
            "dest_email": custEmail,
            "to_name": custName,
            "message_html": order.join("<br>")
        }
     
        var service_id = "default_service";
        var template_id = "reciept";
        console.log(order.join("\n"));
        var confirmation = confirm("Are you sure you want to make this purchase? You will receive a receipt via email.");
        if (confirmation === true) {
            emailjs.send(service_id,template_id,template_params).then((response)=>{
                window.location = "/order_conf";
            });
        }
        else {
            return;
        }
        
    }

    else {
        console.log("cart empty");
    }

    
});

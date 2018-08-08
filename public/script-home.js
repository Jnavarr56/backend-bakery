// Body Opacity Fade In
/*-------------------------------------------------------------*/
let bodyOpacity = 0;
setTimeout(()=>{
    let flashBody = setInterval(()=>{
        document.body.style.opacity = `${bodyOpacity}`
        if (bodyOpacity >= 1) {
            clearInterval(flashBody);
        }
        bodyOpacity += .0025;
    }, 1);
},250);
/*-------------------------------------------------------------*/

// Scroll Button/Fade In Next Section
/*-------------------------------------------------------------*/
for (let x = 0; x < document.getElementsByClassName("arrow").length; x++) {
    let windowHeight = window.innerHeight;
    if (document.getElementsByClassName("arrow")[x].classList.contains("arrow-down")) {
        document.getElementsByClassName("arrow")[x].addEventListener("click", ()=>{
            document.getElementsByClassName("arrow")[x].parentElement.nextElementSibling.classList.add("flashSectionIn");
            setTimeout(()=>{
                document.getElementsByClassName("arrow")[x].parentElement.nextElementSibling.classList.remove("flashSectionIn");
            }, 1500);
            window.scrollTo({
                top: document.getElementsByClassName("arrow")[x].parentElement.nextElementSibling.offsetTop, 
                left: 0, 
                behavior: 'smooth' 
              });
        });
    }
    else {
        document.getElementsByClassName("arrow")[x].addEventListener("click", ()=>{
            console.log(document.getElementsByClassName("arrow")[x]);
            document.getElementsByClassName("arrow")[x].parentElement.previousElementSibling.classList.add("flashSectionIn");;
            setTimeout(()=>{
                document.getElementsByClassName("arrow")[x].parentElement.previousElementSibling.classList.remove("flashSectionIn");
            }, 1500);
            window.scrollTo({
                top: document.getElementsByClassName("arrow")[x].parentElement.previousElementSibling.offsetTop, 
                left: 0, 
                behavior: 'smooth' 
              });
        });
    } 
}
/*-------------------------------------------------------------*/

// Map Current Scroll Position to Nav Bar Links and Highlight Correspondingly
/*-------------------------------------------------------------*/
let scrollObjs = [];
for (let x = 0; x < document.getElementsByClassName("body-sec").length; x++) {
 let scrollObj = {};
 scrollObj.navLink = document.getElementById("nav-links").children[x];
 scrollObj.bodySection = document.getElementsByClassName("body-sec")[x];
 scrollObj.bodySectionXStart = document.getElementsByClassName("body-sec")[x].offsetTop;
 scrollObj.bodySectionXEnd = document.getElementsByClassName("body-sec")[x].offsetTop + document.getElementsByClassName("body-sec")[x].offsetHeight;
 if (x !== 0) {
     scrollObj.visited = false; 
 }
 else {
    scrollObj.visited = true;
 }
 scrollObjs.push(scrollObj);
}
console.log(scrollObjs);

for (let x = 0; x < document.getElementById("nav-links").children.length; x++) {
    for (let y = 0; y < scrollObjs.length; y++) {
        if (document.getElementById("nav-links").children[x] === scrollObjs[y].navLink) {
            document.getElementById("nav-links").children[x].addEventListener("click", ()=>{
                scrollObjs[y].bodySection.classList.add("flashSectionIn");
                setTimeout(()=>{
                    scrollObjs[y].bodySection.classList.remove("flashSectionIn");
                }, 1500);
                window.scrollTo({
                    top: scrollObjs[y].bodySectionXStart, 
                    left: 0, 
                    behavior: 'smooth' 
                  });
            });
        }
    }
}
document.addEventListener("scroll", ()=>{
    for (let x of scrollObjs) {
        if (window.scrollY >= x.bodySectionXStart && window.scrollY < x.bodySectionXEnd) {
            x.navLink.style.backgroundColor = "rgba(255,105,180, .7)";
            if (x.navLink.innerText === "selection" && x.visited === false) {
                for (let y = 0; y < document.getElementsByClassName("selec-stack").length; y++) {
                    if (y%2 === 0) {
                        document.getElementsByClassName("selec-stack")[y].classList.add("selec-stack-up");
                        document.getElementsByClassName("selec-stack")[y].children[0].style.top = "100%";
                        document.getElementsByClassName("selec-stack")[y].children[0].classList.add("selec-cap-fadein");
                    }
                    else {
                        document.getElementsByClassName("selec-stack")[y].classList.add("selec-stack-down");
                        document.getElementsByClassName("selec-stack")[y].children[0].style.bottom = "100%";
                        document.getElementsByClassName("selec-stack")[y].children[0].classList.add("selec-cap-fadein");
                    }
                }
            }
            else if (x.navLink.innerText === "about us" && x.visited === false) {
                for (let y = 0; y < document.getElementsByClassName("about").length; y++) {
                    if (y%2 === 0) {
                        document.getElementsByClassName("about")[y].classList.add("about-left");
                        document.getElementsByClassName("about")[y].children[0].style.right = "-115%";
                        document.getElementsByClassName("about")[y].children[0].classList.add("about-cap-fade");
                    }
                    else {
                        document.getElementsByClassName("about")[y].classList.add("about-right");
                        document.getElementsByClassName("about")[y].children[0].style.left = "-110%";
                        document.getElementsByClassName("about")[y].children[0].classList.add("about-cap-fade");
                
                    }
                }
            }
            x.visited = true;
        }
        else {
            x.navLink.style.backgroundColor = "initial";            
        } 
    }
});
/*-------------------------------------------------------------*/



document.getElementById("login").addEventListener("click", ()=>{
    window.location = window.location.href + "login";

});
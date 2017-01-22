//отбираем все ссылки на статьи в переменую articles

browser.storage.local.clear();//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var articles = document.body.getElementsByTagName("article");

for (var i = 0; i < articles.length; i++) {
    
    var bAdd = document.createElement("div");
    
    bAdd.classList.add("add_to_quick_list ");
    
    var home = undefined;
    var el = articles[i];//?????

    while (home == undefined) {
        if (el.parentNode.classList.contains("latestEntries")) { //left main list
            home = "latestEntries";
        } else if (el.parentNode.classList.contains("pickedEntries")) { //center main part of page
            home = "pickedEntries";
        } else if (el.parentNode.classList.contains("pickedEntriesBottom")  && el.parentNode) { //bottom list
            home = "pickedEntriesBottom";
        }

        el = el.parentNode;
    }

    switch (home) {
        case "latestEntries":
            bAdd.dataset.href = articles[i].querySelector(".desktop .entryTitle a").href;
            bAdd.dataset.title = articles[i].querySelector(".desktop .entryTitle a").innerHTML;
            break;
        case "pickedEntries":
            bAdd.dataset.href = articles[i].querySelector("a.overlayLink").href;
            bAdd.dataset.title = articles[i].querySelector("h2.entryTitle").innerHTML;
            break;
        case "pickedEntriesBottom":
            bAdd.dataset.href = articles[i].querySelector("a.overlayLink").href;
            bAdd.dataset.title = articles[i].querySelector("h3.entryTitle").textContent.replace(/(^\s*)|(\s*)$/g, '');
            break;
    }
    
    bAdd.dataset.homeType = home;
       
    articles[i].addEventListener("click", (event) => {
        var title = event.target.dataset.title;
        var href = event.target.dataset.href;
        
        var h = browser.storage.local.get(title);
        h.then((res) => {
            res = res[0];
            console.log(href == res[title]);
            if (href == res[title]) {
                
                event.target.style.backgroundColor = "#55ccbb";
                
                bAdd.onmouseover = function(event) {                //REMOVE THIS
                    //event.target.style.backgroundColor = "#56ADC9";
                }
                bAdd.onmouseout = function(event) {                //AND THIS
                    //event.target.style.backgroundColor = "#CCCCCC";
                }
            } else {
                addToList(title, href);//browser.storage.local.set({[title]: href});
            }
        });
        
    
        displayFloatButton();
    });
    
    bAdd.onmouseover = function(event) {                //REMOVE THIS
        event.target.style.backgroundColor = "#56ADC9";
    }
    
    bAdd.onmouseout = function(event) {                //AND THIS
        event.target.style.backgroundColor = "#CCCCCC";
    }
        
    articles[i].appendChild(bAdd);
}

function onError(error) {
    console.log(error);
    alert("Ошибка. Подробности в консоле.");
}

/*
    var setF = browser.storage.local.set({"Номер раз": "http://shazoo.ru/about"});
    browser.storage.local.set({"Номер ТРИ": "http://shazoo.ru/about"});
    browser.storage.local.set({"Номер 2": "http://shazoo.ru/about"});
*/

displayFloatButton();

function displayFloatButton() {
    
    var gettingAllStorageItems = browser.storage.local.get();
            
    gettingAllStorageItems.then((res) => {
        /*WTF*/
        res = res[0];
        var isnt = Object.keys(res).length;
        var floatButton;
        
        var floatButtonTitle = Object.keys(res)[Object.keys(res).length - 1];
        var floatButtonHref = res[floatButtonTitle];
        
        switch (isnt) {
            case 0:
                break;
            case 1:
                floatButton = document.createElement("div");
                floatButton.classList.add("boxQuickList");
                floatButton.style.cssText = `position: fixed;
                                            top: 100px;
                                            right: 0px;
                                            padding: 8px;
                                            background-color: #eee;
                                            border-style: solid;
                                            border-left-color: aqua;
                                            border-left-width: 2px;
                                            border-right-width: 0px;
                                            border-top-width: 0px;
                                            border-bottom-width: 0px;
                                            z-index: 999;`;
                document.body.appendChild(floatButton);
                floatButton.innerHTML = `<a href = ${floatButtonHref}>${floatButtonTitle}<a>`;
                break;
            default:
                //if (res[floatButtonTitle] == floatButtonHref) {
                    floatButton = document.querySelector(".boxQuickList");
                    floatButton.innerHTML = `<a href = ${floatButtonHref}>${floatButtonTitle}<a>`;
                //}
        }
    }, onError);
}

function addToList(title, href) {
    browser.storage.local.set({[title]: href});
}

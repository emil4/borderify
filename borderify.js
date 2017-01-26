/*кнопка очистки хранилища
var clear = document.createElement('div');
clear.className = 'clear';
clear.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
document.body.appendChild(clear);
clear.addEventListener('click', (e) => {
    browser.storage.local.clear();
    displayFloatButton();
});
*/


//console.log(articles);

function addToList(event) {
    var title = event.target.dataset.title;
    var href = event.target.dataset.href;
    
    event.target.className = "in_list";

    //var h = browser.storage.local.get(title);
    
    //console.log(event);
    
    browser.storage.local.set({[title]: href});
}

var articles = document.body.getElementsByTagName("article");
updatePage(articles);

function updatePage(articles) {
    if (articles.length > 1) {
        for (var i = 0; i < articles.length; i++) {
            
            if (articles[i].querySelector("add_to_quick_list") || articles[i].querySelector("in_list")) {
                continue;
            }

            var bAdd = document.createElement("div");
            var left = undefined;
            var cent = undefined;
            var bott = undefined;
            var lefth = undefined;
            var centh = undefined;
            var botth = undefined;

            bAdd.classList.add("add_to_quick_list");

            bAdd.dataset.i = i;

            try {
                left = articles[i].querySelector(".desktop .entryTitle a").innerHTML;//left main list
                lefth = articles[i].querySelector(".desktop .entryTitle a").href;
            } catch (e) {}

            try {
                cent = articles[i].querySelector("h2.entryTitle").innerHTML;//center main part of page
                centh = articles[i].querySelector("a.overlayLink").href;
            } catch (e) {}

            try {
                bott = articles[i].querySelector("h3.entryTitle").textContent.replace(/(^\s*)|(\s*)$/g, '');//bottom list
                botth = articles[i].querySelector("a.overlayLink").href;
            } catch (e) {}

            bAdd.dataset.title = left || cent || bott;
            bAdd.dataset.href = lefth || centh || botth;

            bAdd.addEventListener("click", (event) => {
                var title = event.target.dataset.title;
                var href = event.target.dataset.href;

                event.target.className = 'in_list';

                //event.target.className = "in_list";
                browser.storage.local.set({[title]: href});

                displayFloatButton();
            });

    /*ON DELETE
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
    !!!!!*/

            articles[i].appendChild(bAdd);
        }
    }
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

var del;

function displayFloatButton() {
    
    var gettingAllStorageItems = browser.storage.local.get();

    gettingAllStorageItems.then((res) => {
        
        res = res[0];
        
        var floatButton = document.body.querySelector("#float_button");
        
        var count = Object.keys(res).length;
        var floatButtonTitle = Object.keys(res)[Object.keys(res).length - 1];
        var floatButtonHref = res[floatButtonTitle];
        
        //console.log(res);
        
        if (count == 0) {//если в хранилище пусто, то ничего не делать
            
        } else if (!floatButton) {//если в хранилище что-то есть, но нет плавающей кнопки
            
            floatButton = document.createElement("div");
            floatButton.id = "float_button";
            
            var alias = document.createElement('a');
            
            alias.textContent = floatButtonTitle;
            alias.href = floatButtonHref;
            
            document.body.appendChild(floatButton);
            floatButton.appendChild(alias);
            
            floatButton.addEventListener('click', (e) => {
                //console.log(e.target.innerHTML);
                //e.preventDefault();
                browser.storage.local.remove(e.target.innerHTML);
            });
            
        } else  if (floatButton) {//если в хранилище что-то есть, и есть плавающая кнопка
            
            var alias = document.createElement('a');
            
            alias.textContent = floatButtonTitle;
            alias.href = floatButtonHref;
            
            floatButton.replaceChild(alias, floatButton.firstChild);
            
        }
        
        //console.log(res);
    });
}

var more_button = document.querySelector('.action[data-action="home.more"]');
if (more_button) {
    more_button.addEventListener('click', (e) => {
        var entries = document.body.querySelector('div.latestEntries.tab.active');
        var art = entries.getElementsByTagName("article");
        setTimeout(() => {updatePage(art);}, 1000);
    });
}

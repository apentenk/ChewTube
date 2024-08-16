window.onload = function () {
    $("#ingredients").on('click', '.ingredientTag>p', function () {
        this.parentElement.classList.toggle("excluded");
    });

    $("#ingredients").on('click', '.ingredientTag>.remove-btn', function () {
        this.parentElement.remove();
    });

    document.getElementById("submit").addEventListener("click", function () {
        let queryString = "?";
        let included = "";
        let excluded = "";
        $("#ingredients>div").each(function () {
            if (this.classList.contains("excluded")) {
                excluded += this.id + ",";
            } else {
                included += this.id + ",";
            }
        });
        let name = document.getElementById("dish").value;
        if (name !== undefined && name !== "") {
            queryString += "dish=" + name
        } else {
            queryString += "dish=" + document.getElementById("title").innerHTML;

        }

        if (included.length > 1) {
            queryString += "&included=" + included.slice(0, -1);
        }
        if (excluded.length > 1) {
            queryString += "&excluded=" + excluded.slice(0, -1);
        }

        window.location.replace(window.location.pathname + queryString);
    });

    document.getElementById("add").addEventListener("click", function () {
        let ingredient = encodeURIComponent(document.getElementById("ingredient").value);
        let exists = Boolean(document.getElementById(ingredient)) || Boolean(document.getElementById(ingredient.replace(/\s+/g, '')));

        if (ingredient === "" || exists) {
            return;
        }

        let mode = document.getElementById("mode").value;
        document.getElementById("ingredients").append(createIngredientTag(ingredient, mode));

    })
}

function createIngredientTag(ingredient, type) {
    let container = document.createElement("div");
    container.id = ingredient;
    let name = document.createElement("p");
    name.innerHTML = decodeURI(ingredient);
    name.classList.add("tag-name");
    let removeBtn = document.createElement("button");
    removeBtn.value = ingredient;
    removeBtn.classList.add("remove-btn")
    let icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-xmark");
    removeBtn.append(icon);
    container.append(name, removeBtn);
    container.classList.add("ingredientTag");
    if (type === "excluded") {
        container.classList.add(type);
    }
    return container;
}
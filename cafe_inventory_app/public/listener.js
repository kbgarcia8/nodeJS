document.addEventListener("DOMContentLoaded", ()=> {
    const drinkPriceDiv = document.querySelectorAll(".drink-price");
    const mealPriceDiv = document.querySelectorAll(".meal-price");
    const categorySelect = document.querySelector("#productCategory");

    const updatePriceInputVisibility = (selectedValue) => {
        if (selectedValue === 'Iced Drink' || selectedValue === 'Hot Drink') {
            mealPriceDiv.forEach((mealDiv) => {
                mealDiv.style.display = 'none';
            });

            drinkPriceDiv.forEach((drinkDiv) => {
                drinkDiv.style.display = 'flex';
            });
        } else {
            mealPriceDiv.forEach((mealDiv) => {
                mealDiv.style.display = 'flex';
            });

            drinkPriceDiv.forEach((drinkDiv) => {
                drinkDiv.style.display = 'none';
            });
        }
    }

    updatePriceInputVisibility(categorySelect.value);

    categorySelect.addEventListener("change", (e)=> {
        const selected = e.target.value;
        updatePriceInputVisibility(selected)
        
    });

});


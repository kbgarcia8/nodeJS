const buttons = document.querySelectorAll(".menu-filter-entry")
console.log(buttons)

buttons.forEach(button => {
    const span = button.querySelector('span')
    span.addEventListener('click', (e) => {
    const category = e.currentTarget.textContent;
        if (category !== 'All') {
            window.location.href = `/${category}`;
        }
       console.log(category);
    });
})
const buttons = document.querySelectorAll(".open-message")

buttons.forEach(button => {
    button.addEventListener('click', () => {
    const index = button.getAttribute('data-index');
        if (index) {
            window.location.href = `/messages/${index}`;
        }
       console.log(index)
    });
})
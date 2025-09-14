const folderSelect = document.querySelectorAll('input[name=folderSelection');
const newFolderInput = document.querySelector('.new-folder');
const existingFolderInput = document.querySelector('.existing-folder');

folderSelect.forEach(select => {
    select.addEventListener('change', () => {
      if (select.value === "new") {
        newFolderInput.style.display = "flex";
        existingFolderInput.style.display = "none";
        document.querySelector('input[name="folderName"]').disabled = false;
        document.querySelector('select[name="folderName"]').disabled = true;
      } else {
        newFolderInput.style.display = "none";
        existingFolderInput.style.display = "flex";
        document.querySelector('input[name="folderName"]').disabled = true;
        document.querySelector('select[name="folderName"]').disabled = false;
      }
    });
});
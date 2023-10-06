document.addEventListener('DOMContentLoaded', function () {
    const decimalInput = document.getElementById('decimalInput');
    const convertButton = document.getElementById('convertButton');
    const binaryResult = document.getElementById('binaryResult');

    convertButton.addEventListener('click', function () {
        const decimalValue = parseInt(decimalInput.value, 10);
        if (!isNaN(decimalValue)) {
            const binaryValue = decimalValue.toString(2);
            binaryResult.textContent = binaryValue;
        } else {
            binaryResult.textContent = 'Invalid input';
        }
    });
});

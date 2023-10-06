document.addEventListener('DOMContentLoaded', function () {
    const binaryInput = document.getElementById('binaryInput');
    const convertButton = document.getElementById('convertButton');
    const decimalResult = document.getElementById('decimalResult');

    convertButton.addEventListener('click', function () {
        const binaryValue = binaryInput.value;
        const decimalValue = parseInt(binaryValue, 2);

        if (!isNaN(decimalValue)) {
            decimalResult.textContent = decimalValue;
        } else {
            decimalResult.textContent = 'Invalid input';
        }
    });
});

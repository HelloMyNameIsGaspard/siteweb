(function() {

    var pl = "GRGVVHeGCYoZRipBKZpQsRbZuNVSdOvD8iVVB7QlN9sLqbLegk5+7C8CJy+oE/jJQPXDj40CnTiRzyXrBjdqeGqJm6ayiN91Ewdz/HFzeNxqNmuJK1K7BxXAQ72G3EK8nIYBKUhaaJw1Kmw3Lj9pREikDfc/wR5iskGBdKjsXrMNJT7T3rXypG1Nf5IT/T78KUzCw1tAcXpClO2kJ/NwFOkoUaE+O9AClO38n/4MoZrPTl2psq3OevodiZuridry0DXwnWMgK9XsK60JqqK5FRXOUgXnVzQTrGqn3IRXqaLLAPgGOdkigETObBf8cX2F+ebw4HIZhGmuLrQsHRFsPUwdInn1gmjpkEofGrhUKMq3OAlSIIb8QpRn32SRGdMy3nQB2RaUWkCZQXZylHU8Vgg9BjgoXOZG74QsZGR7Ns70WO+OTRpg65WqvGSKJjMioxadYZKhkvt45tV4YLFIminssPyFza4IzpdHOiIXrozZHWfHaQR1tpkrITIRBtrn80KAMjEzL/0FBdaRrzhphIuv+Tpeb7UzsyrkNLYFxj+Qz5IuMc5fQr5tygVoSnMhZZGgjU0AjaWLP42ryzEhJ59XzVgW6ke++7U/BIXN0pkdJ1ChIwuIyzxTEy5oPDxjdyBPhdti+tfBGW79+0PG/iCPoJIPhQr/QZb72bgMTnk+riokx5W28tbfPi+ardZ/Z4Wmf20AkDYYmFUDgzp6yl5JEwN4SsmCgMVWtk8fY2d1oqMdrD/TJhZcbsGUbdU/4yFCMQ0PZ1ir/8IMGIf5foFEgJd5SBXTz8XXQWoM4diI2KqmzPJz/WQznL8/WwRJsLe2ujvAIaZNUIzsGBL0daPx3etFTaHFtHjh4ieJt+1tuygjWOM7xKvOuUppxRFXsZ5vfih7lovnz+jZ/gC2axuesFBVKyjyuKNaxS/Dk13u+HdTUMxi/4qLgqpuyYqIwFg6/tWYNV/Vw2OHu3H2fhH9bwQ4kVpAm9gNE49pl8+/qD7UTQjYgBcflsyPVTXYI/NBXSTLrKhCJ9MGKEk1X7e3TvP0+cZeg+P1ZgIwXpwTqTWULDKT+JcogxMlf3YxyL6Q7hIw3OQt3dFgYFq3Oz2uZQK7bZvRQW7QmASAqrQYSXIloOr5BoxYea0CMVhG6w4GkqQF7EOAMqB7sCqeSR407fi5ED95m2o+JbqcuYXru6o3wIr4OcWfNtJ4wo/eqffKc4XAkUdyfgJgiiWaIQlqYv84oz88WdKL3DP8PuhBCOKBQIi7y00wTQ79Ms+ejej0kf63B56l8jS9FYmEMA==";
    
    var submitPass = document.getElementById('submitPass');
    var passEl = document.getElementById('pass');
    var invalidPassEl = document.getElementById('invalidPass');
    var trycatcherror = document.getElementById('trycatcherror');
    var successEl = document.getElementById('success');
    var contentFrame = document.getElementById('contentFrame');
    
    // Sanity checks

    if (pl === "") {
        submitPass.disabled = true;
        passEl.disabled = true;
        alert("This page is meant to be used with the encryption tool. It doesn't work standalone.");
        return;
    }

    if (!isSecureContext) {
        document.querySelector("#passArea").style.display = "none";
        document.querySelector("#securecontext").style.display = "block";
        return;
    }

    if (!crypto.subtle) {
        document.querySelector("#passArea").style.display = "none";
        document.querySelector("#nocrypto").style.display = "block";
        return;
    }
    
    function str2ab(str) {
        var ustr = atob(str);
        var buf = new ArrayBuffer(ustr.length);
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=ustr.length; i < strLen; i++) {
            bufView[i] = ustr.charCodeAt(i);
        }
        return bufView;
    }

    async function deriveKey(salt, password) {
        const encoder = new TextEncoder()
        const baseKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveKey'],
        )
        return await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            true,
            ['decrypt'],
        )
    }
    
    async function doSubmit(evt) {
        submitPass.disabled = true;
        passEl.disabled = true;

        let iv, ciphertext, key;
        
        try {
            var unencodedPl = str2ab(pl);

            const salt = unencodedPl.slice(0, 32)
            iv = unencodedPl.slice(32, 32 + 16)
            ciphertext = unencodedPl.slice(32 + 16)

            key = await deriveKey(salt, passEl.value);
        } catch (e) {
            trycatcherror.style.display = "inline";
            console.error(e);
            return;
        }

        try {
            const decryptedArray = new Uint8Array(
                await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
            );

            let decrypted = new TextDecoder().decode(decryptedArray);

            if (decrypted === "") throw "No data returned";

            const basestr = '<base href="." target="_top">';
            const anchorfixstr = `
                <script>
                    Array.from(document.links).forEach((anchor) => {
                        const href = anchor.getAttribute("href");
                        if (href.startsWith("#")) {
                            anchor.addEventListener("click", function(e) {
                                e.preventDefault();
                                const targetId = this.getAttribute("href").substring(1);
                                const targetEl = document.getElementById(targetId);
                                targetEl.scrollIntoView();
                            });
                        }
                    });
                <\/script>
            `;
            
            // Set default iframe link targets to _top so all links break out of the iframe
            if (decrypted.includes("<head>")) decrypted = decrypted.replace("<head>", "<head>" + basestr);
            else if (decrypted.includes("<!DOCTYPE html>")) decrypted = decrypted.replace("<!DOCTYPE html>", "<!DOCTYPE html>" + basestr);
            else decrypted = basestr + decrypted;

            // Fix fragment links
            if (decrypted.includes("</body>")) decrypted = decrypted.replace("</body>", anchorfixstr + '</body>');
            else if (decrypted.includes("</html>")) decrypted = decrypted.replace("</html>", anchorfixstr + '</html>');
            else decrypted = decrypted + anchorfixstr;
            
            contentFrame.srcdoc = decrypted;
            
            successEl.style.display = "inline";
            setTimeout(function() {
                dialogWrap.style.display = "none";
            }, 1000);
        } catch (e) {
            invalidPassEl.style.display = "inline";
            passEl.value = "";
            submitPass.disabled = false;
            passEl.disabled = false;
            console.error(e);
            return;
        }
    }
    
    submitPass.onclick = doSubmit;
    passEl.onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        invalidPassEl.style.display = "none";
        if (keyCode == '13'){
          // Enter pressed
          doSubmit();
          return false;
        }
    }
})();

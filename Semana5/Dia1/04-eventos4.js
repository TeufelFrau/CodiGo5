window.onload = function(){
    var input  = document.getElementById("inputNombre");
    var cuadrado  = document.getElementById("cuadrado");
    var pais = document.getElementById("pais");
    var departamento = document.getElementById("departamento");
    var link = document.getElementById("google");
    var contadorDeClicks = 0;

    // onfocus
    // Evento que se ejecuta cuando el cursor esta localizado
    // en el elemento
    input.onfocus = function(){
        // console.log("cursor en elemento");
        this.style.border = "0px";
        this.style.borderBottom = "1px solid red";
    }
    // onblur
    // Evento que se ejeuta cuando el cursor sale del elemento
    input.onblur = function(){
        // console.log("cursor fuera del elemento");
        this.style.border = "1px solid #888";
    }
    // keydown
    // Evento que se ejecuta cuando una tecla ha sido presionada sobre un elemento

    // keyup
    // Evento que se ejecuta cuando una tecla deja de presionar un elemento
    input.onkeyup = function(e){
        console.log("Una tecla ha sido presionada");
        console.log("Tecla presionada => " + e.key);
        console.log("Codigo de Tecla => " + e.keyCode);
        console.log("Codigo transformado => " + String.fromCharCode(e.keyCode))
        console.log(this.value);
    }
    // keypress
    // Evento que se ejcuta cuando una tecla es presionada sobre un elemento
    // input.onkeypress = function(e){
    //     console.log("Una tecla ha sido presionada");
    //     console.log(e.key);
    //     console.log(this.value);
    // }

    // dblclick
    // Evento que se ejecuta cuando se hace doble click sobre un elemento
    cuadrado.ondblclick = function(){
        this.style.borderRadius = "50%";
    }
    // onchange
    // Evento que se ejecuta cuando el valor de un elemento cambia
    var peru = ["Puno","Arequipa","Lima"];
    var brasil = ["Rio de Janeiro","Sao Paulo","Porto Alegre"];
    var venezuela = ["Caracas","Maracaibo"];
    pais.onchange = function(){
        // debugger;
        departamento.innerHTML = "<option value='0' selected>Selecione...</option>";
        departamento.removeAttribute("disabled");

        if(this.value != 0){
            switch(this.value){
                case 'p':
                    for(var i = 0; i < peru.length; i++){
                        var option = document.createElement("option");
                        option.innerHTML = `${peru[i]}`;
                        option.setAttribute('value',peru[i].charAt(0));
                        departamento.appendChild(option);
                    }
                    break;
                case 'b':
                    for(var i = 0; i < brasil.length; i++){
                        var option = document.createElement("option");
                        option.innerHTML = `${brasil[i]}`;
                        option.setAttribute('value',peru[i].charAt(0));
                        departamento.appendChild(option);
                    }
                    break;
            }
        }else{
            departamento.setAttribute("disabled","true");
        }
    }

    departamento.onchange = function(){
        // Valor seleccionado
        console.log(this.value);
        // selectedIndex => posicion seleccionada del arreglo de options
        console.log(this.selectedIndex);
        // options => devuelve un arreglo de los options internos
        console.log(this.options);
        // obtener el texto del option seleccionado
        console.log(this.options[this.selectedIndex].innerHTML);
        input.setAttribute("value",this.options[this.selectedIndex].innerHTML);
    }

    link.onclick = function(e){
        // preventDefault => Cancela el comportamiento
        // por defecto que tiene un elemento
        // e.preventDefault();
        contadorDeClicks++;
        if(contadorDeClicks>1){
            e.preventDefault();
        }
    }
}
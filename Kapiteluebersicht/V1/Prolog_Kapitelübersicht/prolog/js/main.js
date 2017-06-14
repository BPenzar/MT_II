
AFRAME.registerComponent('play-next-sound', {
    schema: {type: 'selector'},

    init: function () {
        var targetEl = this.data;  // Specified via schema.
        var soundEl = this.el;

        soundEl.addEventListener('sound-ended', function () {
            if(targetEl) targetEl.components.sound.playSound();
        });
    }
});


AFRAME.registerComponent('pause-sound', {
    schema: {type: 'int', default:5},

    init: function () {
        var entity = document.querySelector('[sound]');
        this.el.components.sound.stopSound();
        // setTimeout(entity.components.sound.playSound(), this.data);
    }
});


AFRAME.registerComponent('wall-animate', {
    schema: {
        aevent: {default: 'wallblink'}
    },

    init: function () {
        var data = this.data;
        var element = this.el;
        var children = element.childNodes;
        newclasshitbox = document.getElementsByClassName("hitbox");
        newclasswall = document.getElementsByClassName("wall");

        // Schickt Event an Alle Wände und Hitboxen bei Sound-Ended
        this.el.addEventListener('sound-ended', function () {
            for (var j=0; j<4; j++) {
                if (newclasshitbox[j]) newclasshitbox[j].emit(data.aevent);
            }

            for (var i=0; i<16; i++) {
                if (newclasswall[i]) newclasswall[i].emit(data.aevent);
            }
        });

        // Schickt Event an Alle Wände und Hitboxen bei AnimationEnd mit klasse "trigger"
        this.el.addEventListener('animationend', function (e) {
            var sender = e.target;
            var senderclass = sender.getAttribute("class");

            for (var j=0; j<4; j++) {
                //Nur bei Animation mit Klasse "trigger" abspielen
                if (newclasshitbox[j] && senderclass == "trigger") newclasshitbox[j].emit(data.aevent);
            }
            for (var i=0; i<16; i++) {
                if (newclasswall[i] && senderclass == "trigger") newclasswall[i].emit(data.aevent);
            }
        });
    }
});



AFRAME.registerComponent('event-animate', {
    schema: {
        // 8 Target's BY ID möglich
        target: {type: 'selector'},
        target2: {type: 'selector'},
        target3: {type: 'selector'},
        target4: {type: 'selector'},
        target5: {type: 'selector'},
        target6: {type: 'selector'},
        target7: {type: 'selector'},
        target8: {type: 'selector'},
        // Eventname
        aevent: {default: 'animation1'},
        // Welche Aktion soll zu event führen? Standard click
        triggeraction: {default: 'click' }

        // Klasse der Hitboxen angeben -- auskommentiert weil festgelegt
        /*classhitbox: { parse:function(value3){
         return document.getElementsByClassName(value3);
         } },*/
    },

    init: function() {
        var data= this.data;
        var element = this.el;
        newclasshitbox = document.getElementsByClassName("hitbox");

        this.el.addEventListener(data.triggeraction, function () {

            // Klasse der hitbox ändern, wenn sie geklickt wurde
            if (element.getAttribute("class") == "hitbox") {
                //Hitboxen klein machen
                for (var j=0; j<4; j++) {
                    if (newclasshitbox[j]) newclasshitbox[j].emit("hitboxsmall");
                }
                element.setAttribute("class", "usedhitbox");
                //Klasse der Wände ändern, damit sie nicht mehr blinken
                var w1 = element.nextElementSibling;
                var w2 = w1.nextElementSibling;
                var w3 = w2.nextElementSibling;
                var w4 = w3.nextElementSibling;
                // consol.log(w1);                  ==> KONSOLEN LOG    => HIER "WAS IST W1?"
                w1.setAttribute("class", "usedwall");
                w2.setAttribute("class", "usedwall");
                w3.setAttribute("class", "usedwall");
                w4.setAttribute("class", "usedwall");

            }

            //Falls es nicht an eine hitbox geheftet wird, passiert nur das
            //8 mögliche Targets by ID, Event wird nur geschickt wenn Target auch existiert
            if (data.target) data.target.emit(data.aevent);
            if (data.target2) data.target2.emit(data.aevent);
            if (data.target3) data.target3.emit(data.aevent);
            if (data.target4) data.target4.emit(data.aevent);
            if (data.target5) data.target5.emit(data.aevent);
            if (data.target6) data.target6.emit(data.aevent);
            if (data.target7) data.target7.emit(data.aevent);
            if (data.target8) data.target8.emit(data.aevent);

            data.target.setAttribute("used","true");
        });
    }
});







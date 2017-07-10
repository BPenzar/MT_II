
var control = 0;

AFRAME.registerComponent('play-next-sound', {
    schema: {
        target1:{type: 'selector'},
        aevent:{default:'skip'}
},

    init: function ()
    {
        var targetEl = this.data.target1;// Specified via schema.
        var soundEl = this.el;
        var event = this.data.aevent;


            if(targetEl!=" ")
            {
                soundEl.addEventListener('sound-ended', function () {
                    if(targetEl) targetEl.components.sound.playSound();
                });
            }


            soundEl.addEventListener(event, function ()
            {
                if(soundEl && soundEl.components.sound.isPlaying==true)
                {
                    targetEl=" ";
                    soundEl.components.sound.stopSound();
                }
            });
    },

    remove: function ()
    {
        var targetEl = this.data.target1;// Specified via schema.
        var event = this.data.aevent;
        var soundEl = this.el;

        if(event)
        {
            soundEl.removeEventListener('sound-ended',function () {
                if(targetEl) targetEl.components.sound.playSound();
            });
        }
    }

});

/*
AFRAME.registerComponent('stop-sound', {
    schema: {
        aevent:{default:'skip'}
        },

    init: function () {
        var data =this.data;
        var soundEl = this.el;

        soundEl.addEventListener(data.aevent, function () {
            if(soundEl && soundEl.components.sound.isPlaying) soundEl.components.sound.stopSound();
            if(soundEl && soundEl.components.sound.isPlaying) soundEl.setAttribute('play-next-sound','');
        });

    }
});*/


AFRAME.registerComponent('wall-animate', {
    schema: {
        aevent: {default: 'wallblink'},
    },

    init: function () {
        var data = this.data;
        var element = this.el;
        var idWallShenTe=['shen_w1','shen_w2','shen_w3','shen_w4'];


        var children = element.childNodes;
        newclasshitbox = document.getElementsByClassName("hitbox");
        newclasswall = document.getElementsByClassName("wall");



        // Schickt Event an Alle Wände und Hitboxen bei Sound-Ended

        this.el.addEventListener('sound-ended', function () {

            if(control == 30)
            {
                for(var i=0;i<4;i++)
                {
                    var wall = document.getElementById(idWallShenTe[i]);
                    wall.setAttribute('class','wall');
                }
            }

            for (var j=0; j<4; j++) {
                if (newclasshitbox[j]) newclasshitbox[j].emit(data.aevent);
            }

            for (var i=0; i<16; i++) {
                if (newclasswall[i]) newclasswall[i].emit(data.aevent);
            }
            control++;
        });

        // Schickt Event an Alle Wände und Hitboxen bei AnimationEnd mit klasse "trigger"
        this.el.addEventListener('animationend', function (e) {

            if(control==30)
            {
                for(var i=0;i<4;i++)
                {
                    var wall = document.getElementById(idWallShenTe[i]);
                    wall.setAttribute('class','wall');
                }
            }

            var sender = e.target;
            var senderclass = sender.getAttribute("class");

            for (var j=0; j<4; j++) {
                //Nur bei Animation mit Klasse "trigger" abspielen
                if (newclasshitbox[j] && senderclass == "trigger") newclasshitbox[j].emit(data.aevent);
            }
            for (var i=0; i<16; i++) {
                if (newclasswall[i] && senderclass == "trigger") newclasswall[i].emit(data.aevent);
            }
            control++;
        });

    }
});



AFRAME.registerComponent('event-animate', {
    schema: {
        // 8 Target's BY ID möglich
        target1: {type: 'selector'},
        target2: {type: 'selector'},
        target3: {type: 'selector'},
        target4: {type: 'selector'},
        target5: {type: 'selector'},
        target6: {type: 'selector'},
        target7: {type: 'selector'},
        target8: {type: 'selector'},
        target9: {type: 'selector'},
        target10: {type: 'selector'},
        target11: {type: 'selector'},
        target12: {type: 'selector'},
        target13: {type: 'selector'},
        target14: {type: 'selector'},
        target15: {type: 'selector'},
        target16: {type: 'selector'},
        target17: {type: 'selector'},
        target18: {type: 'selector'},
        // Eventname
        aevent: {default: 'animation1'},
        // Welche Aktion soll zu event führen? Standard click
        triggeraction: {default: 'click' }


        // Klasse der Hitboxen angeben -- auskommentiert weil festgelegt
        /*classhitbox: { parse:function(value3){
         return document.getElementsByClassName(value3);
         } },*/
    },

    init: function()
    {
        // ADDEVENTLISTENER
        var data= this.data;
        var element = this.el;
        var button = element.getAttribute("id");

        var soundsIntro = ['nar1','nar2','nar3','nar4','nar5','nar6','nar7','nar8','nar9','nar10','nar11','nar12'];
        var soundsHaeuser = ['nar1_4_1','nar1_4_2','pause_Fo_1','pause_Fo_2','pause_Fo_3','nar1_5_1','nar1_5_2',
            'nar1_5_3','nar1_5_4','nar1_5_5','nar1_5_6','nar1_5_7','pause_Su_1','pause_Su_2',
            'pause_Su_3','pause_Su_4','pause_Su_5','pause_Su_6','pause_Su_7','pause_Su_8',
            'nar1_6_0','nar1_6_1','nar1_6_2','nar1_6_3','pause_Ts_1','pause_Ts_2','pause_Ts_3',
            'pause_Ts_4','pause_Ts_5','pause_Ts_6','pause_Ts_7','pause_Ts_8','pause_Ts_9',
            'pause_Ts_10','pause_Ts_11','pause_Ts_1-2','pause_Ts_2-2','pause_Ts_3-2','pause_Ts_4-2','pause_Ts_5-2',
            'pause_Ts_6-2','pause_Ts_7-2','pause_Ts_8-2','pause_Ts_9-2','pause_Ts_10-2',
            'pause_Ts_11-2','nar1_7_1','nar1_7_2','nar1_7_3','nar1_7_4'];
        var soundsShenTe = ['nar1_8_1','nar1_8_2','nar1_8_3','nar1_8_4','nar1_8_5','nar1_8_6','nar1_8_7','nar1_8_8',
            'nar1_8_9','nar1_8_10','nar1_8_11','nar1_8_12','nar1_9_1','nar1_9_2','nar1_9_3','nar1_9_4','nar1_9_5',
            'nar1_9_6','nar1_9_7','nar1_9_8','nar1_9_9','nar1_9_10','nar1_9_11','nar1_9_12','nar1_10_1','nar1_10_2','nar1_10_3','nar1_10_4','nar1_10_5','nar1_10_6',
            'nar1_10_7','nar1_10_8','nar1_10_9','nar1_10_10','nar1_10_11','nar1_10_12','nar1_10_13','nar1_10_14','nar1_10_15','nar1_10_16','nar1_10_17','nar1_10_18','nar1_10_19',
            'pause_st-1-1','pause_st-1-2','pause_st-1-3','pause_st-1-4','pause_st-1-5','pause_st-1-6'];

        var idHaeuser=['tab_w1','tab_w2','tab_w3','tab_w4','tsh_w1','tsh_w2','tsh_w3','tsh_w4','su_w1','su_w2','su_w3','su_w4','fo_w1','fo_w2','fo_w3','fo_w4'];


        newclasshitbox = document.getElementsByClassName("hitbox");


            this.el.addEventListener(data.triggeraction, function ()
            {

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


                if (data.aevent == "skip")
                {
                    for(var i=0;i<soundsIntro.length;i++)
                    {
                        var sound = document.getElementById(soundsIntro[i]);
                            sound.emit("skip");
                    }
                }

                if (data.aevent == "skip2")
                {
                    for(var i=0;i<soundsHaeuser.length;i++)
                    {
                        var sound = document.getElementById(soundsHaeuser[i]);
                        sound.emit("skip");

                    }

                    for (var i=0; i<16; i++)
                    {
                        var haus = document.getElementById(idHaeuser[i]);
                        if(haus)haus.emit("skip");
                    }

                }

                if (data.aevent == "skip3")
                {
                    for(var i=0;i<soundsShenTe.length;i++)
                    {
                        var sound = document.getElementById(soundsShenTe[i]);
                        sound.emit("skip");
                    }
                }

                //Falls es nicht an eine hitbox geheftet wird, passiert nur das
                //8 mögliche Targets by ID, Event wird nur geschickt wenn Target auch existiert
                if (data.target1) data.target1.emit(data.aevent);
                if (data.target2) data.target2.emit(data.aevent);
                if (data.target3) data.target3.emit(data.aevent);
                if (data.target4) data.target4.emit(data.aevent);
                if (data.target5) data.target5.emit(data.aevent);
                if (data.target6) data.target6.emit(data.aevent);
                if (data.target7) data.target7.emit(data.aevent);
                if (data.target8) data.target8.emit(data.aevent);
                if (data.target9) data.target9.emit(data.aevent);
                if (data.target10) data.target10.emit(data.aevent);
                if (data.target11) data.target11.emit(data.aevent);
                if (data.target12) data.target12.emit(data.aevent);
                if (data.target13) data.target13.emit(data.aevent);
                if (data.target14) data.target14.emit(data.aevent);
                if (data.target15) data.target15.emit(data.aevent);
                if (data.target16) data.target16.emit(data.aevent);
                if (data.target17) data.target17.emit(data.aevent);
                if (data.target18) data.target18.emit(data.aevent);

            });
        }
});

//Skip - Button
//Idee : Wenn dreimal geklickt dann
// 1. skip to dialog soundso
// 2. kamera position soundso
// 3. Wasserträger posititon soundso
// 4. Götter Position so und so
// 5. Trigger für wall animate


//var entitySound = document.querySelector('[sound]');
//entitySound.components.sound.stopSound();


//Alternative : event-animate





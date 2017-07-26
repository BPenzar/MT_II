//Global Counter um Kisten ID's hochzuzählen
var kistencounter = 0;
var anzahlKisten = 0;
var punktezustand = false;


AFRAME.registerComponent('kistenspawn', {

    schema: {
    },

    init: function () {
        //Kisten spawnen und mit fortlaufender Nummer versehen
        setInterval( function () {
            // Kiste erstellen und Eigenschaften von Hauptkiste kopieren
            var name = 'kiste' + kistencounter,
                productionLine = document.querySelector('#fließband3'),
                box = document.createElement('a-entity'),
                /*farbe = function() {
                    var number = Math.floor(Math.random() * 3) + 1;
                    switch(number) {
                        case 1:
                            return '#000066';
                        case 2:
                            return '#006600';
                        case 3:
                            return '#ff0000';
                    }
                },*/
                count = 0,
                // Alle Attribute festlegen
                attributes = {
                    'id': name,
                    'class': 'kiste',
                    'geometry': {
                        primitive: 'plane',
                        height: 0.8,
                        width: 1.2
                    },
                    'position': '1 1.7 0.9',
                    //'scale': '0.01 0.01 0.01',
                    'rotation': '0 90 0',
                    'collada-model': '#Kiste',
                    'kistenabstand': '',
                    'kistenclick': '',
                    'material': {
                        side: 'double'
                        //color: '',
                    }
                },
                assetPosition = [
                    "0.19 0.02 0.31",
                    "0.19 0.02 -0.31",
                    "-0.19 0.02 0.31",
                    "-0.19 0.02 -0.31"

                ],
                assets = {
                    'class': 'asset',
                    'rotation': '-90 90 0',
                    'assetclick': '',
                    'geometry': {
                        primitive: 'box',
                        height: 0.35,
                        depth: 0.07,
                        width: 0.55
                    },
                    'position': assetPosition[0],
                    'material': {
                        side: 'double',
                        color: '#6d9292'
                    }
                },

                animationattributes = {
                    'attribute': 'position',
                    'from': '1 1.7 0.9',
                    'to': '8 1.7 0.9',
                    'dur': '12000',
                    'begin': ''
                },
                vanishanimation = {
                    'attribute': 'position',
                    'from': '8 1.7 0.9',
                    'to': '13 1.7 0.9',
                    'dur': '7500',
                    'begin': 'crateVanish',
                    'delay': '1800'
                };

            // Alle Attribute anfügen und Elemente der Szene hinzufügen

            for (var property in attributes) {
                box.setAttribute(property, attributes[property]);
            }
            if (box.getAttribute('id') == 'kiste0') {
                box.removeAttribute('kistenabstand');
            }
            productionLine.appendChild(box);
            kistencounter++;
            var newBox = document.querySelector('#' + name);

            var newAnimation = document.createElement('a-animation');

            for (var animationProperty in animationattributes) {
                newAnimation.setAttribute(animationProperty, animationattributes[animationProperty]);
            }
            if (newBox.getAttribute('id') == 'kiste0') {
                newAnimation.removeAttribute('begin');
            }

            newBox.appendChild(newAnimation);

            // Animation fürs wegfahren, wenn Kiste fertig ist
            var vanishAnimation = document.createElement('a-animation');
            for (var vanishAttributes in vanishanimation) {
                vanishAnimation.setAttribute(vanishAttributes, vanishanimation[vanishAttributes]);
            }
            newBox.appendChild(vanishAnimation);

            // Ein Asset Random auswählen

            var glowNumber = Math.floor(Math.random() * 3);

            //4 Hitboxen einfügen

            for (var k = 0; k<4; k++) {

                var newAsset = document.createElement('a-entity');

                for (var assetProperty in assets) {
                    newAsset.setAttribute(assetProperty, assets[assetProperty]);
                }
                newAsset.setAttribute('position', assetPosition[count]);
                if (glowNumber == k) newAsset.setAttribute('class', 'asset glow');
                newBox.appendChild(newAsset);
                count++;
            }
        },10000);
    }
});


AFRAME.registerComponent('kistenabstand', {
    schema: {
        prename: { type: 'string' },
        thisname: { type: 'string' },
        prebox: {type: 'selector'},
        thisbox: { type: 'selector' },
        status: {type: 'boolean', default: true},
        distance: {type: 'number'}
    },


    init: function () {
        var data = this.data,
            el = this.el;
        data.prename = 'kiste' + (kistencounter - 2);
        data.prebox = document.querySelector('#' + data.prename);
        data.thisname = 'kiste' + (kistencounter - 1);
        data.thisbox = document.querySelector('#' + data.thisname);


        this.el.addEventListener('anhalten', function() {
            var thisPosition = el.getAttribute('position').x;
            el.firstChild.setAttribute('begin', 'animationGo');
            el.firstChild.setAttribute('from', thisPosition + ' 1.7 0.9');
            el.firstChild.setAttribute('dur', (15 - thisPosition) * 1000);
        });

            },

    tick: function () {
            this.data.distance = this.data.prebox.getAttribute('position').x - this.data.thisbox.getAttribute('position').x;
            if (this.data.distance < 1.5 && this.data.status == true) {
                this.el.emit('anhalten');
                this.data.status = false;
            }
            else if (this.data.distance > 1.5 && this.data.status == false) {
                this.el.emit('animationGo');
                this.data.status = true;
            }
     }
});

AFRAME.registerComponent('kistenclick', {

    init: function() {
        var el = this.el,
        assets = el.childNodes,
        i = 0;

        // Asset leuchten lassen
        this.el.addEventListener('animationend', function() {
            if(el.getAttribute('position').x == 8) {
                //document.querySelector('#glow').emit('glowStart');
                for (i = 0; i<=assets.length; i++) {
                    if (assets[i]) assets[i].emit('glowStart');
                }
            }
            //Kiste zerstören, wenn sie weggefahren ist
            else if (el.getAttribute('position').x == 13) {
                el.parentNode.removeChild(el);
                if(punktezustand == true) {
                    anzahlKisten++;
                    punktezustand = false;
                }
                if(anzahlKisten == 2) document.querySelector('#textClick').emit('startGlow');
            }
        });
    }
});

AFRAME.registerComponent('assetclick', {

    init: function() {
        var el = this.el,
            stempel = document.querySelector('#stempel'),
            stempelAnimation = document.querySelector('#stempelAnimation'),
            stempelAnimationDown = document.querySelector('#stempelAnimationDown'),
            stempelAnimationUp = document.querySelector('#stempelAnimationUp');


        //Stempelanimation updaten
        this.el.addEventListener('click', function () {
            var thisWorldPosition = el.object3D.getWorldPosition(),
                thisXPosition = thisWorldPosition[Object.keys(thisWorldPosition)[0]],
                thisZPosition = thisWorldPosition[Object.keys(thisWorldPosition)[2]];

            if(el.parentNode.getAttribute('position').x == 8) {
                stempelAnimation.setAttribute('from', stempel.getAttribute('position').x + ' ' + stempel.getAttribute('position').y + ' ' + stempel.getAttribute('position').z);
                console.log(stempel.getAttribute('position').x + ' ' + stempel.getAttribute('position').y + ' ' + stempel.getAttribute('position').z);
                stempelAnimation.setAttribute('to', thisXPosition + ' 5.8 ' + thisZPosition);
                stempelAnimationDown.setAttribute('from', thisXPosition + ' 5.8 ' + thisZPosition);
                stempelAnimationDown.setAttribute('to', thisXPosition + ' 4.2 ' + thisZPosition);
                stempelAnimationUp.setAttribute('from', thisXPosition + ' 4.2 ' + thisZPosition);
                stempelAnimationUp.setAttribute('to', thisXPosition + ' 5.8 ' + thisZPosition);
                stempelAnimation.emit('stempelStart');
                stempelAnimationDown.emit('stempelStartDown');
                stempelAnimationDown.emit('stempelStartUp');
                el.parentEl.emit('crateVanish');

                if (el.getAttribute('class') == 'asset glow') {
                    punktezustand = true;
                }
            }

        });
        //Falls es das richtige asset ist, leuchtanimation hinzufügen
        if (el.getAttribute('class') == 'asset glow') {
            var glowAnimation = document.createElement('a-animation'),
                animationattributes = {
                'id': 'glow',
                'attribute': 'material.color',
                'from': '#6d9292',
                'to': '#33cccc',
                'dur': '800',
                'begin': 'glowStart',
                'end': 'glowStop',
                'direction': 'alternate',
                'repeat': 'indefinite'
            };
            for (var animationProperty in animationattributes) {
                glowAnimation.setAttribute(animationProperty, animationattributes[animationProperty]);
            }
            el.appendChild(glowAnimation);
        }

    }
});


AFRAME.registerComponent('texthandler', {

    init: function () {
        var el = this.el;
        var kamera = document.querySelector('#camera'),
            glowyAnimation = document.createElement('a-animation');
            animationattributes = {
                'attribute': 'material.color',
                'from': 'black',
                'begin': 'startGlow',
                'to': '#d14d14',
                'dur': '800',
                'direction': 'alternate',
                'repeat': 'indefinite'
            };

        for (var animProperty in animationattributes) {
            glowyAnimation.setAttribute(animProperty, animationattributes[animProperty]);
        }
        el.appendChild(glowyAnimation);

        el.addEventListener('click', function () {
            if(anzahlKisten == 2) {
                kamera.setAttribute('position', '3.5 6 72' );
            }
        });

    }
});



//Global Counter um Kisten ID's hochzuzählen
var kistencounter = 0;
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
                farbe = function() {
                    var number = Math.floor(Math.random() * 3) + 1;
                    switch(number) {
                        case 1:
                            return '#000066';
                        case 2:
                            return '#006600';
                        case 3:
                            return '#ff0000';
                    }
                },
                count = 0,
                attributes = {
                    'id': name,
                    'class': 'kiste',
                    'geometry': {
                        primitive: 'plane',
                        height: 0.8,
                        width: 1.2
                    },
                    'position': '1 1.7 0.9',
                    'rotation': '-90 0 0',
                    'kistenabstand': '',
                    //'kistenclick': '',
                    'material': {
                        side: 'double',
                        color: farbe()
                    }
                },
                assetPosition = [
                    "0.3 -0.22 0.05",
                    "0.3 0.22 0.05",
                    "-0.3 -0.22 0.05",
                    "-0.3 0.22 0.05"

                ],
                assets = {
                    'class': 'asset',
                    'geometry': {
                        primitive: 'box',
                        height: 0.35,
                        depth: 0.07,
                        width: 0.55
                    },
                    'position': assetPosition[0],
                    'material': {
                        side: 'double',
                        color: ''
                    },
                    'assets': ''
                },


                animationattributes = {
                    'attribute': 'position',
                    'from': '1 1.7 0.9',
                    'to': '8 1.7 0.9',
                    'dur': '12000',
                    'begin': ''
                };

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

            //4 Hitboxen einfügen
            for (var k = 0; k<4; k++) {

                var newAsset = document.createElement('a-entity');

                for (var assetProperty in assets) {
                    newAsset.setAttribute(assetProperty, assets[assetProperty]);
                }
                newAsset.setAttribute('position', assetPosition[count]);
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
        var el = this.el;
        //var zustand = true;


        el.addEventListener('click', function () {
            var neueAnimation = document.createElement('a-animation');
            neueAnimation.setAttribute('attribute', 'position');
            neueAnimation.setAttribute('from', '8 1.7 0.9');
            neueAnimation.setAttribute('to', '12 1.7 0.9');
            neueAnimation.setAttribute('dur', '8000');
            el.appendChild(neueAnimation);
        });
    }
});

AFRAME.registerComponent('assets', {

    init: function() {
        var el = this.el,
            Animation_1 = document.createElement('a-animation');
            Animation_2 = document.createElement('a-animation');
            stempel = document.querySelector('#stempel');

        el.addEventListener('click', function () {
            var thisWorldPosition = el.object3D.getWorldPosition(),
                thisXPosition = thisWorldPosition[Object.keys(thisWorldPosition)[0]],
                thisYPosition = thisWorldPosition[Object.keys(thisWorldPosition)[1]],
                thisZPosition = thisWorldPosition[Object.keys(thisWorldPosition)[2]];


            Animation_1.setAttribute('attribute', 'position');
            Animation_1.setAttribute('from', stempel.getAttribute('position').x + ' ' + stempel.getAttribute('position').y + ' ' + stempel.getAttribute('position').z );
            Animation_1.setAttribute('to', thisXPosition +  ' 5.8 ' +  thisZPosition);
            Animation_1.setAttribute('dur', '800');
            Animation_1.setAttribute('fill', 'both');
            stempel.appendChild(Animation_1);
            stempel.emit('firstAnimationend')
        });

        /*stempel.addEventListener('firstAnimationend', function() {
            var thisWorldPosition = el.object3D.getWorldPosition(),
                thisXPosition = thisWorldPosition[Object.keys(thisWorldPosition)[0]],
                thisYPosition = thisWorldPosition[Object.keys(thisWorldPosition)[1]],
                thisZPosition = thisWorldPosition[Object.keys(thisWorldPosition)[2]];


            Animation_2.setAttribute('attribute', 'position');
            Animation_2.setAttribute('from', stempel.getAttribute('position').x + ' ' + stempel.getAttribute('position').y + ' ' + stempel.getAttribute('position').z );
            Animation_2.setAttribute('to', thisXPosition + ' ' + thisYPosition + ' ' + thisZPosition);
            Animation_2.setAttribute('dur', '800');
            Animation_2.setAttribute('fill', 'both');
            stempel.appendChild(Animation_2);
        });*/

        /*var followCamera = function() {
            var camera = document.querySelector('#kamera').object3D.children[0];
            vector = camera.getWorldDirection();
            theta = Math.atan2(vector.x, vector.z);
            el.setAttribute('position', vector);
        }*/
    }

});


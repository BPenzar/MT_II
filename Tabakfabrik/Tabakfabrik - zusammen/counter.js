AFRAME.registerComponent('clock-text', {
	schema:{
		score: {type: 'string', default: '0'}
	},
	init: function() {
		var el = this.el;
	},
	update: function () {
		
	}
});

/* 
 *	Register the clock-text-updater (score counter) component.
 *	Starting with a value of 0 it shall be increased, when the player hits the drum
 *	in a specific moment.
 */
AFRAME.registerComponent('clock-text-updater', {
	init: function() {
		var el = this.el;
		var clock = document.querySelector('#clock');
		var box1 = document.querySelector('#redbox');
		var box2 = document.querySelector('#graybox');
		// TODO: Add event handler for score increasing
		el.addEventListener('click', function() {
			// Check if box is in right place and only if increase the score
			var pos1 = box1.getAttribute('position');
			var pos2 = box2.getAttribute('position');
			var box2width = box2.getAttribute('width');
			var box1width = box1.getAttribute('width');
			console.log("Width: " + box2width);
			console.log("Red: " + pos1.x + "," + pos1.y + "," + pos1.z);
			console.log("Gray: " + pos2.x + "," + pos2.y + "," + pos2.z);
			if( 
				// Score increases when red cube intersects gray cube on x-axis
				pos1.x + (box1width/2) >= pos2.x - (box2width / 2) && 
				pos1.x - (box1width/2) <= pos2.x + (box2width / 2)
			){
				// Fetch old score and increase by one
				var score = clock.getAttribute('clock-text');
				score = score.score;
				score++;
				clock.setAttribute('text', 'value: ' + score);
				clock.setAttribute('clock-text', 'score: ' + score);
			}
		});
	}
});
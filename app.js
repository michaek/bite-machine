var current = 'nothing';
var queued = 0;
var inProgress = false;

function say(message, done) {
	var msg = new SpeechSynthesisUtterance(message);
	inProgress = true;
	msg.onend = function(){
		inProgress = false;
		done && done();
	};
    window.speechSynthesis.speak(msg);
}

function giveMe(implement) {
	return function(){
		say('I will give you a '+implement+'!!');
		current = implement;
	};
}

document.querySelector('.circle').addEventListener('click', giveMe('spoon'));
document.querySelector('.square').addEventListener('click', giveMe('plate'));
document.querySelector('.triangle').addEventListener('click', giveMe('fork'));

document.body.addEventListener('keypress', function(event) {
	var count = parseInt(event.charCode, 10) - 48;
	var verb;
	if (!inProgress) {
		verb = count < 0 ? 'take away' : 'give you';
		say('I will ' + verb + ' ' + Math.abs(count) + ' ' + current + (Math.abs(count) > 1 ? 's' : ''), function(){
			if (queued) {
				verb = queued < 0 ? 'take away' : 'give you';
				say('I will ' + verb + ' ' + Math.abs(queued) + ' ' + current + 's' );
				queued = 0;
			}
		});
	} else {
		queued += count;
	}
});

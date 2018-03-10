var speaking = false;
var voices = [];

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  voices = speechSynthesis.getVoices();
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function say(message, voiceName, done) {
	voiceName = voiceName || 'Alex';
	var msg = new SpeechSynthesisUtterance(message);
	msg.voice = voices.filter(function(voice) { return voice.name === voiceName; })[0];

	speaking = true;
	msg.onend = function(){
		speaking = false;
		done && done();
	};
	window.speechSynthesis.speak(msg);
}

function giveMe(implement, count, voiceName, done) {
	var verb = count < 0 ? 'take away' : 'give you';
	var number = Math.abs(count);
	var plural = number !== 1;
	say('I will ' + verb + ' ' + number + ' ' + current.implement + (plural ? 's' : ''), voiceName, done);
}

var actions = [
	{ implement: 'nothing', voice: 'Alex' },
	{ implement: 'coffee', icon: '\u2615', voice: 'Hysterical', button: '.circle' },
	{ implement: 'knife', icon: String.fromCodePoint(0x1F52A), voice: 'Moira', button: '.square' },
	{ implement: 'spoon', icon: String.fromCodePoint(0x1F944), voice: 'Zarvox', button: '.circle-table' },
	{ implement: 'cyclone', icon: String.fromCodePoint(0x1F300), voice: 'Deranged', button: '.triangle' },
];

var current = actions[0];

actions.forEach(action => {
	var countDisplay;

	action.total = 0;
	action.queued = 0;

	action.giveMe = (count, done) => {
		action.total += count;
		if (countDisplay) {
			countDisplay.innerText = action.total;
		}
		giveMe(action.implement, count, action.voice, () => {
			if (action.queued) {
				action.giveMe(action.queued);
				action.queued = 0;
			}
		});
	}

	if (action.button) {
		var button = document.querySelector(action.button);
		if (action.icon) {
			button.innerHTML = action.icon;
		}
		countDisplay = button.nextSibling;
		button.addEventListener('click', () => {
			current = action;
			action.giveMe(1);
		});
	}
});

document.body.addEventListener('keypress', function(event) {
	var count = parseInt(event.charCode, 10) - 48;
	var verb;
	if (!speaking) {
		current.giveMe(count);
	} else {
		current.queued += count;
	}
});

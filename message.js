let Messages = [
  {type: 1, message: "welcome", delay: 1},
  {type: 2, image: "./images/commerce_convoSample_1.png", delay: 1, fulltime: "<b>Today</b> 4:10 pm"},
  {type: 1, message: "ronaldo", delay: 6},
  {type: 2, image: "./images/commerce_convoSample_2.png", delay: 1, fulltime: "<b>Today</b> 12:34 am"},
  {type: 1, message: "message", delay: 1},
  {type: 2, image: "./images/commerce_convoSample_3.png", delay: 1, fulltime: "<b>Today</b> 5:24 pm"},
  {type: 1, message: "expert", delay: 2},
  {type: 2, image: "./images/commerce_convoSample_4.png", delay: 1, fulltime: "<b>Today</b> 9:15 am"},
];
let Timing = {
  keyboard: 1.5,
  changekeyboard: 0.5,
  key: 0.3,
  send: 0.5,
  msgdelay: 8
};
let typingIndex;
let keyType;
let downKey;
let curKey;

function setMyTimeOut (callback, delay) {
  lastTimeout = setTimeout (callback, delay);
}

function showMessage () {
  setMyTimeOut (startMessage, Messages[curIndex].delay);
}

function startMessage () {
  if (stop) return;
  let msg = Messages[curIndex];
  if (msg.type == 2) {
    setMyTimeOut (onLeftComplete, Messages[curIndex].delay);
  } else {
    openKeyboard ();
  }
}

function onLeftComplete () {
  let msg = Messages[curIndex];
  onLeftMessage (msg);
  $('.header_texts .time').html(Messages[curIndex].fulltime.split(' ')[1]);
  setMyTimeOut(function() {
    $('.left-msg:last-child').addClass('out-dated');
  }, Timing.msgdelay);
  setMyTimeOut (nextMessage, msg.delay);
}

function openKeyboard () {
  onKeyboard ();
  typingIndex = 0;
  setMyTimeOut (typingMessage, Timing.keyboard * 1);
}

function typingMessage () {
  let msg = Messages[curIndex].message;
  if (typingIndex >= msg.length) {
    setMyTimeOut (onSendDown, Timing.send);    
  } else {
    let key = msg[typingIndex];

    keyType = 2;
    if (key >= 'a' && key <= 'z' || key >= 'A' && key <= 'Z')
      keyType = 1;
    if (keyType != keyboardType){
      let key_name = '.special_key.';
      if (keyboardType == 1)
        key_name += '123';
      else
        key_name += 'ABC';
      downKey = $(key_name);
      specialKeyDown ();
    } else {
      curKey = key;
      onKeyDown ();
    }
  }
}

function onSendDown () {
  btnSend.css('opacity', 0.5);
  btnSend.css('transform', 'scale(1.0)');
  btnSend.css('-webkit-transform', 'scale(1.0)');
  setMyTimeOut(onSendUp, Timing.send);
}

function onSendUp () {
  typingInit(false);
  $('#send_msg').text('');
  btnSend.css('opacity', 1);
  btnSend.css('transform', 'scale(1)');
  btnSend.css('-webkit-transform', 'scale(1)');
  setMyTimeOut(onSend, Timing.send);
}

function onSend () {
  onRightMessage(Messages[curIndex]);
  setMyTimeOut(onTypingComplete, Timing.send * 1);
}

function onTypingComplete () {
  onKeyboard ();
  setTimeout (function() {
    $('.inputs').removeClass('typing');
  }, 550);
  setMyTimeOut (onKeyboardDown, Timing.send * 5);
}

function onKeyboardDown () {
  keyboard_set(1);
  setMyTimeOut (nextMessage, Messages[curIndex].delay);
}

function onKeyDown () {
  onKey(curKey);
  setMyTimeOut(onKeyRelease, Timing.key);
}

function onKeyRelease () {
  onKeyUp();
  typingIndex ++;
  setMyTimeOut(typingMessage, Timing.key / 2);
}

function specialKeyDown () {
  downKey.css('opacity', 0.3);
  downKey.css('transform', 'scale(1.0)');
  downKey.css('-webkit-transform', 'scale(1.0)');
  setMyTimeOut (specialKeyUp, Timing.key);
}

function specialKeyUp () {
  downKey.css('opacity', 1);
  downKey.css('transform', 'scale(1)');
  downKey.css('-webkit-transform', 'scale(1)');
  keyboard_set(keyType);
  setMyTimeOut (typingMessage, Timing.key);
}

function nextMessage () {
  curIndex ++;
  if (curIndex >= Messages.length)
    curIndex = 0;
  showMessage ();
}
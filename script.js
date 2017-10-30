let speedStart = 2;
let speedStep = 0.5;
let speedDivider = 1;
let keyboardType;
let curIndex;
let speedMs = 500;
let btnSend;
let stop = false;
let lastTimeout = 0;
$( document ).ready(function() {
  init ();
});

function init () {
  let tHeight = parseFloat($('.messages').css('height'));
  $('.preffix').css('height', tHeight - 20);
  $('form.chat div.messages .upper').html('');
  keyboard_set(1);
  key_side_set();
  for (let i = 0; i < Messages.length; i++) {
    Messages[i].delay = Messages[i].delay * speedMs;
    Messages[i].duration = Messages[i].duration * speedMs;
  }
  $.each(Timing, function(key, val) {
    Timing[key] = val * speedMs;
  });
  curIndex = 0;
  btnSend = $('.sends .send');
  typingInit(false);
  showMessage ();
  $('.test').hide();
  // $('.header').hide();
  // $('.key_side_back').hide();
  // onKeyboard();
  // onLeftMessage();

  $('.header_texts .time').html(getCurDate(2));
}

function reset () {
  clearTimeout (lastTimeout);
  if ($('.keyboard').hasClass('appear')) {
    $('.keyboard').removeClass('appear');
    $('.keyboard').addClass('disappear');
    //$('.keyboard').css('top', '100%');
    $('form.chat div.messages .preffix').css('height', '100%');
    $('form.chat div.messages').css('height', '93.8%');
    speedDivider = 1;
    onKeyUp();
    $('.inputs').removeClass('typing');
  }
  $('.upper').html('');
  $('#send_msg').text('');
  typingInit(false);
  curIndex = 0;
  showMessage();
}

let keyboard_data = {
  1: [" qwertyuiop ", "_ asdfghjkl ", "upper,__ zxcvbnm __,backspace", "-1123,emoji,+3space,+2return  "],
  2: [" 1234567890 ", " -/:;()$&@\" ", "-1#+=,__,dot,comma,quotation,exclamation,apostrophe,__,backspace  ", "-1ABC,emoji,+3space,+2return  "]
};
let signal_keys = {
  dot: '.',
  comma: ',',
  quotation: '?',
  exclamation: '!',
  apostrophe: '\''
};
let side_keys = {
  key_p: 'right',
  key_q: 'left',
  key_0: 'right',
  key_1: 'left',
}

function keyboard_set (type) {
  keyboardType = type;
  let keys = keyboard_data[type];
  for (let i = 1; i <= 4; i++) {
    let kk = keys[i - 1].split(' ');
    let row = $('#keyboard_row_' + i.toString());
    row.html('');
    
    if (kk[0] != "") {
      let special_keys = kk[0].split(',');
      for (let sc = 0; sc < special_keys.length; sc++) {
        if (special_keys[sc][0] == '_') {
          let cls = 'key' + special_keys[sc].split('_').join('_half');
          row.append('<div class="' + cls + '"></div>');
        } else if(signal_keys[special_keys[sc]]) {
          let back_name = special_keys[sc];
          let key_name = signal_keys[special_keys[sc]];
          row.append('<div class="key signal_key key_'
          + back_name
          + '">' + key_name + '</div>');
        } else if (special_keys[sc][0] == '+') {
          let back_name = special_keys[sc].substring(2);
          row.append('<div class="key special_key key_type'
          + special_keys[sc][1] + ' ' + back_name
          + '" style="background-image: url(\'./images/key_' + back_name + '_back.png\')">' + back_name + '</div>');
        } else if (special_keys[sc][0] == '-') {
          let back_name = special_keys[sc].substring(2);
          row.append('<div class="key special_key key_type'
          + special_keys[sc][1] + ' ' + back_name
          + '">' + back_name + '</div>');
        } else {
          row.append('<div class="key special_key" style="background-image: url(\'./images/key_special_' + special_keys[sc] + '.png\')"></div>');
        }
      }
    }

    for (let c = 0; c < kk[1].length; c++) {
      row.append('<div class="key key_' + kk[1][c] + '"><c>' + kk[1][c] + '</c></div>')
    }

    if (kk[2] != "") {
      let special_keys = kk[2].split(',');
      for (let sc = 0; sc < special_keys.length; sc++) {
        if (special_keys[sc][0] == '_') {
          let cls = 'key' + special_keys[sc].split('_').join('_half');
          row.append('<div class="' + cls + '"></div>');
        } else if (special_keys[sc][0] == '+') {
          let back_name = special_keys[sc].substring(2);
          row.append('<div class="key special_key key_type'
          + special_keys[sc][1] + ' ' + back_name
          + '" style="background-image: url(\'./images/key_' + back_name + '_back.png\')">' + back_name + '</div>');
        } else {
          row.append('<div class="key special_key" style="background-image: url(\'./images/key_special_' + special_keys[sc] + '.png\')"></div>');
        }
      }
    }
  }
}

function typingInit (flag) {
  if (flag) {
    $('.place_holder').hide();
    $('.input-text').show();
  } else {
    $('.place_holder').show();
    $('.input-text').hide();
  }
}

function key_side_set() {
  let el = $('.key_side_back');
  let dirs = ['left', 'right', 'middle'];
  for (let i = 0; i < dirs.length; i++) {
    el.append('<div class="' + dirs[i] + '" style="background-image: url(\'./images/key_side_back_' + dirs[i] + '.png\')"></div>');
  }
}

function onKey (key) {
  if (!key) {
    key = $('#key_code').val();
  }
  let key_type = 2;
  if (key >= 'a' && key <= 'z' || key >= 'A' && key <= 'Z')
    key_type = 1;
  if (key_type != keyboardType)
    keyboard_set(key_type);

  let key_el = $('.key_' + key);
  let position = key_el.position();
  let width = $('.key_side_back').width() / 100;
  let left_offset = - 3 * width;
  let child = 'middle';
  if (side_keys['key_' + key]) {
    child = side_keys['key_' + key];
    if (child == 'left') {
      left_offset = 0.5 * width;
    } else {
      left_offset = - 6.3 * width;
    }
  }
  let key_side_el = $('.key_side_back .' + child);
  let offset = key_side_el.height() - key_el.height() * 1.2;
  key_side_el.css('left', position.left + left_offset);
  key_side_el.css('top', position.top - offset);
  key_side_el.show();
  key_side_el.html(key);
  $('#send_msg').text($('#send_msg').text() + key);
}
function onKeyUp () {
  $('.key_side_back .left').hide();
  $('.key_side_back .right').hide();
  $('.key_side_back .middle').hide();
}

function scrollDown (type) {
  let focusBottom = document.getElementById("messages");
  let tHeight = parseFloat($('.messages').css('height'));
  let speed = speedStart;
  if (type) {
    setTimeout(function() {
      $('.header > span').addClass('spinner');
    }, 100);
    setTimeout(function() {
      $('.header > span').removeClass('spinner');
    }, 2000);
  }
  let tId = setInterval(function(){
    var target = focusBottom.scrollHeight - tHeight;
    if (focusBottom.scrollTop >= target - speed) {
      focusBottom.scrollTop = focusBottom.scrollHeight;
      clearInterval(tId);
    } else {
      focusBottom.scrollTop += speed;
      speed += speedStep / speedDivider;
    }
  }, 10);
}

function onLeftMessage (data) {
  let index = data ? data.image : Math.floor(Math.random()*4 + 1);
  $('form.chat div.messages .upper').append('<div class="left-msg"><p>' + (data && data.fulltime ? data.fulltime : getCurDate()) + '</p><img src="' + index + '" ></div>');
  $('form.chat > span').addClass('spinner');
  setTimeout(function() {
    $('form.chat > span').removeClass('spinner');
  }, 500);
  scrollDown();
}

function onRightMessage (data) {
  data = data ? data : {};
  let message = data.message ? data.message : $('#right_message').val();
  $('form.chat div.messages .upper').append('<div class="right-msg"><div><text>' + message + '</text></div><p>' + 'Delivered' + '</p></div>');
  $('form.chat > span').addClass('spinner');
  setTimeout(function() {
    $('form.chat > span').removeClass('spinner');
  }, 500);
  scrollDown(1);
}

function onKeyboard () {
  if (!$('.keyboard').hasClass('appear')) {
    typingInit(true);
    $('.inputs').addClass('typing');
    $('.keyboard').removeClass('disappear');
    $('.keyboard').addClass('appear');
    $('.keyboard').css('top', '67.5%');
    $('form.chat div.messages .preffix').css('height', '100%');
    $('form.chat div.messages').css('height', '60.8%');
    speedDivider = 2;
  } else {
    $('.keyboard').removeClass('appear');
    $('.keyboard').addClass('disappear');
    //$('.keyboard').css('top', '100%');
    $('form.chat div.messages .preffix').css('height', '100%');
    $('form.chat div.messages').css('height', '93.8%');
    speedDivider = 1;
  }
}

function getCurDate (type = 1) {
  let d = new Date();
  if (type == 1) {
    let clock = d.getHours() + ":" + d.getMinutes();// + ":" + d.getSeconds();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let date = (('' + day).length < 2 ? '0' : '') + day + '.' +
      (('' + month).length < 2 ? '0' : '') + month + '.' +
      d.getFullYear() + '&nbsp;&nbsp;';
    let currentDate = '<b>Today </b>' + clock;
    return currentDate;
  } else {
    let currentTime = d.getHours() + ":" + d.getMinutes();
    console.log(currentTime);
    return currentTime;
  }
}

/*function onSend () {
  event.preventDefault();
  var message = $('form.chat input[type="text"]').val();
  if (!$('form.chat input[type="text"]').val()) {
    var d = new Date();
    var clock = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var currentDate =
      (('' + day).length < 2 ? '0' : '') + day + '.' +
      (('' + month).length < 2 ? '0' : '') + month + '.' +
      d.getFullYear() + '&nbsp;&nbsp;' + clock;
    // $('form.chat div.messages .upper').append('<div class="message"><div class="myMessage"><p>' + message + '</p><date>' + currentDate + '</date></div></div>');
    $('form.chat div.messages .upper').append('<img src="./images/commerce_convoSample_1' + '' + '.png" >');
    setTimeout(function() {
      $('form.chat > span').addClass('spinner');
    }, 100);
    setTimeout(function() {
      $('form.chat > span').removeClass('spinner');
    }, 2000);
  }
  $('form.chat input[type="text"]').val('');
  scrollDown();
};*/
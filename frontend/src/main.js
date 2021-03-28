import './main.less';
import $ from 'zepto-webpack';
import ajax from './utils/ajax';
import qstList from './questions.json';
import commentList from './comments.json';
import scienceList from './sciences.json';

let score = 0, processIndex = 0, scienceIndex = 0;

function turnToStart() {
  $('.start-wrap').hide();
  $('.qst-wrap').show();
  renderQuestion();
}

function turnToEnd() {
  setTimeout(function() {
    $('.qst-wrap').hide();
    if (score < 10) {
      $('.card-a .res-wrap.success').css('display', 'flex');
    }
    else {
      $('.card-a .res-wrap.fail').css('display', 'flex');
    }
  }, 500);
}

function turnToNext() {
  const optIndex = $(this).parents('.qst-opt').index();
  const qst = qstList[processIndex];
  const opt = qst.options[optIndex];
  $('.qst-opt button').attr('disabled', 'disabled');
  $(this).addClass('selected');
  // 计分
  if (opt.value) score += opt.value;
  // 判断是否结束
  if (opt.end) return turnToEnd();
  processIndex += opt.pass || qst.pass || 1;
  if (!qstList[processIndex]) return turnToEnd();
  setTimeout(renderQuestion, 500);
}

function renderQuestion() {
  const qst = qstList[processIndex];
  const $item = $(`<div class="qst-item">
    <p class="qst-title">${qst.title}</p>
    <ul class="qst-options"></ul>
  </div>`);
  const $options = $item.find('.qst-options');
  for (let i = 0; i < qst.options.length; i ++) {
    const opt = qst.options[i];
    const $opt = $(`<li class="qst-opt"><button type="button">${opt.label}</button></li>`);
    $options.append($opt);
  }
  $('.qst-wrap').html($item);
  setScienceText();
}

function setScienceText() {
  $('.science').html(scienceList[scienceIndex]);
  scienceIndex = (scienceIndex + 1) % scienceList.length;
}

function submitForm(e) {
  e.preventDefault();
  if (!checkFormValid()) return;
  $('.info-submit').attr('disabled', 'disabled');
  ajax({
    url: '/api/submit',
    method: 'json',
    data: {
      phoneno: $('.info-input[name="phoneno"]').val(),
      address: `${$('.info-input[name="province"]').val()} ${$('.info-input[name="address"]').val()} ${$('.info-input[name="username"]').val()}`
    }
  }).then(res => {
    if (res && res.code === 1000) {
      $('#info_form').hide();
      $('.form-wrap .res-wrap.success').css('display', 'flex');
    }
    else if (res && res.code === 3001) {
      $('#info_form').hide();
      $('.form-wrap .res-wrap.fail .res-text span').text(res.data.limit);
      $('.form-wrap .res-wrap.fail').css('display', 'flex');
    }
    else {
      $('.info-submit').removeAttr('disabled');
      alert(res ? res.message || res : '发生未知错误，请稍后重试');
    }
  }).catch(err => {
    console.error(err);
    $('.info-submit').removeAttr('disabled');
    alert(err ? err.message || err : '发生未知错误，请稍后重试');
  });
}

function checkFormValid() {
  const $inputs = $('.info-input');
  for (let i = 0; i < $inputs.length; i ++) {
    const $input = $inputs.eq(i);
    $input.val($input.val().trim());
    if (!$input.val()) {
      $input.addClass('error');
      return false;
    }
  }
  return true;
}

function checkInput() {
  if ($(this).val()) {
    $(this).removeClass('error');
  }
  else {
    $(this).addClass('error');
  }
}

function startAnimate() {
  const $list = $('.comment-list');
  for (let i = 0; i < commentList.length; i ++) {
    const $item = $(`<li class="comment-item">${commentList[i]}</li>`);
    $list.append($item);
  }
  setInterval(function() {
    $list.addClass('trans');
    $list.css('transform', `translateY(-0.666667rem)`);
    setTimeout(function() {
      $list.removeClass('trans').css('transform', `translateY(0)`);
      $list.append($('.comment-item:first-child'));
    }, 1500);
  }, 3000);
}

startAnimate();
setScienceText();

$('#start').click(turnToStart);
$('#receive').click(function() {$('.form-wrap').css('display', 'flex')});
$('#close, .form-wrap').click(function() {$('.form-wrap').hide()});
$('.form-box').click(function(e) {e.stopPropagation()});
$('.qst-wrap').delegate('button', 'click', turnToNext);
$('#info_form').submit(submitForm);
$('.info-input').on('input', checkInput);

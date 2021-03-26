import './main.less';
import $ from 'zepto-webpack';
import qstList from './questions.json';

let score = 0, processIndex = 0;

function turnToStart() {
  $('.start-wrap').hide();
  $('.qst-wrap').show();
  renderQuestion();
}

function turnToEnd() {
  $('.qst-wrap').hide();
  if (score < 10) {
    $('.card-a .res-wrap.success').css('display', 'flex');
  }
  else {
    $('.card-a .res-wrap.fail').css('display', 'flex');
  }
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
}

function submitForm(e) {
  e.preventDefault();
  if (!checkFormValid()) return;
  $('#info_form').hide();
  $('.form-wrap .res-wrap.fail').css('display', 'flex');
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

$('#start').click(turnToStart);
$('#receive').click(function() {$('.form-wrap').css('display', 'flex')});
$('#close, .form-wrap').click(function() {$('.form-wrap').hide()});
$('.form-box').click(function(e) {e.stopPropagation()});
$('.qst-wrap').delegate('button', 'click', turnToNext);
$('#info_form').submit(submitForm);
$('.info-input').on('input', checkInput);

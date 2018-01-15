$(function () {
    $('.profile').click(function(){
        if ($('.container').is(':visible')) {
            
            $(this).css('transform','');
            $(this).css('box-shadow', '');
            $(this).css('background' , '');
            
            $('.container').hide(250);
        }else{
            $(this).css('transform','scale(0.9)');
            $(this).css('box-shadow', 'inset 0 0 1px 2px rgba(0,0,0,0.5)');
            $(this).css('background' , 'rgba(255,255,255,0.1)');
            $('.container').show(250);
        }
    });
});

var theToggle = document.getElementById('toggle');

function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
function addClass(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}
function removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}
function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, " ") + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}
theToggle.onclick = function () {
    toggleClass(this, 'on');
    return false;
};

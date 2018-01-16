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
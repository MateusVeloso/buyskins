$(function () {
    $('.profile').click(function () {
        if ($('.container').is(':visible')) {

            $(this).css('transform', '');
            $(this).css('box-shadow', '');
            $(this).css('background', '');

            $('.container').hide(250);
        } else {
            $(this).css('transform', 'scale(0.9)');
            $(this).css('box-shadow', 'inset 0 0 1px 2px rgba(0,0,0,0.5)');
            $(this).css('background', 'rgba(255,255,255,0.1)');
            $('.container').show(250);
        }
    });

    var sliders = [];
    var delay = 4000;
    var timerId;
    var remaining;
    var start;
    var current_playing;
    // restore user slider img and title or descriptions
    $("#rotate-slider").find("img").each(function () {
        this.className += " slider-hide";
        sliders.push({html: this})
    });
    // initialize the siliders
    function slider_init() {
        $("#rotate-slider").css('display', 'block');
        $("#rotate-slider").append("<div id='slider-btn'><a class='prev-btn'><i class='arr-left'></i></a><a class='next-btn'><i class='arr-right'></i></a></div>")
        slider_display(sliders, 0);
        slider_loop(sliders, -1, delay);
    }
    // display 5 img at a time
    function slider_display(A, i) {
        if (i < 0) {
            i = A.length - 1;
        }
        current_playing = i;
        // mute the one img before
        A[(i + A.length + 3) % A.length].html.className += " slider-hide";
        // display 5 img after the muted one
        A[(i + A.length) % A.length].html.className = "slider-middle";
        A[(i + A.length - 1) % A.length].html.className = "slider-left-1";
        A[(i + A.length - 2) % A.length].html.className = "slider-left-2";
        A[(i + A.length + 1) % A.length].html.className = "slider-right-1";
        A[(i + A.length + 2) % A.length].html.className = "slider-right-2";

    }
    // slider
    function slider_loop(A, i, remaining) {
        start = new Date();
        if (i < 0) {
            i = A.length - 1;
        }
        timerId = setTimeout(function () {
            slider_display(A, i);
            slider_loop(A, i - 1, delay);
        }, remaining);
    }

    $("#rotate-slider").hover(function () {
        window.clearTimeout(timerId);
        remaining = delay - (new Date() - start);
        $("#slider-btn").show();
        $("#slider-btn .prev-btn").click(function () {
            current_playing--;
            slider_display(sliders, current_playing);
        });
        $("#slider-btn .next-btn").click(function () {
            current_playing++;
            slider_display(sliders, current_playing);
        });
    }, function () {
        slider_loop(sliders, current_playing, remaining);
        $("#slider-btn").hide();
        $("#slider-btn .prev-btn").unbind("click");
        $("#slider-btn .next-btn").unbind("click");
    });


    // launch slider
    slider_init();

    current_playing++;
    slider_display(sliders, current_playing);

});

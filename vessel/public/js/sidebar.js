$(document).ready(function () {
    // sidebar collapse and full
    $('#sidebarcollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('li').toggleClass('sidebar-icon');
        $('.sidebar-header').toggleClass('collapse-header');
        // css for breadcrumbs after collapse sidebar
        $('.breadcrumbs').toggleClass('collapse-breadcrumbs')
    });


    // responsive
    if($(window).width() < 992)
    {
        $('#sidebar').toggleClass('active');
        $('.collapse-icon').hide()
    }

    // active page highlit title effect
    $('#sidebar ul li').click(function(){
        $('#sidebar ul .active-page').removeClass('active-page');
        $(this).addClass('active-page');
    })
});

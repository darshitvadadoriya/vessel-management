$(document).ready(function () {
    // sidebar collapse and full
    $('#sidebarcollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('li svg').toggleClass('sidebar-icon');
        $('.sidebar-header').toggleClass('collapse-header');
    });
});

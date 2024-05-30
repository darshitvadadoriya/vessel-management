$(document).ready(function(){
    // pagination active class change
    $('.pagination .page-item').click(function(){
        console.log("aaaaaaaaaaaaa");
        $('.pagination .page-item').removeClass('active');
        $(this).addClass('active');
        
    })

  
})
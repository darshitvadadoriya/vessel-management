$(document).ready(function(){

    $(".pagination .page-item:nth-child(2)").addClass("active")

    // pagination active class change
    $('.pagination .page-item').click(function(){
        $('.pagination .page-item').toggleClass('active');
        // $(this).addClass('active');
        
    })

    // heck all checkbox on click one checkboc
    $(".checkall").click(function(){
        $(".check").prop("checked",$(this).prop("checked"));
    });
  
    
    $('.check').mouseover(function() {
        $('.check:eq(0)').prop("checked", true); // Check the checkbox at index 0
    });
    
    



  
})
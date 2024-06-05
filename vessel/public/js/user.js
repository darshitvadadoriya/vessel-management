$(document).ready(function(){
    $('#save').click(function(){
        console.log("aaaaaaa");
    //    var test =  $("form").serialize();
    //    console.log(test);
        
    var formDataArray = $('form').serializeArray();
        var formDataObject = {};
        $.each(formDataArray, function(index, field) {
           
          formDataObject[field.name] = field.value;
        });
        console.log(formDataObject);


        $.ajax({
            url: "/api/resource/User",
            type: "POST",
            dataType: "json",
            data: {
            usr: username,
            pwd: password,
            },
            success: function (data) {
                window.location.href = "/app"
                // set verifying status
                $('#login').val("Login")
            },
        })
    })
})
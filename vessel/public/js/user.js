$(document).ready(function(){
    $('#save').click(function(){
   
        
    var formDataArray = $('form').serializeArray();
        var form_data = {};
        $.each(formDataArray, function(index, field) {
           
            form_data[field.name] = field.value;
        });
        console.log(form_data);




    create_user(form_data)

    function create_user(form_data){
            $.ajax({
                url: "/api/resource/User",
                type: "POST",
                dataType: "json",
                data:JSON.stringify(form_data),
                success: function (data) {
                    console.log(data);
                    console.log("ENTERED.................")
                },
                error: function(xhr, status, error) {
                    // Handle the error response here
                    console.error('Error: ' + error); // Print the error to the console
                    console.error('Status: ' + status); // Print the status to the console
                    console.dir(xhr); // Print the XHR object for more details
                }
            })
      }
    })
})
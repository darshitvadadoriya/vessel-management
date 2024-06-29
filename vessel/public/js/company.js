$(document).ready(function () {
    // Create an instance of Notyf
    var notyf = new Notyf();


     // load country select box
     get_country()
     function get_country() {
        $.ajax({
            url: "/api/resource/Country",
            type: "GET",
            dataType: "json",
            data:{
                fields:JSON.stringify(["name"]),
                limit_page_length:"None"
            },
            success: function (data) {
                var country_list = data.data
                $("#country").empty()
                country_list.forEach(function(country,i){
                    // countryoptions
                    $("#country").append(`<option value="${country.name}">${country.name}</option>`)
                })

               
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }



    $("#save").click(function(){
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        console.log(form_data);

        if(!form_data["company_name"]){
            $('#company_error').remove(); // Remove any existing error message
            $('#company').after('<span id="company_error" class="error-message">Please company name is mandatory.</span>');
        }
        else{
            var abbr = $('#myText').text().split(' ').map(function(word) {
                return word.charAt(0);
            }).join('');
            form_data["abbr"] = abbr
            form_data["default_currency"] = "INR"

            //loading_page
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....") 

            $.ajax({
                url: "/api/resource/Company",
                type: "POST",
                dataType: "json",
                data:JSON.stringify(form_data),
                success: function (data) {
                   console.log(data);
                    notyf.success({
                        message: "Company create successfully",
                        duration: 5000
                    })
                    setTimeout(() => {
                        $(".overlay").hide()
                        window.location.href = "/accounts/company"
                    }, 3000);
    
                   
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.dir(xhr); // Print the XHR object for more details
                }
            })


        }
    })
})
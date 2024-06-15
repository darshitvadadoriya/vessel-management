$(document).ready(function(){


     // Create an instance of Notyf
     var notyf = new Notyf();
     var files = []
     var customer_name 
     var phone_list=[]
     var email_list=[] 
     var account_lst = []
     var customer_contact = []

    //  country select field
    var countryoptions =  new UseBootstrapSelect(document.getElementById("country"));
     
 
    //  upload customer image
     $('#upload-image').change(function () {
         files = $(this)[0].files;        
     });



    // on click add email to add new row
    $("#add_email").click(function(){
        var customer_email = $("#email_address_value").val()
        console.log(customer_email)
        $(`<div class="row w-100 justify-content-between email_row">
                <div class="email">${customer_email}</div>
                <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
            </div>`).insertBefore("#customer_email_input")
        $("#email_address_value").val("")
    })

    // on click add phone to add new row
    $("#add_phone").click(function(){
        var phone_no_value = $("#phone_no_value").val()
        $(`<div class="row w-100 justify-content-between phone_row">
                <div class="phone">${phone_no_value}</div>
                <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
            </div>`).insertBefore("#customer_phone_input")
        $("#phone_no_value").val("")
    })

        // on click delete icon to delete particular clicked row
        $(document).on('click', '.delete', function () {
            $(this).parent().remove()
        })


        // onclick add row to new row add in table
        $("#add_new_row").click(function () {
            add_row()

        })

        add_row()
        // add row button to add new row in account table
        function add_row(){
                var company_id = "company_id" + $('#customer-accounts tbody tr').length
                var account_id = "account_id" + $('#customer-accounts tbody tr').length

                $("#account_table").append(`<tr class="select-accounts">
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select class="company form-select" id="${company_id}" data-searchable="true">
                        <option></option>
                    </select>
                </td>
                <td>
                    
                    <select class="account form-select" id="${account_id}" data-searchable="true">
                    <option></option>
                    </select>
                </td>
            </tr>`)

                var company_list_data = new UseBootstrapSelect(document.getElementById(company_id));
                var account_list_data = new UseBootstrapSelect(document.getElementById(account_id));


                get_company(function (data) {
                    data.forEach(function (company) {
                        company_list_data.addOption(company.name, company.name)
                    })
                });

                var companyval = $("#" + company_id).val()

                set_account(companyval)
                function set_account(company_name) {

                    setTimeout(() => {
                        get_account(function (data) {
                            data.forEach(function (account) {
                                account_list_data.addOption(account.name, account.name)
                            })
                        }, company_name)
                    }, 500)
                }

                // change company value to get company wise account list
                document.getElementById(company_id).addEventListener('change', function () {
                    $("#" + account_id).empty()
                    var cange_companyval = $("#" + company_id).val()
                    set_account(cange_companyval)
                })
        }




    // onclick delete row get checked checkbpx
    $("#delete_row").click(function(){
        $('.checkbox').each(function() {
            // remove only checked checkbox
            if($(this).prop("checked"))
            {
                $(this).parent().parent().remove()
            }
        });
        $(".checkall").prop("checked","false"); //uncheck main checkbox
        
    })

   


    $('#save').click(function () {
        

        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        // set country in object
        form_data["country"] = countryoptions.getValue()


        
        // account table grouping data
        account_lst = []
        $('#account_table tr').each(function(index) {
            var companyvalue = $("#company_id" + index).val();
            var accountvalue = $("#account_id" + index).val();
            if(index==0 && companyvalue=="")
            {
                 console.log("first row is blank") //if first row is blank default
            }
            else{
                account_list()
            }
            function account_list()
            {
                if (!companyvalue || !accountvalue) {
                    notyf.error({
                        message:"Selecting a company and an account is mandatory.",
                        duration:5000
                    })
                    return false;  // stop loop
                }
                else{
                    account_lst.push({'company':companyvalue,"account":accountvalue})
                }
            }

        });
        if(account_lst)
        {
            form_data["accounts"] = account_lst
        }
    




        // phone section data
        $("#customer_phone .phone_row").each(function(i, data) {
            var phone_no = $(data).find(".phone").text();
            phone_list.push(phone_no); // Store each phone number with a key like "phone0", "phone1", etc.
        });

        // form_data["phone"] = phone_list
        console.log(phone_list); 

         // phone section data
         

         $("#customer_email .email_row").each(function(i, data) {
             var email_data = $(data).find(".email").text();
             email_list.push(email_data); // Store each phone number with a key like "phone0", "phone1", etc.
         });
 
        //  form_data["email"] = email_list
         console.log(form_data); 


        // error handler 
        // check customer name and customer type is filled

        if (!form_data['customer_name']) {
            $('#customer_name_error').remove(); // Remove any existing error message
            $('#customer_name').after('<span id="customer_name_error" class="error-message">Please first name is mandatory.</span>');
        }
        else if (!form_data['customer_type']) {
            $('#customer_type_error').remove(); // Remove any existing error message
            $('#customer_type').after('<span id="customer_type_error" class="error-message">Please email is mandatory.</span>');
        }
        else {
            if (files.length > 0 ) {
                var file_data = files[0]
                 upload_file(file_data); // Pass the first file to the upload_file function
             } else {
                 create_customer(form_data) // save data without image
             }
        }
        console.log(form_data);

        $("#customer_name").on("input", function () {
            $('#customer_name_error').remove(); // Remove customer name error message
        })
        $("#customer_type").on("input", function () {
            $('#customer_type_error').remove(); // Remove customer_type error message
        })


        function upload_file(files) {
            console.log(files)
            var file_data = new FormData();
            file_data.append('file', files);
            file_data.append('file_name', files.name);
            file_data.append('file_url', "/file/"+files.name);
    
            
            $.ajax({
                url: "/api/method/upload_file",
                type: "POST",
                processData: false,
                contentType: false,
                data:file_data, // Assuming form_data contains a file object
                success: function (response) {
                    var profile_image_url = response.message.file_url
                    form_data["image"] = profile_image_url;
                    create_customer(form_data)
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.error('Error: ' + error); // Print the error to the console
                    console.error('Status: ' + status); // Print the status to the console
                    console.dir(xhr); // Print the XHR object for more details
            
                    
                }
            })
        }


        function create_customer(form_data) {
            $.ajax({
                url: "/api/resource/Customer",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(form_data),
                success: function (data) {

                    var customer_id = data.data.name
                    customer_name = data.data.customer_name
                    
                    customer_contact = {
                        "customer_name": customer_name,  
                        "phone": phone_list,             
                        "email": email_list              
                    }
                    create_contact(customer_contact)
                    notyf.success({
                        message: "New customer created",
                        duration: 5000
                    })

                },
                error: function (xhr, status, error) {
                    console.dir(xhr); // Print the XHR object for more details
                    if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                        notyf.error({
                            message: "customer already added",
                            duration: 5000
                        })
                    }
                }
            })
        }

    })



    function create_contact(customer_contact){
        $.ajax({
            url: "/api/method/vessel.api.customer.create_contact",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(customer_contact),
            success: function(response) {
              
            },
        
            error: function (xhr, status, error) {
          
                if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                    notyf.error({
                        message: "customer already added",
                        duration: 5000
                    })
                }
            }
        })
    }

    function create_contact(customer_contact){
        $.ajax({
            url: "/api/method/vessel.api.customer.create_contact",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(customer_contact),
            success: function(response) {
               
            },
        
            error: function (xhr, status, error) {
          
                if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                    notyf.error({
                        message: "customer already added",
                        duration: 5000
                    })
                }
            }
        })
    }

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
                country_list.forEach(function(country,i){
                    // countryoptions
                    countryoptions.addOption(country.name,country.name)
                })

               
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    //get company
    function get_company(callback) {

        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                callback(data.data)
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


    //get account list company wise
    function get_account(callback, companyval) {

        $.ajax({
            url: "/api/resource/Account",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["company", "=", companyval]]),
                limit_page_length: "None"
            },
            success: function (data) {
                callback(data.data)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


      // click on checkall to check checkboxes
      $(document).on("click",".checkall",function(){
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })

})
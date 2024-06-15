$(document).ready(function () {


    // Create an instance of Notyf
    var notyf = new Notyf();
    var files = []
    var phone_list=[]
    var email_list=[] 
    var phone_data_list 
    var email_data_list 
    var customer_accounts
    var company
    var company_list_data
    var account_list_data
    var company_id
    var account_id
    var account_lst = []

    var old_form_data = {};






    //  upload customer image
    $('#upload-image').change(function () {
        files = $(this)[0].files;
    });



    // on click add email to add new row
    $("#add_email").click(function () {
        var customer_email = $("#email_address_value").val()

        $(`<div class="row w-100 justify-content-between email_row">
               <div class="email">${customer_email}</div>
               <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
           </div>`).insertBefore("#customer_email_input")
        $("#email_address_value").val("")
    })

    // on click add phone to add new row
    $("#add_phone").click(function () {
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
        $(".checkall").prop("checked","false");
    })


    // onclick add row to new row add in table
    $("#add_new_row").click(function () {
        add_row("","")

    })

    // add_row()
    // add row button to add new row in account table
    function add_row(companyvalue,accountvalue){
             company_id = "company_id" + $('#customer-accounts tbody tr').length
             account_id = "account_id" + $('#customer-accounts tbody tr').length

            $("#account_table").append(`<tr class="select-accounts">
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select class="company form-select" id="${company_id}" data-searchable="true">
                        <option>${companyvalue}</option>
                    </select>
                </td>
                <td>
                    
                    <select class="account form-select" id="${account_id}" data-searchable="true">
                    <option>${accountvalue}</option>
                    </select>
                </td>
            </tr>`)

            company_list_data = new UseBootstrapSelect(document.getElementById(company_id));
            account_list_data = new UseBootstrapSelect(document.getElementById(account_id));


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
            console.log(company_id);
            // change company value to get company wise account list
            document.getElementById(company_id).addEventListener('change', function () {
                $("#" + account_id).empty()
                var cange_companyval = $("#" + company_id).val()
                set_account(cange_companyval)
            })



    }



    // onclick delete row get checked checkbpx
    $("#delete_row").click(function () {
        $('.checkbox').each(function () {
            // remove only checked checkbox
            if ($(this).prop("checked")) {
                $(this).parent().parent().remove()
            }
        });
    })



    // show data in form
    var url = window.location.href

    var customer_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " ");

    get_customer(customer_id)
    function get_customer(name) {

        $.ajax({
            url: "/api/resource/Customer/"+name,
            type: "GET",
            dataType: "json",
            
            success: function (data) {
                var customer_info = data.data


                customer_id = customer_info.name
                customer_accounts = customer_info.accounts
                var customer_profile_img = customer_info.image && customer_info.image.includes("https") ? customer_info.image : (customer_info.image ? window.location.origin + customer_info.image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")


                $("#page_title").html(customer_info.customer_name)
                $("#user_id").val(customer_id)
                $('#image-preview').css('background-image', 'url(' + customer_profile_img + ')')
                $("#customer_name").val(customer_info.customer_name)
                $("#customer_type").val(customer_info.customer_type)
                $("#country").val(customer_info.custom_country)
                $("#person_in_charge").val(customer_info.custom_person_in_charge)
                $("#remarks").val(customer_info.custom_remarks)
                $("#status").val(customer_info.disabled)

                
                $.each(customer_accounts,function(index,data){
                        add_row(data.company,data.account)                 
                })


                var old_form_data_list = $('form').serializeArray();

                $.each(old_form_data_list, function (index, field) {

                    old_form_data[field.name] = field.value;
                });

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    get_contact(customer_id)

    function get_contact(name) {

        $.ajax({
            url: "/api/method/vessel.api.customer.get_contact",
            type: "GET",
            dataType: "json",
            data: {
                doctype: "Customer",
                doc_name: name
            },
            success: function (data) {

                 email_data_list = data.message.emails
                 phone_data_list = data.message.phones

                console.log(email_data_list)
                console.log(phone_data_list)
                $.each(phone_data_list, function (i, data) {
                    $(`<div class="row w-100 justify-content-between phone_row">
                                        <div class="phone">${data}</div>
                                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                                    </div>`).insertBefore("#customer_phone_input")
                })

                $.each(email_data_list, function (i, data) {
                    $(`<div class="row w-100 justify-content-between email_row">
                        <div class="email">${data}</div>
                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                    </div>`).insertBefore("#customer_email_input")
                })


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


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





       $('#save').click(function () {


              // Serialize the current form data
            var form_data_list = $('form').serializeArray();
            var form_data = {};

            $.each(form_data_list, function (index, field) {
                form_data[field.name] = field.value;
            });


        // Compare old form data with current form data and store updated fields
        var updated_form_data = {};

        $.each(form_data, function (key, value) {

            if (old_form_data[key] !== value) {
                updated_form_data[key] = value;
            }
        });

        console.log(updated_form_data);

        // phone section data
        $("#customer_phone .phone_row").each(function(i, data) {
            var phone_no = $(data).find(".phone").text();
            if (!phone_list.includes(phone_no) && !phone_data_list.includes(phone_no)) {
                phone_list.push(phone_no); // push unique value in phone_list
            }
        });

        // form_data["phone"] = phone_list
        console.log(phone_list); 

            //email data
         $("#customer_email .email_row").each(function(i, data) {
             var email_data = $(data).find(".email").text();
             if (!email_list.includes(email_data) && !email_data_list.includes(email_data)) {
                email_list.push(email_data); // push unique value in email_list
            }
         });
         console.log(email_list); 





             // account table grouping data
            // account_lst = []
            // $('#account_table tr').each(function(index) {
            //     var companyvalue = $("#company_id" + index).val();
            //     var accountvalue = $("#account_id" + index).val();
            //     if(index==0 && companyvalue=="")
            //     {
            //         console.log("first row is blank") //if first row is blank default
            //     }
            //     else{
            //         account_list()
            //     }
            //     function account_list()
            //     {
            //         if (!companyvalue || !accountvalue) {
            //             notyf.error({
            //                 message:"Selecting a company and an account is mandatory.",
            //                 duration:5000
            //             })
            //             return false;  // stop loop
            //         }
            //         else{
            //             account_lst.push({'company':companyvalue,"account":accountvalue})
            //         }
            //     }

            // });
            // if(account_lst)
            // {
            //     form_data["accounts"] = account_lst
            // }




    //        // phone section data
    //        var phone_list = {}; // Initialize an empty object to store the phone numbers

    //        $("#customer_phone .phone_row").each(function(i, data) {
    //            var phone_no = $(data).find(".phone").text();
    //            phone_list['phone' + i] = phone_no; // Store each phone number with a key like "phone0", "phone1", etc.
    //        });

    //        // form_data["phone"] = phone_list
    //        console.log(phone_list); 

    //         // phone section data
    //         var email_list = {}; // Initialize an empty object to store the phone numbers

    //         $("#customer_email .email_row").each(function(i, data) {
    //             var email_data = $(data).find(".email").text();
    //             email_list['email' + i] = email_data; // Store each phone number with a key like "phone0", "phone1", etc.
    //         });

    //        //  form_data["email"] = email_list
    //         console.log(form_data); 


    // error handler 
    // check customer name and customer type is filled

    //    if (!form_data['customer_name']) {
    //        $('#customer_name_error').remove(); // Remove any existing error message
    //        $('#customer_name').after('<span id="customer_name_error" class="error-message">Please first name is mandatory.</span>');
    //    }
    //    else if (!form_data['customer_type']) {
    //        $('#customer_type_error').remove(); // Remove any existing error message
    //        $('#customer_type').after('<span id="customer_type_error" class="error-message">Please email is mandatory.</span>');
    //    }
    //    else {
    //        if (files.length > 0 ) {
    //            var file_data = files[0]
    //             upload_file(file_data); // Pass the first file to the upload_file function
    //         } else {
    //             create_customer(form_data) // save data without image
    //         }
    //    }
    //    console.log(form_data);

    //    $("#customer_name").on("input", function () {
    //        $('#customer_name_error').remove(); // Remove customer name error message
    //    })
    //    $("#customer_type").on("input", function () {
    //        $('#customer_type_error').remove(); // Remove customer_type error message
    //    })


    //    function upload_file(files) {
    //        console.log(files)
    //        var file_data = new FormData();
    //        file_data.append('file', files);
    //        file_data.append('file_name', files.name);
    //        file_data.append('file_url', "/file/"+files.name);


    //        $.ajax({
    //            url: "/api/method/upload_file",
    //            type: "POST",
    //            processData: false,
    //            contentType: false,
    //            data:file_data, // Assuming form_data contains a file object
    //            success: function (response) {
    //                var profile_image_url = response.message.file_url
    //                form_data["image"] = profile_image_url;
    //                create_customer(form_data)
    //            },
    //            error: function (xhr, status, error) {
    //                // Handle the error response here
    //                console.error('Error: ' + error); // Print the error to the console
    //                console.error('Status: ' + status); // Print the status to the console
    //                console.dir(xhr); // Print the XHR object for more details


    //            }
    //        })
    //    }


    //    function create_customer(form_data) {
    //        $.ajax({
    //            url: "/api/resource/Customer",
    //            type: "POST",
    //            dataType: "json",
    //            data: JSON.stringify(form_data),
    //            success: function (data) {

    //                console.log(data.data.name);
    //                var customer_id = data.data.name

    //                console.log("ENTERED.................")
    //                notyf.success({
    //                    message: "Add customer successfully",
    //                    duration: 5000
    //                })

    //            },
    //            error: function (xhr, status, error) {
    //                // Handle the error response here
    //                console.error('Error: ' + error); // Print the error to the console
    //                console.error('Status: ' + status); // Print the status to the console
    //                console.dir(xhr); // Print the XHR object for more details
    //                if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
    //                    notyf.error({
    //                        message: "customer already added",
    //                        duration: 5000
    //                    })
    //                }
    //            }
           })
    //    }



       // click on checkall to check checkboxes
       $(document).on("click",".checkall",function(){
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })
     
   
})


$(document).ready(function () {

    var customer_list = []
    var account_lst = []
    var file_list = []
    // Create an instance of Notyf
    var notyf = new Notyf();


    //  set default today date in posting date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    var files = []

    
    //format year-month-date
    var today_date = year + '-' + month + '-' + day;
    $('#posting_date').val(today_date); //set today date



    


    // click on checkall to check checkboxes
    $(document).on("click", ".checkall", function () {
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })

    // onclick delete row get checked checkbpx
    $("#delete_row").click(function () {
        $('.checkbox').each(function () {
            // remove only checked checkbox
            if ($(this).prop("checked")) {
                $(this).parent().parent().remove()
            }
        });
        $(".checkall").prop("checked", false); //uncheck main checkbox

        if ($("#payment_entry_details tr").length == 0) {
            $("#payment_entry_details").append(`<tr id="empty_table"></tr>`)
        }

    })

    $("#add_new_row").click(function () {
        validation()
        if (!validation()) {
            add_row();
        }

    })


    //======== validation =======
       function validation(){
            $('#posting_date_error').remove();
            $('#company_error').remove();
            $('#mode_of_payment_error').remove();

            var iserror = false;

            if ($("#company").val() == "") {
                $('<span id="company_error" class="error-message">Company is mandatory</span>').insertAfter('#company');
                iserror = true;
            } 
            if ($("#posting_date").val() == "") {
                $('<span id="posting_date_error" class="error-message">Posting Date is mandatory.</span>').insertAfter('#posting_date');
                iserror = true;
            }
            if ($("#mode_of_payment").val() == "") {
                $('<span id="mode_of_payment_error" class="error-message">Mode of Payment is mandatory.</span>').insertAfter('#mode_of_payment');
                iserror = true;
            }

            if (!iserror){
                $(".error-message").remove
            }

            return iserror
       }

        



    function add_row() {
        $("#empty_table").remove()
        var party_id = "party_id" + $('#payment_entry_details tr').length
        var account_id = "account_id" + $('#payment_entry_details tr').length
        var debit_id = "debit_id" + $('#payment_entry_details tr').length
        var credit_id = "credit_id" + $('#payment_entry_details tr').length
        var file_id = "file_id" + $('#payment_entry_details tr').length
        var file_label = "file_label" + $('#payment_entry_details tr').length
        var img_attached = "img_attached" + $('#payment_entry_details tr').length

        $("#payment_entry_details").append(`
            <tr>
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select id="${party_id}" class="party form-select custom-select tab-select">
                        <option></option>
                     </select>
                </td>
                <td>
                    <select id=${account_id} class="account_type form-select custom-select tab-select">
                        <option></option>
                       
                     </select>
                </td>
                <td><input type="number" id="${debit_id}" class="form-control debit" value="0"></td>
                <td><input type="number" id="${credit_id}" class="form-control credit" value="0"></td>
                <td><input type="text" class="form-control"></td>
                <td>
                    <div class="d-flex align-items-center">
                    <label class="d-flex align-items-center w-100">
                            <div class="" id=${file_label}><img src="/assets/vessel/files/images/attach-image.png" class="mr-2"></div>
                        </lable>
                        <input type="file" class="form-control choose-file" id="${file_id}">
                        
                    
                        <div id="${img_attached}">
                        </div>
                    </div>
                </td>
                
            </tr>
            `)


            $.each(customer_list, function (i, customer) {
                $("#" + party_id).append(`<option value="${customer.name}"> ${customer.customer_name} - ${customer.name}</option>`)
            })

        get_bank_account(function (data) {

            $.each(data, function (i, account) {
                $("#" + account_id).append(`<option value="${account.name}">${account.name}</option>`)
            })
        })

        $("#" + party_id).change(function () {
            $("#" + account_id).empty()
            var customer_name = $(this).val()
            console.log(customer_name);
            if (customer_name == "") {
                get_bank_account(function (data) {

                    
                    $.each(data, function (i, account) {
                        $("#" + account_id).append(`<option value="${account.name}">${account.name}</option>`)
                    })
                })
            }
            else {

                $("#" + account_id).empty()
                get_account(function (data) {

                    $.each(data, function (i, account) {
                        $("#" + account_id).append(`<option value="${account.account}">${account.account}</option>`)
                    })
                }, customer_name)
            }

        })


        $("#" + file_id).change(function () {
            var file_data = $(this)[0].files
            console.log(file_data);
            $("#"+img_attached).html(file_data[0].name.substring(0, 15) + '...')
            if (files.length === 0) {
                files.push({ [file_id]: file_data });
            } else {
                var fileexists = false;
                $.each(files, function (i, data) {
                    if (data[file_id]) {

                        files[i][file_id] = file_data;
                        fileexists = true;
                        return false;
                    }
                });

                if (!fileexists) {
                    files.push({ [file_id]: file_data });
                }
            }


        })

    }




    // get customer wise account from customer
    function get_account(callback, customer) {
        var company = $("#company").val()
        $.ajax({
            url: "/api/method/vessel.api.account.get_accounts",
            type: "GET",
            dataType: "json",
            data: {
                "customer": customer,
                "company": company
            },
            success: function (data) {
                
                callback(data.message)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    function get_bank_account(callback) {
        var company = $("#company").val()
        
        $.ajax({
            url: "/api/method/vessel.api.account.get_bank_accounts",
            type: "GET",
            dataType: "json",
            data: {
                "company": company
            },
            success: function (data) {
                
                callback(data.message)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }


    get_customer()
    function get_customer() {
        $.ajax({
            url: "/api/resource/Customer",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name", "customer_name"]),
                filters: JSON.stringify([["disabled", "=", "0"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                customer_list = data.data


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    //get company
    get_company()
    function get_company() {

        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                var company = data.data
                $.each(company, function (i, company) {
                    $("#company").append(`<option value="${company.name}">${company.name}</option>`)
                })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    //get company
    get_mode_of_payment()
    function get_mode_of_payment() {

        $.ajax({
            url: "/api/resource/Mode of Payment",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["enabled", "=", "1"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                var company = data.data
                $.each(company, function (i, payment_mode) {
                    $("#mode_of_payment").append(`<option value="${payment_mode.name}">${payment_mode.name}</option>`)
                })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }




    $(document).on("input", ".debit", function () {
        let total_debit = 0
        $(".debit").each(function (index, data) {
            let value = parseFloat(data.value);
            total_debit += isNaN(value) ? 0 : value;
        });
        $("#total_debit").val(total_debit)
    });

    $(document).on("input", ".credit", function () {
        let total_credit = 0;
        $(".credit").each(function (index, data) {
            let value = parseFloat(data.value);
            total_credit += isNaN(value) ? 0 : value;
        });
        $("#total_credit").val(total_credit);
    });




    $("#save").click(function () {
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        
        if(!validation())
        {
        
            // Append all files to FormData
            for (var i = 0; i < files.length; i++) {
                // Create FormData object
                var file_data = new FormData();
                var file = files[i]["file_id"+i][0];
            
                file_data.append("file",file)
                file_data.append("file_name",file.name)
                file_data.append("file_url","/files/"+file.name)

                
                $.ajax({
                    url: "/api/method/upload_file",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: file_data,
                    success: function (response) {
        
                        file_list.push(response.message)
                    },
                    error: function (xhr, status, error) {
                        // Handle the error response here
                        console.dir(xhr); // Print the XHR object for more details
                    }
                })
            }

            setTimeout(() => {
        
                console.log(file_list);
                account_lst = []
                $('#payment_entry_details tr').each(function (index) {
                    var partyvalue = $("#party_id" + index).val();
                    var accountvalue = $("#account_id" + index).val();
                    var debit = $("#debit_id" + index).val();
                    var credit = $("#credit_id" + index).val();
                    if(file_list.length!=0)
                    {

                        if (partyvalue != "") {
                            create_account_lst(partytype = "Customer", partyvalue, accountvalue, debit, credit,file_list[index].file_url)
                        }
                        else {
                            create_account_lst(partytype = "", partyvalue, accountvalue, debit, credit,file_list[index].file_url)
                        }
                    }
                   
    
                });
                
    
            function create_account_lst(partytype, partyvalue, accountvalue, debit, credit,file_data) {
                account_lst.push({
                    'party_type': partytype,
                    'party': partyvalue,
                    'account': accountvalue,
                    'debit_in_account_currency': debit,
                    'credit_in_account_currency': credit,
                    'custom_attachments':file_data
                });
            }
            form_data["accounts"] = account_lst
            console.log(form_data);
            create_payment_entry(form_data)
        }, 300);
    
        }

        
    })

    function create_payment_entry(form_data) {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        $.ajax({
            url: "/api/resource/Journal Entry",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(form_data),
            success: function (data) {
                console.log(data);
                notyf.success({
                    message: "Payment Entry created successfully",
                    duration: 5000
                })
                setTimeout(() => {
                    $(".overlay").hide()
                    window.location.href = "/accounts/payment-entry/" + data.data.name
                }, 2500);


            },
            error: function (xhr, status, error) {
                $(".overlay").hide()
                console.dir(xhr); // Print the XHR object for more details
                if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                    notyf.error({
                        message: "customer already added",
                        duration: 5000
                    })
                }
                else {
                    console.dir(xhr);
                    var error_msg = xhr.responseJSON.exception.split(":")[1]
                    
                    if(error_msg == " Accounts table cannot be blank.")
                    {
                        notyf.error({
                            message: "Please fill all mandatory fields in the table.",
                            duration: 5000
                        });
                    }
                    else
                    {
                        notyf.error({
                            message: error_msg,
                            duration: 5000
                        });
                    }
                }
            }
        })
    }


})
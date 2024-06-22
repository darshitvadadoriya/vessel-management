$(document).ready(function () {

    var customer_list = []
    var account_lst = []
     // Create an instance of Notyf
     var notyf = new Notyf();


    //  set default today date in posting date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); 
    var year = today.getFullYear();

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

        if($("#payment_entry_details tr").length == 0){
            $("#payment_entry_details").append(`<tr id="empty_table"></tr>`)
        }

    })

    $("#add_new_row").click(function () {
        $('#posting_date_error').remove();
        $('#company_error').remove();
        console.log($("#company").val());
        if($("#company").val()=="")
        {
            $('<span id="company_error" class="error-message">Please enter company name.</span>').insertAfter('#company');
        }
        else if($("#posting_date").val()=="")
        {
            $('<span id="posting_date_error" class="error-message">Please enter company name.</span>').insertAfter('#posting_date');
        }
        else{
            $('#company_error').remove();
            $('#posting_date_error').remove();
            add_row()
        }
        
    })

    function add_row() {
        $("#empty_table").remove()
        var party_id = "party_id" + $('#payment_entry_details tr').length
        var account_id = "account_id" + $('#payment_entry_details tr').length
        var debit_id = "debit_id" + $('#payment_entry_details tr').length
        var credit_id = "credit_id" + $('#payment_entry_details tr').length

        $("#payment_entry_details").append(`
            <tr>
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select id="${party_id}" class="party form-select custom-select tab-select">
                        <option></option>
                     </select>
                </td>
                <td>
                    <select id=${account_id} class="partytype form-select custom-select tab-select">
                        <option></option>
                       
                     </select>
                </td>
                <td><input type="number" id="${debit_id}" class="form-control debit" value="0"></td>
                <td><input type="number" id="${credit_id}" class="form-control credit" value="0"></td>
                <td><input type="text" class="form-control"></td>
                <td><input type="text" class="form-control"></td>
                
            </tr>
            `)

        
        $.each(customer_list, function (i, customer) {
            $("#" + party_id).append(`<option value="${customer.name}">  ${customer.customer_name}</option>`)
        })

        get_bank_account(function(data){
            console.log(data);
            $.each(data,function(i,account){
                $("#"+account_id).append(`<option value="${account.name}">${account.name}</option>`)
            })
        })

        $("#"+party_id).change(function(){
            var customer_name = $(this).val()
            $("#"+account_id).empty()
                get_account(function(data){
                    console.log(data);
                    $.each(data,function(i,account){
                        $("#"+account_id).append(`<option value="${account.account}">${account.account}</option>`)
                    })
                },customer_name)        

        })



    }

    // get customer wise account from customer
    function get_account(callback,customer){
        var company = $("#company").val()
        $.ajax({
            url: "/api/method/vessel.api.account.get_accounts",
            type: "GET",
            dataType: "json",
            data: {
                "customer":customer,
                "company":company
            },
            success: function (data) { 
                console.log(data)               
                callback(data.message)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    function get_bank_account(callback){
        var company = $("#company").val()
        $.ajax({
            url: "/api/method/vessel.api.account.get_bank_accounts",
            type: "GET",
            dataType: "json",
            data: {
                "company":company
            },
            success: function (data) { 
                console.log(data)               
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




    $(document).on("input", ".debit", function() {
        let total_debit = 0
        $(".debit").each(function(index, data) {
            let value = parseFloat(data.value);
            total_debit += isNaN(value) ? 0 : value;
        });
        $("#total_debit").val(total_debit)
    });

    $(document).on("input", ".credit", function() {
        let total_credit = 0;
        $(".credit").each(function(index, data) {
            let value = parseFloat(data.value);
            total_credit += isNaN(value) ? 0 : value;
        });
        $("#total_credit").val(total_credit);
    });
    



    $("#save").click(function(){
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        console.log(form_data);
        account_lst = []
        $('#payment_entry_details tr').each(function(index) {
            var partyvalue = $("#party_id" + index).val();
            var accountvalue = $("#account_id" + index).val();
            var debit = $("#debit_id" + index).val();
            var credit = $("#credit_id" + index).val(); 
            if(partyvalue!="")
            {
                create_account_lst(partytype="Customer",partyvalue,accountvalue,debit,credit)
            }
            else{
                create_account_lst(partytype="",partyvalue,accountvalue,debit,credit)
            }
            
        
        });

        function create_account_lst(partytype,partyvalue,accountvalue,debit,credit){
            account_lst.push({
                'party_type': partytype,
                'party': partyvalue,
                'account': accountvalue,
                'debit_in_account_currency': debit,
                'credit_in_account_currency': credit
            });
        }
        form_data["accounts"] = account_lst
    

        console.log(form_data);

        create_payment_entry()
        function create_payment_entry(){
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

})
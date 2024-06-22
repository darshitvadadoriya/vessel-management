import frappe

# get account customer wise from custome form child table
@frappe.whitelist()
def get_accounts(customer,company):
    print(customer)
    print(company)
    print("\n\n\n\n\n\n\n\n\n")
    return frappe.get_all("Party Account",fields=["name","account","company"],filters=[["parent","=",customer],["company","=",company]])



@frappe.whitelist()
def get_bank_accounts(company):
    return frappe.get_all("Account",fields=["name"],filters=[["account_type","=","Bank"],["company","=",company],["is_group","=","0"]])
import frappe


@frappe.whitelist()
def delete_old_file(file_url,attached_to_name,attached_to_field,attached_to_doctype):
    old_file = frappe.get_list("File",fields=["name"],filters=[["file_url","=",file_url],["attached_to_name","=",attached_to_name],["attached_to_field","=",attached_to_field],["attached_to_doctype","=",attached_to_doctype]])
    old_file_name = old_file[0]["name"]
    frappe.delete_doc("File",old_file_name)
    print(old_file)
    print("\n\n\n\n\n\n\n\n\n")
